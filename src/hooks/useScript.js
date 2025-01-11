// src/hooks/useScript.js
import { useState, useEffect } from 'react';

const useScript = (src) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Проверяем, загружен ли уже скрипт
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    const onScriptLoad = () => setLoaded(true);
    const onScriptError = () => setError(true);

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, [src]);

  return { loaded, error };
};

export default useScript;
