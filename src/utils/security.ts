// Security utilities for The Experiment Machine
export class SecurityUtils {
  /**
   * Sanitize user input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate experiment data
   */
  static validateExperimentData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Experiment name must be at least 3 characters long');
    }
    
    if (!data.blueprintId) {
      errors.push('Blueprint is required');
    }
    
    if (!data.targetAudience || data.targetAudience.trim().length < 5) {
      errors.push('Target audience must be at least 5 characters long');
    }
    
    if (!data.endDate || new Date(data.endDate) <= new Date()) {
      errors.push('End date must be in the future');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate blueprint data
   */
  static validateBlueprintData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Blueprint name must be at least 3 characters long');
    }
    
    if (!data.industry) {
      errors.push('Industry is required');
    }
    
    if (!data.targetRole) {
      errors.push('Target role is required');
    }
    
    if (!data.companySize) {
      errors.push('Company size is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate ICP profile data
   */
  static validateICPProfileData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Profile name must be at least 3 characters long');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (!data.jobTitles || data.jobTitles.length === 0) {
      errors.push('At least one job title is required');
    }
    
    if (!data.industries || data.industries.length === 0) {
      errors.push('At least one industry is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(html: string): string {
    if (!html) return '';
    
    // Remove all HTML tags
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Rate limiting helper
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, { count: number; resetTime: number }>();
    
    return (identifier: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(identifier);
      
      if (!userRequests || now > userRequests.resetTime) {
        requests.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
      }
      
      if (userRequests.count >= maxRequests) {
        return false;
      }
      
      userRequests.count++;
      return true;
    };
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate token format
   */
  static isValidToken(token: string): boolean {
    if (!token) return false;
    // Basic JWT format validation
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return jwtRegex.test(token);
  }
} 