'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  UserMinusIcon,
  EyeIcon,
  PencilIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Mock user data - in real app, this would come from API
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z',
    totalOrders: 12,
    totalSpent: 156.78,
    balance: 25.50,
    avatar: null
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    totalOrders: 8,
    totalSpent: 89.32,
    balance: 12.00,
    avatar: null
  },
  {
    id: '3',
    email: 'bob.wilson@example.com',
    fullName: 'Bob Wilson',
    role: 'user',
    status: 'suspended',
    createdAt: '2024-01-05T11:20:00Z',
    lastLogin: '2024-01-18T09:30:00Z',
    totalOrders: 3,
    totalSpent: 45.67,
    balance: 0.00,
    avatar: null
  },
  {
    id: '4',
    email: 'alice.brown@example.com',
    fullName: 'Alice Brown',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T08:00:00Z',
    lastLogin: '2024-01-20T17:15:00Z',
    totalOrders: 25,
    totalSpent: 345.89,
    balance: 50.00,
    avatar: null
  },
  {
    id: '5',
    email: 'charlie.davis@example.com',
    fullName: 'Charlie Davis',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-12-20T14:30:00Z',
    lastLogin: '2024-01-10T12:00:00Z',
    totalOrders: 5,
    totalSpent: 67.45,
    balance: 8.50,
    avatar: null
  }
]

interface UserFilters {
  search: string
  role: 'all' | 'user' | 'admin'
  status: 'all' | 'active' | 'inactive' | 'suspended'
  sortBy: 'name' | 'email' | 'createdAt' | 'lastLogin' | 'totalSpent'
  sortOrder: 'asc' | 'desc'
}

export default function UsersPage() {
  const { user, loading } = useAuth()
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let users = mockUsers

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      users = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        user.fullName.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.role !== 'all') {
      users = users.filter(user => user.role === filters.role)
    }

    if (filters.status !== 'all') {
      users = users.filter(user => user.status === filters.status)
    }

    // Sort users
    users.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName)
          break
        case 'email':
          comparison = a.email.localeCompare(b.email)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'lastLogin':
          comparison = new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
          break
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent
          break
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return users
  }, [filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = mockUsers.length
    const activeUsers = mockUsers.filter(u => u.status === 'active').length
    const totalRevenue = mockUsers.reduce((sum, u) => sum + u.totalSpent, 0)
    const averageOrderValue = mockUsers.reduce((sum, u) => sum + u.totalOrders, 0) / totalUsers

    return { totalUsers, activeUsers, totalRevenue, averageOrderValue }
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access user management.</p>
        </div>
      </div>
    )
  }

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    console.log(`Action ${action} for user ${userId}`)
    // In real app, this would call API
  }

  const handleBulkAction = (action: 'suspend' | 'activate' | 'delete') => {
    console.log(`Bulk action ${action} for users:`, selectedUsers)
    setSelectedUsers([])
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UsersIcon}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={ShieldCheckIcon}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={CurrencyDollarIcon}
            color="purple"
          />
          <StatCard
            title="Avg Orders/User"
            value={stats.averageOrderValue.toFixed(1)}
            icon={ClipboardDocumentListIcon}
            color="orange"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
              />
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <UserMinusIcon className="h-4 w-4 mr-1" />
                  Suspend
                </button>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserPlusIcon className="h-4 w-4 mr-1" />
                  Activate
                </button>
                <button
                  onClick={clearSelection}
                  className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg transition-colors ${
                showFilters ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        role: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        status: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        sortBy: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="createdAt">Created Date</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="lastLogin">Last Login</option>
                      <option value="totalSpent">Total Spent</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        sortOrder: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({
                      search: '',
                      role: 'all',
                      status: 'all',
                      sortBy: 'createdAt',
                      sortOrder: 'desc'
                    })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Users Table */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={selectedUsers.length === filteredUsers.length ? clearSelection : selectAllUsers}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {filteredUsers.length} users
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {selectedUsers.length} selected
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onToggleSelection={() => toggleUserSelection(user.id)}
                onView={() => setSelectedUser(user)}
                onAction={handleUserAction}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleUserAction}
        />
      )}
  )
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// User Row Component
function UserRow({ user, isSelected, onToggleSelection, onView, onAction }: {
  user: typeof mockUsers[0]
  isSelected: boolean
  onToggleSelection: () => void
  onView: () => void
  onAction: (userId: string, action: 'suspend' | 'activate' | 'delete') => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'suspended':
        return 'text-red-600 bg-red-100'
      case 'inactive':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-purple-600 bg-purple-100'
      case 'user':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-6 py-4 hover:bg-gray-50/50 transition-colors ${
        isSelected ? 'bg-green-50/50' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <UsersIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.fullName}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
          <div className="text-center">
            <p className="font-medium text-gray-900">{user.totalOrders}</p>
            <p className="text-xs">Orders</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">${user.totalSpent.toFixed(2)}</p>
            <p className="text-xs">Spent</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">${user.balance.toFixed(2)}</p>
            <p className="text-xs">Balance</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          {user.status === 'active' ? (
            <button
              onClick={() => onAction(user.id, 'suspend')}
              className="p-2 text-yellow-400 hover:text-yellow-600 transition-colors"
              title="Suspend User"
            >
              <UserMinusIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onAction(user.id, 'activate')}
              className="p-2 text-green-400 hover:text-green-600 transition-colors"
              title="Activate User"
            >
              <UserPlusIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// User Details Modal Component
function UserDetailsModal({ user, onClose, onAction }: {
  user: typeof mockUsers[0]
  onClose: () => void
  onAction: (userId: string, action: 'suspend' | 'activate' | 'delete') => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="text-sm text-gray-900">{user.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="text-sm text-gray-900 capitalize">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 capitalize">{user.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity & Stats</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                  <dd className="text-sm text-gray-900">{user.totalOrders}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                  <dd className="text-sm text-gray-900">${user.totalSpent.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                  <dd className="text-sm text-gray-900">${user.balance.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Average Order Value</dt>
                  <dd className="text-sm text-gray-900">
                    ${user.totalOrders > 0 ? (user.totalSpent / user.totalOrders).toFixed(2) : '0.00'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          
          {user.status === 'active' ? (
            <button
              onClick={() => {
                onAction(user.id, 'suspend')
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              Suspend User
            </button>
          ) : (
            <button
              onClick={() => {
                onAction(user.id, 'activate')
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Activate User
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
