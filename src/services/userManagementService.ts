import { supabase } from '../supabaseClient';
import { User, UserApprovalRequest, SuperAdminStats } from '../types';

export class UserManagementService {
  /**
   * Get all users (super admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        console.error('Error getting all users:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  /**
   * Get pending approval requests
   */
  static async getPendingApprovals(): Promise<UserApprovalRequest[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        console.error('Error getting pending approvals:', error);
        return [];
      }
      
      return (data || []).filter(u => u.status === 'pending');
    } catch (error) {
      console.error('Error in getPendingApprovals:', error);
      return [];
    }
  }

  /**
   * Get current user's profile with fallback
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      // First try the normal query
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If user doesn't exist in users table, create them
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating entry...');
          return await this.createUserEntry(user);
        }
        
        console.error('Error fetching user:', error);
        // Try fallback approach
        return await this.getCurrentUserFallback(user.id);
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error);
      return await this.getCurrentUserFallback(user.id);
    }
  }

  /**
   * Fallback method to get user data
   */
  private static async getCurrentUserFallback(userId: string): Promise<User | null> {
    try {
      // Try to get user data using RPC function that bypasses RLS
      const { data, error } = await supabase.rpc('get_user_by_id', { user_id: userId });
      
      if (error) {
        console.error('Fallback user lookup failed:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Fallback user lookup error:', error);
      return null;
    }
  }

  /**
   * Create user entry in users table
   */
  private static async createUserEntry(authUser: any): Promise<User | null> {
    try {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email,
          role: 'pending',
          status: 'pending'
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user entry:', createError);
        return null;
      }
      
      return newUser;
    } catch (error) {
      console.error('Error in createUserEntry:', error);
      return null;
    }
  }

  /**
   * Check if current user is approved
   */
  static async isUserApproved(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.status === 'approved';
  }

  /**
   * Check if current user is super admin
   */
  static async isSuperAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'super_admin';
  }

  /**
   * Approve a user (super admin only)
   */
  static async approveUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('update_user_by_admin', { 
      target_user_id: userId,
      new_status: 'approved'
    });
    if (error) throw error;
  }

  /**
   * Reject a user (super admin only)
   */
  static async rejectUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('update_user_by_admin', { 
      target_user_id: userId,
      new_status: 'rejected'
    });
    if (error) throw error;
  }

  /**
   * Suspend a user (super admin only)
   */
  static async suspendUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('update_user_by_admin', { 
      target_user_id: userId,
      new_status: 'suspended'
    });
    if (error) throw error;
  }

  /**
   * Get super admin statistics
   */
  static async getSuperAdminStats(): Promise<SuperAdminStats> {
    const { data, error } = await supabase
      .from('users')
      .select('status');
    
    if (error) throw error;

    const stats = {
      totalUsers: data?.length || 0,
      pendingApprovals: data?.filter(u => u.status === 'pending').length || 0,
      approvedUsers: data?.filter(u => u.status === 'approved').length || 0,
      rejectedUsers: data?.filter(u => u.status === 'rejected').length || 0,
      suspendedUsers: data?.filter(u => u.status === 'suspended').length || 0,
    };

    return stats;
  }

  /**
   * Update user role (super admin only)
   */
  static async updateUserRole(userId: string, role: User['role']): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
  }

  /**
   * Delete user (super admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  }
} 