import { LogEntry, LogLevel, ServiceName, SERVICES } from './types';

function generateId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateTraceId(): string {
  return `trace_${Math.random().toString(36).substring(2, 11)}`;
}

// Weighted random for realistic log level distribution
function randomLevel(): LogLevel {
  const rand = Math.random();
  if (rand < 0.05) return 'error';      // 5% errors
  if (rand < 0.15) return 'warn';       // 10% warnings
  if (rand < 0.60) return 'info';       // 45% info
  return 'debug';                        // 40% debug
}

function randomService(): ServiceName {
  return SERVICES[Math.floor(Math.random() * SERVICES.length)];
}

const LOG_TEMPLATES: Record<ServiceName, Record<LogLevel, { messages: string[]; metadata?: () => Record<string, unknown> }>> = {
  'api-gateway': {
    error: {
      messages: [
        'Request timeout after 30000ms',
        'Upstream service unavailable',
        'Rate limit exceeded for client',
        'Invalid request body: JSON parse error',
        'SSL certificate verification failed',
      ],
      metadata: () => ({
        statusCode: [500, 502, 503, 504][Math.floor(Math.random() * 4)],
        path: ['/api/users', '/api/orders', '/api/products', '/api/auth'][Math.floor(Math.random() * 4)],
        method: 'POST',
        duration: Math.floor(Math.random() * 30000) + 1000,
      }),
    },
    warn: {
      messages: [
        'Slow response time detected',
        'Retry attempt 2/3 for upstream request',
        'High memory usage detected',
        'Connection pool nearing capacity',
      ],
      metadata: () => ({
        responseTime: Math.floor(Math.random() * 5000) + 1000,
        threshold: 1000,
      }),
    },
    info: {
      messages: [
        'GET /api/users completed',
        'POST /api/orders completed',
        'GET /api/products completed',
        'Request routed to auth-service',
        'Health check passed',
      ],
      metadata: () => ({
        statusCode: 200,
        duration: Math.floor(Math.random() * 500),
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
      }),
    },
    debug: {
      messages: [
        'Parsing request headers',
        'Validating JWT token',
        'Adding CORS headers',
        'Request body size: 1.2KB',
        'Cache miss for route config',
      ],
    },
  },
  'auth-service': {
    error: {
      messages: [
        'Authentication failed: invalid credentials',
        'Token refresh failed: expired refresh token',
        'OAuth callback error: invalid state',
        'Password hash verification failed',
        'Account locked due to multiple failed attempts',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
        attempts: Math.floor(Math.random() * 5) + 1,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      }),
    },
    warn: {
      messages: [
        'Suspicious login attempt detected',
        'Password strength below minimum requirements',
        'Session approaching expiration',
        'Multiple devices detected for user',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
        location: ['US', 'UK', 'DE', 'JP'][Math.floor(Math.random() * 4)],
      }),
    },
    info: {
      messages: [
        'User login successful',
        'Password reset email sent',
        'New user registered',
        'Session created',
        'Token refreshed successfully',
        'Two-factor authentication enabled',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
      }),
    },
    debug: {
      messages: [
        'Validating email format',
        'Checking password against policy',
        'Loading user permissions',
        'Generating JWT claims',
      ],
    },
  },
  'payment-service': {
    error: {
      messages: [
        'Payment declined: insufficient funds',
        'Stripe API error: card_declined',
        'Refund failed: transaction not found',
        'Currency conversion failed',
        'Payment gateway timeout',
      ],
      metadata: () => ({
        amount: (Math.random() * 1000).toFixed(2),
        currency: 'USD',
        transactionId: `txn_${Math.random().toString(36).substring(2, 12)}`,
        errorCode: ['card_declined', 'insufficient_funds', 'processing_error'][Math.floor(Math.random() * 3)],
      }),
    },
    warn: {
      messages: [
        'High-value transaction requires review',
        'Multiple failed payment attempts',
        'Unusual payment pattern detected',
        'Payment processor latency high',
      ],
      metadata: () => ({
        amount: (Math.random() * 5000 + 1000).toFixed(2),
        currency: 'USD',
      }),
    },
    info: {
      messages: [
        'Payment processed successfully',
        'Subscription renewed',
        'Refund initiated',
        'Invoice generated',
        'Payment method added',
      ],
      metadata: () => ({
        amount: (Math.random() * 500).toFixed(2),
        currency: 'USD',
        transactionId: `txn_${Math.random().toString(36).substring(2, 12)}`,
      }),
    },
    debug: {
      messages: [
        'Validating card number format',
        'Calculating tax for region',
        'Applying discount code',
        'Building payment intent',
      ],
    },
  },
  'user-service': {
    error: {
      messages: [
        'Failed to update user profile',
        'Email already in use',
        'User not found',
        'Profile image upload failed',
        'Data validation error',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
        field: ['email', 'phone', 'address'][Math.floor(Math.random() * 3)],
      }),
    },
    warn: {
      messages: [
        'User preferences migration needed',
        'Profile completeness below 50%',
        'Inactive user detected',
        'Email bounce detected',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
      }),
    },
    info: {
      messages: [
        'Profile updated successfully',
        'Email preferences saved',
        'Avatar uploaded',
        'Account settings changed',
        'Notification sent to user',
      ],
      metadata: () => ({
        userId: `user_${Math.random().toString(36).substring(2, 8)}`,
      }),
    },
    debug: {
      messages: [
        'Loading user preferences',
        'Validating phone number format',
        'Compressing profile image',
        'Checking username availability',
      ],
    },
  },
  'database': {
    error: {
      messages: [
        'Connection pool exhausted',
        'Query timeout after 30s',
        'Deadlock detected',
        'Foreign key constraint violation',
        'Replication lag critical',
      ],
      metadata: () => ({
        query: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'][Math.floor(Math.random() * 4)],
        table: ['users', 'orders', 'products', 'sessions'][Math.floor(Math.random() * 4)],
        duration: Math.floor(Math.random() * 30000) + 5000,
      }),
    },
    warn: {
      messages: [
        'Slow query detected',
        'Connection pool at 80% capacity',
        'Index scan on large table',
        'Replication lag increasing',
      ],
      metadata: () => ({
        duration: Math.floor(Math.random() * 5000) + 1000,
        threshold: 1000,
      }),
    },
    info: {
      messages: [
        'Query executed successfully',
        'Connection established',
        'Transaction committed',
        'Backup completed',
        'Index created',
      ],
      metadata: () => ({
        duration: Math.floor(Math.random() * 100),
        rowsAffected: Math.floor(Math.random() * 100),
      }),
    },
    debug: {
      messages: [
        'Preparing statement',
        'Acquiring connection from pool',
        'Beginning transaction',
        'Releasing connection to pool',
      ],
    },
  },
};

export function generateLog(overrides?: Partial<LogEntry>): LogEntry {
  const service = overrides?.service as ServiceName || randomService();
  const level = overrides?.level || randomLevel();
  const templates = LOG_TEMPLATES[service][level];
  const message = overrides?.message || templates.messages[Math.floor(Math.random() * templates.messages.length)];

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    traceId: Math.random() > 0.3 ? generateTraceId() : undefined,
    metadata: templates.metadata?.(),
    ...overrides,
  };
}

export function generateBatchLogs(count: number = 50): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    // Spread logs over the last 30 minutes
    const timestamp = new Date(now - Math.random() * 30 * 60 * 1000).toISOString();
    logs.push(generateLog({ timestamp }));
  }

  // Sort by timestamp descending (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
