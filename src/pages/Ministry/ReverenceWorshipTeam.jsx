// src/pages/Ministry/ReverenceWorshipTeam.jsx
import React from 'react';
import rev from '../../assets/emlr/bg2.jpg';

function ReverenceWorshipTeam() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <section 
        className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${rev})`,}}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Reverence Worship Team</h1>
          <p className="text-xl md:text-2xl mb-8">Leading hearts into authentic worship</p>
          <button className="bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            Experience Worship
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">About Our Worship Team</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                src={rev}
                  alt="Reverence Worship Team" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4 text-lg">
                The Reverence Worship Team is dedicated to creating an atmosphere where people can encounter God through heartfelt worship. 
                Our team of musicians and vocalists seeks to facilitate transformative worship experiences that draw people closer to God.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                We blend contemporary worship music with timeless hymns, creating a diverse worship experience that resonates with people of all generations 
                and backgrounds.
              </p>
              
              <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
                <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Worship Community</h3>
                <p className="text-gray-700">Weekly rehearsals: Wednesdays at 6:30 PM | Sound checks: Sundays at 8:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Media Section */}


      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#f0f8ff] to-[#e6f2ff]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">Join The Worship Team</h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 bg-[#003366] text-white">
                <h3 className="text-2xl font-bold mb-4">Audition Information</h3>
                <p className="mb-6">We're always looking for passionate musicians and vocalists to join our worship team.</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Auditions held on the first Saturday of each month</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Main Sanctuary</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6 text-[#003366]">Schedule an Audition</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5fb9e2] focus:ring focus:ring-[#5fb9e2] focus:ring-opacity-50" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5fb9e2] focus:ring focus:ring-[#5fb9e2] focus:ring-opacity-50" />
                  </div>
                  
                  <div>
                    <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">Instrument/Voice Part</label>
                    <select id="instrument" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5fb9e2] focus:ring focus:ring-[#5fb9e2] focus:ring-opacity-50">
                      <option>Select an option</option>
                      <option>Vocals - Soprano</option>
                      <option>Vocals - Alto</option>
                      <option>Vocals - Tenor</option>
                      <option>Vocals - Bass</option>
                      <option>Acoustic Guitar</option>
                      <option>Electric Guitar</option>
                      <option>Bass Guitar</option>
                      <option>Drums/Percussion</option>
                      <option>Keyboard/Piano</option>
                      <option>Other Instrument</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full py-3 px-4 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-md shadow-md transition duration-300">
                    Submit Application
                  </button>
                </form>
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
            <a href="#" className="text-white hover:text-[#5fb9e2] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          <p className="text-[#5fb9e2]">© {new Date().getFullYear()} Reverence Worship Team. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Leading hearts into authentic worship since 2015</p>
        </div>
      </footer>
    </div>
  );
}

export default ReverenceWorshipTeam;