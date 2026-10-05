// src/pages/Ministry/EvangelismTeam.jsx
import React from 'react';
import evangelismTeamImg from '../../assets/emlr/1.jpg';

function EvangelismTeam() {
  const locations = [
    "Kicukiro", "Kagarama-Niboye", "Kabeza-Kanombe", "Nyarugenge", 
    "Kimironko", "Nyabisindu", "Gatenga", "Kagugu-Batsinda", 
    "Kimisagara", "Gatsata-Bweramvura", "Gikondo-Kigarama", "Remera", 
    "Kagina", "Karembure", "Rwabutenge", "Nyakabungo", 
    "Kabuga", "Ntatsinda ubarizwamo", "Rwanko", "Nyirakanamba", 
    "Nyabyunyu", "Antenne", "Gatovu", "Kiyanja", "Kagasa"
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Evangelism Team</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={evangelismTeamImg}
                alt="Evangelism Team at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Evangelism Team at EMRL Kicukiro is passionate about fulfilling the Great Commission by 
              sharing the Gospel message within our community and beyond. We believe that every believer is 
              called to be a witness for Christ and we equip members to confidently share their faith.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our activities include door-to-door evangelism, street outreach, community service projects, 
              evangelism training workshops, and follow-up with new believers. We strive to build relationships 
              that create opportunities to share God's love in both word and deed.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Join Our Outreach</h3>
              <p className="text-gray-700">Monthly outreach events: 3rd Saturday of each month</p>
              <p className="text-gray-700 text-sm mt-2">Training provided - all experience levels welcome</p>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-gradient-to-br from-[#003366] to-[#5fb9e2] rounded-xl shadow-lg p-8 text-[#003366]">
          <h2 className="text-3xl text-[#bccddd] font-bold text-center mb-8">Our Evangelism Locations</h2>
          <p className="text-center text-[#bccddd] text-xl mb-10 max-w-3xl mx-auto">
            We're actively sharing the Gospel in these communities across Kigali and beyond. 
            Join a team in your area or start a new one!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locations.map((location, index) => (
              <div 
                key={index} 
                className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-25 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 极 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{location}</span>
                </div>
              </div>
            ))}
          </div>
          
       
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-16">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-[#003366] mb-2">25+</div>
            <div className="text-gray-700">Active Locations</div>
          </div>
      
       
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-[#003366] mb-6">Ready to Make a Difference?</h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our evangelism team and be part of spreading God's love in your community. 
            No experience necessary
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvangelismTeam;