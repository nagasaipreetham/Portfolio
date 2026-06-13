import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Works.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    name: 'Zerion',
    tagline: 'Analytics Dashboard',
    description:
      'Real-time data visualization platform with AI-powered insights, customizable widgets, and live reporting modules.',
    stack: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
    year: '2024',
    hue: '230',
  },
  {
    id: '02',
    name: 'NeoCommerce',
    tagline: 'E-Commerce Platform',
    description:
      'Scalable storefront builder with seamless checkout flow, inventory management system, and multi-theme support.',
    stack: ['Next.js', 'Express', 'PostgreSQL', 'Stripe'],
    year: '2024',
    hue: '160',
  },
  {
    id: '03',
    name: 'Cortex AI',
    tagline: 'AI Writing Assistant',
    description:
      'Distraction-free editor with GPT-4 integration, smart auto-complete, real-time suggestions, and voice input.',
    stack: ['React', 'Python', 'OpenAI API', 'FastAPI'],
    year: '2023',
    hue: '40',
  },
  {
    id: '04',
    name: 'Flowcast',
    tagline: 'Collaborative Whiteboard',
    description:
      'Infinite canvas with real-time multi-cursor syncing, shape recognition, and one-click diagram export.',
    stack: ['React', 'Socket.io', 'Canvas API', 'Node.js'],
    year: '2023',
    hue: '310',
  },
  {
    id: '05',
    name: 'Beacon CMS',
    tagline: 'Headless Content Platform',
    description:
      'Visual page builder with multi-site support, API-first architecture, role-based access, and global CDN delivery.',
    stack: ['React', 'GraphQL', 'MongoDB', 'Cloudflare'],
    year: '2023',
    hue: '265',
  },
];

export default function Works() {
  const sectionRef          = useRef(null);
  const curtainTopRef       = useRef(null);   // used for BOTH open AND close
  const curtainBottomRef    = useRef(null);   // used for BOTH open AND close
  const galleryTrackRef     = useRef(null);
  const galleryContainerRef = useRef(null);

  useEffect(() => {
    const section          = sectionRef.current;
    const curtainTop       = curtainTopRef.current;
    const curtainBottom    = curtainBottomRef.current;
    const track            = galleryTrackRef.current;
    const galleryContainer = galleryContainerRef.current;

    const ctx = gsap.context(() => {
      /* ── How far the gallery must slide (px) ─────────────────── */
      const getGalleryDist = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      /* ── High-perf setters (created once, used every tick) ───── */
      const setCurtainTopY    = gsap.quickSetter(curtainTop,       'yPercent');
      const setCurtainBottomY = gsap.quickSetter(curtainBottom,    'yPercent');
      const setTrackX         = gsap.quickSetter(track,            'x', 'px');
      const setGalleryOp      = gsap.quickSetter(galleryContainer, 'opacity');

      /* ── Scroll phase map (progress 0 → 1) ───────────────────────
       *
       *  [0.00 – 0.25]  Phase 1 — curtains split OUTWARD
       *  [0.25 – 0.68]  Phase 2 — gallery scrolls horizontally
       *  [0.68 – 0.78]  Phase 3 — gallery dims
       *  [0.74 – 0.92]  Phase 4 — SAME curtains return INWARD (close)
       *  [0.92 – 1.00]  Phase 5 — hold sealed, then natural unpin
       *
       *  end = max(innerHeight×2,  galleryDist / 0.43)
       *    → gallery phase (43 % of progress) = exactly galleryDist px
       * ─────────────────────────────────────────────────────────── */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () =>
          `+=${Math.max(
            window.innerHeight * 2,
            Math.round(getGalleryDist() / 0.43)
          )}`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onUpdate(self) {
          const p = self.progress;
          const G = getGalleryDist();

          /* ── Curtains: Phase 1 (open) + Phase 4 (close) ─────────
           *
           * THE SAME top and bottom panels drive both directions.
           *
           * Phase 1 (0.00 → 0.25):
           *   top    yPercent  0 → -100  (slides UP out of screen)
           *   bottom yPercent  0 → +100  (slides DOWN out of screen)
           *
           * Phase 4 (0.74 → 0.92):
           *   top    yPercent -100 → 0   (returns DOWN, seals section)
           *   bottom yPercent +100 → 0   (returns UP,  seals section)
           *
           * Between (0.25 – 0.74): curtains parked fully open (-100/+100)
           * ─────────────────────────────────────────────────────── */
          let topY, bottomY;

          if (p <= 0.25) {
            // Phase 1 — opening
            const t = p / 0.25;
            topY    = t * -100;
            bottomY = t *  100;
          } else if (p >= 0.74) {
            // Phase 4 — closing (same curtains, reversed direction)
            const t = Math.min(1, (p - 0.74) / 0.18);
            topY    = -100 + t * 100;   //  -100 → 0
            bottomY =  100 - t * 100;   //  +100 → 0
          } else {
            // Phases 2 & 3 — curtains fully open
            topY    = -100;
            bottomY =  100;
          }

          setCurtainTopY(topY);
          setCurtainBottomY(bottomY);

          /* ── Phase 2: gallery scrolls (0.25 → 0.68) ──────────── */
          const galleryP = Math.max(0, Math.min(1, (p - 0.25) / 0.43));
          setTrackX(-G * galleryP);

          /* ── Phase 3: gallery dims (0.68 → 0.78) ─────────────── */
          const dimP = Math.max(0, Math.min(1, (p - 0.68) / 0.10));
          setGalleryOp(1 - 0.88 * dimP);

          /* Phase 5 (0.92 → 1.00): no-op — curtains shut at topY=0 */
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="works-section" ref={sectionRef} id="projects">

      {/* ── Curtains (open on entry, close on exit) ──────────── */}
      <div className="curtain curtain-top" ref={curtainTopRef}>
        <h2 className="works-title">WORKS</h2>
      </div>

      <div className="curtain curtain-bottom" ref={curtainBottomRef}>
        <h2 className="works-title">WORKS</h2>
      </div>

      {/* ── Gallery ──────────────────────────────────────────── */}
      <div className="gallery-container" ref={galleryContainerRef}>

        <div className="gallery-meta">
          <span className="gallery-label">SELECTED WORKS</span>
          <span className="gallery-count">05 PROJECTS</span>
        </div>

        <div className="gallery-track" ref={galleryTrackRef}>
          <div className="gallery-pad" aria-hidden="true" />

          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="project-card"
              style={{ '--card-hue': project.hue }}
            >
              <div className="card-visual">
                <div className="card-glow" />
                <div className="card-grid" />
                <span className="card-bg-number" aria-hidden="true">
                  {project.id}
                </span>
              </div>

              <div className="card-body">
                <div className="card-header">
                  <span className="card-id">{project.id}</span>
                  <span className="card-year">{project.year}</span>
                </div>

                <div className="card-text">
                  <h3 className="card-name">{project.name}</h3>
                  <p className="card-tagline">{project.tagline}</p>
                  <p className="card-desc">{project.description}</p>
                </div>

                <div className="card-bottom">
                  <div className="card-stack">
                    {project.stack.map((tag) => (
                      <span key={tag} className="stack-pill">{tag}</span>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="card-arrow"
                    aria-label={`View ${project.name} project`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="gallery-pad" aria-hidden="true" />
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <span>SCROLL</span>
        </div>
      </div>

      {/* Film-grain overlay */}
      <div className="works-grain" aria-hidden="true" />
    </section>
  );
}
