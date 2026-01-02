import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User, AuthState, AuthResponse } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('fetchUser - Token exists:', !!token);

      if (!token) {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null }));
        return;
      }

      const response = await api.get('/profile');
      console.log('fetchUser - Profile response:', response.data);

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          user: response.data.data,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        // Token invalid or other error
        console.log('fetchUser - Profile failed, clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState(prev => ({ ...prev, user: null, token: null, isAuthenticated: false, isLoading: false }));
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile', error);

      // Only clear token if it's a 401 Unauthorized error
      if (error.response?.status === 401) {
        console.log('fetchUser - 401 Unauthorized, clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState(prev => ({ ...prev, user: null, token: null, isAuthenticated: false, isLoading: false }));
      } else {
        // Network error or other issues - keep the token but set as not authenticated
        console.log('fetchUser - Network or other error, keeping token');
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials: any) => {
    const response = await api.post<AuthResponse>('/login', credentials);
    console.log(response);
    if (response.data.success) {
      const { user, access_token } = response.data.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.log(response.data.message);
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    const response = await api.post<AuthResponse>('/register', data);
    if (response.data.success) {
      // Depending on API response, we might auto-login or just return success
      // If the API returns a token on register, we can login immediately:
      if (response.data.data?.access_token) {
        const { user, access_token } = response.data.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setState({
          user,
          token: access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    }
    return response;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateUser = (user: User) => {
    setState(prev => ({ ...prev, user }));
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
