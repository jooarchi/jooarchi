import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useSiteContext } from '../context/SiteContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteContext();

  const isUnderConstruction = settings.isUnderConstruction;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to('.menu-overlay', { y: '0%', duration: 0.8, ease: 'power4.inOut' });
      gsap.fromTo('.menu-link', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to('.menu-overlay', { y: '-100%', duration: 0.8, ease: 'power4.inOut' });
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-start md:items-center z-50 mix-blend-difference text-white pointer-events-none">
        <Link to="/" className="flex flex-col items-center gap-1.5 group hover:opacity-80 transition-opacity pointer-events-auto">
          <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="miter" strokeLinecap="square">
            <line x1="30" y1="15" x2="50" y2="15"></line>
            <line x1="50" y1="15" x2="50" y2="65"></line>
            <path d="M 50 65 C 50 95, 20 95, 20 65"></path>
            <line x1="50" y1="15" x2="80" y2="85"></line>
            <line x1="50" y1="60" x2="70" y2="60"></line>
          </svg>
          <div className="flex flex-col items-center text-center">
            <span className="display-font text-xl md:text-2xl font-medium tracking-tighter leading-none">JOOARCHI</span>
            <span className="text-xs tracking-[0.2em] mt-1 leading-none opacity-80 uppercase">Architectural Studio</span>
          </div>
        </Link>

        <div className={`gap-8 text-sm tracking-widest uppercase opacity-80 mt-4 md:mt-0 pointer-events-auto ${isUnderConstruction ? 'flex' : 'hidden md:flex'}`}>
          {!isUnderConstruction && (
            <>
              <Link to="/projects" className="hover:opacity-100 transition-opacity">Project</Link>
              <Link to="/about" className="hover:opacity-100 transition-opacity">About</Link>
              <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
            </>
          )}
          <Link to="/admin" className="hover:opacity-100 transition-opacity">Admin</Link>
        </div>
        
        {!isUnderConstruction && (
          <button className="md:hidden group mt-2 pointer-events-auto" onClick={() => setIsOpen(true)}>
            <Menu strokeWidth={1.5} className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className="menu-overlay fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col justify-center items-center text-white" style={{ transform: 'translateY(-100%)' }}>
        <button className="absolute top-8 right-6 md:right-12 p-2 hover:rotate-90 transition-transform duration-300" onClick={() => setIsOpen(false)}>
          <X strokeWidth={1.5} className="w-8 h-8" />
        </button>
        
        <div className="flex flex-col items-center gap-8 text-3xl md:text-5xl display-font tracking-tighter uppercase">
          {!isUnderConstruction && (
            <>
              <Link to="/" className="menu-link hover:text-gray-400 transition-colors">Home</Link>
              <Link to="/projects" className="menu-link hover:text-gray-400 transition-colors">Project</Link>
              <Link to="/about" className="menu-link hover:text-gray-400 transition-colors">About</Link>
              <Link to="/contact" className="menu-link hover:text-gray-400 transition-colors">Contact</Link>
            </>
          )}
          <Link to="/admin" className="menu-link hover:text-gray-400 transition-colors">Admin</Link>
        </div>
      </div>
    </>
  );
}
