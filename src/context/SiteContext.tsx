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
  category: string;
  scale: string;
  images: string[];
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
  contactEmail: "studio@jooarchi.com",
  contactPhone: "+47 123 456 789",
  contactAddress: "Oslo, Norway / New York, USA",
  homeIntroText: "JOOARCHI Architectural Studio believes that the most profound architecture is often the quietest. We strip away the unnecessary to reveal the essential truth of a space, crafting environments that breathe.",
  isUnderConstruction: true,
  underConstructionImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  underConstructionText: "A space is waiting to be born",
  logoImage: "",
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
