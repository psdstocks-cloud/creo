export default function TestStylingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-8">
          CSS Styling Test Page
        </h1>
        
        {/* Glass Card Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Glass Card Test</h2>
          <p className="text-gray-600 mb-4">This should have a glassmorphism effect with backdrop blur.</p>
          <div className="flex gap-4">
            <button className="button-primary">Primary Button</button>
            <button className="button-secondary">Secondary Button</button>
            <button className="button-success">Success Button</button>
          </div>
        </div>
        
        {/* Status Badges Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Status Badges Test</h2>
          <div className="flex flex-wrap gap-4">
            <span className="status-success">Success</span>
            <span className="status-error">Error</span>
            <span className="status-warning">Warning</span>
            <span className="status-info">Info</span>
            <span className="status-processing">Processing</span>
          </div>
        </div>
        
        {/* Form Elements Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Form Elements Test</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Test input" 
              className="form-input w-full"
            />
            <textarea 
              placeholder="Test textarea" 
              className="form-textarea w-full"
              rows={3}
            />
            <select className="form-select w-full">
              <option>Test select</option>
            </select>
          </div>
        </div>
        
        {/* Grid Test */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Grid Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <h3 className="font-semibold text-gray-900">Item {i + 1}</h3>
                <p className="text-sm text-gray-600">Grid item</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

