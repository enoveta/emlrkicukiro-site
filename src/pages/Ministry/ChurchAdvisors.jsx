// src/pages/Ministry/ChurchAdvisors.jsx
import React from 'react';
import advisorsImg from '../../assets/emlr/bg5.jpeg';

function ChurchAdvisors() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Church Advisors</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={advisorsImg}
                alt="Church Advisors at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Church Advisors at EMRL Kicukiro are seasoned spiritual leaders who provide wisdom, guidance, 
              and counsel to the church leadership and congregation. Drawing from years of experience and 
              spiritual maturity, they help ensure the church remains grounded in biblical truth and effective 
              in ministry.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our advisors offer perspective on theological matters, church governance, conflict resolution, 
              and strategic planning. They serve as spiritual fathers and mothers to the congregation, 
              providing mentorship and discipleship that strengthens the entire church body.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Seek Counsel</h3>
              <p className="text-gray-700">Available by appointment for spiritual guidance</p>
              <p className="text-gray-700 text-sm mt-2">Experience, wisdom, and biblical counsel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChurchAdvisors;