'use client';

import { useState, useEffect } from 'react';

export function GlobalFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="global-fullscreen-btn"
      title={isFullscreen ? '退出全屏 (ESC)' : '全屏浏览'}
      aria-label={isFullscreen ? '退出全屏' : '全屏浏览'}
    >
      {isFullscreen ? '⛶ 退出' : '⛶'}
    </button>
  );
}
