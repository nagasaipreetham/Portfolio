import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────
const TWINKLE_COUNT   = 70;   // number of twinkling stars
const MAX_SHOOTS      = 2;    // max simultaneous shooting stars
const SHOOT_ANGLE_DEG = 38;   // NW→SE angle in degrees (from horizontal)
const BANNER_H        = 350;  // matches .hero-banner-wrapper height
const COVERAGE_RATIO  = 0.80; // stars only live in the top 80% of the banner

function rand(a, b) { return a + Math.random() * (b - a); }

// ─── Twinkling star factory ───────────────────────
function makeTwinkler(W, H) {
  const coverageH = H * COVERAGE_RATIO;
  return {
    x:         rand(0, W),
    y:         rand(0, coverageH),   // confined to top 80%
    r:         rand(0.3, 1.1),       // smaller, more star-like
    baseAlpha: rand(0.25, 1.0),
    alpha:     rand(0, 1),
    phase:     rand(0, Math.PI * 2),
    speed:     rand(0.006, 0.028),
  };
}

// ─── Shooting star factory  (NW → SE diagonal) ───
//  We start the star somewhere along the TOP or LEFT edge so it
//  travels fully across the visible area before exiting via
//  the BOTTOM or RIGHT edge.
function makeShooter(W, H) {
  const angleRad = (SHOOT_ANGLE_DEG * Math.PI) / 180;
  const speed    = rand(3.5, 7);
  const vx       = speed * Math.cos(angleRad);
  const vy       = speed * Math.sin(angleRad);
  const length   = rand(90, 180);

  // Spawn point: random mix of top edge and left edge
  let x, y;
  if (Math.random() < 0.6) {
    // top edge, spread across width
    x = rand(-length, W);
    y = rand(-20, H * 0.3);
  } else {
    // left edge, spread down
    x = rand(-length, W * 0.3);
    y = rand(-20, H * 0.5);
  }

  return {
    x, y, vx, vy,
    length,
    alpha:     0,
    phase:    'fadein',   // fadein | travel | fadeout
    traveled:  0,
    // how far it needs to travel before we start fading out
    fadeStart: rand(0.55, 0.75) * (Math.sqrt(W * W + H * H)),
    maxAlpha:  rand(0.55, 0.95),
  };
}

// ─────────────────────────────────────────────────
export default function StarEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Size canvas to fill wrapper ──────────────
    const resize = () => {
      canvas.width  = canvas.offsetWidth  || canvas.parentElement?.offsetWidth  || 800;
      canvas.height = canvas.offsetHeight || BANNER_H;
      // Reposition twinkling stars on resize within coverage zone
      const coverageH = canvas.height * COVERAGE_RATIO;
      twinklers.forEach((s) => {
        s.x = rand(0, canvas.width);
        s.y = rand(0, coverageH);
      });
    };

    // ── Create star pools ─────────────────────────
    const twinklers = [];
    for (let i = 0; i < TWINKLE_COUNT; i++) {
      twinklers.push(makeTwinkler(800, BANNER_H)); // rough init, resize fixes
    }

    const shooters = [];
    let rafId;

    // Stagger initial shooters with small delays so they don't all spawn at once
    const spawnTimers = [];
    for (let i = 0; i < MAX_SHOOTS; i++) {
      const t = setTimeout(() => {
        shooters.push(makeShooter(canvas.width, canvas.height));
      }, rand(0, 3000));
      spawnTimers.push(t);
    }

    resize();
    window.addEventListener('resize', resize);

    // ── Main draw loop ────────────────────────────
    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // ─── Twinkling stars ─────────────────────
      const coverageH = H * COVERAGE_RATIO;
      for (const s of twinklers) {
        s.phase += s.speed;
        // Smooth sine-based flicker — gives a breathing feel
        s.alpha = s.baseAlpha * (0.35 + 0.65 * ((Math.sin(s.phase) + 1) / 2));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
        ctx.fill();

        // Occasional soft glow on brighter stars
        if (s.r > 0.8 && s.alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,235,255,${(s.alpha * 0.12).toFixed(3)})`;
          ctx.fill();
        }
      }

      // ─── Shooting stars ──────────────────────
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];

        // Update alpha by phase
        if (s.phase === 'fadein') {
          s.alpha += 0.04;
          if (s.alpha >= s.maxAlpha) {
            s.alpha = s.maxAlpha;
            s.phase = 'travel';
          }
        } else if (s.phase === 'travel') {
          // Fade out if: traveled past fadeStart threshold OR head is nearing coverage boundary
          if (s.traveled >= s.fadeStart || s.y >= coverageH - 20) {
            s.phase = 'fadeout';
          }
        } else {
          s.alpha -= 0.025;
          if (s.alpha <= 0) {
            // Remove dead shooter and respawn a fresh one after a delay
            shooters.splice(i, 1);
            const t = setTimeout(() => {
              shooters.push(makeShooter(canvas.width, canvas.height));
            }, rand(800, 3500));
            spawnTimers.push(t);
            continue;
          }
        }

        // Move
        s.x += s.vx;
        s.y += s.vy;
        s.traveled += Math.sqrt(s.vx * s.vx + s.vy * s.vy);

        // Tail start point (opposite direction of travel)
        const tx = s.x - (s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;
        const ty = s.y - (s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;

        // ── Gradient tail: transparent at back → white at head
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0,    `rgba(255,255,255,0)`);
        grad.addColorStop(0.5,  `rgba(200,220,255,${(s.alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(0.85, `rgba(230,240,255,${(s.alpha * 0.75).toFixed(3)})`);
        grad.addColorStop(1,    `rgba(255,255,255,${s.alpha.toFixed(3)})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.8;
        ctx.lineCap     = 'round';
        // Subtle glow
        ctx.shadowColor = 'rgba(180,210,255,0.8)';
        ctx.shadowBlur  = 8;
        ctx.stroke();
        ctx.shadowBlur  = 0;

        // ── Bright head dot
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
        headGrad.addColorStop(0, `rgba(255,255,255,${s.alpha.toFixed(3)})`);
        headGrad.addColorStop(1, `rgba(180,210,255,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      spawnTimers.forEach(clearTimeout);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',   // full banner height
        zIndex:        1,
        pointerEvents: 'none',
      }}
    />
  );
}
