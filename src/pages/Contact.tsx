import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

export default function Contact() {
  const { settings } = useSiteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    budget: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xjgawakz', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert('Thank you for your inquiry. We will get back to you shortly.');
        setFormData({
          name: '', email: '', phone: '', projectType: '', location: '', budget: '', message: ''
        });
        form.reset();
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch (error) {
      alert('Oops! There was a problem submitting your form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left Column: Message & Info */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h1 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-8">CONTACT</h1>
            <p className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed mb-16">
              We are always interested in new projects and collaborations. 
              Feel free to contact us to discuss your project.
            </p>
          </div>

          <div className="space-y-12 border-t border-black/10 pt-12">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Office</h3>
              <p className="text-lg font-medium">JOOARCHI</p>
              <p className="text-gray-600 font-light mt-2 whitespace-pre-line">
                {settings.contactAddress}
              </p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Inquiries</h3>
              <a href={`mailto:${settings.contactEmail}`} className="block text-lg font-medium hover:text-gray-600 transition-colors">{settings.contactEmail}</a>
              <a href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, '')}`} className="block text-gray-600 font-light mt-2 hover:text-black transition-colors">{settings.contactPhone}</a>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Social</h3>
              <div className="flex gap-6">
                <a href="#" className="text-gray-600 hover:text-black transition-colors">Instagram</a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">Are.na</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-16 rounded-2xl shadow-sm border border-black/5">
          <h2 className="display-font text-3xl font-medium mb-8">Project Inquiry</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="projectType" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Project Type *</label>
                <select 
                  id="projectType" 
                  name="projectType" 
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent appearance-none rounded-none"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="location" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Project Location *</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="budget" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Budget (Optional)</label>
                <input 
                  type="text" 
                  id="budget" 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="e.g. $500k - $1M"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="attachment" className="text-xs uppercase tracking-widest text-gray-500 font-medium">Attachment (Optional)</label>
              <input 
                type="file" 
                id="attachment" 
                name="attachment" 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="group flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors w-full md:w-auto justify-center disabled:opacity-70">
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              {!isSubmitting && <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
