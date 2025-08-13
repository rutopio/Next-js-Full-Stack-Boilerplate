// Security filter for removing sensitive data from API responses and logs

export interface SensitiveDataFilter {
  // List of fields to always remove
  sensitiveFields: string[];
  // Custom filter function
  customFilter?: (obj: any) => any;
}

const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'salt',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'privateKey',
  'ssn',
  'creditCard',
  'cvv',
  'pin',
];

export class SecurityFilter {
  private sensitiveFields: Set<string>;
  private customFilter?: (obj: any) => any;

  constructor(config?: SensitiveDataFilter) {
    this.sensitiveFields = new Set([
      ...DEFAULT_SENSITIVE_FIELDS,
      ...(config?.sensitiveFields || [])
    ]);
    this.customFilter = config?.customFilter;
  }

  // Remove sensitive data from objects
  filterObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.filterObject(item));
    }

    if (typeof obj === 'object') {
      const filtered: any = {};
      
      for (const [key, value] of Object.entries(obj)) {
        if (this.sensitiveFields.has(key.toLowerCase())) {
          filtered[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          filtered[key] = this.filterObject(value);
        } else {
          filtered[key] = value;
        }
      }

      // Apply custom filter if provided
      return this.customFilter ? this.customFilter(filtered) : filtered;
    }

    return obj;
  }

  // Filter user object specifically (common use case)
  filterUser(user: any): any {
    if (!user) return user;

    const filtered = this.filterObject(user);
    
    // Additional user-specific filtering
    if (filtered.email) {
      // Optionally mask part of email for logs
      const [localPart, domain] = filtered.email.split('@');
      if (localPart && domain) {
        filtered.emailMasked = `${localPart.slice(0, 2)}***@${domain}`;
      }
    }

    return filtered;
  }

  // Filter for logging purposes (more aggressive)
  filterForLogging(obj: any): any {
    const filtered = this.filterObject(obj);
    
    // Additional fields to remove in logs
    const logSensitiveFields = ['email', 'phone', 'address', 'ip'];
    
    if (typeof filtered === 'object' && filtered !== null) {
      for (const field of logSensitiveFields) {
        if (filtered[field]) {
          filtered[field] = '[REDACTED]';
        }
      }
    }

    return filtered;
  }

  // Check if a string contains sensitive patterns
  containsSensitiveData(text: string): boolean {
    if (typeof text !== 'string') return false;

    const sensitivePatterns = [
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/, // Phone
      /\b[A-Za-z0-9+/]{40,}={0,2}\b/, // Base64 tokens (rough)
    ];

    return sensitivePatterns.some(pattern => pattern.test(text));
  }

  // Sanitize string for safe display
  sanitizeString(text: string): string {
    if (typeof text !== 'string') return '';

    return text
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/['";]/g, '') // Remove potential injection
      .trim();
  }
}

// Default instance
export const securityFilter = new SecurityFilter();

// Helper functions
export function filterSensitiveData(obj: any): any {
  return securityFilter.filterObject(obj);
}

export function filterUserData(user: any): any {
  return securityFilter.filterUser(user);
}

export function filterForLogging(obj: any): any {
  return securityFilter.filterForLogging(obj);
}

export function sanitizeInput(text: string): string {
  return securityFilter.sanitizeString(text);
}