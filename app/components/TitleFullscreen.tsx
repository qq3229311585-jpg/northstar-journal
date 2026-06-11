'use client';

import { useState } from 'react';
import { ReactNode } from 'react';

export function TitleFullscreen({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div
        className="title-fullscreen-wrapper"
        onClick={isFullscreen ? toggleFullscreen : undefined}
      >
        {children}
        {!isFullscreen && (
          <button
            className="title-fullscreen-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            title="全屏浏览标题"
            aria-label="全屏浏览标题"
          >
            ⛶
          </button>
        )}
      </div>

      {isFullscreen && (
        <div className="title-fullscreen-overlay" onClick={toggleFullscreen}>
          <div className="title-fullscreen-content">
            {children}
            <button
              className="title-fullscreen-close"
              onClick={toggleFullscreen}
              aria-label="关闭全屏"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
