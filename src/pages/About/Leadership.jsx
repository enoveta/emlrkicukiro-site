import { Link } from 'react-router-dom';

function Leadership() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#5fb9e2] bg-[#e8f5fb] rounded-full mb-4">
            Church Governance
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-6">Organizational Structure</h1>
         
        </div>

        <div className="space-y-16">
          {/* NATIONAL LEVEL */}
          <div>
            <h2 className="text-3xl font-bold text-center text-[#001d3a] mb-10">
              National Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#001d3a] to-[#0a2c52] text-white p-6 rounded-xl shadow-lg">
               
                <h3 className="text-xl font-semibold mb-3">EMLR Financial Audit Level</h3>
                <p className="text-blue-100">Oversight and financial governance at the national level</p>
              </div>

              <div className="bg-gradient-to-br from-[#001d3a] to-[#0a2c52] text-white p-6 rounded-xl shadow-lg">
              
                <h3 className="text-xl font-semibold mb-3">General Conference</h3>
                <div className="space-y-3 mt-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Leadership Council of the General Conference</h4>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Office of the Bishop and EMLR Advocacy</h4>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#001d3a] to-[#0a2c52] text-white p-6 rounded-xl shadow-lg">
             
                <h3 className="text-xl font-semibold mb-3">EMLR Conflict Resolution Level</h3>
                <p className="text-blue-100">Mediation and conflict resolution at the national level</p>
              </div>
            </div>
          </div>

          {/* CONFERENCE LEVEL */}
          <div>
            <h2 className="text-3xl font-bold text-center text-[#001d3a] mb-10">
              Conference Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#5fb9e2] to-[#7ac7eb] text-white p-6 rounded-xl shadow-lg">
               
                <h3 className="text-xl font-semibold mb-3">Conference Financial Audit Level</h3>
                <p className="text-blue-50">Financial oversight and governance at the conference level</p>
              </div>

              <div className="bg-gradient-to-br from-[#5fb9e2] to-[#7ac7eb] text-white p-6 rounded-xl shadow-lg">
               
                <h3 className="text-xl font-semibold mb-3">Annual Conference Meeting</h3>
                <div className="space-y-3 mt-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Conference Executive Committee</h4>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Office of the Superintendent and Conference Advocacy</h4>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Parishes</h4>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">School of Evangelism</h4>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <h4 className="font-medium">Evangelism Team</h4>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#5fb9e2] to-[#7ac7eb] text-white p-6 rounded-xl shadow-lg">
              
                <h3 className="text-xl font-semibold mb-3">Conference Conflict Resolution Level</h3>
                <p className="text-blue-50">Mediation and conflict resolution at the conference level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to About Link */}
        <div className="text-center mt-16">
          <Link 
            to="/about" 
            className="inline-flex items-center px-6 py-3 bg-[#001d3a] text-white font-medium rounded-lg hover:bg-[#003366] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to About
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leadership;