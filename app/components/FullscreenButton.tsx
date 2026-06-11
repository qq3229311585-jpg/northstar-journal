'use client';

import { useState } from 'react';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // 进入全屏阅读模式
      document.documentElement.classList.add('reading-fullscreen');
      setIsFullscreen(true);
    } else {
      // 退出全屏阅读模式
      document.documentElement.classList.remove('reading-fullscreen');
      setIsFullscreen(false);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fullscreen-btn"
      title={isFullscreen ? '退出全屏阅读' : '全屏阅读'}
      aria-label={isFullscreen ? '退出全屏阅读' : '全屏阅读'}
    >
      {isFullscreen ? '↙' : '⛶'}
    </button>
  );
}
