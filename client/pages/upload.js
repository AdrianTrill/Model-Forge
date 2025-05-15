import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://172.20.10.2:3001/api/files/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(`Success! File uploaded as: ${data.filename}`);
      } else {
        setUploadStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <Layout title="Upload">
      <h1>Upload a File</h1>
      <p>You can upload videos or pictures. Files are handled by our RESTful API.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
        <input type="file" onChange={handleFileChange} accept="video/*,image/*" />
        <button type="submit">Upload File</button>
      </form>
      {uploadStatus && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{uploadStatus}</p>}
      <p style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to Home</Link>
      </p>
    </Layout>
  );
}
