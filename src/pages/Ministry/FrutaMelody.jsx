// src/pages/Ministry/FrutaMelodyChoir.jsx
import React from 'react';
import frutaBg from '../../assets/emlr/2.jpg';
import frutaAbout from '../../assets/emlr/1.jpg';

function FrutaMelodyChoir() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <section 
        className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${frutaBg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Fruta Melody Choir</h1>
          <p className="text-xl md:text-2xl mb-8">Youth lifting praises, creating harmony, serving God</p>
          <button className="bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            Listen to Our Music
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-8 h-8 border-2 border-white rounded-full animate-bounce flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin极="round" strokeWidth="2" d="M19 14极-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">About Fruta Melody</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={frutaAbout}
                  alt="Fruta Melody Youth Choir members" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4 text-lg">
                Fruta Melody is the dynamic youth choir of EMRL Kicukiro, where young people ages 13-25 come together 
                to worship God through contemporary Christian music. Our name "Fruta" represents the fresh, vibrant 
                energy of youth, and "Melody" signifies our commitment to creating beautiful music for God's glory.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                We blend modern worship styles with traditional hymns, creating a unique sound that resonates with 
                youth and young adults. Our ministry focuses on spiritual growth through musical excellence, 
                fellowship, and service.
              </p>
              
              <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
                <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Youth Choir</h3>
                <p className="text-gray-700">Fridays at 5:00 PM | Sunday sound check at 10:30 AM</p>
                <p className="text-gray-700 text-sm mt-2">Ages 13-25 | All skill levels welcome</p>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}

export default FrutaMelodyChoir;