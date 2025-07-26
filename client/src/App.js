import React, { useState } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('manual');
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [textFile, setTextFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);

  const handleEncrypt = async () => {
    const formData = new FormData();
    if (mode === 'file') {
      formData.append('textFile', textFile);
      formData.append('keyFile', keyFile);
      const res = await fetch('/api/file/encrypt', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.result);
    } else {
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, key })
      });
      const data = await res.json();
      setResult(data.result);
    }
  };

  const handleDecrypt = async () => {
    const formData = new FormData();
    if (mode === 'file') {
      formData.append('textFile', textFile);
      formData.append('keyFile', keyFile);
      const res = await fetch('/api/file/decrypt', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.result);
    } else {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, key })
      });
      const data = await res.json();
      setResult(data.result);
    }
  };

  return (
    <div className="App">
      <h1>Vigenere Cipher</h1>
      <div>
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="manual">Manual</option>
            <option value="file">File Upload</option>
          </select>
        </label>
      </div>
      <div key={mode}>
        {mode === 'manual' ? (
          <>
            <input
              type="text"
              placeholder="PlainText/CipherText"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </>
        ) : (
          <>
            <div>
              <label>
                PlainText/CipherText File:
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setTextFile(e.target.files[0])}
                />
              </label>
            </div>
            <div>
              <label>
                Key File:
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setKeyFile(e.target.files[0])}
                />
              </label>
            </div>
          </>
        )}
      </div>

      <div>
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt}>Decrypt</button>
      </div>
      <textarea rows="6" cols="60" value={result} readOnly />
    </div>
  );
}

export default App;