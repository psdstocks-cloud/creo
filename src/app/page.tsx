import AuthTest from "../components/AuthTest";
import WebhookTestExample from "../components/WebhookTestExample";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Creo - Supabase Authentication Test
          </h1>
          <p className="text-primaryOrange-200 text-lg">
            Test your Supabase authentication setup
          </p>
        </div>
        
                <AuthTest />

                <WebhookTestExample />

                <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Available Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">AuthModal</h3>
              <p className="text-sm text-gray-300">Complete authentication modal with sign up, sign in, and password reset</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">AuthButton</h3>
              <p className="text-sm text-gray-300">Simple authentication button component</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">FAQ Accordion</h3>
              <p className="text-sm text-gray-300">Friendly FAQ component with search and filtering</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Pricing Rollback</h3>
              <p className="text-sm text-gray-300">Points rollback policy information component</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Pricing</h3>
              <p className="text-sm text-gray-300">Interactive pricing slider with tiered calculations</p>
            </div>
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">Testimonials</h3>
                      <p className="text-sm text-gray-300">Animated testimonials carousel with Framer Motion</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">Webhook Test</h3>
                      <p className="text-sm text-gray-300">Test nehtw webhook integration with various events</p>
                    </div>
          </div>
        </div>
      </div>
    </div>
  );
}
