// src/pages/Ministry/MemberGroups.jsx
import { useState } from 'react';

function MemberGroups() {
  const [activeGroup, setActiveGroup] = useState('men');
  
  const groups = {
    men: {
      title: "Men Fellowship",
      description: "Our men's fellowship group meets regularly for Bible study, prayer, and fellowship. We focus on developing spiritual leadership in homes and the community.",
      meetingTime: "Every Saturday, 3:00 PM",
      contact: "Brother John - 0788 123 456"
    },
    women: {
      title: "Women Fellowship",
      description: "The women's ministry provides a supportive community for spiritual growth, fellowship, and service. We organize prayer meetings, retreats, and outreach programs.",
      meetingTime: "Every Tuesday, 2:00 PM",
      contact: "Sister Mary - 0788 654 321"
    },
    youth: {
      title: "Youth Ministry",
      description: "Our vibrant youth ministry engages young people through dynamic worship, relevant teaching, and fun activities that help them grow in their faith.",
      meetingTime: "Every Friday, 5:00 PM",
      contact: "Youth Leader - 0788 789 012"
    },
    children: {
      title: "Children Ministry",
      description: "We provide a safe, fun environment where children can learn about Jesus through age-appropriate lessons, worship, and activities.",
      meetingTime: "Sundays during service",
      contact: "Children's Director - 0788 345 678"
    },
    family: {
      title: "Family Commission",
      description: "The family commission supports and strengthens families through counseling, workshops, and events that promote biblical family values.",
      meetingTime: "Monthly, every 3rd Saturday",
      contact: "Family Pastor - 0788 901 234"
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#290011]">Member Groups</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Connect with others in our church community through these fellowship groups designed for different ages and life stages.
        </p>
        
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {Object.keys(groups).map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeGroup === group 
                  ? 'bg-[#290011] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {groups[group].title}
            </button>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#d44930]">{groups[activeGroup].title}</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{groups[activeGroup].description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#290011]">Meeting Time</h3>
              <p className="text-gray-700">{groups[activeGroup].meetingTime}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#290011]">Contact</h3>
              <p className="text-gray-700">{groups[activeGroup].contact}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="bg-[#290011] text-white px-6 py-3 rounded-lg hover:bg-[#d44930] transition-colors">
              Join This Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberGroups;