import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('http://localhost:8080/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Image uploaded successfully!');
    })
    .catch(error => {
      console.error('Error uploading image: ', error);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>Upload</button>
    </div>
  );
};

export default ImageUpload;
