import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { SiteProvider } from './context/SiteContext';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initial Load Animation
    const loadTl = gsap.timeline({
      onComplete: () => {
        document.body.style.opacity = '1';
      }
    });

    loadTl.to('.loader-line', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
          .to('.loader-text', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.in' }, "-=0.2")
          .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <SiteProvider>
      <Router>
        <ScrollToTop />
        <div ref={containerRef} className="text-base sm:text-lg leading-relaxed font-sans bg-[var(--c-bg)] min-h-screen">
        {/* NOISE */}
        <div className="noise"></div>

        {/* PRELOADER */}
        <div className="loader">
          <div className="loader-text flex flex-col items-center justify-center gap-4">
            <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="miter" strokeLinecap="square">
              <line x1="30" y1="15" x2="50" y2="15"></line>
              <line x1="50" y1="15" x2="50" y2="65"></line>
              <path d="M 50 65 C 50 95, 20 95, 20 65"></path>
              <line x1="50" y1="15" x2="80" y2="85"></line>
              <line x1="50" y1="60" x2="70" y2="60"></line>
            </svg>
            <div className="flex flex-col items-center text-center">
              <span className="display-font text-3xl md:text-4xl font-medium tracking-tighter leading-none">JOOARCHI</span>
              <span className="text-sm md:text-base tracking-[0.2em] mt-2 leading-none opacity-80 uppercase">Architectural Studio</span>
            </div>
          </div>
          <div className="loader-line"></div>
        </div>

        <Navigation />

        <main className="wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
    </SiteProvider>
  );
}
