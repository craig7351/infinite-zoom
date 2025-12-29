import React, { useState, useRef, useEffect } from 'react';

// Project Configurations
const PROJECTS = {
  infinite: {
    name: 'Infinite Zoom',
    folder: 'images',
    frames: ['1.webp', '3.webp', '5.webp', '7.webp', '9.webp', '11.webp', '13.webp'],
    guides: {
      0: { x: 39.39, y: 65.14, w: 20.07, h: 27.43 },
      1: { x: 35.24, y: 60.43, w: 18.68, h: 29.29 },
      2: { x: 39.08, y: 34.14, w: 26.30, h: 23.71 },
      3: { x: 50.15, y: 23.43, w: 19.38, h: 31.43 },
      4: { x: 46.16, y: 20.29, w: 18.76, h: 34.86 },
      5: { x: 36.01, y: 35.14, w: 16.30, h: 25.43 },
    }
  },
  earth: {
    name: 'Earth Zoom',
    folder: 'earth-zoom',
    // Updated to match actual files in directory
    frames: [
      '1.webp', '2.webp', '3.webp', '4.webp', '5.webp',
      '6.webp', '7.webp', '8.webp', '9.webp', '10.webp',
      '11.webp', '12.webp', '14.webp', '16.webp', '17.webp',
      '19.webp', '20.webp', '22.webp', '24.webp', '26.webp', '28.webp'
    ],
    guides: {
      // 1.webp (Step 0)
      0: { x: 53.26, y: 40.33, w: 3.94, h: 7.41 },
      // 2.webp (Step 1)
      1: { x: 48.57, y: 45.73, w: 3.40, h: 7.41 },
      // 3.webp (Step 2)
      2: { x: 48.44, y: 45.23, w: 3.94, h: 8.54 },
      // 4.webp (Step 3)
      3: { x: 48.44, y: 45.23, w: 3.94, h: 8.54 },
      // 5.webp (Step 4)
      4: { x: 47.76, y: 45.73, w: 4.48, h: 8.54 },
      // 6.webp (Step 5)
      5: { x: 47.76, y: 45.73, w: 4.48, h: 8.54 },
      // 7.webp (Step 6)
      6: { x: 47.76, y: 45.73, w: 4.48, h: 8.54 },
      // 8.webp (Step 7)
      7: { x: 47.76, y: 45.73, w: 4.48, h: 8.54 },
      // 9.webp (Step 8)
      8: { x: 47.76, y: 45.73, w: 4.48, h: 8.54 },
      // 10.webp (Step 9)
      9: { x: 60.73, y: 23.13, w: 7.54, h: 11.80 },
      // 11.webp (Step 10)
      10: { x: 52.24, y: 36.44, w: 4.62, h: 12.56 },
      // 12.webp (Step 11)
      11: { x: 29.96, y: 34.56, w: 11.61, h: 14.94 },
      // 14.webp (Step 12)
      12: { x: 32.14, y: 22.88, w: 13.04, h: 11.43 },
      // 16.webp (Step 13)
      13: { x: 15.91, y: 19.49, w: 13.31, h: 20.09 },
      // 17.webp (Step 14)
      14: { x: 32.07, y: 25.14, w: 3.19, h: 4.02 },
      // 19.webp (Step 15)
      15: { x: 34.85, y: 69.71, w: 14.74, h: 22.98 },
      // 20.webp (Step 16)
      16: { x: 31.46, y: 82.90, w: 8.90, h: 14.06 },
      // 22.webp (Step 17)
      17: { x: 27.52, y: 66.20, w: 22.75, h: 29.63 },
      // 24.webp (Step 18)
      18: { x: 33.84, y: 46.11, w: 13.79, h: 15.95 },
      // 26.webp (Step 19)
      19: { x: 23.72, y: 45.10, w: 25.33, h: 42.32 },
    }
  }
};

function App() {
  const [currentProject, setCurrentProject] = useState('infinite');
  const [step, setStep] = useState(0); // Current image index
  const [region, setRegion] = useState(null); // { x, y, w, h } in %
  const [isZooming, setIsZooming] = useState(false);
  // Removed clickMode state - always active
  const [debugMode, setDebugMode] = useState(false); // New Debug Mode

  const projectConfig = PROJECTS[currentProject];
  const imageFiles = projectConfig.frames;
  const guides = projectConfig.guides;

  // Reset state when project changes
  useEffect(() => {
    setStep(0);
    setRegion(null);
    setIsZooming(false);
  }, [currentProject]);

  const currentImageSrc = `${import.meta.env.BASE_URL}${projectConfig.folder}/${imageFiles[step]}`;
  const nextImageSrc = step < imageFiles.length - 1 ? `${import.meta.env.BASE_URL}${projectConfig.folder}/${imageFiles[step + 1]}` : null;
  const currentGuide = guides[step];

  const containerRef = useRef(null);

  // Selection Logic
  const [dragStart, setDragStart] = useState(null);

  const handleMouseDown = (e) => {
    if (isZooming || !nextImageSrc) return;

    // MODIFICATION: Block drag if not in debug mode
    if (!debugMode) return;

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
    // If debug mode and valid region, log coords
    if (debugMode && region && region.w > 0) {
      const filename = imageFiles[step];
      const coords = `// ${filename} (Step ${step})\n${step}: { x: ${region.x.toFixed(2)}, y: ${region.y.toFixed(2)}, w: ${region.w.toFixed(2)}, h: ${region.h.toFixed(2)} },`;
      console.log(coords);
    }
    setDragStart(null);
  };

  const handleGuideClick = () => {
    if (isZooming || !currentGuide) return;
    setRegion({ ...currentGuide });
    setIsZooming(true);
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

  const copyToClipboard = () => {
    if (!region) return;
    const filename = imageFiles[step];
    // Format: // filename (Step X) -> X: { ... },
    const textToCopy = `// ${filename} (Step ${step})\n${step}: { x: ${region.x.toFixed(2)}, y: ${region.y.toFixed(2)}, w: ${region.w.toFixed(2)}, h: ${region.h.toFixed(2)} },`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Show a brief non-blocking toast or just alert
      // For simplicity, keeping alert but making it informative
      alert('Copied to clipboard:\n' + textToCopy);
    });
  };

  // Calculate Transform for Zoom
  const zoomStyle = isZooming && region ? {
    transformOrigin: `${region.x + region.w / 2}% ${region.y + region.h / 2}%`,
    transform: `scale(${100 / region.w})`,
    transition: 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)'
  } : {
    transformOrigin: 'center center',
    transform: 'scale(1)',
    transition: 'none'
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Project Switcher */}
          <select
            value={currentProject}
            onChange={(e) => setCurrentProject(e.target.value)}
            style={{
              background: '#333',
              color: '#fff',
              border: '1px solid #555',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {Object.entries(PROJECTS).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
        </div>

        <div className="controls-bar" style={{ gap: '15px' }}>
          {/* Debug Mode Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem', color: '#8f8' }}>
            <input
              type="checkbox"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Debug Box
          </label>

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
                height: `${currentGuide.h}%`,
                pointerEvents: 'auto', // Always interactive
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.15)', // Always visible
                // Debug Green Box Style
                border: debugMode ? '2px solid #0f0' : '1px solid rgba(255, 0, 0, 0.8)',
                boxShadow: debugMode ? '0 0 10px #0f0' : 'none'
              }}
              onClick={handleGuideClick}
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
            {debugMode ? 'Debug: Drag to measure & copy coords' : '點擊白色框框進入下一層'}
          </div>
        )}

        {/* Fixed Debug Info Panel */}
        {debugMode && region && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid #0f0',
            padding: '15px',
            borderRadius: '8px',
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            minWidth: '200px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>Debug Info</h4>
            <div style={{ marginBottom: '5px', color: '#fff', fontWeight: 'bold' }}>
              {imageFiles[step]} (Step {step})
            </div>

            {/* Step Navigation */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <button
                disabled={step <= 0}
                onClick={() => setStep(s => Math.max(0, s - 1))}
                style={{
                  flex: 1,
                  background: step <= 0 ? '#555' : '#444',
                  color: '#fff',
                  border: '1px solid #777',
                  padding: '4px',
                  cursor: step <= 0 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                &lt; Prev
              </button>
              <button
                disabled={step >= imageFiles.length - 1}
                onClick={() => setStep(s => Math.min(imageFiles.length - 1, s + 1))}
                style={{
                  flex: 1,
                  background: step >= imageFiles.length - 1 ? '#555' : '#444',
                  color: '#fff',
                  border: '1px solid #777',
                  padding: '4px',
                  cursor: step >= imageFiles.length - 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                Next &gt;
              </button>
            </div>

            <hr style={{ borderColor: '#333', margin: '5px 0' }} />
            <div style={{ marginBottom: '5px' }}>x: {region.x.toFixed(2)}</div>
            <div style={{ marginBottom: '5px' }}>y: {region.y.toFixed(2)}</div>
            <div style={{ marginBottom: '5px' }}>w: {region.w.toFixed(2)}</div>
            <div style={{ marginBottom: '10px' }}>h: {region.h.toFixed(2)}</div>
            <button
              onClick={copyToClipboard}
              style={{
                width: '100%',
                background: '#0f0',
                color: '#000',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}
            >
              Copy Config
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
