import React, { useState, useRef, useEffect } from 'react';

// Use odd numbered images as detected: 1, 3, 5, ...
// Assuming max is 13 based on file list.
const IMAGE_FILES = [
  '1.png', '3.png', '5.png', '7.png', '9.png', '11.png', '13.png'
];

function App() {
  const [step, setStep] = useState(0); // Current image index
  const [region, setRegion] = useState(null); // { x, y, w, h } in %
  const [isZooming, setIsZooming] = useState(false);

  const currentImageSrc = `/images/${IMAGE_FILES[step]}`;
  const nextImageSrc = step < IMAGE_FILES.length - 1 ? `/images/${IMAGE_FILES[step + 1]}` : null;

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
    // Force aspect ratio to match screen (container) for perfect zoom?
    // Let's keep it freeform but maybe square is safer? 
    // User asked "draw a box", usually implies freeform. 
    // But for "Infinite Zoom" to work perfectly, the box aspect ratio SHOULD ideally match the viewport.
    // Let's enforce the aspect ratio of the selection to match the container (16:9 approx).
    // Or just let user draw and we zoom to "cover" or "contain".
    // Let's try simple freeform first, but maybe just width determines height if we want 1:1 map.
    // Let's settle on: Box determines the "Next Viewport".

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
      // Transition finished.
      // 1. Advance Step
      setStep(s => s + 1);
      // 2. Reset Region & Zoom State
      setIsZooming(false);
      setRegion(null);
    }
  };

  // Calculate Transform for Zoom
  // We want the Region to fill the Container.
  // Scale = 100 / region.w (assuming width dominant)
  // Origin = Center of region
  const zoomStyle = isZooming && region ? {
    transformOrigin: `${region.x + region.w / 2}% ${region.y + region.h / 2}%`,
    transform: `scale(${100 / region.w})`, // Scale based on width
    transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)' // Slow ease-in-out or ease-in
  } : {
    transformOrigin: 'center center',
    transform: 'scale(1)',
    transition: 'none'
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">Mosaic Zoom: Step {step + 1} / {IMAGE_FILES.length}</div>
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
          {/* 
              The Zoom Layer.
              This whole div scales up.
            */}
          <div
            className="zoom-layer"
            style={zoomStyle}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Current Image */}
            <img
              src={currentImageSrc}
              className="current-image"
              alt="current"
            />

            {/* 
                  Next Image (Hidden initially, or overlay inside box?)
                  For "Mosaic Effect", we can just let the Current Image pixelate as it scales.
                  AND we can overlay the next image inside the box with opacity, or just reveal it next step.
                  The user says "出現馬賽克過場效果, 然後出現第二張".
                  This implies the transition ITSELF is the effect, then the switch happens.
                  
                  To make it look like a cool transition:
                  We can overlay the NEXT image inside the selection region immediately?
                  Or just zoom the current one until it's blurry/blocky, then switch.
                */}
          </div>

          {/* UI Overlays (Not scaled) */}
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

          {/* Guide Text */}
          {!isZooming && !region && nextImageSrc && (
            <div className="guide-text">Draw a box to define the next frame</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
