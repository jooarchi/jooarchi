import React from 'react';
import { useSiteContext } from '../context/SiteContext';

export default function About() {
  const { settings } = useSiteContext();

  return (
    <div className="min-h-screen bg-[var(--c-bg)] pt-32">
      {/* Header */}
      <header className="px-6 md:px-12 max-w-[1600px] mx-auto mb-24 md:mb-48">
        <h1 className="display-font text-5xl md:text-8xl font-medium tracking-tighter mb-8">
          ABOUT US
        </h1>
        <p className="font-light text-gray-600 max-w-4xl leading-relaxed whitespace-pre-line" style={{ fontSize: settings.aboutTextFontSize }}>
          {settings.aboutText}
        </p>
      </header>

      {/* Philosophy */}
      {(settings.aboutPhilosophyTitle || settings.aboutPhilosophyText) && (
        <section className="py-24 bg-white px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-sm uppercase tracking-widest font-medium text-gray-400 sticky top-32">
                01 / Philosophy
              </h2>
            </div>
            <div className="md:col-span-8">
              {settings.aboutPhilosophyTitle && (
                <h3 className="display-font font-medium tracking-tight mb-16 leading-[1.1]" style={{ fontSize: settings.aboutPhilosophyTitleFontSize }}>
                  {settings.aboutPhilosophyTitle}
                </h3>
              )}
              
              {settings.aboutPhilosophyText && (
                <div className="text-gray-600 font-light leading-relaxed whitespace-pre-line" style={{ fontSize: settings.aboutPhilosophyTextFontSize }}>
                  {settings.aboutPhilosophyText}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Approach */}
      {settings.aboutApproachText && (
        <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-sm uppercase tracking-widest font-medium text-gray-400 sticky top-32">
                02 / Our Approach
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="text-gray-600 font-light leading-relaxed whitespace-pre-line" style={{ fontSize: settings.aboutApproachTextFontSize }}>
                {settings.aboutApproachText}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Principal & Office */}
      {(settings.aboutPrincipalName || settings.aboutPrincipalTitle || settings.aboutStudioInfo || settings.aboutClientsText) && (
        <section className="py-24 bg-[#111] text-white px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-sm uppercase tracking-widest font-medium text-gray-500 sticky top-32">
                03 / Principal & Office
              </h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Principal */}
              {(settings.aboutPrincipalName || settings.aboutPrincipalTitle || settings.aboutPrincipalEducation || settings.aboutPrincipalCareer || settings.aboutPrincipalAwards) && (
                <div>
                  <img 
                    src={settings.aboutImage || "https://picsum.photos/seed/architect/800/1000"} 
                    alt="Principal Architect" 
                    className="w-full aspect-[3/4] object-cover mb-8 grayscale" 
                    referrerPolicy="no-referrer"
                  />
                  {settings.aboutPrincipalName && <h3 className="display-font font-medium mb-2" style={{ fontSize: settings.aboutPrincipalNameFontSize }}>{settings.aboutPrincipalName}</h3>}
                  {settings.aboutPrincipalTitle && <p className="uppercase tracking-widest text-gray-400 mb-8" style={{ fontSize: settings.aboutPrincipalTitleFontSize }}>{settings.aboutPrincipalTitle}</p>}
                  
                  <div className="space-y-6 font-light text-gray-300">
                    {settings.aboutPrincipalEducation && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Education</h4>
                        <p className="whitespace-pre-line" style={{ fontSize: settings.aboutPrincipalEducationFontSize }}>{settings.aboutPrincipalEducation}</p>
                      </div>
                    )}
                    {settings.aboutPrincipalCareer && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Career</h4>
                        <p className="whitespace-pre-line" style={{ fontSize: settings.aboutPrincipalCareerFontSize }}>{settings.aboutPrincipalCareer}</p>
                      </div>
                    )}
                    {settings.aboutPrincipalAwards && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Awards</h4>
                        <p className="whitespace-pre-line" style={{ fontSize: settings.aboutPrincipalAwardsFontSize }}>{settings.aboutPrincipalAwards}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Office Info */}
              {(settings.aboutStudioInfo || settings.aboutClientsText) && (
                <div className="flex flex-col justify-center">
                  {settings.aboutStudioInfo && (
                    <div className="mb-16">
                      <h3 className="display-font text-3xl font-medium mb-6">The Studio</h3>
                      <div className="font-light text-gray-300 whitespace-pre-line leading-loose" style={{ fontSize: settings.aboutStudioInfoFontSize }}>
                        {settings.aboutStudioInfo}
                      </div>
                    </div>
                  )}

                  {settings.aboutClientsText && (
                    <div>
                      <h3 className="display-font text-2xl font-medium mb-6">Selected Clients & Collaborators</h3>
                      <div className="font-light text-gray-300 whitespace-pre-line" style={{ fontSize: settings.aboutClientsTextFontSize }}>
                        {settings.aboutClientsText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
