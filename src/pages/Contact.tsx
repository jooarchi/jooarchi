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
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <div className="max-w-3xl w-full">
          <h1 className="display-font text-5xl md:text-7xl font-medium tracking-tighter mb-8">CONTACT</h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed mb-16">
            We are always interested in new projects and collaborations. 
            Feel free to contact us to discuss your project.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-black/10 pt-12 text-left">
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
