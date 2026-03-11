import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    id: 1,
    title: 'SILENT VILLA',
    location: 'Kyoto, Japan',
    year: '2023',
    category: 'Residential',
    scale: '350 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp'
  },
  {
    id: 2,
    title: 'VERTICAL FARM',
    location: 'Berlin, Germany',
    year: '2024',
    category: 'Public',
    scale: '4,200 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/952269bf-60f5-48dc-afce-13953bead1eb_1600w.webp'
  },
  {
    id: 3,
    title: 'NORDIC CLIFF',
    location: 'Reykjavik, Iceland',
    year: '2025',
    category: 'Concept',
    scale: '1,200 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/aa5ed4de-1a7e-4bb7-b0ea-1a4c511663df_1600w.webp'
  },
  {
    id: 4,
    title: 'URBAN OASIS',
    location: 'Seoul, Korea',
    year: '2022',
    category: 'Commercial',
    scale: '2,800 sqm',
    image: 'https://picsum.photos/seed/architecture1/1600/1200'
  },
  {
    id: 5,
    title: 'THE MONOLITH',
    location: 'New York, USA',
    year: '2023',
    category: 'Office',
    scale: '15,000 sqm',
    image: 'https://picsum.photos/seed/architecture2/1600/1200'
  },
  {
    id: 6,
    title: 'HERITAGE RENEWAL',
    location: 'London, UK',
    year: '2024',
    category: 'Renovation',
    scale: '850 sqm',
    image: 'https://picsum.photos/seed/architecture3/1600/1200'
  }
];

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Office', 'Renovation', 'Public', 'Concept'];

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <header className="mb-16 md:mb-24">
          <h1 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-8">PROJECTS</h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm uppercase tracking-widest transition-colors ${
                  filter === cat 
                    ? 'bg-black text-white' 
                    : 'bg-white text-gray-500 hover:text-black border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100 rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="display-font text-xl md:text-2xl font-medium tracking-tight">{project.title}</h3>
                  <span className="text-xs font-mono text-gray-400">{project.year}</span>
                </div>
                <div className="flex justify-between items-end text-sm text-gray-500">
                  <span className="uppercase tracking-widest text-xs">{project.location}</span>
                  <span className="uppercase tracking-widest text-xs">{project.scale}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
