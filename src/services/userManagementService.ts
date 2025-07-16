import { supabase } from '../supabaseClient';
import { User, UserApprovalRequest, SuperAdminStats } from '../types';

export class UserManagementService {
  // Get all users (super admin only)
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
    
    return data || [];
  }

  // Get super admin statistics
  static async getSuperAdminStats(): Promise<SuperAdminStats> {
    const { data, error } = await supabase.rpc('get_super_admin_stats');
    
    if (error) {
      console.error('Error fetching super admin stats:', error);
      throw new Error('Failed to fetch super admin stats');
    }
    
    if (!data || data.length === 0) {
      return {
        totalUsers: 0,
        pendingApprovals: 0,
        approvedUsers: 0,
        rejectedUsers: 0,
        suspendedUsers: 0
      };
    }
    
    const stats = data[0];
    return {
      totalUsers: parseInt(stats.total_users) || 0,
      pendingApprovals: parseInt(stats.pending_approvals) || 0,
      approvedUsers: parseInt(stats.approved_users) || 0,
      rejectedUsers: parseInt(stats.rejected_users) || 0,
      suspendedUsers: parseInt(stats.suspended_users) || 0
    };
  }

  // Get pending approval requests
  static async getPendingApprovals(): Promise<UserApprovalRequest[]> {
    const { data, error } = await supabase.rpc('get_pending_approvals');
    
    if (error) {
      console.error('Error fetching pending approvals:', error);
      throw new Error('Failed to fetch pending approvals');
    }
    
    return (data || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: new Date(user.created_at),
      status: 'pending' as const
    }));
  }

  // Get current user's profile
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      // Try to get user data from the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching current user:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  // Check if current user is super admin
  static async isSuperAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === 'super_admin' && user?.status === 'approved';
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  }

  // Check if current user is approved
  static async isUserApproved(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.status === 'approved';
    } catch (error) {
      console.error('Error checking user approval status:', error);
      return false;
    }
  }

  // Approve a user
  static async approveUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('approve_user', { user_id: userId });
    
    if (error) {
      console.error('Error approving user:', error);
      throw new Error('Failed to approve user');
    }
  }

  // Reject a user
  static async rejectUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('reject_user', { user_id: userId });
    
    if (error) {
      console.error('Error rejecting user:', error);
      throw new Error('Failed to reject user');
    }
  }

  // Suspend a user
  static async suspendUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('suspend_user', { user_id: userId });
    
    if (error) {
      console.error('Error suspending user:', error);
      throw new Error('Failed to suspend user');
    }
  }

  // Update user by admin
  static async updateUserByAdmin(
    userId: string, 
    updates: { role?: string; status?: string; full_name?: string }
  ): Promise<void> {
    const { error } = await supabase.rpc('update_user_by_admin', {
      target_user_id: userId,
      new_role: updates.role || null,
      new_status: updates.status || null,
      new_full_name: updates.full_name || null
    });
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }
} 