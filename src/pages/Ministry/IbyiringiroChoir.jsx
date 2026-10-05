// src/pages/Ministry/IbyiringiroChoir.jsx
import React from 'react';
import ibyi from '../../assets/emlr/ibyiri.webp';
import iby from '../../assets/emlr/iby.jpg';

function IbyiringiroChoir() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <section 
        className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${ibyi})`,}}
      >
        <div className="absolute  inset-0 bg-black bg-opacity-10"></div>
        <div className="relative mt-64 z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Ibyiringiro Choir</h1>
          <p className="text-xl md:text-2xl mb-8">Making a joyful noise unto the Lord</p>
          <button className="bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            Listen Now
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-8 h-8 border-2 border-white rounded-full animate-bounce flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">About Our Choir</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src= {iby}
                  alt="Ibyiringiro Choir members" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4 text-lg">
                The Ibyiringiro Choir is a vibrant community of believers who use their musical gifts 
                to worship God and inspire congregations. Our name "Ibyiringiro" means "Hope" in Kinyarwanda, 
                reflecting our mission to spread hope through sacred music.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                We welcome singers of all experience levels who are passionate about using their 
                voices to glorify God and edify the church community.
              </p>
              
              <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
                <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Us For Rehearsals</h3>
                <p className="text-gray-700">Every Thursday at 6:30 PM | Sunday Morning Warm-up at 9:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#f0f8ff] to-[#e6f2ff]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">Our Media</h2>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-[#003366]">YouTube Channel</h3>
            
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden mb-6">
              <iframe 
                src="https://www.youtube.com/embed/?list=UUibyiringirochoir4001" 
                title="Ibyiringiro Choir YouTube Channel"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 md:h-96"
              ></iframe>
            </div>
            
            <div className="text-center">
              <a 
                href="https://www.youtube.com/@ibyiringirochoir4001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5fb9e2]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Visit Our YouTube Channel
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-[#003366]">Latest Performances</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(item => (
                  <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-[#5fb9e2] bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Worship Performance {item}</h4>
                      <p className="text-sm text-gray-600">Posted 2 weeks ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-[#003366]">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <div key={item} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#003366] to-[#5fb9e2] opacity-70 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white rounded-md transition-colors duration-300">
                View Full Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">Contact Us</h2>
          
          <div className="bg-gradient-to-r from-[#003366] to-[#5fb9e2] rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 text-white">
                <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
                <p className="mb-6">Interested in joining our choir or having us perform at your event? Reach out to us!</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+250 123 456 789</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>choir@ibyiringiro.org</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Kigali, Rwanda</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 bg-white p-8 md:p-12">
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-white hover:text-[#5fb9e2] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-[#5fb9e2] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@ibyiringirochoir4001" className="text-white hover:text-[#5fb9e2] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          <p className="text-[#5fb9e2]">© {new Date().getFullYear()} Ibyiringiro Choir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default IbyiringiroChoir;