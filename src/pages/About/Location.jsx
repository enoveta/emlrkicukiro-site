import { Link } from 'react-router-dom';

function Location() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#5fb9e2] bg-[#e8f5fb] rounded-full mb-4">
            Visit Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-6">Our Location & Contact</h1>
          <div className="w-24 h-1.5 bg-[#5fb9e2] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            We welcome you to join us for worship and fellowship at our parish
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Map Section */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="h-104">
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4610160248685!2d30.09513407589272!3d-1.9696555367567457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca70009849dad%3A0xf18b0ddc989f39e0!2sEglise%20Mthodiste%20Libre%20au%20rwanda%20(%20EMLR-%20Kicukiro)%20%2F%20Free%20Methodist%20Church%20in%20Rwanda%20(Kicukiro%20Parish)%20%2F!5e0!3m2!1sen!2srw!4v1758233462336!5m2!1sen!2srw"
  width="600"
  height="500"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

            </div>
            <div className="bg-white p-4 border-t border-gray-100">
              <h3 className="font-semibold text-[#001d3a]">EMLR Kicukiro Parish</h3>
              <p className="text-gray-600 text-sm">23JX+43M, Kigali, Rwanda</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#001d3a] mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Senior Pastor */}
              <div className="flex items-start">
                <div className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#5fb9e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">Rev NDAGIJIMANA Jean Baptiste</h3>
                  <p className="text-gray-600">Senior Pastor</p>
                  <a href="tel:+250788524792" className="text-[#5fb9e2] hover:text-[#001d3a] transition-colors flex items-center mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    +250 788 524 792
                  </a>
                </div>
              </div>

              {/* Associate Pastor */}
              <div className="flex items-start">
                <div className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#5fb9e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">Rev Dr RUTIMIRWA Benjamin</h3>
                  <p className="text-gray-600">Associate Pastor</p>
                  <a href="tel:+250788300839" className="text-[#5fb9e2] hover:text-[#001d3a] transition-colors flex items-center mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    +250 788 300 839
                  </a>
                </div>
              </div>
              {/*Mwalimu*/ }
              <div className="flex items-start">
                <div className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#5fb9e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">Mr. Manasse NSHIMYUMUKIZA</h3>
                  <p className="text-gray-600">Mwarimu</p>
                  <a href="tel:+250788300839" className="text-[#5fb9e2] hover:text-[#001d3a] transition-colors flex items-center mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    +250 785 714 185
                  </a>
                </div>
              </div>

              {/* System Administrator */}
              <div className="flex items-start">
                <div className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#5fb9e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">Mr. HAKIZIMANA Bernard</h3>
                  <p className="text-gray-600">System Administrator</p>
                  <a href="tel:+250788917742" className="text-[#5fb9e2] hover:text-[#001d3a] transition-colors flex items-center mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    +250 788 917 742
                  </a>
                </div>
              </div>

              {/* Email Contact */}
              <div className="flex items-start pt-4 border-t border-gray-100">
                <div className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#5fb9e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">Contact Email</h3>
                  <a href="mailto:info@emlrkicukiroparish.org" className="text-[#5fb9e2] hover:text-[#001d3a] transition-colors flex items-center mt-1">
                    info@emlrkicukiroparish.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

  

        {/* Back to About Link */}
        <div className="text-center">
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

export default Location;