import api from '@/lib/axios';

export const getDrawing = async (projectId) => {
  const res = await api.get(`projects/${projectId}/drawing`)
  return res.data
}

export const saveDrawing = async (projectId, canvasData, method = 'post') => {
  const res = await api[method](`projects/${projectId}/drawing`, { canvasData })
  return res.data
}
