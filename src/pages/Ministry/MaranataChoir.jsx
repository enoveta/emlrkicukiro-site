// src/pages/Ministry/MaranathaChoir.jsx
import React from 'react';
import maranathaBg from '../../assets/emlr/2.jpg';
import maranathaAbout from '../../assets/emlr/abana.webp';

function MaranathaChoir() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <section 
        className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${maranathaBg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Maranatha Choir</h1>
          <p className="text-xl md:text-2xl mb-8">Little voices with big praise for Jesus!</p>
          <button className="bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            Hear Us Sing
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">About Maranata Choir</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={maranathaAbout}
                  alt="Maranatha Choir" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4 text-lg">
                The Maranatha Kids Choir is EMRL Kicukiro's vibrant children's choir where young hearts learn to worship 
                Jesus through music. Our name "Maranatha" means "Come, Lord Jesus," reflecting our hope and excitement 
                for Christ's return.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                We welcome children ages 6-12 to join us as we learn fun worship songs, build musical skills, 
                and grow in our faith together. Our choir performs regularly during church services and special events.
              </p>
              
              <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
                <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Choir Practices</h3>
                <p className="text-gray-700">Saturdays at 10:00 AM | Sunday warm-up at 11:00 AM</p>
                <p className="text-gray-700 text-sm mt-2">Ages 6-12 | No prior experience needed!</p>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}

export default MaranathaChoir;