/**
 * User Service Implementation
 * 
 * Handles user management, authentication, and profile operations.
 */

import { BaseService } from './BaseService';
import { IUserService } from '../contracts/IDomainServices';
import { ServiceResponse } from '../contracts/IBaseService';
import { User, UserRole } from '../../types';
import { ApiService } from '../../services/apiService';

export class UserService extends BaseService<User> implements IUserService {
  constructor() {
    super('users');
  }

  async getUserProfile(userId: string): Promise<ServiceResponse<User>> {
    try {
      this.logger.info('UserService: Getting user profile', { userId });
      
      const user = await ApiService.getUser(userId);
      
      this.logger.info('UserService: Retrieved user profile', { 
        userId, 
        role: user?.role 
      });
      
      return this.createResponse(user, true);
    } catch (error) {
      this.logger.error('UserService: Failed to get user profile', error);
      return this.createErrorResponse('Failed to retrieve user profile', error);
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ServiceResponse<User>> {
    try {
      this.logger.info('UserService: Updating user profile', { userId, updates: Object.keys(updates) });
      
      const updatedUser = await ApiService.updateUser(userId, updates);
      
      this.logger.info('UserService: User profile updated', { userId });
      return this.createResponse(updatedUser, true);
    } catch (error) {
      this.logger.error('UserService: Failed to update user profile', error);
      return this.createErrorResponse('Failed to update user profile', error);
    }
  }

  async getUsersByRole(role: UserRole): Promise<ServiceResponse<User[]>> {
    try {
      this.logger.info('UserService: Getting users by role', { role });
      
      const users = await ApiService.getUsersByRole(role);
      
      this.logger.info('UserService: Retrieved users by role', { 
        role, 
        count: users.length 
      });
      
      return this.createResponse(users, true);
    } catch (error) {
      this.logger.error('UserService: Failed to get users by role', error);
      return this.createErrorResponse('Failed to retrieve users by role', error);
    }
  }

  async getUsersByOrganization(orgId: string): Promise<ServiceResponse<User[]>> {
    try {
      this.logger.info('UserService: Getting users by organization', { orgId });
      
      const users = await ApiService.getUsersByOrganization(orgId);
      
      this.logger.info('UserService: Retrieved organization users', { 
        orgId, 
        count: users.length 
      });
      
      return this.createResponse(users, true);
    } catch (error) {
      this.logger.error('UserService: Failed to get organization users', error);
      return this.createErrorResponse('Failed to retrieve organization users', error);
    }
  }

  async activateUser(userId: string): Promise<ServiceResponse<User>> {
    try {
      this.logger.info('UserService: Activating user', { userId });
      
      const user = await ApiService.updateUser(userId, { status: 'Active' });
      
      this.logger.info('UserService: User activated', { userId });
      return this.createResponse(user, true);
    } catch (error) {
      this.logger.error('UserService: Failed to activate user', error);
      return this.createErrorResponse('Failed to activate user', error);
    }
  }

  async deactivateUser(userId: string): Promise<ServiceResponse<User>> {
    try {
      this.logger.info('UserService: Deactivating user', { userId });
      
      const user = await ApiService.updateUser(userId, { status: 'Inactive' });
      
      this.logger.info('UserService: User deactivated', { userId });
      return this.createResponse(user, true);
    } catch (error) {
      this.logger.error('UserService: Failed to deactivate user', error);
      return this.createErrorResponse('Failed to deactivate user', error);
    }
  }

  async resetUserPassword(userId: string): Promise<ServiceResponse<boolean>> {
    try {
      this.logger.info('UserService: Resetting user password', { userId });
      
      // This would typically send a password reset email
      await ApiService.resetPassword(userId);
      
      this.logger.info('UserService: Password reset initiated', { userId });
      return this.createResponse(true, true);
    } catch (error) {
      this.logger.error('UserService: Failed to reset password', error);
      return this.createErrorResponse('Failed to reset user password', error);
    }
  }

  async searchUsers(query: string): Promise<ServiceResponse<User[]>> {
    try {
      this.logger.info('UserService: Searching users', { query });
      
      const users = await ApiService.searchUsers(query);
      
      this.logger.info('UserService: User search completed', { 
        query, 
        resultCount: users.length 
      });
      
      return this.createResponse(users, true);
    } catch (error) {
      this.logger.error('UserService: Search failed', error);
      return this.createErrorResponse('Failed to search users', error);
    }
  }
}