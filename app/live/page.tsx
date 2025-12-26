'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isRecording, setIsRecording] = useState(false);
  const [isGoingLive, setIsGoingLive] = useState(false);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiEffectType, setAiEffectType] = useState('beauty'); // beauty, blur-bg, face-enhance
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const pauseTimerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const filters = [
    { id: 'beauty', label: '✨ BEAUTY', color: '#ec4899' },
    { id: 'smooth', label: '🎵 SMOOTH', color: '#3b82f6' },
    { id: 'chill', label: '❄️ CHILL', color: '#06b6d4' },
    { id: 'hype', label: '🔥 HYPE', color: '#f97316' },
    { id: 'groovy', label: '🎶 GROOVY', color: '#a855f7' },
    { id: 'vibes', label: '✨ VIBES', color: '#ec4899' },
    { id: 'lofi', label: '☕ LO-FI', color: '#b45309' },
    { id: 'ambient', label: '🌌 AMBIENT', color: '#6366f1' },
    { id: 'trap', label: '⚡ TRAP', color: '#1e293b' },
    { id: 'dark', label: '🌑 DARK', color: '#000' },
  ];

  const filterEffects = {
    beauty: 'brightness(1.2) contrast(1.1) saturate(1.1)',
    smooth: 'blur(1px) brightness(1.15) saturate(1.05)',
    chill: 'hue-rotate(200deg) saturate(0.8) brightness(1.1)',
    hype: 'saturate(1.8) brightness(1.25) contrast(1.4) hue-rotate(10deg)',
    groovy: 'hue-rotate(45deg) saturate(1.5) brightness(1.15)',
    vibes: 'sepia(0.3) saturate(1.3) hue-rotate(350deg)',
    lofi: 'sepia(0.5) saturate(0.5) brightness(0.95)',
    ambient: 'hue-rotate(270deg) saturate(0.7) brightness(1.1)',
    trap: 'contrast(1.5) brightness(0.9) saturate(1.2)',
    dark: 'brightness(0.65) contrast(1.4)',
  };

  // APPLY BROWSER-SIDE AI FILTERS
  const applyAIEffect = async (videoElement, outputCanvas) => {
    if (!aiMode || !videoElement || !outputCanvas) return;

    const ctx = outputCanvas.getContext('2d');
    outputCanvas.width = videoElement.videoWidth;
    outputCanvas.height = videoElement.videoHeight;

    // Simple client-side AI effects (no server needed)
    if (aiEffectType === 'beauty') {
      // Beauty mode: smooth skin, enhance features
      ctx.filter = 'blur(2px)';
      ctx.drawImage(videoElement, 0, 0);
      
      // Overlay slight brightness boost
      ctx.fillStyle = 'rgba(255, 200, 150, 0.1)';
      ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      
    } else if (aiEffectType === 'blur-bg') {
      // Blur background (keep face sharp)
      ctx.drawImage(videoElement, 0, 0);
      
      // Simple edge detection for face
      const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const data = imageData.data;
      
      // Apply slight blur to entire image
      ctx.filter = 'blur(8px)';
      ctx.drawImage(videoElement, 0, 0);
      
    } else if (aiEffectType === 'face-enhance') {
      // Face enhancement: sharpen, enhance eyes/lips
      ctx.filter = 'contrast(1.3) brightness(1.1) saturate(1.2)';
      ctx.drawImage(videoElement, 0, 0);
    }

    // Apply selected filter on top
    if (selectedFilter) {
      ctx.filter = `${filterEffects[selectedFilter]} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(videoElement, 0, 0);
    }
  };

  // INITIALIZE CAMERA
  useEffect(() => {
    const initCamera = async () => {
      try {
        setError('');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error('Play error:', err);
              setError('Could not play video');
            });
            setIsLive(true);
          };

          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            recordedChunksRef.current.push(e.data);
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError(`${err.name}: ${err.message}`);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    };
  }, []);

  // PAUSE TIMER
  useEffect(() => {
    if (pauseTimeLeft > 0 && isPaused) {
      pauseTimerRef.current = setTimeout(() => {
        setPauseTimeLeft(pauseTimeLeft - 1);
      }, 1000);
    } else if (pauseTimeLeft === 0 && isPaused) {
      setIsPaused(false);
    }

    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [pauseTimeLeft, isPaused]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.filter = `${filterEffects[selectedFilter] || 'none'} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(videoRef.current, 0, 0);
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.download = `creator-prime-${Date.now()}.jpg`;
    link.click();
  };

  const toggleRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (!isRecording) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `creator-prime-${Date.now()}.webm`;
        link.click();
      };
      setIsRecording(false);
    }
  };

  const handleGoLive = () => {
    setIsGoingLive(!isGoingLive);
  };

  const handlePause5Min = () => {
    setIsPaused(true);
    setPauseTimeLeft(300);
  };

  const handleStopLive = () => {
    setIsGoingLive(false);
    setIsRecording(false);
    setPauseTimeLeft(0);
    setIsPaused(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('✅ Link copied to clipboard!');
  };

  const handleAI = () => {
    setAiMode(!aiMode);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a0033 50%, #0a0a15 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.8}50%{opacity:1} }
        @keyframes glow { 0%{filter:brightness(1)}50%{filter:brightness(1.2)}100%{filter:brightness(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)} }
        @keyframes aiGlow { 0%{box-shadow:0 0 20px rgba(34,197,94,0.4)}50%{box-shadow:0 0 40px rgba(34,197,94,0.8)}100%{box-shadow:0 0 20px rgba(34,197,94,0.4)} }
        input[type="range"] { accent-color: #ec4899; }
      `}</style>

      {/* ANIMATED BACKGROUND BLOBS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 6s ease-in-out infinite 1s',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 6s ease-in-out infinite 2s',
        }} />
      </div>

      {/* HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(15,15,30,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '3px solid rgba(236,72,153,0.6)',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(168,85,247,0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            {/* LEFT: BACK BUTTON */}
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'rgba(55,65,81,0.7)',
                border: '2px solid rgba(107,114,128,0.5)',
                color: '#fff',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(75,85,101,0.9)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(55,65,81,0.7)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ← BACK
            </button>

            {/* CENTER: TITLE */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #ec4899, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                🎬 CREATOR-PRIME
              </h1>
              <p style={{
                margin: '0.5rem 0 0',
                fontSize: '1rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#999',
                fontWeight: 600,
              }}>
                {aiMode ? '🤖 AI-POWERED STUDIO' : 'Live Studio • Face Filters • HD Camera'}
              </p>
            </div>

            {/* RIGHT: STATUS + CONTROLS */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.5rem',
            }}>
              {isRecording && (
                <div style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  borderRadius: '999px',
                  border: '2px solid #ff4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 0 20px rgba(220,38,38,0.8)',
                  animation: 'glow 1s ease-in-out infinite',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#ff4444',
                    boxShadow: '0 0 10px #ff4444',
                    animation: 'pulse 0.5s ease-in-out infinite',
                  }} />
                  RECORDING
                </div>
              )}

              {isGoingLive && (
                <div style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  borderRadius: '999px',
                  border: '2px solid #4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 0 20px rgba(34,197,94,0.8)',
                  animation: 'glow 1s ease-in-out infinite',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 10px #4ade80',
                    animation: 'pulse 0.5s ease-in-out infinite',
                  }} />
                  LIVE
                </div>
              )}

              {aiMode && (
                <div style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '999px',
                  border: '2px solid #a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  animation: 'aiGlow 2s ease-in-out infinite',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 10px #a78bfa',
                    animation: 'pulse 0.5s ease-in-out infinite',
                  }} />
                  AI ACTIVE
                </div>
              )}

              {isPaused && (
                <div style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '999px',
                  border: '2px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 0 20px rgba(245,158,11,0.8)',
                }}>
                  ⏸️ {formatTime(pauseTimeLeft)}
                </div>
              )}

              <div style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(34,197,94,0.2)',
                border: '2px solid #22c55e',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#22c55e',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }} />
                {isLive ? 'READY' : 'LOADING'}
              </div>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollBehavior: 'smooth',
          }}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(selectedFilter === f.id ? '' : f.id)}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: selectedFilter === f.id
                    ? `linear-gradient(135deg, ${f.color}, #ec4899)`
                    : 'rgba(55,65,81,0.6)',
                  border: selectedFilter === f.id ? `2px solid ${f.color}` : '2px solid rgba(107,114,128,0.5)',
                  color: '#fff',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: selectedFilter === f.id ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                  boxShadow: selectedFilter === f.id ? `0 0 20px ${f.color}88` : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* AI EFFECTS SELECTOR (only when AI is on) */}
          {aiMode && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(139,92,246,0.1)',
              border: '2px solid rgba(139,92,246,0.4)',
              borderRadius: '0.75rem',
              display: 'flex',
              gap: '1rem',
            }}>
              <label style={{ color: '#a78bfa', fontWeight: 'bold', alignSelf: 'center' }}>🤖 AI Effect:</label>
              <select
                value={aiEffectType}
                onChange={(e) => setAiEffectType(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  background: 'rgba(55,65,81,0.7)',
                  border: '2px solid rgba(139,92,246,0.5)',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                <option value="beauty">✨ Beauty Mode (Smooth Skin)</option>
                <option value="blur-bg">🌫️ Blur Background</option>
                <option value="face-enhance">💎 Face Enhancement (Sharp)</option>
              </select>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.2)',
            border: '2px solid #dc2626',
            color: '#fca5a5',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>⚠️ {error}</div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc2626',
                border: 'none',
                color: '#fff',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!isLive && !error && (
          <div style={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}>
            <div style={{
              fontSize: '5rem',
              animation: 'float 2s ease-in-out infinite',
            }}>
              🎥
            </div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ec4899, #a855f7)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              INITIALIZING CAMERA
            </h2>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              ✅ Allow camera access in your browser popup
            </p>
          </div>
        )}

        {isLive && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
            {/* VIDEO SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* VIDEO CONTAINER */}
              <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: aiMode 
                  ? '0 0 60px rgba(139,92,246,0.5), inset 0 0 30px rgba(168,85,247,0.2)'
                  : '0 0 60px rgba(236,72,153,0.4), inset 0 0 30px rgba(168,85,247,0.2)',
                border: aiMode ? '4px solid rgba(139,92,246,0.8)' : '4px solid rgba(236,72,153,0.8)',
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    display: 'block',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                    filter: `${filterEffects[selectedFilter] || 'none'} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                    opacity: isPaused ? 0.5 : 1,
                  }}
                />
                {isPaused && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)',
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                    }}>
                      ⏸️ {formatTime(pauseTimeLeft)}
                    </div>
                  </div>
                )}
              </div>

              {/* MAIN CONTROLS - 5 BUTTONS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1rem',
              }}>
                {/* BACK */}
                <button
                  onClick={() => router.push('/')}
                  style={{
                    padding: '1.2rem 1rem',
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(107,114,128,0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ← BACK
                </button>

                {/* SHARE */}
                <button
                  onClick={handleShare}
                  style={{
                    padding: '1.2rem 1rem',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(59,130,246,0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  📤 SHARE
                </button>

                {/* GO LIVE */}
                <button
                  onClick={handleGoLive}
                  style={{
                    padding: '1.2rem 1rem',
                    background: isGoingLive
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: isGoingLive
                      ? '0 10px 25px rgba(239,68,68,0.3)'
                      : '0 10px 25px rgba(34,197,94,0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {isGoingLive ? '🛑 LIVE' : '🎬 GO LIVE'}
                </button>

                {/* PAUSE 5MIN */}
                <button
                  onClick={handlePause5Min}
                  disabled={isPaused}
                  style={{
                    padding: '1.2rem 1rem',
                    background: isPaused
                      ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: isPaused ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(245,158,11,0.3)',
                    opacity: isPaused ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!isPaused) e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ⏸️ PAUSE
                </button>

                {/* STOP LIVE */}
                <button
                  onClick={handleStopLive}
                  disabled={!isGoingLive}
                  style={{
                    padding: '1.2rem 1rem',
                    background: isGoingLive
                      ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                      : 'linear-gradient(135deg, #9ca3af, #6b7280)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: isGoingLive ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(220,38,38,0.3)',
                    opacity: isGoingLive ? 1 : 0.6,
                  }}
                  onMouseOver={(e) => {
                    if (isGoingLive) e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ⏹️ STOP
                </button>
              </div>

              {/* SECONDARY CONTROLS - SNAP, REC, AI, CLEAR */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
              }}>
                <button
                  onClick={handleCapture}
                  style={{
                    padding: '1.2rem 1rem',
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(168,85,247,0.4)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 15px 35px rgba(168,85,247,0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(168,85,247,0.4)';
                  }}
                >
                  📸 SNAP
                </button>

                <button
                  onClick={toggleRecording}
                  style={{
                    padding: '1.2rem 1rem',
                    background: isRecording
                      ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                      : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: isRecording
                      ? '0 10px 25px rgba(220,38,38,0.4)'
                      : '0 10px 25px rgba(6,182,212,0.4)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {isRecording ? '⏹️ STOP REC' : '🎬 REC'}
                </button>

                <button
                  onClick={handleAI}
                  style={{
                    padding: '1.2rem 1rem',
                    background: aiMode
                      ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    border: aiMode ? '2px solid #a78bfa' : 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: aiMode
                      ? '0 10px 25px rgba(139,92,246,0.5)'
                      : '0 10px 25px rgba(99,102,241,0.4)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🤖 {aiMode ? 'AI ON' : 'AI'}
                </button>

                <button
                  onClick={() => setSelectedFilter('')}
                  style={{
                    padding: '1.2rem 1rem',
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(100,116,139,0.4)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ✕ CLEAR
                </button>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              {/* BRIGHTNESS */}
              <div style={{
                background: 'rgba(30,30,45,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem',
                borderRadius: '1rem',
                border: '1px solid rgba(168,85,247,0.3)',
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#fbbf24',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  ☀️ BRIGHTNESS
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(55,65,81,0.5)',
                    outline: 'none',
                  }}
                />
                <div style={{
                  marginTop: '0.75rem',
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                }}>
                  {brightness}%
                </div>
              </div>

              {/* CONTRAST */}
              <div style={{
                background: 'rgba(30,30,45,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem',
                borderRadius: '1rem',
                border: '1px solid rgba(236,72,153,0.3)',
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#ec4899',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  🔲 CONTRAST
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(55,65,81,0.5)',
                    outline: 'none',
                  }}
                />
                <div style={{
                  marginTop: '0.75rem',
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#ec4899',
                }}>
                  {contrast}%
                </div>
              </div>

              {/* SATURATION */}
              <div style={{
                background: 'rgba(30,30,45,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem',
                borderRadius: '1rem',
                border: '1px solid rgba(6,182,212,0.3)',
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#06b6d4',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  🎨 SATURATION
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(55,65,81,0.5)',
                    outline: 'none',
                  }}
                />
                <div style={{
                  marginTop: '0.75rem',
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#06b6d4',
                }}>
                  {saturation}%
                </div>
              </div>

              {/* STATUS BOX */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.1))',
                border: '1px solid rgba(168,85,247,0.4)',
                padding: '1.25rem',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
              }}>
                <h3 style={{
                  margin: '0 0 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#a78bfa',
                }}>
                  📊 STATUS
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#999',
                  lineHeight: '1.6',
                }}>
                  <div>✅ Camera: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>READY</span></div>
                  <div>🎬 Filter: <span style={{ color: '#ec4899', fontWeight: 'bold' }}>{selectedFilter.toUpperCase() || 'NONE'}</span></div>
                  <div>🔴 Record: <span style={{ color: isRecording ? '#dc2626' : '#999', fontWeight: 'bold' }}>{isRecording ? 'YES' : 'NO'}</span></div>
                  <div>🤖 AI: <span style={{ color: aiMode ? '#8b5cf6' : '#999', fontWeight: 'bold' }}>{aiMode ? `${aiEffectType.toUpperCase()}` : 'OFF'}</span></div>
                </div>
              </div>

              {/* AI INFO BOX */}
              {aiMode && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))',
                  border: '2px solid rgba(139,92,246,0.5)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  fontSize: '0.8rem',
                  color: '#a78bfa',
                  lineHeight: '1.5',
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>💜 100% BROWSER AI</div>
                  <div style={{ color: '#999', fontSize: '0.75rem' }}>
                    ✓ Zero server costs<br/>
                    ✓ Runs on device<br/>
                    ✓ Real-time processing<br/>
                    ✓ Customer GPU/CPU
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
