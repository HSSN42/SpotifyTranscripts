#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies with sudo
sudo apt-get update
sudo apt-get install -y ffmpeg

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p temp_audio_chunks 