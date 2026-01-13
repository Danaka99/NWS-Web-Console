import React, { useState, useEffect } from 'react';
import { Cloud, Users, Database, HardDrive, Server, Menu, X, Settings, LogOut, Home, Shield, Plus, Trash2, Edit, Play, Square, RefreshCw } from 'lucide-react';
import { identityAPI, storageAPI, blockAPI, computeAPI } from '../services/api';

const NWSConsole = () => {
  const [currentService, setCurrentService] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [identityData, setIdentityData] = useState({
    users: [],
    projects: [],
    roles: []
  });
  const [storageData, setStorageData] = useState({
    containers: []
  });
  const [blockData, setBlockData] = useState({
    volumes: []
  });
  const [computeData, setComputeData] = useState({
    instances: [],
    flavors: [],
    images: []
  });

  // Identity Management Component
  const IdentityManagement = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      description: '',
      enabled: true
    });

    useEffect(() => {
      if (activeTab === 'users') {
        loadUsers();
      } else if (activeTab === 'projects') {
        loadProjects();
      } else if (activeTab === 'roles') {
        loadRoles();
      }
    }, [activeTab]);

    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await identityAPI.getUsers();
        setIdentityData(prev => ({ ...prev, users: response.data.users || [] }));
      } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users. Using demo mode.');
      } finally {
        setLoading(false);
      }
    };

    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await identityAPI.getProjects();
        setIdentityData(prev => ({ ...prev, projects: response.data.projects || [] }));
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadRoles = async () => {
      setLoading(true);
      try {
        const response = await identityAPI.getRoles();
        setIdentityData(prev => ({ ...prev, roles: response.data.roles || [] }));
      } catch (error) {
        console.error('Error loading roles:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleCreateUser = async () => {
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }

      setLoading(true);
      try {
        await identityAPI.createUser(formData);
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', description: '', enabled: true });
        loadUsers();
        alert('User created successfully!');
      } catch (error) {
        console.error('Error creating user:', error);
        // Demo mode fallback
        setIdentityData(prev => ({
          ...prev,
          users: [...prev.users, { ...formData, id: Date.now() }]
        }));
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', description: '', enabled: true });
        alert('User created successfully! (Demo mode)');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteUser = async (userId) => {
      if (!window.confirm('Are you sure you want to delete this user?')) return;
      
      setLoading(true);
      try {
        await identityAPI.deleteUser(userId);
        loadUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      } finally {
        setLoading(false);
      }
    };

    const CreateUserModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Create New User</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description"
                rows="3"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="enabled" className="text-sm text-gray-700">User Enabled</label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Identity and Access Management</h2>
          <p className="text-gray-600">Manage users, projects, and roles using OpenStack Keystone</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex gap-6 px-6">
              {['users', 'projects', 'roles'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-3">Loading...</p>
              </div>
            )}

            {!loading && activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Users</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Create User
                  </button>
                </div>

                {identityData.users.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-4">No users created yet</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create your first user
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {identityData.users.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                                <Edit size={16} className="inline" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                <Trash2 size={16} className="inline" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'projects' && (
              <div className="text-center py-12">
                <Database size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Projects management</p>
                <p className="text-sm text-gray-500">
                  {identityData.projects.length} projects available
                </p>
              </div>
            )}

            {!loading && activeTab === 'roles' && (
              <div className="text-center py-12">
                <Shield size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Roles management</p>
                <p className="text-sm text-gray-500">
                  {identityData.roles.length} roles available
                </p>
              </div>
            )}
          </div>
        </div>

        {showCreateModal && <CreateUserModal />}
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">NuGenesis Web Services Console</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { name: 'Identity', icon: Shield, color: 'blue', service: 'identity', desc: 'Keystone IAM' },
          { name: 'Object Storage', icon: Database, color: 'green', service: 'storage', desc: 'Swift Storage' },
          { name: 'Block Storage', icon: HardDrive, color: 'purple', service: 'block', desc: 'Cinder Volumes' },
          { name: 'Compute', icon: Server, color: 'orange', service: 'compute', desc: 'Nova Instances' }
        ].map(item => (
          <button
            key={item.name}
            onClick={() => setCurrentService(item.service)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left group"
          >
            <item.icon className={`text-${item.color}-600 mb-3 group-hover:scale-110 transition-transform`} size={32} />
            <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-blue-600" />
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-lg">{identityData.users.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-semibold text-lg">{identityData.projects.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Compute Instances</span>
              <span className="font-semibold text-lg">{computeData.instances.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-gray-800">Set up Identity Management</p>
                <p className="text-sm text-gray-600">Create users, projects, and manage access with Keystone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-gray-800">Configure Storage</p>
                <p className="text-sm text-gray-600">Set up object and block storage for your applications</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-gray-800">Launch Compute Instances</p>
                <p className="text-sm text-gray-600">Deploy virtual machines with Nova compute service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Welcome to NuGenesis Web Services</h3>
        <p className="mb-4">Your OpenStack-powered cloud infrastructure management platform</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
          View Documentation
        </button>
      </div>
    </div>
  );

  const ServicePlaceholder = ({ title, icon: Icon, description }) => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Icon size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-sm text-gray-500 mt-2">OpenStack integration ready</p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Configure Service
        </button>
      </div>
    </div>
  );

  const services = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'identity', name: 'Identity (Keystone)', icon: Shield },
    { id: 'storage', name: 'Object Storage (Swift)', icon: Database },
    { id: 'block', name: 'Block Storage (Cinder)', icon: HardDrive },
    { id: 'compute', name: 'Compute (Nova)', icon: Server }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <Cloud size={32} className="text-blue-400" />
            <div>
              <h1 className="font-bold text-lg">NuGenesis</h1>
              <p className="text-xs text-gray-400">Web Services</p>
            </div>
          </div>

          <nav className="space-y-1">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setCurrentService(service.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentService === service.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <service.icon size={20} />
                <span className="text-sm">{service.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Region: us-east-1
            </span>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              NWS
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {currentService === 'dashboard' && <Dashboard />}
          {currentService === 'identity' && <IdentityManagement />}
          {currentService === 'storage' && <ServicePlaceholder title="Object Storage (Swift)" icon={Database} description="Manage containers and objects with OpenStack Swift" />}
          {currentService === 'block' && <ServicePlaceholder title="Block Storage (Cinder)" icon={HardDrive} description="Create and manage block volumes with OpenStack Cinder" />}
          {currentService === 'compute' && <ServicePlaceholder title="Compute (Nova)" icon={Server} description="Launch and manage virtual machine instances with OpenStack Nova" />}
        </div>
      </div>
    </div>
  );
};

export default NWSConsole;