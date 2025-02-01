// src/components/ShareButtons.jsx
import React, { useEffect } from 'react';
import useScript from '../hooks/useScript';

const ShareButtons = () => {
  const { loaded, error } = useScript(
    'https://platform-api.sharethis.com/js/sharethis.js#property=6780c5c9c1886b001ae16e5d&product=inline-share-buttons'
  );

  useEffect(() => {
    if (loaded && window.sharethis) {
      // Инициализируем ShareThis после загрузки скрипта
      window.sharethis.init();
    }
  }, [loaded]);

  if (error) {
    return <div>Ошибка загрузки кнопок поделиться.</div>;
  }

  return (
    <div>
      {loaded ? (
        <div className="sharethis-inline-share-buttons"></div>
      ) : (
        <div>Загрузка кнопок поделиться...</div>
      )}
    </div>
  );
};

export default ShareButtons;
