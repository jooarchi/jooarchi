import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc, getDocFromServer } from 'firebase/firestore';
import { db, auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Project {
  id: number;
  title: string;
  location: string;
  year: string;
  category?: string;
  scale?: string;
  images: string[];
  description?: string;
}

export interface SiteSettings {
  aboutText: string;
  aboutPhilosophyTitle?: string;
  aboutPhilosophyText?: string;
  aboutApproachText?: string;
  aboutPrincipalName?: string;
  aboutPrincipalTitle?: string;
  aboutPrincipalEducation?: string;
  aboutPrincipalCareer?: string;
  aboutPrincipalAwards?: string;
  aboutStudioInfo?: string;
  aboutClientsText?: string;
  contactEmail: string;
  contactAddress: string;
  homeIntroText: string;
  isUnderConstruction: boolean;
  underConstructionImage: string;
  underConstructionText: string;
  logoImage?: string;
  homeHeroImage?: string;
  aboutImage?: string;
}

interface SiteContextType {
  projects: Project[];
  settings: SiteSettings;
  updateProject: (id: number, updatedProject: Partial<Project>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  aboutText: "JOOARCHI is an architectural practice based in Oslo and New York. We believe in creating spaces that resonate with their environment and the people who inhabit them. Our approach is rooted in a deep understanding of materials, light, and context. We work across residential, commercial, and cultural projects.",
  aboutPhilosophyTitle: "Architecture that responds to context.",
  aboutPhilosophyText: "Sense of Place\nWe believe every site has a unique voice. Our design process begins by listening to the land, understanding its history, climate, and cultural significance.\n\nUser-Centric Design\nSpaces are ultimately for people. We focus on human scale, natural light, and intuitive flow to create environments that enhance daily life.\n\nSustainable Architecture\nTrue sustainability goes beyond technology. It's about building structures that endure, using timeless materials and passive design strategies.\n\nAttitude Towards Detail\nGod is in the details. We obsess over the junction of materials, the quality of finishes, and the hidden mechanics that make a building work seamlessly.",
  aboutApproachText: "01 Client Consultation\nUnderstanding the client's vision, requirements, and budget.\n\n02 Site & Context Research\nAnalyzing the physical, environmental, and cultural context of the site.\n\n03 Concept Design\nEstablishing the spatial concept and overall design direction.\n\n04 Design Development\nRefining the design, selecting materials, and coordinating with engineers.\n\n05 Construction Documentation\nProducing detailed technical drawings and specifications for bidding.\n\n06 Construction Collaboration\nWorking closely with contractors to ensure the design intent is realized.",
  aboutPrincipalName: "Joohee Gul",
  aboutPrincipalTitle: "Principal Architect / Founder",
  aboutPrincipalEducation: "Master of Architecture, Harvard GSD\nB.Arch, Seoul National University",
  aboutPrincipalCareer: "OMA, Rotterdam (2015-2019)\nFounded JOOARCHI (2024)",
  aboutPrincipalAwards: "Young Architect Award (2025)\nAIA Design Excellence",
  aboutStudioInfo: "Founded: 2024\nLocation: Seoul, Korea / Oslo, Norway\nTeam Size: 12 Architects & Designers\nExpertise: Architecture, Interior, Masterplanning",
  aboutClientsText: "Developers, Private Clients, Public Institutions, Construction Partners, Cultural Foundations, Tech Companies",
  contactEmail: "studio@jooarchi.com",
  contactAddress: "Oslo, Norway / New York, USA",
  homeIntroText: "JOOARCHI Architectural Studio believes that the most profound architecture is often the quietest. We strip away the unnecessary to reveal the essential truth of a space, crafting environments that breathe.",
  isUnderConstruction: true,
  underConstructionImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  underConstructionText: "A space is waiting to be born",
  logoImage: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/7523f66c-5e45-422f-8700-669533359d9c_1024w.webp",
  homeHeroImage: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/482e7b6a-168c-4d0d-b35d-0e2ff4014577_3840w.webp",
  aboutImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop"
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();

    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: Number(doc.id)
      })) as Project[];
      setProjects(projectsData.sort((a, b) => b.id - a.id));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      } else {
        // Initialize settings if they don't exist
        setDoc(doc(db, 'settings', 'global'), DEFAULT_SETTINGS).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, 'settings/global');
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    });

    return () => unsubscribe();
  }, []);

  const updateProject = async (id: number, updatedProject: Partial<Project>) => {
    const path = `projects/${id}`;
    try {
      const projectRef = doc(db, 'projects', id.toString());
      await updateDoc(projectRef, updatedProject);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const path = `projects/${newId}`;
    try {
      await setDoc(doc(db, 'projects', newId.toString()), { ...project, id: newId });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteProject = async (id: number) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id.toString()));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const path = 'settings/global';
    try {
      const settingsRef = doc(db, 'settings', 'global');
      await updateDoc(settingsRef, newSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
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
