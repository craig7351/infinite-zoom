import React, { useState, useRef, useEffect } from 'react';

// Use odd numbered images as detected: 1, 3, 5, ...
// Assuming max is 13 based on file list.
const IMAGE_FILES = [
  '1.webp', '3.webp', '5.webp', '7.webp', '9.webp', '11.webp', '13.webp'
];

// Define optional guides for each image (User will provide these values later)
// Format: { [stepIndex]: { x, y, w, h } }
const GUIDES = {
  0: { x: 39.39, y: 65.14, w: 20.07, h: 27.43 },
  1: { x: 35.24, y: 60.43, w: 18.68, h: 29.29 },
  2: { x: 39.08, y: 34.14, w: 26.30, h: 23.71 },
  3: { x: 50.15, y: 23.43, w: 19.38, h: 31.43 },
  4: { x: 46.16, y: 20.29, w: 18.76, h: 34.86 },
  5: { x: 36.01, y: 35.14, w: 16.30, h: 25.43 },
};

function App() {
  const [step, setStep] = useState(0); // Current image index
  const [region, setRegion] = useState(null); // { x, y, w, h } in %
  const [isZooming, setIsZooming] = useState(false);

  const currentImageSrc = `/images/${IMAGE_FILES[step]}`;
  const nextImageSrc = step < IMAGE_FILES.length - 1 ? `/images/${IMAGE_FILES[step + 1]}` : null;
  const currentGuide = GUIDES[step];

  const containerRef = useRef(null);

  // Selection Logic
  const [dragStart, setDragStart] = useState(null);

  const handleMouseDown = (e) => {
    if (isZooming || !nextImageSrc) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDragStart({ x, y });
    setRegion({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!dragStart || isZooming) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const width = currentX - dragStart.x;
    const height = (currentY - dragStart.y);

    setRegion({
      x: width > 0 ? dragStart.x : currentX,
      y: height > 0 ? dragStart.y : currentY,
      w: Math.abs(width),
      h: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  const startZoom = () => {
    if (!region || !nextImageSrc) return;
    setIsZooming(true);
  };

  const handleTransitionEnd = () => {
    if (isZooming) {
      setStep(s => s + 1);
      setIsZooming(false);
      setRegion(null);
    }
  };

  // Calculate Transform for Zoom
  const zoomStyle = isZooming && region ? {
    transformOrigin: `${region.x + region.w / 2}% ${region.y + region.h / 2}%`,
    transform: `scale(${100 / region.w})`,
    transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)'
  } : {
    transformOrigin: 'center center',
    transform: 'scale(1)',
    transition: 'none'
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">Infinite Zoom</div>
        <div className="controls-bar">
          {!isZooming && nextImageSrc && region && region.w > 5 && (
            <button className="primary" onClick={startZoom}>ZOOM ➤</button>
          )}
          {!nextImageSrc && (
            <button className="secondary" onClick={() => window.location.reload()}>RESET</button>
          )}
        </div>
      </header>

      <div className="main-content">
        <div
          className="canvas-container"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="zoom-layer"
            style={zoomStyle}
            onTransitionEnd={handleTransitionEnd}
          >
            <img
              src={currentImageSrc}
              className="current-image"
              alt="current"
            />
          </div>

          {/* Guide Box Layer (User Hint) */}
          {!isZooming && currentGuide && (
            <div
              className="guide-box"
              style={{
                left: `${currentGuide.x}%`,
                top: `${currentGuide.y}%`,
                width: `${currentGuide.w}%`,
                height: `${currentGuide.h}%`
              }}
            />
          )}

          {/* User Selection Layer */}
          {!isZooming && region && (
            <div
              className="selection-box"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.w}%`,
                height: `${region.h}%`
              }}
            />
          )}

        </div>

        {/* Instruction overlay */}
        {!isZooming && !region && step === 0 && (
          <div style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 30,
            pointerEvents: 'none',
            fontSize: '1.2rem',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 20
          }}>
            請參考白色透明框框 去框選要放大的區域
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

