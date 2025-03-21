from flask import Blueprint, jsonify, request, make_response
from flask_cors import cross_origin
from . import db
from .models import Podcast
import os 
import requests
import json
from pydub import AudioSegment
import openai
import tempfile

main = Blueprint("main", __name__)

@main.route("/")
@cross_origin()
def index():
    return jsonify({
        "status": "success",
        "message": "Welcome to Spotify Transcripts API",
        "endpoints": {
            "GET /": "This help message",
            "GET /get_podcast?url=<url>": "Get transcript for a podcast episode"
        }
    })

@main.route("/podcasts")
@cross_origin()
def podcasts():
    try:
        podcasts_list = Podcast.query.all()
        podcasts = []
        for podcast in podcasts_list:
            podcasts.append({"url": podcast.url, "transcript": podcast.transcript})
        return jsonify({"podcasts": podcasts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/get_podcast", methods=["GET", "OPTIONS"])
@cross_origin()
def get_podcast():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

    try:
        url = request.args.get("url")
        if not url:
            return jsonify({"error": "URL parameter is required"}), 400

        # Check if podcast exists in database
        existing_podcast = Podcast.query.filter_by(url=url).first()
        if existing_podcast and existing_podcast.transcript:
            return jsonify({
                "transcript": json.loads(existing_podcast.transcript),
                "cached": True
            })

        # Transcribe the podcast
        transcript = transcribe_from_url(url)
        
        # Save to database
        new_podcast = Podcast(
            url=url,
            transcript=json.dumps(transcript)
        )
        db.session.add(new_podcast)
        db.session.commit()

        return jsonify({
            "transcript": transcript,
            "cached": False
        })
    except Exception as e:
        print("Error in get_podcast:", str(e))
        return jsonify({"error": str(e)}), 500

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def download_audio(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            downloads_dir = "downloads"
            ensure_directory_exists(downloads_dir)
            audio_path = os.path.join(downloads_dir, "temp_audio.mp3")
            with open(audio_path, "wb") as f:
                f.write(response.content)
            return audio_path
    except Exception as e:
        print(f"Error downloading audio: {str(e)}")
        return None

def transcribe_from_url(url):
    try:
        # Download the audio file
        audio_path = download_audio(url)
        if not audio_path:
            raise Exception("Failed to download audio file")

        # Load the audio file
        audio = AudioSegment.from_mp3(audio_path)
        
        # Initialize transcript segments list
        transcript_segments = []
        chunk_length = 30000  # 30 seconds
        
        # Create a temporary directory for chunks
        with tempfile.TemporaryDirectory() as temp_dir:
            # Split audio into chunks and process each chunk
            for i, chunk_start in enumerate(range(0, len(audio), chunk_length)):
                try:
                    # Extract chunk
                    chunk = audio[chunk_start:chunk_start + chunk_length]
                    chunk_filename = os.path.join(temp_dir, f"chunk{i}.wav")
                    
                    # Export chunk as WAV
                    chunk.export(chunk_filename, format="wav")
                    
                    # Transcribe using OpenAI Whisper
                    with open(chunk_filename, "rb") as audio_file:
                        transcript = openai.Audio.transcribe(
                            "whisper-1",
                            audio_file
                        )
                    
                    # Add segment info
                    segment = {
                        "startTime": chunk_start / 1000,  # Convert to seconds
                        "endTime": (chunk_start + len(chunk)) / 1000,
                        "sentence": transcript.text
                    }
                    transcript_segments.append(segment)
                        
                except Exception as e:
                    print(f"Error processing chunk {i}: {str(e)}")
                    continue
        
        # Clean up the downloaded audio file
        try:
            os.remove(audio_path)
        except:
            pass
            
        return transcript_segments

    except Exception as e:
        print(f"Error in transcribe_from_url: {str(e)}")
        raise