import React, { useEffect } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteContext } from '../context/SiteContext';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ children, className = '' }: { children: string, className?: string }) => {
  const words = children.split(' ');
  return (
    <span className={`split-animate ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="word-wrap">
          <span className="word-inner">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
};

export default function Home() {
  const { projects, settings } = useSiteContext();
  const featuredProjects = projects.slice(0, 1); // Get only the most recent project

  const isUnderConstruction = settings.isUnderConstruction;

  useEffect(() => {
    if (isUnderConstruction) return;

    function initAnimations() {
      const heroTl = gsap.timeline();
      heroTl.to('.hero-title-wrap span', {
        y: 0,
        stagger: 0.1,
        duration: 1.4,
        ease: 'power3.out'
      })
      .to('.hero-fade', { opacity: 1, duration: 1 }, "-=0.5");

      gsap.to('.hero-img', {
        yPercent: 20,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-img-wrap',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      document.querySelectorAll('.split-animate').forEach(el => {
        const words = el.querySelectorAll('.word-inner');
        gsap.to(words, {
          y: "0%",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.015,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        });
      });

      const cards = gsap.utils.toArray('.card-item') as HTMLElement[];
      cards.forEach((card, i) => {
        const inner = card.querySelector('.card-inner');
        const nextCard = cards[i+1];

        if (nextCard) {
          gsap.to(inner, {
            scale: 0.92,
            y: -30,
            opacity: 0.6,
            filter: 'blur(2px)',
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top 10vh",
              scrub: true
            }
          });
        }
      });
    }

    // Small delay to ensure DOM is ready
    setTimeout(initAnimations, 100);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isUnderConstruction]);

  if (isUnderConstruction) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl flex flex-col items-center justify-center animate-fade-in">
          <img 
            src={settings.underConstructionImage || "/bg-image.jpg"} 
            alt={settings.underConstructionText || "A space is waiting to be born"} 
            className="w-full max-w-full h-auto max-h-[75vh] object-contain mb-10 md:mb-16"
            onError={(e) => {
              // Fallback if the user hasn't uploaded the image yet
              e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop";
            }}
          />
          <h1 className="display-font font-light tracking-[0.3em] uppercase text-center text-[#1a1a1a] opacity-80 mt-4" style={{ fontSize: settings.underConstructionFontSize }}>
            {settings.underConstructionText || "A space is waiting to be born"}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--c-bg)]">
      {/* HERO */}
      <section className="h-[70vh] md:h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full hero-img-wrap bg-black">
          <img 
            src={settings.homeHeroImage || "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/482e7b6a-168c-4d0d-b35d-0e2ff4014577_3840w.webp"} 
            className="w-full h-full object-contain md:object-cover md:h-[120%] brightness-[0.6] hero-img" 
            alt="Hero Architecture" 
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 text-center text-white mix-blend-exclusion px-4">
          <h1 className="display-font text-[7vw] md:text-[6vw] leading-[1.1] tracking-tight overflow-hidden hero-title-wrap">
            <span className="block translate-y-full">Envisioned in Mind,</span>
          </h1>
          <h1 className="display-font text-[7vw] md:text-[6vw] leading-[1.1] tracking-tight overflow-hidden hero-title-wrap mt-2">
            <span className="block translate-y-full">Born in Space</span>
          </h1>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 mix-blend-exclusion animate-bounce hero-fade opacity-0">
          <ArrowDown strokeWidth={1.5} className="w-5 h-5" />
        </div>
      </section>

      {/* INTRO */}
      <section className="py-32 px-6 md:px-20 max-w-[1600px] mx-auto bg-[var(--c-bg)]">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-7">
            <h2 className="display-font text-4xl md:text-6xl leading-[1.1] tracking-tight text-[#1a1a1a]" style={{ fontSize: settings.homeIntroTitleFontSize }}>
              <SplitText>{settings.homeIntroTitle1 || "We define the"}</SplitText>
              <br />
              <span className="text-gray-400"><SplitText>{settings.homeIntroTitleHighlight || "invisible lines"}</SplitText></span>
              <SplitText>{` ${settings.homeIntroTitle2 || "between nature and structure."}`}</SplitText>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-2">
            <div className="font-light text-gray-600 leading-relaxed" style={{ fontSize: settings.homeIntroFontSize }}>
              <SplitText>{settings.homeIntroText}</SplitText>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS STACK */}
      <section className="stack-section pb-32">
        <div className="px-6 md:px-20 mb-20 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <span className="text-sm font-medium uppercase tracking-widest text-gray-500">Selected Works</span>
            </div>
            <h2 className="display-font text-4xl md:text-5xl font-medium tracking-tight">
              FEATURED
              <br />
              PROJECTS
            </h2>
          </div>
          <div className="hidden md:block">
            <Link to="/projects" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity">
              View Archive
              <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="stack-container px-4 md:px-0">
          {featuredProjects.map((project, index) => (
            <div className="card-item" key={project.id}>
              <Link to={`/projects/${project.id}`} className="card-inner block">
                <div className="card-content">
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-mono text-gray-400">0{index + 1} / 0{featuredProjects.length}</span>
                      <span className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-gray-800" />
                      </span>
                    </div>
                    <h3 className="display-font text-2xl md:text-3xl font-medium tracking-tight mt-6">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mt-2">
                      {project.location}
                    </p>
                  </div>
                  <div className="space-y-6 mt-6">
                    <p className="text-gray-600 leading-relaxed font-light" style={{ fontSize: project.descriptionFontSize }}>
                      {project.description || 'A stunning architectural project.'}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs uppercase tracking-wider text-gray-600">{project.category}</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs uppercase tracking-wider text-gray-600">{project.year}</span>
                      {project.projectType && (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs uppercase tracking-wider text-gray-600">{project.projectType}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-img-wrap flex items-center justify-center bg-gray-50">
                  <img 
                    src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                    className="card-img w-full h-full md:w-[60%] md:h-[60%]" 
                    alt={project.title} 
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY / SPACER */}
      <section className="py-32 md:py-48 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <h2 className="display-font text-3xl md:text-5xl font-medium tracking-tight mb-8 relative z-10">
          Form emerges from
          <span className="text-gray-400 italic font-light"> story.</span>
        </h2>
        <div className="max-w-xl text-gray-500 font-light leading-relaxed relative z-10">
          We do not merely construct structures; we compose narratives.
          Every line we draw becomes a sentence in the story the landscape tells,
          and those sentences gather to form a world.
        </div>
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </section>
    </div>
  );
}
