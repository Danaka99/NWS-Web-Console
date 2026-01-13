import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['X-Auth-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Identity Service (Keystone)
export const identityAPI = {
  authenticate: (credentials) => api.post('/identity/auth', credentials),
  getUsers: () => api.get('/identity/users'),
  createUser: (userData) => api.post('/identity/users', userData),
  updateUser: (id, userData) => api.patch(`/identity/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/identity/users/${id}`),
  getProjects: () => api.get('/identity/projects'),
  createProject: (projectData) => api.post('/identity/projects', projectData),
  getRoles: () => api.get('/identity/roles'),
};

// Object Storage Service (Swift)
export const storageAPI = {
  listContainers: (projectId) => api.get('/storage/containers', { params: { project_id: projectId } }),
  createContainer: (containerData) => api.post('/storage/containers', containerData),
  deleteContainer: (name, projectId) => api.delete(`/storage/containers/${name}`, { params: { project_id: projectId } }),
  listObjects: (container, projectId) => api.get(`/storage/containers/${container}/objects`, { params: { project_id: projectId } }),
  uploadObject: (container, objectName, data, projectId) => api.put(`/storage/containers/${container}/objects/${objectName}`, data, { params: { project_id: projectId } }),
  deleteObject: (container, objectName, projectId) => api.delete(`/storage/containers/${container}/objects/${objectName}`, { params: { project_id: projectId } }),
};

// Block Storage Service (Cinder)
export const blockAPI = {
  listVolumes: (projectId) => api.get('/block/volumes', { params: { project_id: projectId } }),
  createVolume: (volumeData) => api.post('/block/volumes', volumeData),
  getVolume: (id, projectId) => api.get(`/block/volumes/${id}`, { params: { project_id: projectId } }),
  deleteVolume: (id, projectId) => api.delete(`/block/volumes/${id}`, { params: { project_id: projectId } }),
  listVolumeTypes: (projectId) => api.get('/block/types', { params: { project_id: projectId } }),
  createSnapshot: (snapshotData) => api.post('/block/snapshots', snapshotData),
};

// Compute Service (Nova)
export const computeAPI = {
  listInstances: () => api.get('/compute/instances'),
  createInstance: (instanceData) => api.post('/compute/instances', instanceData),
  getInstance: (id) => api.get(`/compute/instances/${id}`),
  deleteInstance: (id) => api.delete(`/compute/instances/${id}`),
  startInstance: (id) => api.post(`/compute/instances/${id}/start`),
  stopInstance: (id) => api.post(`/compute/instances/${id}/stop`),
  rebootInstance: (id, type) => api.post(`/compute/instances/${id}/reboot`, { type }),
  listFlavors: () => api.get('/compute/flavors'),
  listImages: () => api.get('/compute/images'),
};

export default api;