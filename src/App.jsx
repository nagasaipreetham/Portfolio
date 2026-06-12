import Navbar from './components/Navbar';
import Separator from './components/Separator';
import Hero from './components/Hero';

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
        
        {/* Faint ABOUT separator */}
        <div className="section-separator">
          <span className="section-label">ABOUT</span>
          <div className="section-line"></div>
        </div>
      </main>
    </div>
  );
}

export default App;
