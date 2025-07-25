import { create } from 'zustand';

export const useAuth = create(set => ({
    user: null,
    token: null,

    login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
    },
    
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));
