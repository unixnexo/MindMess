import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(res => res.data)
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });
};

export const useDeleteProject = () => {
 const queryClient = useQueryClient();
 
 return useMutation({
   mutationFn: (id) => api.delete(`/projects/${id}`),
   onSuccess: () => {
     queryClient.invalidateQueries(['projects']);
   }
 });
};