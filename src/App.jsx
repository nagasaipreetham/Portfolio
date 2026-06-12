import Navbar from './components/Navbar';
import Separator from './components/Separator';
import Hero from './components/Hero';
import About from './components/About';
import SkillStack from './components/SkillStack';

function App() {
  return (
    <div className="layout-container">
      <div className="hero-banner-wrapper">
        <img src="/banner.png" alt="Hero background" className="hero-banner-img" />
        <div className="hero-banner-fade"></div>
      </div>
      
      <Navbar />
      
      <div className="separator-full-width">
        <Separator />
      </div>

      <main>
        <Hero />

        <div className="separator-full-width">
          <Separator />
        </div>
        
        <About />

        {/* SKILL STACK divider */}
        <div className="section-separator">
          <span className="section-label">SKILL STACK</span>
          <div className="section-line"></div>
        </div>

        <SkillStack />

        <div className="separator-full-width">
          <Separator />
        </div>
      </main>
    </div>
  );
}

export default App;
