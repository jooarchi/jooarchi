import React, { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0922') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
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
        <div className="bg-white p-8 rounded-lg border border-black/5">
          <p className="text-gray-600">Welcome to the admin area. Here you can manage your projects, content, and inquiries.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded border border-gray-100">
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">Projects</h3>
              <p className="text-xs text-gray-500 mb-4">Manage portfolio items</p>
              <button className="text-xs underline">Edit Projects</button>
            </div>
            <div className="p-6 bg-gray-50 rounded border border-gray-100">
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">Inquiries</h3>
              <p className="text-xs text-gray-500 mb-4">View contact messages</p>
              <button className="text-xs underline">View Messages</button>
            </div>
            <div className="p-6 bg-gray-50 rounded border border-gray-100">
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">Settings</h3>
              <p className="text-xs text-gray-500 mb-4">Site configuration</p>
              <button className="text-xs underline">Edit Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
