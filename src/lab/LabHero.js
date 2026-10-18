import { useEffect, useRef, useState } from 'react';
import LivingField from './LivingField';

// Prototype hero: the silk, with ghosts footage or your camera as a portal
// and the mic as a live wire. Switch inputs at the bottom. Nothing is sent
// anywhere; the camera and mic stay in the browser.

const CLIPS = [
  { id: 'a', label: 'Clip A', src: '/lab/ghosts-a.mp4' },
  { id: 'b', label: 'Clip B', src: '/lab/ghosts-b.mp4' },
];

const LabHero = () => {
  const [source, setSource] = useState('b');
  const [sound, setSound] = useState(false);
  const [keyLevel, setKeyLevel] = useState(0.32);
  const [mirror, setMirror] = useState(true);
  const [levels, setLevels] = useState({ bass: 0, mid: 0, drive: 0, beat: 0 });
  const [video, setVideo] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const meter = useRef(0);

  // A hidden <video>: a clip from /public, or the camera.
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;
    let stream = null;
    let cancelled = false;
    setCameraError(null);
    const clip = CLIPS.find((c) => c.id === source);
    if (clip) {
      node.srcObject = null;
      node.src = clip.src;
      node.loop = true;
      node.muted = true;
      node.playsInline = true;
      node.play().catch(() => {});
      setVideo(node);
    } else if (source === 'camera') {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false })
        .then((s) => {
          if (cancelled) {
            s.getTracks().forEach((t) => t.stop());
            return;
          }
          stream = s;
          node.removeAttribute('src');
          node.srcObject = s;
          node.muted = true;
          node.playsInline = true;
          node.play().catch(() => {});
          setVideo(node);
        })
        .catch((error) => setCameraError(error.message || 'Camera unavailable'));
    } else {
      node.pause();
      node.removeAttribute('src');
      node.srcObject = null;
      setVideo(null);
    }
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [source]);

  // Throttle the meter so React isn't rendering 60 times a second.
  const onLevels = (next) => {
    const now = performance.now();
    if (now - meter.current < 80) return;
    meter.current = now;
    setLevels({ bass: next.bass, mid: next.mid, drive: next.drive, beat: next.beat });
  };

  return (
    <div className="labhero">
      <section className="hero is-lab">
        <LivingField video={video} sound={sound} keyLevel={keyLevel} mirror={mirror} className="hero-field" onLevels={onLevels} />
        <video ref={videoRef} className="labhero-video" muted playsInline aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-body">
          <div className="hero-copy">
            <h1 className="hero-heading">Hey, it&rsquo;s Baz.</h1>
            <p className="hero-sub">Software + visuals.</p>
          </div>
          <div className="labhero-controls" data-no-field>
            <div className="labhero-group" role="group" aria-label="Picture">
              <span className="labhero-label">Picture</span>
              {[{ id: 'none', label: 'Field only' }, ...CLIPS, { id: 'camera', label: 'Your camera' }].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`labhero-chip ${source === option.id ? 'is-on' : ''}`}
                  onClick={() => setSource(option.id)}
                >
                  {option.label}
                </button>
              ))}
              {cameraError && <span className="labhero-note">{cameraError}</span>}
            </div>
            {source !== 'none' && (
              <div className="labhero-group" role="group" aria-label="Key">
                <span className="labhero-label">Key</span>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.01"
                  value={keyLevel}
                  onChange={(e) => setKeyLevel(Number(e.target.value))}
                  aria-label="Key threshold"
                />
                <span className="labhero-value">{keyLevel.toFixed(2)}</span>
                {source === 'camera' && (
                  <button type="button" className={`labhero-chip ${mirror ? 'is-on' : ''}`} onClick={() => setMirror((m) => !m)}>
                    Mirror
                  </button>
                )}
              </div>
            )}
            <div className="labhero-group" role="group" aria-label="Sound">
              <span className="labhero-label">Sound</span>
              <button type="button" className={`labhero-chip ${sound ? 'is-on' : ''}`} onClick={() => setSound((s) => !s)}>
                {sound ? 'Mic on' : 'Use the mic'}
              </button>
              {sound && (
                <span className="labhero-meter" aria-hidden="true">
                  <i style={{ transform: `scaleX(${levels.bass})` }} />
                  <i style={{ transform: `scaleX(${levels.mid})` }} />
                  <b style={{ opacity: levels.beat }} />
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      <p className="labhero-foot">
        Prototype. Clips are from ghosts.fyi; the camera and mic never leave this browser. The real version would key the body
        with a segmentation model, the way ghosts does, instead of brightness.
      </p>
    </div>
  );
};

export default LabHero;
