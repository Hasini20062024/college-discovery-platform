import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user), isAuthenticated: true });
      }
    }
  },
}));

export const useCompareStore = create((set, get) => ({
  selectedColleges: [],
  comparisonResult: null,

  addCollege: (college) => {
    const { selectedColleges } = get();
    if (selectedColleges.length < 4 && !selectedColleges.find((c) => c.id === college.id)) {
      set({ selectedColleges: [...selectedColleges, college] });
    }
  },

  removeCollege: (collegeId) => {
    const { selectedColleges } = get();
    set({ selectedColleges: selectedColleges.filter((c) => c.id !== collegeId) });
  },

  clearSelection: () => set({ selectedColleges: [], comparisonResult: null }),

  setComparisonResult: (result) => set({ comparisonResult: result }),
}));
