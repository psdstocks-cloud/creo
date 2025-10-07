const DashboardPage = () => {
  return (
    <div className="dashboard-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-6">User Dashboard</h1>
      {/* Insert components */}
      {/* Examples: CreditBalance, MediaSearch, OrderHistory, Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Credit Balance</h2>
          <p className="text-2xl font-bold text-primaryOrange-500">1,250 Credits</p>
          <p className="text-sm text-gray-600">Available for downloads</p>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Media Search</h2>
          <input 
            type="text" 
            placeholder="Search stock media..." 
            className="w-full p-2 border rounded"
          />
          <button className="mt-2 px-4 py-2 bg-primaryOrange-500 text-white rounded">
            Search
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-2">
            <div className="text-sm">Order #12345 - Completed</div>
            <div className="text-sm">Order #12344 - Processing</div>
            <div className="text-sm">Order #12343 - Completed</div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Profile & Subscription</h2>
          <p className="text-sm mb-2">Professional Plan</p>
          <p className="text-sm text-gray-600">Next billing: Jan 15, 2024</p>
          <button className="mt-2 px-4 py-2 bg-deepPurple-500 text-white rounded text-sm">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
