import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-sticky">
      <div className="absolute inset-0 z-0">
        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1c6b6980-54e4-4d8c-9ff6-e09b844d7b01_3840w.webp" className="w-full h-full object-cover opacity-20 pointer-events-none grayscale" alt="Footer background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs uppercase tracking-widest text-gray-300">
            Accepting new commissions
          </span>
        </div>

        <a href="mailto:hello@jooarchi.com" className="block group">
          <h2 className="display-font text-[10vw] leading-[0.8] font-medium tracking-tighter text-white group-hover:text-gray-300 transition-colors duration-500">
            LET'S BUILD
          </h2>
          <div className="h-[1px] w-0 group-hover:w-full bg-white/50 mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mt-4"></div>
        </a>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 text-left border-t border-white/10 pt-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Socials</span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Are.na</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Office</span>
            <p className="text-sm text-gray-400">
              Akersgata 12<br />
              0158 Oslo<br />
              Norway
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Contact</span>
            <a href="mailto:hello@jooarchi.com" className="text-sm text-gray-400 hover:text-white transition-colors">hello@jooarchi.com</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">+47 22 33 44 55</a>
          </div>
          <div className="flex flex-col justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">© 2025</span>
            <div className="text-xs text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="miter" strokeLinecap="square">
                <line x1="30" y1="15" x2="50" y2="15"></line>
                <line x1="50" y1="15" x2="50" y2="65"></line>
                <path d="M 50 65 C 50 95, 20 95, 20 65"></path>
                <line x1="50" y1="15" x2="80" y2="85"></line>
                <line x1="50" y1="60" x2="70" y2="60"></line>
              </svg>
              JOOARCHI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
