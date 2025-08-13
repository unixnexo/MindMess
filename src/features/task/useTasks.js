import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from './task.api'

export const useTasks = (projectId) =>
  useQuery({ queryKey: ['tasks', projectId], queryFn: () => getTasks(projectId) })

export const useCreateTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createTask(projectId, data),
    onSuccess: () => qc.invalidateQueries(['tasks', projectId]),
  })
}

export const useUpdateTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => updateTask(id, data),
    onSuccess: () => qc.invalidateQueries(['tasks', projectId]),
  })
}

export const useDeleteTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () => qc.invalidateQueries(['tasks', projectId]),
  })
}
