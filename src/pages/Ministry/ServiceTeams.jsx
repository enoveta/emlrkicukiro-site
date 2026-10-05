// src/pages/Ministry/ServiceTeams.jsx
import { useState } from 'react';

function ServiceTeams() {
  const [activeTeam, setActiveTeam] = useState('ict');
  
  const teams = {
    ict: {
      name: "ICT & Technical Team",
      description: "Our ICT and Technical Team manages all audio-visual equipment, live streaming, and church communications. They ensure our services run smoothly from a technical perspective.",
      responsibilities: [
        "Sound system operation",
        "Live streaming services",
        "Website and social media management",
        "Presentation slides during services"
      ],
      contact: "Team Leader: Brother James - 0788 123 789"
    },
    protocol: {
      name: "Protocol Team",
      description: "The Protocol Team welcomes visitors, assists with seating, distributes materials, and helps maintain order during services. They are the first faces people see when they arrive.",
      responsibilities: [
        "Greeting and welcoming attendees",
        "Ushering and seating assistance",
        "Distributing bulletins and materials",
        "Offering collection"
      ],
      contact: "Team Leader: Sister Agnes - 0788 456 123"
    },
    prayer: {
      name: "Prayer Ministry",
      description: "The Prayer Ministry intercedes for the church, its members, and community needs. They organize prayer meetings and are available for prayer after services.",
      responsibilities: [
        "Intercessory prayer for the church",
        "Prayer chain for urgent requests",
        "Post-service prayer assistance",
        "Weekly prayer meetings"
      ],
      contact: "Team Leader: Deacon Paul - 0788 789 456"
    },
    advisors: {
      name: "Church Advisors",
      description: "Church Advisors provide godly counsel and guidance to members facing various life challenges. They operate under the pastoral team's supervision.",
      responsibilities: [
        "Biblical counseling sessions",
        "Marriage and family guidance",
        "Crisis intervention",
        "Discipleship mentoring"
      ],
      contact: "Lead Pastor - 0788 555 123"
    },
    evangelism: {
      name: "Evangelism Team",
      description: "The Evangelism Team focuses on outreach and spreading the Gospel in our community. They organize evangelism events and follow-up with new converts.",
      responsibilities: [
        "Community outreach programs",
        "Door-to-door evangelism",
        "New convert follow-up",
        "Outreach event planning"
      ],
      contact: "Team Leader: Evangelist John - 0788 123 555"
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#290011]">Service Teams</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our service teams are the backbone of our church operations. Each team plays a vital role in ensuring our church functions effectively.
        </p>
        
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {Object.keys(teams).map(team => (
            <button
              key={team}
              onClick={() => setActiveTeam(team)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTeam === team 
                  ? 'bg-[#290011] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {teams[team].name}
            </button>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#d44930]">{teams[activeTeam].name}</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{teams[activeTeam].description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[#290011]">Key Responsibilities</h3>
            <ul className="list-disc list-inside space-y-2">
              {teams[activeTeam].responsibilities.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#290011]">Contact</h3>
            <p className="text-gray-700">{teams[activeTeam].contact}</p>
          </div>
          
          <div className="mt-8">
            <button className="bg-[#290011] text-white px-6 py-3 rounded-lg hover:bg-[#d44930] transition-colors">
              Join This Team
            </button>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-100 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#290011]">Service Team Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-[#290011]">Community</h3>
              <p className="text-gray-700 text-sm">Build meaningful relationships with other believers</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-[#290011]">Growth</h3>
              <p className="text-gray-700 text-sm">Develop your spiritual gifts and talents</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-[#290011]">Impact</h3>
              <p className="text-gray-700 text-sm">Make a difference in people's lives</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-[#290011]">Training</h3>
              <p className="text-gray-700 text-sm">Receive specialized training for your role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceTeams;