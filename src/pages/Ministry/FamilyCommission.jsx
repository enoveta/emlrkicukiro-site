// src/pages/Ministry/FamilyCommission.jsx
import React from 'react';
import familyCommissionImg from '../../assets/emlr/fam.jpg';

function FamilyCommission() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Family Commission</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={familyCommissionImg}
                alt="Family Commission at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              The Family Commission at EMRL Kicukiro is dedicated to strengthening families according to biblical principles. 
              We believe that healthy families are the foundation of a healthy church and society, and we work to provide 
              resources, support, and guidance for families at every stage of life.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Our ministry offers marriage enrichment programs, parenting workshops, family counseling, 
              and events that bring families together in fellowship and fun. We strive to create a community 
              where families can grow together in faith and support one another through life's challenges.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Get Involved</h3>
              <p className="text-gray-700">Monthly Family Gatherings | Various Programs</p>
              <p className="text-gray-700 text-sm mt-2">Strengthening families, building community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FamilyCommission;