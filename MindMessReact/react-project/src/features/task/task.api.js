import api from '../../lib/axios';

export const getTasks = (projectId) => api.get(`tasks/project/${projectId}`).then(res => res.data)
export const createTask = (projectId, data) => api.post(`tasks/project/${projectId}`, data).then(res => res.data)
export const updateTask = (taskId, data) => api.put(`tasks/${taskId}`, data).then(res => res.data)
export const deleteTask = (taskId) => api.delete(`tasks/${taskId}`).then(res => res.data)
export const getTask = (taskId) => api.get(`tasks/${taskId}`).then(res => res.data)
