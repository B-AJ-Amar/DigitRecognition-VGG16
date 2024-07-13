@echo off

@REM install reuirements.txt
pip install -r requirements.txt

REM Change to Flask app directory and start Flask server
cd app\
echo Starting Flask server...
start /B cmd /c "flask --app main run"



REM Wait for the React app to be available
:wait_for_flask
echo Waiting for flask app to be available...
curl -s http://localhost:5000 > nul 2>&1
if errorlevel 1 (
    timeout /t 1 > nul
    goto wait_for_flask
)
echo flask app is available!

REM Open Google Chrome and navigate to the React app
echo Opening Google Chrome...
start chrome "http://localhost:5000"
