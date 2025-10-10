export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">
          If you can see this page with proper styling, your layout and CSS are working correctly.
        </p>
        <div className="mt-4 p-4 bg-orange-100 text-orange-800 rounded-lg">
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <div className="space-y-1 text-sm">
            <div>
              Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
            </div>
            <div>
              NEHTW API: {process.env.NEXT_PUBLIC_NEHTW_API_KEY ? '✅ Configured' : '❌ Missing'}
            </div>
            <div>
              NEHTW Base URL: {process.env.NEXT_PUBLIC_NEHTW_BASE_URL ? '✅ Configured' : '❌ Missing'}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
          <h3 className="font-semibold mb-2">Status:</h3>
          <p className="text-sm">
            ✅ Layout working<br/>
            ✅ CSS working<br/>
            ✅ Glassmorphism working<br/>
            ✅ Background gradient working
          </p>
        </div>
      </div>
    </div>
  )
}

