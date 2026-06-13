import './Contact.css';

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <p className="contact-sub">
          Have an exciting project, collaboration opportunity, or just want to say hello?
        </p>
        <p className="contact-sub">
          Let's connect and build something remarkable.
        </p>

        {/* Hover trigger container for email address & send a message button */}
        <div className="contact-email-trigger">
          <a href="mailto:nagasaipreetham@gmail.com" className="contact-email">
            <span className="email-user">nagasaipreetham</span>
            <span className="email-domain">@gmail.com</span>
          </a>

          {/* Comet trail line container — layout-stable space holder */}
          <div className="email-underline-wrapper">
            <div className="email-underline"></div>
          </div>

          <a href="mailto:nagasaipreetham@gmail.com" className="contact-message-link">
            SEND A MESSAGE <span className="arrow">↗</span>
          </a>
        </div>

        {/* Divider line with text */}
        <div className="contact-divider">
          <span className="contact-divider-text">OR FIND ME ON</span>
        </div>

        {/* Center links grid (wrapped & centered) */}
        <div className="social-links-grid">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
            X
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
            LINKEDIN
          </a>
          <a href="mailto:nagasaipreetham@gmail.com" className="social-link">
            EMAIL
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            INSTAGRAM
          </a>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-link">
            DISCORD
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
            GITHUB
          </a>
        </div>
      </div>
    </section>
  );
}
