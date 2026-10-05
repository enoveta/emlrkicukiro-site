// src/pages/Ministry/WomenFellowship.jsx
import React from 'react';
import womenFellowshipImg from '../../assets/emlr/iby.jpg';

function WomenFellowship() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Women's Fellowship</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={womenFellowshipImg}
                alt="Women's Fellowship at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Women's Fellowship at EMRL Kicukiro is a vibrant community where women of all ages come together 
              to grow spiritually, support one another, and serve our church and community. We believe in empowering 
              women to fulfill their God-given purpose through prayer, study, and fellowship.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our meetings provide a safe space for sharing, learning, and building meaningful relationships 
              that extend beyond our church walls. We organize various activities including Bible studies, 
              prayer gatherings, outreach programs, and social events that strengthen our bond as sisters in Christ.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Us</h3>
              <p className="text-gray-700">Every Saturday at 2:00 PM | Fellowship Hall</p>
              <p className="text-gray-700 text-sm mt-2">All women welcome - no registration required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WomenFellowship;