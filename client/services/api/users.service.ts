// Users Service
import { User } from '../../types';
import { ApiUser } from '../../shared-types';
import { transformApiUser } from '../../utils/type-transformers';
import { fetchJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const usersService = {
  getAll: async (orgId?: string): Promise<User[]> => {
    const apiUsers = await fetchJson<ApiUser[]>(`/users${buildQueryString({ orgId })}`);
    return apiUsers.map(transformApiUser);
  },

  getById: async (id: string): Promise<User> => {
    const apiUser = await fetchJson<ApiUser>(`/users/${id}`);
    return transformApiUser(apiUser);
  },

  getByEmail: async (email: string): Promise<User> => {
    const apiUser = await fetchJson<ApiUser>(`/users/email/${encodeURIComponent(email)}`);
    return transformApiUser(apiUser);
  },

  update: (id: string, data: Partial<User>) =>
    putJson<User>(`/users/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/users/${id}`),
};
