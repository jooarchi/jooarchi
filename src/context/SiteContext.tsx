import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: number;
  title: string;
  location: string;
  year: string;
  category: string;
  scale: string;
  image: string;
  description?: string;
}

export interface SiteSettings {
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  homeIntroText: string;
  isUnderConstruction: boolean;
  underConstructionImage: string;
  underConstructionText: string;
}

interface SiteContextType {
  projects: Project[];
  settings: SiteSettings;
  updateProject: (id: number, updatedProject: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (id: number) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'SILENT VILLA',
    location: 'Kyoto, Japan',
    year: '2023',
    category: 'Residential',
    scale: '350 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp',
    description: 'A minimalist concrete residence designed to capture the changing shadows of the surrounding bamboo forest. A study in negative space.'
  },
  {
    id: 2,
    title: 'VERTICAL FARM',
    location: 'Berlin, Germany',
    year: '2024',
    category: 'Public',
    scale: '4,200 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/952269bf-60f5-48dc-afce-13953bead1eb_1600w.webp',
    description: 'Adaptive reuse of a brutalist bunker into a sustainable vertical farm and communal living space.'
  },
  {
    id: 3,
    title: 'NORDIC CLIFF',
    location: 'Reykjavik, Iceland',
    year: '2025',
    category: 'Concept',
    scale: '1,200 sqm',
    image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/aa5ed4de-1a7e-4bb7-b0ea-1a4c511663df_1600w.webp',
    description: 'A glass and steel structure cantilevered over the volcanic landscape. Blurring the line between shelter and exposure.'
  },
  {
    id: 4,
    title: 'URBAN OASIS',
    location: 'Seoul, Korea',
    year: '2022',
    category: 'Commercial',
    scale: '2,800 sqm',
    image: 'https://picsum.photos/seed/architecture1/1600/1200',
    description: 'A commercial complex integrating natural elements into the urban fabric.'
  },
  {
    id: 5,
    title: 'THE MONOLITH',
    location: 'New York, USA',
    year: '2023',
    category: 'Office',
    scale: '15,000 sqm',
    image: 'https://picsum.photos/seed/architecture2/1600/1200',
    description: 'A striking office tower redefining the skyline with its bold, monolithic presence.'
  },
  {
    id: 6,
    title: 'HERITAGE RENEWAL',
    location: 'London, UK',
    year: '2024',
    category: 'Renovation',
    scale: '850 sqm',
    image: 'https://picsum.photos/seed/architecture3/1600/1200',
    description: 'Careful restoration and modern extension of a historic Victorian building.'
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  aboutText: "JOOARCHI is an architectural practice based in Oslo and New York. We believe in creating spaces that resonate with their environment and the people who inhabit them. Our approach is rooted in a deep understanding of materials, light, and context. We work across residential, commercial, and cultural projects.",
  contactEmail: "studio@jooarchi.com",
  contactPhone: "+47 123 456 789",
  contactAddress: "Oslo, Norway / New York, USA",
  homeIntroText: "JOOARCHI Architectural Studio believes that the most profound architecture is often the quietest. We strip away the unnecessary to reveal the essential truth of a space, crafting environments that breathe.",
  isUnderConstruction: true,
  underConstructionImage: "/bg-image.jpg",
  underConstructionText: "A space is waiting to be born"
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('jooarchi_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('jooarchi_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('jooarchi_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('jooarchi_settings', JSON.stringify(settings));
  }, [settings]);

  const updateProject = (id: number, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects(prev => [...prev, { ...project, id: newId }]);
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteContext.Provider value={{ projects, settings, updateProject, addProject, deleteProject, updateSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
