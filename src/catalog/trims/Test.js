import React, { useState } from 'react';

function Test() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [inputVisible, setInputVisible] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleAddVideo = () => {
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
      console.log('Video ID:', id);
    } else {
      alert('Некорректная ссылка на YouTube');
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setInputVisible(!inputVisible)}>
        {inputVisible ? 'Скрыть форму' : 'Добавить видео'}
      </button>

      {inputVisible && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Вставьте ссылку на YouTube"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="form-control mb-2"
          />
          <button className="btn btn-success" onClick={handleAddVideo}>
            Показать видео
          </button>
        </div>
      )}

      {videoId && (
        <div className="mt-4">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default Test;
