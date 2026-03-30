import React, { useState, useRef } from 'react';
import { useSiteContext, Project, SiteSettings } from '../context/SiteContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isPasswordAuthenticated, setIsPasswordAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'settings' | 'mainpage'>('projects');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);
  const ucInputRef = useRef<HTMLInputElement>(null);
  
  const { projects, settings, updateProject, addProject, deleteProject, updateSettings } = useSiteContext();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0922') {
      setIsPasswordAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsPasswordAuthenticated(false);
    setPassword('');
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      try {
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err: any) {
        console.error(`Error uploading ${file.name}:`, err);
        throw new Error(`Failed to upload ${file.name}: ${err.message}`);
      }
    });
    return Promise.all(uploadPromises);
  };

  const uploadSingleImage = async (file: File, folder: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (err: any) {
      console.error(`Error uploading ${file.name}:`, err);
      throw new Error(`Failed to upload ${file.name}: ${err.message}`);
    }
  };

  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      let imageUrls: string[] = editingProject?.images || [];
      
      if (selectedFiles.length > 0) {
        const newUrls = await uploadImages(selectedFiles);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const projectData = {
        title: formData.get('title') as string,
        location: formData.get('location') as string,
        year: formData.get('year') as string,
        category: formData.get('category') as string,
        projectType: formData.get('projectType') as string,
        scale: formData.get('scale') as string,
        shortDescription: formData.get('shortDescription') as string,
        images: imageUrls,
        description: formData.get('description') as string,
        descriptionFontSize: (formData.get('descriptionFontSize') as string) || '100%',
      };

      if (isAddingProject) {
        await addProject(projectData);
        setIsAddingProject(false);
      } else if (editingProject) {
        await updateProject(editingProject.id, projectData);
        setEditingProject(null);
      }
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error("Error saving project:", err);
      alert(`Failed to save project: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    if (editingProject) {
      const newImages = [...editingProject.images];
      newImages.splice(index, 1);
      setEditingProject({ ...editingProject, images: newImages });
    }
  };

  const handleSaveMainPage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const settingsData: Partial<SiteSettings> = {
        isUnderConstruction: formData.get('isUnderConstruction') === 'true',
        underConstructionText: formData.get('underConstructionText') as string,
        underConstructionFontSize: formData.get('underConstructionFontSize') as string,
        homeIntroText: formData.get('homeIntroText') as string,
        homeIntroFontSize: formData.get('homeIntroFontSize') as string,
        homeIntroTitle1: formData.get('homeIntroTitle1') as string,
        homeIntroTitleHighlight: formData.get('homeIntroTitleHighlight') as string,
        homeIntroTitle2: formData.get('homeIntroTitle2') as string,
        homeIntroTitleFontSize: formData.get('homeIntroTitleFontSize') as string,
      };

      if (ucInputRef.current?.files?.[0]) {
        settingsData.underConstructionImage = await uploadSingleImage(ucInputRef.current.files[0], 'settings');
      }
      
      if (heroInputRef.current?.files?.[0]) {
        settingsData.homeHeroImage = await uploadSingleImage(heroInputRef.current.files[0], 'settings');
      }

      await updateSettings(settingsData);
      alert('Main Page settings saved successfully!');
    } catch (err: any) {
      console.error("Error saving main page settings:", err);
      alert(`Failed to save settings: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const settingsData: Partial<SiteSettings> = {
        aboutText: formData.get('aboutText') as string,
        aboutTextFontSize: formData.get('aboutTextFontSize') as string,
        aboutPhilosophyTitle: formData.get('aboutPhilosophyTitle') as string,
        aboutPhilosophyTitleFontSize: formData.get('aboutPhilosophyTitleFontSize') as string,
        aboutPhilosophyText: formData.get('aboutPhilosophyText') as string,
        aboutPhilosophyTextFontSize: formData.get('aboutPhilosophyTextFontSize') as string,
        aboutApproachText: formData.get('aboutApproachText') as string,
        aboutApproachTextFontSize: formData.get('aboutApproachTextFontSize') as string,
        aboutPrincipalName: formData.get('aboutPrincipalName') as string,
        aboutPrincipalNameFontSize: formData.get('aboutPrincipalNameFontSize') as string,
        aboutPrincipalTitle: formData.get('aboutPrincipalTitle') as string,
        aboutPrincipalTitleFontSize: formData.get('aboutPrincipalTitleFontSize') as string,
        aboutPrincipalEducation: formData.get('aboutPrincipalEducation') as string,
        aboutPrincipalEducationFontSize: formData.get('aboutPrincipalEducationFontSize') as string,
        aboutPrincipalCareer: formData.get('aboutPrincipalCareer') as string,
        aboutPrincipalCareerFontSize: formData.get('aboutPrincipalCareerFontSize') as string,
        aboutPrincipalAwards: formData.get('aboutPrincipalAwards') as string,
        aboutPrincipalAwardsFontSize: formData.get('aboutPrincipalAwardsFontSize') as string,
        aboutStudioInfo: formData.get('aboutStudioInfo') as string,
        aboutStudioInfoFontSize: formData.get('aboutStudioInfoFontSize') as string,
        aboutClientsText: formData.get('aboutClientsText') as string,
        aboutClientsTextFontSize: formData.get('aboutClientsTextFontSize') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactEmailFontSize: formData.get('contactEmailFontSize') as string,
        contactAddress: formData.get('contactAddress') as string,
        contactAddressFontSize: formData.get('contactAddressFontSize') as string,
        projectsTitleFontSize: formData.get('projectsTitleFontSize') as string,
      };

      if (logoInputRef.current?.files?.[0]) {
        settingsData.logoImage = await uploadSingleImage(logoInputRef.current.files[0], 'settings');
      }

      if (aboutInputRef.current?.files?.[0]) {
        settingsData.aboutImage = await uploadSingleImage(aboutInputRef.current.files[0], 'settings');
      }

      await updateSettings(settingsData);
      alert('Settings saved successfully!');
    } catch (err: any) {
      console.error("Error saving site settings:", err);
      alert(`Failed to save settings: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isPasswordAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <h1 className="display-font text-3xl font-medium mb-8 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors bg-transparent text-center tracking-widest"
              />
              {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="display-font text-5xl font-medium tracking-tighter">ADMIN DASHBOARD</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-xs underline text-gray-400 hover:text-black">Logout</button>
          </div>
        </div>
        
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`text-sm tracking-widest uppercase ${activeTab === 'projects' ? 'font-bold text-black' : 'text-gray-500'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('mainpage')}
            className={`text-sm tracking-widest uppercase ${activeTab === 'mainpage' ? 'font-bold text-black' : 'text-gray-500'}`}
          >
            Main Page
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`text-sm tracking-widest uppercase ${activeTab === 'settings' ? 'font-bold text-black' : 'text-gray-500'}`}
          >
            Site Settings
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="bg-white p-8 rounded-lg border border-black/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Manage Projects</h2>
              <button 
                onClick={() => { setIsAddingProject(true); setEditingProject(null); setSelectedFiles([]); }}
                className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest"
              >
                Add New Project
              </button>
            </div>

            {(isAddingProject || editingProject) ? (
              <form onSubmit={handleSaveProject} className="space-y-4 bg-gray-50 p-6 rounded border border-gray-200 mb-8">
                <h3 className="font-medium mb-4">{isAddingProject ? 'Add New Project' : 'Edit Project'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="title" defaultValue={editingProject?.title} placeholder="Title" required className="p-2 border rounded w-full" />
                  <input name="location" defaultValue={editingProject?.location} placeholder="Location" required className="p-2 border rounded w-full" />
                  <input name="year" defaultValue={editingProject?.year} placeholder="Year" required className="p-2 border rounded w-full" />
                  <input name="category" defaultValue={editingProject?.category} placeholder="Category (e.g. Residential)" className="p-2 border rounded w-full" />
                  <input name="projectType" defaultValue={editingProject?.projectType} placeholder="Project Type" className="p-2 border rounded w-full" />
                  <input name="scale" defaultValue={editingProject?.scale} placeholder="Scale (e.g. 150 sqm)" className="p-2 border rounded w-full" />
                  <input name="shortDescription" defaultValue={editingProject?.shortDescription} placeholder="Short Description (for Project Info)" className="p-2 border rounded w-full" />
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Upload Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="p-2 border rounded w-full bg-white" 
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs mt-1 text-gray-600">{selectedFiles.length} files selected</p>
                    )}
                  </div>
                </div>

                {editingProject && editingProject.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Current Images</h4>
                    <div className="flex flex-wrap gap-2">
                      {editingProject.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded border" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                    <div className="flex gap-2">
                      <textarea name="description" defaultValue={editingProject?.description} placeholder="Description" rows={4} className="flex-1 p-2 border rounded"></textarea>
                      <div className="flex flex-col gap-1">
                        <input name="descriptionFontSize" defaultValue={editingProject?.descriptionFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-2 border rounded" />
                        <span className="text-[10px] text-gray-400">Current: {editingProject?.descriptionFontSize || '100%'}</span>
                      </div>
                    </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest disabled:bg-gray-400"
                  >
                    {isUploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingProject(false); setEditingProject(null); setSelectedFiles([]); }} className="bg-gray-200 text-black px-4 py-2 text-xs uppercase tracking-widest">Cancel</button>
                </div>
              </form>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="p-4 border border-gray-200 rounded flex flex-col justify-between">
                  <div>
                    <img src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'} alt={project.title} className="w-full h-40 object-cover mb-4 rounded" />
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{project.category} • {project.year} {project.projectType ? `• ${project.projectType}` : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProject(project)} className="text-xs underline text-blue-600">Edit</button>
                    <button onClick={() => { if(window.confirm('Are you sure?')) deleteProject(project.id) }} className="text-xs underline text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mainpage' && (
          <div className="bg-white p-8 rounded-lg border border-black/5">
            <h2 className="text-xl font-medium mb-6">Main Page Settings</h2>
            <form onSubmit={handleSaveMainPage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Display Mode</label>
                <select 
                  name="isUnderConstruction" 
                  defaultValue={settings.isUnderConstruction ? 'true' : 'false'}
                  className="w-full p-3 border rounded focus:outline-none focus:border-black"
                >
                  <option value="true">Under Construction (Image + Text only)</option>
                  <option value="false">Full Website (Projects, About, Contact)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Choose whether to show the full website or a simple "Under Construction" page.</p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-medium mb-4">Under Construction Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Image</label>
                    <div className="flex items-center gap-4">
                      {settings.underConstructionImage && (
                        <img src={settings.underConstructionImage} alt="UC" className="w-20 h-20 object-cover rounded border" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={ucInputRef}
                        className="p-2 border rounded flex-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Main Text & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.underConstructionFontSize})</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        name="underConstructionText" 
                        type="text" 
                        defaultValue={settings.underConstructionText} 
                        className="flex-1 p-3 border rounded focus:outline-none focus:border-black" 
                      />
                      <input 
                        name="underConstructionFontSize" 
                        type="text" 
                        defaultValue={settings.underConstructionFontSize} 
                        placeholder="Size (e.g. 100%)"
                        className="w-32 p-3 border rounded focus:outline-none focus:border-black" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-medium mb-4">Full Website Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Home Hero Image</label>
                    <div className="flex items-center gap-4">
                      {settings.homeHeroImage && (
                        <img src={settings.homeHeroImage} alt="Hero" className="w-20 h-20 object-cover rounded border" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={heroInputRef}
                        className="p-2 border rounded flex-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Home Intro Title & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.homeIntroTitleFontSize})</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input name="homeIntroTitle1" defaultValue={settings.homeIntroTitle1} placeholder="Part 1 (e.g. We define the)" className="flex-1 p-3 border rounded focus:outline-none focus:border-black" />
                        <input name="homeIntroTitleFontSize" defaultValue={settings.homeIntroTitleFontSize} placeholder="Size (e.g. 100%)" className="w-32 p-3 border rounded focus:outline-none focus:border-black" />
                      </div>
                      <input name="homeIntroTitleHighlight" defaultValue={settings.homeIntroTitleHighlight} placeholder="Highlight (e.g. invisible lines)" className="w-full p-3 border rounded focus:outline-none focus:border-black" />
                      <input name="homeIntroTitle2" defaultValue={settings.homeIntroTitle2} placeholder="Part 2 (e.g. between nature and structure.)" className="w-full p-3 border rounded focus:outline-none focus:border-black" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Home Intro Text & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.homeIntroFontSize})</span>
                    </label>
                    <div className="flex gap-2">
                      <textarea name="homeIntroText" defaultValue={settings.homeIntroText} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" required></textarea>
                      <input 
                        name="homeIntroFontSize" 
                        type="text" 
                        defaultValue={settings.homeIntroFontSize} 
                        placeholder="Size (e.g. 100%)"
                        className="w-32 p-3 border rounded self-start focus:outline-none focus:border-black" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors mt-6 disabled:bg-gray-400"
              >
                {isUploading ? 'Saving...' : 'Save Main Page Settings'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-lg border border-black/5">
            <h2 className="text-xl font-medium mb-6">Site Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo Image</label>
                  <div className="flex items-center gap-4">
                    {settings.logoImage && (
                      <img src={settings.logoImage} alt="Logo" className="w-12 h-12 object-contain border p-1" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={logoInputRef}
                      className="p-2 border rounded flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">About Image</label>
                  <div className="flex items-center gap-4">
                    {settings.aboutImage && (
                      <img src={settings.aboutImage} alt="About" className="w-12 h-12 object-cover border" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={aboutInputRef}
                      className="p-2 border rounded flex-1" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  About Intro Text & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutTextFontSize})</span>
                </label>
                <div className="flex gap-2">
                  <textarea name="aboutText" defaultValue={settings.aboutText} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" required></textarea>
                  <input 
                    name="aboutTextFontSize" 
                    type="text" 
                    defaultValue={settings.aboutTextFontSize} 
                    placeholder="Size (e.g. 100%)"
                    className="w-32 p-3 border rounded self-start focus:outline-none focus:border-black" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Philosophy Title & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPhilosophyTitleFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="aboutPhilosophyTitle" type="text" defaultValue={settings.aboutPhilosophyTitle} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" />
                    <input name="aboutPhilosophyTitleFontSize" type="text" defaultValue={settings.aboutPhilosophyTitleFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Philosophy Text & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPhilosophyTextFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutPhilosophyText" defaultValue={settings.aboutPhilosophyText} rows={5} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutPhilosophyTextFontSize" type="text" defaultValue={settings.aboutPhilosophyTextFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Approach Text & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutApproachTextFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutApproachText" defaultValue={settings.aboutApproachText} rows={5} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutApproachTextFontSize" type="text" defaultValue={settings.aboutApproachTextFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Principal Name & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPrincipalNameFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="aboutPrincipalName" type="text" defaultValue={settings.aboutPrincipalName} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" />
                    <input name="aboutPrincipalNameFontSize" type="text" defaultValue={settings.aboutPrincipalNameFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Principal Title & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPrincipalTitleFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="aboutPrincipalTitle" type="text" defaultValue={settings.aboutPrincipalTitle} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" />
                    <input name="aboutPrincipalTitleFontSize" type="text" defaultValue={settings.aboutPrincipalTitleFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Principal Education & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPrincipalEducationFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutPrincipalEducation" defaultValue={settings.aboutPrincipalEducation} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutPrincipalEducationFontSize" type="text" defaultValue={settings.aboutPrincipalEducationFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Principal Career & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPrincipalCareerFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutPrincipalCareer" defaultValue={settings.aboutPrincipalCareer} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutPrincipalCareerFontSize" type="text" defaultValue={settings.aboutPrincipalCareerFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Principal Awards & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutPrincipalAwardsFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutPrincipalAwards" defaultValue={settings.aboutPrincipalAwards} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutPrincipalAwardsFontSize" type="text" defaultValue={settings.aboutPrincipalAwardsFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Studio Info & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutStudioInfoFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutStudioInfo" defaultValue={settings.aboutStudioInfo} rows={4} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutStudioInfoFontSize" type="text" defaultValue={settings.aboutStudioInfoFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Clients & Collaborators & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.aboutClientsTextFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea name="aboutClientsText" defaultValue={settings.aboutClientsText} rows={3} className="flex-1 p-3 border rounded focus:outline-none focus:border-black"></textarea>
                    <input name="aboutClientsTextFontSize" type="text" defaultValue={settings.aboutClientsTextFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded self-start focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Email & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.contactEmailFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" required />
                    <input name="contactEmailFontSize" type="text" defaultValue={settings.contactEmailFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Address & Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.contactAddressFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="contactAddress" type="text" defaultValue={settings.contactAddress} className="flex-1 p-3 border rounded focus:outline-none focus:border-black" required />
                    <input name="contactAddressFontSize" type="text" defaultValue={settings.contactAddressFontSize} placeholder="Size (e.g. 100%)" className="w-24 p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Projects Page Title Size <span className="text-xs font-normal text-gray-400 ml-1">(Current: {settings.projectsTitleFontSize})</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="projectsTitleFontSize" type="text" defaultValue={settings.projectsTitleFontSize} placeholder="Size (e.g. 100%)" className="w-full p-3 border rounded focus:outline-none focus:border-black" />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUploading}
                className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isUploading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
