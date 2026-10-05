// src/pages/Ministry/MenFellowship.jsx
import React from 'react';
import menFellowshipImg from '../../assets/emlr/2.jpg';

function MenFellowship() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Men's Fellowship</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={menFellowshipImg}
                alt="Men's Fellowship at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Men's Fellowship at EMRL Kicukiro is dedicated to building godly men who lead with integrity 
              in their homes, workplaces, and communities. We provide a brotherhood where men can be authentic, 
              accountable, and encouraged in their faith journey.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Through regular meetings, service projects, and discipleship programs, we strive to develop men 
              who are strong in faith, committed to family, and engaged in ministry. We believe that when men 
              embrace their biblical roles, entire families and communities are transformed.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Us</h3>
              <p className="text-gray-700">Every Saturday at 4:00 PM | Conference Room</p>
              <p className="text-gray-700 text-sm mt-2">All men welcome - come as you are</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenFellowship;