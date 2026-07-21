'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';
import { glitchVertexShader, glitchFragmentShader } from '@/shaders/glitch';

/**
 * A displaced PlaneGeometry with a live video texture.
 * Hover/click drives the uGlitch uniform → datamosh / chromatic aberration.
 * Falls back to an animated procedural texture if no reel.mp4 is present.
 */
export default function VideoPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glitchTarget = useRef(0);
  const glitchCurrent = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // ── Video texture (graceful fallback) ───────────────────────────────────
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const video = document.createElement('video');
    video.src = '/reel.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.oncanplaythrough = () => setVideoLoaded(true);
    video.onerror = () => { /* video failed to load — stay with fallback */ };
    video.play().catch(() => {/* silently ignore */});
    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // ── Procedural fallback canvas texture ──────────────────────────────────
  const fallbackTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1280; canvas.height = 720;
    const ctx = canvas.getContext('2d')!;
    // Initial rich frame
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, '#0d1b2a');
    grd.addColorStop(0.5, '#0a0f1a');
    grd.addColorStop(1, '#1a0d2a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Cyan frame border
    ctx.strokeStyle = 'rgba(0,255,224,0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    const tex = new THREE.CanvasTexture(canvas);
    (tex as any)._canvas = canvas;
    (tex as any)._ctx = ctx;
    return tex;
  }, []);

  // Use video only if it actually loaded successfully
  const activeTexture = (videoLoaded && videoTexture) ? videoTexture : fallbackTexture;

  // ── Shader material ──────────────────────────────────────────────────────
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: glitchVertexShader,
      fragmentShader: glitchFragmentShader,
      uniforms: {
        uVideoTexture: { value: activeTexture },
        uGlitch: { value: 0.0 },
        uTime: { value: 0.0 },
      },
      side: THREE.FrontSide,
    });
  }, [activeTexture]);

  // ── Glitch target logic ──────────────────────────────────────────────────
  useEffect(() => {
    glitchTarget.current = clicked ? 0.9 : hovered ? 0.45 : 0.0;
  }, [hovered, clicked]);

  useFrame(({ clock, viewport }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    // Smooth glitch interpolation
    glitchCurrent.current = MathUtils.lerp(
      glitchCurrent.current,
      glitchTarget.current,
      0.06
    );
    mat.uniforms.uGlitch.value = glitchCurrent.current;
    mat.uniforms.uTime.value = clock.elapsedTime;

    // Animate procedural fallback texture
    if (!videoLoaded) {
      const tex = fallbackTexture as any;
      if (!tex) return;
      const ctx = tex._ctx as CanvasRenderingContext2D;
      const canvas = tex._canvas as HTMLCanvasElement;
      const t = clock.elapsedTime;

      // Vibrant animated gradient
      const grd = ctx.createLinearGradient(
        canvas.width * Math.abs(Math.sin(t * 0.2)),
        0,
        canvas.width * Math.abs(Math.cos(t * 0.15)),
        canvas.height
      );
      grd.addColorStop(0,   `hsl(${(t * 15) % 360}, 70%, 12%)`);
      grd.addColorStop(0.4, `hsl(${(t * 25 + 120) % 360}, 60%, 8%)`);
      grd.addColorStop(0.8, `hsl(${(t * 10 + 200) % 360}, 80%, 14%)`);
      grd.addColorStop(1,   `hsl(${(t * 20 + 300) % 360}, 70%, 10%)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyan frame border
      ctx.strokeStyle = `rgba(0,255,224,${0.2 + Math.sin(t) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

      // Grid lines for tech feel
      ctx.strokeStyle = 'rgba(0,255,224,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Scan lines
      ctx.fillStyle = 'rgba(0,255,224,0.025)';
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Timecode text
      const seconds = Math.floor(t);
      const frames = Math.floor((t % 1) * 24);
      const tc = `01:${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
      ctx.font = 'bold 28px monospace';
      ctx.fillStyle = 'rgba(0,255,224,0.7)';
      ctx.fillText(tc, 40, 56);
      ctx.font = '18px monospace';
      ctx.fillStyle = 'rgba(0,255,224,0.4)';
      ctx.fillText('▶  DROP reel.mp4 INTO /public/', 40, canvas.height - 36);
      ctx.fillText('REEL PREVIEW — INTERACTIVE GLITCH PLANE', 40, canvas.height - 16);

      if (fallbackTexture) fallbackTexture.needsUpdate = true;
    }

    // Scale for vertical screens to prevent clipping the animation
    // The VideoPlane is 7.11 units wide. We want it to fit within viewport.width.
    const targetWidth = 7.5; // slight padding
    const scale = viewport.width < targetWidth ? viewport.width / targetWidth : 1;
    meshRef.current.scale.setScalar(scale);

    // Slight idle mesh float
    meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.04;
    meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); setClicked(false); }}
      onPointerDown={() => setClicked(true)}
      onPointerUp={() => setClicked(false)}
    >
      {/* High vertex count for smooth displacement */}
      <planeGeometry args={[7.11, 4, 80, 45]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
