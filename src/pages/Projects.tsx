import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';

export default function Projects() {
  const { projects, settings } = useSiteContext();
  const [imageOrientations, setImageOrientations] = React.useState<{[key: number]: 'portrait' | 'landscape'}>({});

  const handleImageLoad = (id: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageOrientations(prev => ({
      ...prev,
      [id]: naturalHeight > naturalWidth ? 'portrait' : 'landscape'
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <header className="mb-16 md:mb-24">
          <h1 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-8">PROJECTS</h1>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                  onLoad={(e) => handleImageLoad(project.id, e)}
                  alt={project.title} 
                  className={`transition-transform duration-700 group-hover:scale-105 ${
                    imageOrientations[project.id] === 'portrait' 
                      ? 'h-[85%] w-auto object-contain' 
                      : 'w-full h-full md:w-[60%] md:h-[60%] object-contain'
                  }`}
                />
              </div>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="display-font text-xl md:text-2xl font-medium tracking-tight" style={{ fontSize: settings.projectsTitleFontSize }}>{project.title}</h3>
                  <span className="text-xs font-mono text-gray-400">{project.year}</span>
                </div>
                <div className="flex justify-between items-end text-sm text-gray-500">
                  <span className="uppercase tracking-widest text-xs">{project.location}</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{project.category}</span>
                    {project.projectType && (
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">{project.projectType}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
