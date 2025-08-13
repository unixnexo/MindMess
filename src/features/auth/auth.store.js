import { create } from 'zustand';

export const useAuth = create((set) => {
    
  // try to load from localStorage on init
  const token = localStorage.getItem('token');

  return {
    user: null,
    token,

    login: (user, token) => {
      localStorage.setItem('token', token);
      set({ user, token });
    },

    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    },
  };
});
