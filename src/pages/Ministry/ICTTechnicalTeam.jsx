// src/pages/Ministry/ICTTechnicalTeam.jsx
import React from 'react';
import ictTeamImg from '../../assets/emlr/2.jpg';

function ICTTechnicalTeam() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">ICT & Technical Team</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={ictTeamImg}
                alt="ICT and Technical Team at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The ICT & Technical Team at EMRL Kicukiro is dedicated to supporting the church's ministry through 
              technology and technical expertise. We ensure that worship services, events, and communications 
              are enhanced by reliable audio, visual, and digital solutions that help spread the Gospel message.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our team manages sound systems, live streaming, lighting, presentation software, and maintains 
              the church's digital presence. We believe that excellence in technical ministry creates an 
              environment where people can encounter God without distractions.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Team</h3>
              <p className="text-gray-700">Technical rehearsals: Saturdays at 3:00 PM</p>
              <p className="text-gray-700 text-sm mt-2">Sound, video, lighting, and IT skills welcome</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ICTTechnicalTeam;