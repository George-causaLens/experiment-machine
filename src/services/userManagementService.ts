import { supabase } from '../supabaseClient';
import { User, UserApprovalRequest, SuperAdminStats } from '../types';

export class UserManagementService {
  /**
   * Get all users (super admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get pending approval requests
   */
  static async getPendingApprovals(): Promise<UserApprovalRequest[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at, status')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get current user's profile
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
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
    const { error } = await supabase.rpc('approve_user', { user_id: userId });
    if (error) throw error;
  }

  /**
   * Reject a user (super admin only)
   */
  static async rejectUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('reject_user', { user_id: userId });
    if (error) throw error;
  }

  /**
   * Suspend a user (super admin only)
   */
  static async suspendUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('suspend_user', { user_id: userId });
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