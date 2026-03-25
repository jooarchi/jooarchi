import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useSiteContext();
  
  const projectIndex = projects.findIndex(p => p.id === Number(id));
  const project = projects[projectIndex];
  
  const nextProject = projectIndex >= 0 && projectIndex < projects.length - 1 
    ? projects[projectIndex + 1] 
    : projects[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!project) {
      navigate('/projects');
    }
  }, [id, project, navigate]);

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {/* Hero Image */}
      <section className="h-[80vh] md:h-screen relative bg-black flex items-center justify-center">
        <img 
          src={project.images[0] || 'https://picsum.photos/seed/placeholder/1920/1080'} 
          alt={project.title} 
          className="w-full h-full md:w-[60%] md:h-[60%] object-contain"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-12 left-6 md:left-12 text-white">
          <h1 className="display-font text-5xl md:text-8xl font-medium tracking-tighter mb-4">{project.title}</h1>
          <p className="text-sm md:text-base uppercase tracking-[0.3em]">{project.location}</p>
        </div>
      </section>

      {/* Project Information */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-black/10 pt-12">
          <div className="col-span-1">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-8">Project Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Project Name</span>
                <span className="font-medium">{project.title}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{project.location}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Year</span>
                <span className="font-medium">{project.year}</span>
              </li>
            </ul>
          </div>

          {/* Design Concept */}
          <div className="col-span-1 md:col-span-3 md:pl-12">
            <h2 className="display-font text-3xl md:text-4xl font-medium tracking-tight mb-12">Design Concept</h2>
            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line" style={{ fontSize: project.descriptionFontSize }}>
              {project.description || 'No description available for this project.'}
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.images.length > 1 && (
        <section className="px-6 md:px-12 max-w-[1600px] mx-auto pb-24">
          <div className="flex flex-col gap-12">
            {project.images.slice(1).map((img, index) => (
              <div key={index} className="overflow-hidden rounded-lg w-full md:w-[60%] mx-auto">
                <img 
                  src={img} 
                  alt={`${project.title} - ${index + 2}`} 
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next Project */}
      {nextProject && (
        <section className="py-32 text-center border-t border-black/10 mt-24">
          <span className="text-xs uppercase tracking-widest text-gray-400 mb-6 block">Next Project</span>
          <Link to={`/projects/${nextProject.id}`} className="group inline-block">
            <h2 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-4 group-hover:text-gray-500 transition-colors">
              {nextProject.title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
              View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
