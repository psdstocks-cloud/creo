const AdminDashboard = () => {
  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>
      {/* Panels and management features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="space-y-2">
            <div className="text-sm">Total Users: 1,234</div>
            <div className="text-sm">Active Users: 987</div>
            <div className="text-sm">New This Month: 156</div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm">
            View Users
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Order Management</h2>
          <div className="space-y-2">
            <div className="text-sm">Pending Orders: 23</div>
            <div className="text-sm">Completed Today: 156</div>
            <div className="text-sm">Failed Orders: 3</div>
          </div>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded text-sm">
            View Orders
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Content & Analytics</h2>
          <div className="space-y-2">
            <div className="text-sm">Total Downloads: 45,678</div>
            <div className="text-sm">Popular Categories: Images</div>
            <div className="text-sm">Revenue: $12,345</div>
          </div>
          <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded text-sm">
            View Analytics
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <div className="space-y-2">
            <div className="text-sm">API Status: Online</div>
            <div className="text-sm">Server Load: 45%</div>
            <div className="text-sm">Last Backup: 2 hours ago</div>
          </div>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm">
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
