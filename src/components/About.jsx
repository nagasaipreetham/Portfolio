import './About.css';

export default function About() {
  return (
    <section className="about-section-container">
      {/* Left Column: Thin vertical title bar */}
      <div className="about-left-bar" aria-hidden="true">
        <span className="about-vertical-text">ABOUT</span>
      </div>

      {/* Right Column: About Details */}
      <div className="about-right-content">
        <p className="about-bio-text">
          Hi👋! I'm <span className="highlight-text">Preetham</span>. I build things that seemed like a good idea at 2 AM.<p></p>
          I enjoy building products with the <span className="highlight-text">MERN stack</span>, experimenting with <span className="highlight-text">AI tools</span>, and <span className="highlight-text">designing experiences</span> that people actually enjoy using. Most of my ideas start as random thoughts and end up as projects on the internet.
        </p>
        
        <div className="about-divider-line"></div>
        
        <div className="about-education-row">
          <span className="education-school">Centurion University of Technology and Management, AP</span>
          <span className="education-cgpa">~CGPA 9.11</span>
        </div>
      </div>
    </section>
  );
}
