// src/pages/BibleStudies.jsx
function BibleStudies() {
    return (
      <div className="min-h-screen pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#290011] to-[#842a1a] text-white p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold mb-4">Bible Studies</h1>
            <p className="text-xl">
              Explore our Bible study resources and groups.
            </p>
          </div>
  
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#290011]">Bible Study Resources</h2>
            <p className="text-gray-700 mb-6">
              Our church offers various Bible study opportunities for all ages and stages of faith.
              Check our ministries page for specific Bible study groups.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#d44930]">Available Studies</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Men's Bible Study</li>
                  <li>Women's Bible Study</li>
                  <li>Youth Bible Study</li>
                  <li>Couples Bible Study</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#d44930]">Get Involved</h3>
                <p className="text-gray-700 mb-4">
                  Contact our church office to learn more about our Bible study opportunities 
                  and find a group that fits your schedule.
                </p>
                <a href="/about/location" className="bg-[#290011] text-white px-4 py-2 rounded hover:bg-[#d44930] transition-colors inline-block">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default BibleStudies;