import { create } from 'zustand';

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email;
  } catch {
    return null;
  }
};

export const useAuth = create((set) => {
  const token = localStorage.getItem('token');
  const user = getUserFromToken(token);

  return {
    user,
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