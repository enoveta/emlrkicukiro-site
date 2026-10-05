// src/pages/Ministry/ChildrenMinistry.jsx
import React from 'react';
import childrenMinistryImg from '../../assets/emlr/abana.webp';

function ChildrenMinistry() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#003366]">Children's Ministry</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={childrenMinistryImg}
                alt="Children's Ministry at EMRL Kicukiro" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4 text-lg">
              Our Children's Ministry at EMRL Kicukiro is committed to nurturing the faith of the next generation 
              in a safe, fun, and engaging environment. We believe that children are not just the future of the church 
              but an essential part of our present community.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Through age-appropriate Bible lessons, worship, games, and activities, we help children develop 
              a personal relationship with Jesus Christ. Our dedicated team of volunteers creates a welcoming 
              space where children can learn about God's love and grow in their faith alongside their peers.
            </p>
            
            <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
              <h3 className="font-bold text-lg mb-2 text-[#003366]">Programs Available</h3>
              <p className="text-gray-700">Sundays at 10:00 AM | Children's Wing</p>
              <p className="text-gray-700 text-sm mt-2">Ages 3-12 | Safe and nurturing environment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildrenMinistry;