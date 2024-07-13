#!/bin/bash

# Install requirements.txt
pip install -r requirements.txt

# Change to Flask app directory and start Flask server
cd app
echo "Starting Flask server..."
flask --app main run &

# Wait for the Flask app to be available
wait_for_flask() {
  echo "Waiting for Flask app to be available..."
  until curl -s http://localhost:5000 > /dev/null; do
    sleep 1
  done
  echo "Flask app is available!"
}

wait_for_flask

# Open Google Chrome and navigate to the React app
echo "Opening Google Chrome..."
google-chrome "http://localhost:5000"
