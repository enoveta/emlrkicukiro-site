// src/pages/Ministry/YouthMinistry.jsx
import React from 'react';
import youthMinistryImg from '../../assets/emlr/2.jpg';

function YouthMinistry() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Youth Ministry</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={youthMinistryImg}
                alt="Youth Ministry at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              Our Youth Ministry at EMRL Kicukiro is a dynamic community where teenagers and young adults 
              can explore their faith, build meaningful relationships, and discover their purpose in Christ. 
              We create relevant and engaging experiences that meet youth where they are and challenge them 
              to grow spiritually.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Through worship nights, small groups, service projects, and fun activities, we provide a space 
              where youth can be themselves, ask tough questions, and develop a faith that will sustain them 
              through life's challenges. We're committed to raising up the next generation of Christian leaders.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Youth</h3>
              <p className="text-gray-700">Fridays at 6:00 PM | Youth Center</p>
              <p className="text-gray-700 text-sm mt-2">Ages 13-25 | Relevant, engaging, and fun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouthMinistry;