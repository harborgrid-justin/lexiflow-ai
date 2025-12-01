// Authentication Service
import { User } from '../../types';
import { fetchJson, postJson } from '../http-client';

export const authService = {
  login: (email: string, password: string) =>
    postJson<{ access_token: string; user: User }>('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_id?: string;
  }) => postJson<User>('/auth/register', userData),

  getCurrentUser: () => fetchJson<User>('/auth/me'),

  logout: () => postJson<void>('/auth/logout', {}),
};
