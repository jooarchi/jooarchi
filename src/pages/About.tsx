import React from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function About() {
  const { settings } = useSiteContext();

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32">
      {/* Header */}
      <header className="px-6 md:px-12 max-w-[1600px] mx-auto mb-24 md:mb-48">
        <h1 className="display-font text-5xl md:text-8xl font-medium tracking-tighter mb-8">
          ABOUT US
        </h1>
        <p className="text-xl md:text-3xl font-light text-gray-600 max-w-4xl leading-relaxed whitespace-pre-line">
          {settings.aboutText}
        </p>
      </header>

      {/* Philosophy */}
      <section className="py-24 bg-white px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-sm uppercase tracking-widest font-medium text-gray-400 sticky top-32">
              01 / Philosophy
            </h2>
          </div>
          <div className="md:col-span-8">
            <h3 className="display-font text-4xl md:text-6xl font-medium tracking-tight mb-16 leading-[1.1]">
              Architecture that responds to context.
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h4 className="text-lg font-medium mb-4">Sense of Place</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                  We believe every site has a unique voice. Our design process begins by listening to the land, understanding its history, climate, and cultural significance.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">User-Centric Design</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                  Spaces are ultimately for people. We focus on human scale, natural light, and intuitive flow to create environments that enhance daily life.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Sustainable Architecture</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                  True sustainability goes beyond technology. It's about building structures that endure, using timeless materials and passive design strategies.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Attitude Towards Detail</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                  God is in the details. We obsess over the junction of materials, the quality of finishes, and the hidden mechanics that make a building work seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-sm uppercase tracking-widest font-medium text-gray-400 sticky top-32">
              02 / Our Approach
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="space-y-12">
              {[
                { step: '01', title: 'Client Consultation', desc: 'Understanding the client\'s vision, requirements, and budget.' },
                { step: '02', title: 'Site & Context Research', desc: 'Analyzing the physical, environmental, and cultural context of the site.' },
                { step: '03', title: 'Concept Design', desc: 'Establishing the spatial concept and overall design direction.' },
                { step: '04', title: 'Design Development', desc: 'Refining the design, selecting materials, and coordinating with engineers.' },
                { step: '05', title: 'Construction Documentation', desc: 'Producing detailed technical drawings and specifications for bidding.' },
                { step: '06', title: 'Construction Collaboration', desc: 'Working closely with contractors to ensure the design intent is realized.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-6 md:gap-12 border-b border-black/10 pb-8">
                  <span className="font-mono text-gray-400 text-lg">{item.step}</span>
                  <div>
                    <h4 className="display-font text-2xl font-medium mb-2">{item.title}</h4>
                    <p className="text-gray-500 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal & Office */}
      <section className="py-24 bg-[#111] text-white px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-sm uppercase tracking-widest font-medium text-gray-500 sticky top-32">
              03 / Principal & Office
            </h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Principal */}
            <div>
              <img src="https://picsum.photos/seed/architect/800/1000" alt="Principal Architect" className="w-full aspect-[3/4] object-cover mb-8 grayscale" />
              <h3 className="display-font text-3xl font-medium mb-2">Joohee Gul</h3>
              <p className="text-sm uppercase tracking-widest text-gray-400 mb-8">Principal Architect / Founder</p>
              
              <div className="space-y-6 text-sm font-light text-gray-300">
                <div>
                  <h4 className="text-white font-medium mb-2">Education</h4>
                  <p>Master of Architecture, Harvard GSD<br/>B.Arch, Seoul National University</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Career</h4>
                  <p>OMA, Rotterdam (2015-2019)<br/>Founded JOOARCHI (2024)</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Awards</h4>
                  <p>Young Architect Award (2025)<br/>AIA Design Excellence</p>
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-16">
                <h3 className="display-font text-3xl font-medium mb-6">The Studio</h3>
                <ul className="space-y-4 text-sm font-light text-gray-300">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-500">Founded</span>
                    <span>2024</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-500">Location</span>
                    <span>Seoul, Korea / Oslo, Norway</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-500">Team Size</span>
                    <span>12 Architects & Designers</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-500">Expertise</span>
                    <span>Architecture, Interior, Masterplanning</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="display-font text-2xl font-medium mb-6">Selected Clients & Collaborators</h3>
                <div className="flex flex-wrap gap-3">
                  {['Developers', 'Private Clients', 'Public Institutions', 'Construction Partners', 'Cultural Foundations', 'Tech Companies'].map(client => (
                    <span key={client} className="px-4 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest text-gray-300">
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
