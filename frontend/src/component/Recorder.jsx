import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneLinesSlash } from "react-icons/fa6";

const Recorder = () => {
  const [audioData, setAudioData] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Function to handle audio recording
  const handleRecordToggle = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = e => {
          chunks.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const reader = new FileReader();
          
          reader.onload = async () => {
            const base64Data = reader.result.split(',')[1];
            
            // Send audio data to Flask backend
            const response = await fetch('http://localhost:8000/upload-audio', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ audio_data: base64Data })
            });

            const data = await response.json();
            console.log(data);
          };

          reader.readAsDataURL(blob);
        };

        setMediaRecorder(recorder);
        recorder.start();
        setRecording(true);
      } catch (error) {
        console.error('Error recording audio:', error);
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        setRecording(false);
      }
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <button onClick={handleRecordToggle} className='m-4'>{recording ? <FaMicrophoneLinesSlash /> : <FaMicrophone/>}</button>
    </div>
  );
};

export default Recorder;
