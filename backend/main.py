from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import base64
from urllib.parse import quote

app = Flask(__name__)
CORS(app)


db = SQLAlchemy(app)

# Define the model
class Audio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    audio_data = db.Column(db.LargeBinary)

# API endpoint to receive audio data
@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if request.method == 'POST':
        # Get audio data from the request
        print("Before the eif statement")
        audio_data_b64 = request.json.get('audio_data')
        
        if audio_data_b64:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data_b64) 
            # Store audio data into the database
            print("after converting into bytes")
            new_audio = Audio(audio_data=audio_bytes)
            print("Before the storing into the database")
            db.session.add(new_audio)
            db.session.commit()

            return jsonify({"message": "Audio uploaded successfully."}), 200
        else:
            return jsonify({"error": "No audio data found in the request."}), 400

if __name__ == '__main__':
    app.run(debug=True)
