// src/pages/PrivacyPolicy.jsx
function PrivacyPolicy() {
    return (
      <div className="min-h-screen pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#290011] to-[#842a1a] text-white p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl">
              How we protect and use your personal information.
            </p>
          </div>
  
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#290011]">Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              This privacy policy explains how EMLR Kicukiro collects, uses, and protects your personal information.
            </p>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Information We Collect</h3>
                <p>We collect information you provide when you register for events, make donations, or contact us.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">How We Use Your Information</h3>
                <p>We use your information to communicate with you, process donations, and provide services you request.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Information Protection</h3>
                <p>We implement security measures to protect your personal information from unauthorized access.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#d44930]">Contact Us</h3>
                <p>If you have questions about our privacy policy, please contact us at info@emlrkicukiro.rw</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default PrivacyPolicy;