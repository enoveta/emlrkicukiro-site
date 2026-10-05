// src/pages/Media/Media.jsx
import { Link } from 'react-router-dom';

function Media() {
  const recentSermons = [
    {
      title: "The Power of Faith",
      preacher: "Pastor John",
      date: "October 15, 2023",
      duration: "45:22"
    },
    {
      title: "Finding Peace in Turbulent Times",
      preacher: "Evangelist Mary",
      date: "October 8, 2023",
      duration: "38:15"
    },
    {
      title: "The Joy of Giving",
      preacher: "Deacon James",
      date: "October 1, 2023",
      duration: "42:08"
    }
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#290011]">Media Center</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Access sermons, news, photos, and other media resources from EMLR Kicukiro Parish.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#d44930]">Sermons</h2>
            <p className="text-gray-700 mb-6">Watch or listen to our latest messages and teachings.</p>
            
            <div className="space-y-4 mb-6">
              {recentSermons.map((sermon, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-[#290011]">{sermon.title}</h3>
                  <p className="text-gray-600 text-sm">{sermon.preacher} • {sermon.date} • {sermon.duration}</p>
                </div>
              ))}
            </div>
            
            <button className="bg-[#290011] text-white px-4 py-2 rounded hover:bg-[#d44930] transition-colors">
              View All Sermons
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#d44930]">Live Streaming</h2>
            <p className="text-gray-700 mb-6">Join our services online through our live streaming platform.</p>
            
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Live stream will appear here during services</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-[#290011] text-white px-4 py-2 rounded hover:bg-[#d44930] transition-colors flex-1">
                Watch Live
              </button>
              <button className="border border-[#290011] text-[#290011] px-4 py-2 rounded hover:bg-[#290011] hover:text-white transition-colors flex-1">
                Schedule
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/media/news" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#d44930]">Church News</h2>
            </div>
            <p className="text-gray-700 mb-4">Stay updated with the latest news and announcements from our church.</p>
            <span className="text-[#290011] font-medium hover:underline">Read News →</span>
          </Link>
          
          <Link to="/media/gallery" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#d44930] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#d44930]">Photo Gallery</h2>
            </div>
            <p className="text-gray-700 mb-4">Browse photos from our services, events, and community activities.</p>
            <span className="text-[#290011] font-medium hover:underline">View Gallery →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Media;