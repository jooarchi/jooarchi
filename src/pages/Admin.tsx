import React, { useState } from 'react';
import { useSiteContext, Project, SiteSettings } from '../context/SiteContext';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  
  const { projects, settings, updateProject, addProject, deleteProject, updateSettings } = useSiteContext();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0922') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      year: formData.get('year') as string,
      category: formData.get('category') as string,
      scale: formData.get('scale') as string,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
    };

    if (isAddingProject) {
      addProject(projectData);
      setIsAddingProject(false);
    } else if (editingProject) {
      updateProject(editingProject.id, projectData);
      setEditingProject(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settingsData: Partial<SiteSettings> = {
      aboutText: formData.get('aboutText') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      contactAddress: formData.get('contactAddress') as string,
      homeIntroText: formData.get('homeIntroText') as string,
    };
    updateSettings(settingsData);
    alert('Settings saved successfully!');
  };

  if (!isAuthenticated) {
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
        <h1 className="display-font text-5xl font-medium tracking-tighter mb-8">ADMIN DASHBOARD</h1>
        
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`text-sm tracking-widest uppercase ${activeTab === 'projects' ? 'font-bold text-black' : 'text-gray-500'}`}
          >
            Projects
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
                onClick={() => { setIsAddingProject(true); setEditingProject(null); }}
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
                  <input name="category" defaultValue={editingProject?.category} placeholder="Category" required className="p-2 border rounded w-full" />
                  <input name="scale" defaultValue={editingProject?.scale} placeholder="Scale" required className="p-2 border rounded w-full" />
                  <input name="image" defaultValue={editingProject?.image} placeholder="Image URL" required className="p-2 border rounded w-full" />
                </div>
                <textarea name="description" defaultValue={editingProject?.description} placeholder="Description" rows={4} className="p-2 border rounded w-full"></textarea>
                <div className="flex gap-2">
                  <button type="submit" className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest">Save</button>
                  <button type="button" onClick={() => { setIsAddingProject(false); setEditingProject(null); }} className="bg-gray-200 text-black px-4 py-2 text-xs uppercase tracking-widest">Cancel</button>
                </div>
              </form>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="p-4 border border-gray-200 rounded flex flex-col justify-between">
                  <div>
                    <img src={project.image} alt={project.title} className="w-full h-40 object-cover mb-4 rounded" />
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{project.category} • {project.year}</p>
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

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-lg border border-black/5">
            <h2 className="text-xl font-medium mb-6">Site Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Home Intro Text</label>
                <textarea name="homeIntroText" defaultValue={settings.homeIntroText} rows={3} className="w-full p-3 border rounded focus:outline-none focus:border-black" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">About Text</label>
                <textarea name="aboutText" defaultValue={settings.aboutText} rows={5} className="w-full p-3 border rounded focus:outline-none focus:border-black" required></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className="w-full p-3 border rounded focus:outline-none focus:border-black" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input name="contactPhone" type="text" defaultValue={settings.contactPhone} className="w-full p-3 border rounded focus:outline-none focus:border-black" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Contact Address</label>
                  <input name="contactAddress" type="text" defaultValue={settings.contactAddress} className="w-full p-3 border rounded focus:outline-none focus:border-black" required />
                </div>
              </div>
              <button type="submit" className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
