// src/pages/TermsOfService.jsx
function TermsOfService() {
    return (
      <div className="min-h-screen pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#290011] to-[#842a1a] text-white p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl">
              Terms and conditions for using our website and services.
            </p>
          </div>
  
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#290011]">Terms of Service</h2>
            <p className="text-gray-700 mb-6">
              By using our website and services, you agree to the following terms and conditions.
            </p>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Acceptance of Terms</h3>
                <p>By accessing and using this website, you accept and agree to be bound by these terms.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Use of Content</h3>
                <p>All content on this website is for personal, non-commercial use only.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">User Conduct</h3>
                <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Changes to Terms</h3>
                <p>We may update these terms from time to time. Continued use of the website constitutes acceptance of the updated terms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TermsOfService;