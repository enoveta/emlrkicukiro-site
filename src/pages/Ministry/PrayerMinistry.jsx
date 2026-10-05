// src/pages/Ministry/PrayerMinistry.jsx
import React from 'react';
import prayerMinistryImg from '../../assets/emlr/1.jpg';

function PrayerMinistry() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Prayer Ministry</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={prayerMinistryImg}
                alt="Prayer Ministry at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Prayer Ministry at EMRL Kicukiro is the spiritual backbone of our church, committed to 
              covering our congregation, leadership, and community in consistent, fervent prayer. We believe 
              that prayer is not just preparation for the work of ministry—it is the work of ministry.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              We organize prayer chains, intercessory prayer sessions, prayer walks, and emergency prayer 
              responses. Our team also provides prayer support during services and maintains a prayer request 
              system that ensures every need is lifted to God by faithful intercessors.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Pray With Us</h3>
              <p className="text-gray-700">Weekly prayer meetings: Tuesdays at 6:00 PM</p>
              <p className="text-gray-700 text-sm mt-2">Pre-service prayer: Sundays at 8:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrayerMinistry;