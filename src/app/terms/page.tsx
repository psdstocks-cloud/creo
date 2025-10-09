export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Creo, you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of Creo for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-600 mb-4">
              Creo provides access to stock media and AI generation services. We reserve the 
              right to modify or discontinue the service at any time without notice.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">
              You may not use our service for any unlawful purpose or to solicit others to perform 
              unlawful acts, or to violate any international, federal, provincial, or state regulations, 
              rules, laws, or local ordinances.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content License</h2>
            <p className="text-gray-600 mb-4">
              By using our service, you grant Creo a non-exclusive, worldwide, royalty-free license 
              to use, reproduce, and distribute any content you submit through our platform.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Creo, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or 
              punitive damages.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@creo.com" className="text-orange-600 hover:text-orange-700">
                legal@creo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
