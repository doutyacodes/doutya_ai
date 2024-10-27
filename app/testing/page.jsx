"use client";
import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices; // Update voices when they are loaded
  }, []);

  const speak = () => {
    if (!text) return; // Prevent speaking if no text is entered

    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'en-US';
    speech.rate = 1; // Adjust the speech rate (1 is normal speed)
    speech.pitch = 1.2; // Adjust pitch for a more human-like sound
    speech.voice = voices.find(voice => voice.name === 'Google US English') || null; // Change this to any voice you prefer

    // Use MediaRecorder to record the audio
    const stream = window.speechSynthesis.speak(speech);
    setIsSpeaking(true);

    speech.onend = () => {
      setIsSpeaking(false);
      // Create a Blob from the audio data and create a URL for downloading
      const blob = new Blob([stream], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    window.speechSynthesis.speak(speech);
  };

  const downloadAudio = () => {
    if (!audioUrl) return; // Prevent downloading if there is no audio

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'speech.wav'; // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4" 
        cols="50"
        placeholder="Enter text here..."
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
      />
      <div>
        <button 
          onClick={speak}
          disabled={isSpeaking} 
          style={{ marginRight: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          {isSpeaking ? 'Speaking...' : 'Speak'}
        </button>
        
      </div>
    </div>
  );
};

export default TextToSpeech;
