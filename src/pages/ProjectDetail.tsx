import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PROJECT_DATA = {
  1: {
    title: 'SILENT VILLA',
    location: 'Kyoto, Japan',
    year: '2023',
    program: 'Private Residence',
    siteArea: '850 sqm',
    buildingArea: '220 sqm',
    totalFloorArea: '350 sqm',
    architect: 'JOOARCHI',
    heroImage: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp',
    concept: {
      background: "Situated on the edge of a dense bamboo forest in Kyoto, the client requested a home that acts as a retreat from the bustling city life.",
      strategy: "We designed a structure that turns its back to the street and opens entirely to the forest, using the natural landscape as the primary living space.",
      architectural: "The material palette is restricted to exposed concrete, local timber, and glass, allowing the changing seasons to become the main decorative element.",
      urban: "By maintaining a low profile and a modest street facade, the villa respects the traditional scale of the neighborhood while offering a radical spatial experience inside."
    },
    spatialExperience: "The interior is defined by a sequence of compressed and expanded spaces. The entrance is intentionally dark and narrow, leading to a double-height living area that frames the forest through a single, uninterrupted pane of glass.",
    gallery: [
      'https://picsum.photos/seed/silent1/1600/1200',
      'https://picsum.photos/seed/silent2/1600/1200',
      'https://picsum.photos/seed/silent3/1600/1200'
    ]
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECT_DATA[Number(id) as keyof typeof PROJECT_DATA] || PROJECT_DATA[1]; // Fallback to 1 for demo

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {/* Hero Image */}
      <section className="h-[80vh] md:h-screen relative">
        <img 
          src={project.heroImage} 
          alt={project.title} 
          className="w-full h-full object-cover"
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
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Program</span>
                <span className="font-medium">{project.program}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Site Area</span>
                <span className="font-medium">{project.siteArea}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Building Area</span>
                <span className="font-medium">{project.buildingArea}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Total Floor Area</span>
                <span className="font-medium">{project.totalFloorArea}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-gray-500">Architect</span>
                <span className="font-medium">{project.architect}</span>
              </li>
            </ul>
          </div>

          {/* Design Concept */}
          <div className="col-span-1 md:col-span-3 md:pl-12">
            <h2 className="display-font text-3xl md:text-4xl font-medium tracking-tight mb-12">Design Concept</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Background</h4>
                <p className="text-gray-600 font-light leading-relaxed">{project.concept.background}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Spatial Strategy</h4>
                <p className="text-gray-600 font-light leading-relaxed">{project.concept.strategy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Architectural Concept</h4>
                <p className="text-gray-600 font-light leading-relaxed">{project.concept.architectural}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Urban Context</h4>
                <p className="text-gray-600 font-light leading-relaxed">{project.concept.urban}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spatial Experience */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src={project.gallery[0]} alt="Interior" className="w-full h-auto rounded-lg" />
          </div>
          <div className="md:pl-12">
            <h3 className="display-font text-3xl font-medium tracking-tight mb-6">Spatial Experience</h3>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              {project.spatialExperience}
            </p>
          </div>
        </div>
      </section>

      {/* Drawings */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-[1px] bg-black"></div>
          <h3 className="text-sm uppercase tracking-widest font-medium">Drawings</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <span className="text-xs uppercase tracking-widest text-gray-400">Site Plan</span>
          </div>
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <span className="text-xs uppercase tracking-widest text-gray-400">Floor Plan</span>
          </div>
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <span className="text-xs uppercase tracking-widest text-gray-400">Section</span>
          </div>
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <span className="text-xs uppercase tracking-widest text-gray-400">Diagram</span>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.gallery.slice(1).map((img, idx) => (
            <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-[60vh] object-cover rounded-lg" />
          ))}
        </div>
      </section>

      {/* Next Project */}
      <section className="py-32 text-center border-t border-black/10 mt-24">
        <span className="text-xs uppercase tracking-widest text-gray-400 mb-6 block">Next Project</span>
        <Link to="/projects/2" className="group inline-block">
          <h2 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-4 group-hover:text-gray-500 transition-colors">
            VERTICAL FARM
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
            View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>
      </section>
    </div>
  );
}
