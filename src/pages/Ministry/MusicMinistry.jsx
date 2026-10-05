// src/pages/Ministry/MusicMinistry.jsx
import { useState } from 'react';

function MusicMinistry() {
  const [activeChoir, setActiveChoir] = useState('ibyiringiro');
  
  const choirs = {
    ibyiringiro: {
      name: "Ibyiringiro Choir",
      description: "The Ibyiringiro Choir specializes in traditional hymns and contemporary worship music. With a focus on hope and inspiration, this choir ministers through powerful vocal arrangements.",
      rehearsal: "Thursdays, 5:00 PM - 7:00 PM",
      leader: "Director: Mr. Emmanuel - 0788 111 222"
    },
    narada: {
      name: "Narada Choir",
      description: "Narada Choir brings energetic praise and worship with a mix of modern gospel and charismatic expressions. This choir often leads our youth services and special events.",
      rehearsal: "Fridays, 4:00 PM - 6:00 PM",
      leader: "Director: Miss Grace - 0788 222 333"
    },
    maranata: {
      name: "Maranata Choir",
      description: "Maranata Choir focuses on prophetic worship and intimate moments with God. Their ministry creates an atmosphere of reverence and connection with the Holy Spirit.",
      rehearsal: "Wednesdays, 6:00 PM - 8:00 PM",
      leader: "Director: Pastor David - 0788 333 444"
    },
    reverence: {
      name: "Reverence Worship Team",
      description: "The Reverence Team leads our contemporary worship services with a full band setup. They introduce new songs while maintaining the depth of traditional worship.",
      rehearsal: "Tuesdays, 5:30 PM - 7:30 PM",
      leader: "Director: Mr. Samuel - 0788 444 555"
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#290011]">Music Ministry</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our music ministry consists of talented choirs and worship teams that lead our congregation in praise and worship.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.keys(choirs).map(choir => (
            <button
              key={choir}
              onClick={() => setActiveChoir(choir)}
              className={`p-4 rounded-lg transition-colors text-center ${
                activeChoir === choir 
                  ? 'bg-[#290011] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {choirs[choir].name}
            </button>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#d44930]">{choirs[activeChoir].name}</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{choirs[activeChoir].description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#290011]">Rehearsal Time</h3>
              <p className="text-gray-700">{choirs[activeChoir].rehearsal}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#290011]">Contact</h3>
              <p className="text-gray-700">{choirs[activeChoir].leader}</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-[#290011] text-white px-6 py-3 rounded-lg hover:bg-[#d44930] transition-colors">
              Join This Choir
            </button>
            <button className="border border-[#290011] text-[#290011] px-6 py-3 rounded-lg hover:bg-[#290011] hover:text-white transition-colors">
              Listen to Recordings
            </button>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-100 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#290011]">Upcoming Musical Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Christmas Concert</h3>
              <p className="text-gray-600 mb-2">December 15, 2023</p>
              <p className="text-gray-700">All choirs will perform special Christmas selections.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Easter Cantata</h3>
              <p className="text-gray-600 mb-2">April 5, 2024</p>
              <p className="text-gray-700">A special presentation of the Easter story through music.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Music Workshop</h3>
              <p className="text-gray-600 mb-2">June 20, 2024</p>
              <p className="text-gray-700">Training session for all choir members and musicians.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicMinistry;