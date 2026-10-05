// src/pages/Ministry/ProtocolTeam.jsx
import React from 'react';
import protocolTeamImg from '../../assets/emlr/2.jpg';

function ProtocolTeam() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Protocol Team</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={protocolTeamImg}
                alt="Protocol Team at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Protocol Team at EMRL Kicukiro serves as the welcoming face of our church, ensuring that 
              every visitor and member experiences warmth, order, and excellent service. We create an atmosphere 
              of hospitality that reflects Christ's love and makes everyone feel valued and comfortable.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our responsibilities include greeting attendees, ushering, managing seating arrangements, 
              assisting during communion, and ensuring smooth flow during services and special events. 
              We believe that first impressions matter in ministry and strive to make every encounter meaningful.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Team</h3>
              <p className="text-gray-700">Training sessions: 1st Saturday of each month</p>
              <p className="text-gray-700 text-sm mt-2">Friendly, organized individuals needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtocolTeam;