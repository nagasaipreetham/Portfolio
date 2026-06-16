import { useState, useEffect } from 'react';
import './SectionNavigator.css';

const SECTIONS = [
  { id: 'hero', label: 'HERO' },
  { id: 'about', label: 'ABOUT' },
  { id: 'sponsors', label: 'SPONSORS' },
  { id: 'projects', label: 'WORKS' },
  { id: 'contact', label: 'CONTACT' },
  { id: 'footer', label: 'FOOTER' }
];

// Y coordinate arrays (defined relative to a 260x320 SVG ViewBox)
const Y_COLLAPSED = [125, 139, 153, 167, 181, 195];
const Y_RIGHT_EXPANDED = [115, 133, 151, 169, 187, 205]; // closer spacing on the right
const Y_LEFT_EXPANDED = [60, 100, 140, 180, 220, 260];    // wider diverging spacing on the left

export default function SectionNavigator() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // ── Track viewport scroll to update active section ─────────────────
  useEffect(() => {
    const elements = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);

    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px', // detects when crossing center portion of screen
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));

    // Fallback/Initial layout check
    const checkActive = () => {
      let currentActive = 'hero';
      let minDistance = Infinity;

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Distance from center-top of viewport
        const dist = Math.abs(rect.top - window.innerHeight * 0.2);
        if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.15) {
          if (dist < minDistance) {
            minDistance = dist;
            currentActive = el.id;
          }
        }
      });
      
      setActiveSection(currentActive);
    };

    // Run check once on mount and register scroll/resize handlers
    checkActive();
    window.addEventListener('scroll', checkActive);
    window.addEventListener('resize', checkActive);

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener('scroll', checkActive);
      window.removeEventListener('resize', checkActive);
    };
  }, []);

  // ── Smooth Scroll on click ─────────────────────────────────────────
  const handleNavigate = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Resolve target element if pinned by GSAP ScrollTrigger
    const target = element.closest('.pin-spacer') || element;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`section-navigator ${isHovered ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
      aria-label="Section navigation menu"
    >
      {/* SVG Canvas for drawing the curved connector lines */}
      <svg className="navigator-svg" viewBox="0 0 260 320" xmlns="http://www.w3.org/2000/svg">
        {SECTIONS.map((section, idx) => {
          const isActive = activeSection === section.id;
          const isItemHovered = hoveredIndex === idx;

          // Compute coordinates based on hover state
          const yRight = isHovered ? Y_RIGHT_EXPANDED[idx] : Y_COLLAPSED[idx];
          const yLeft = isHovered ? Y_LEFT_EXPANDED[idx] : Y_COLLAPSED[idx];

          const xRight = 250;
          const xLeft = isHovered ? 100 : 230;

          const cxRight = isHovered ? 175 : 243.3;
          const cxLeft = isHovered ? 175 : 236.7;

          // Cubic Bezier path
          const pathData = `M ${xRight},${yRight} C ${cxRight},${yRight} ${cxLeft},${yLeft} ${xLeft},${yLeft}`;

          return (
            <path
              key={section.id}
              d={pathData}
              className={`navigator-line ${isActive ? 'active' : ''} ${isItemHovered ? 'hovered' : ''}`}
            />
          );
        })}
      </svg>

      {/* Navigation Text Labels positioned to align with left ends of paths */}
      <div className="navigator-labels">
        {SECTIONS.map((section, idx) => {
          const isActive = activeSection === section.id;
          const isItemHovered = hoveredIndex === idx;

          // Match vertical coordinate of left end of line
          const topPosition = isHovered ? Y_LEFT_EXPANDED[idx] : Y_COLLAPSED[idx];

          return (
            <button
              key={section.id}
              className={`navigator-label-btn ${isActive ? 'active' : ''} ${isItemHovered ? 'hovered' : ''}`}
              style={{
                top: `${topPosition}px`,
                // Calculate correct transform translation when active or hovered
                transform: `translateY(-50%) scale(${isItemHovered ? 1.08 : 1})`,
              }}
              onClick={() => handleNavigate(section.id)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={isHovered ? 0 : -1}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
