// Environment configuration
export const env = {
  /** Whether we're running in production mode */
  isProd: process.env.NODE_ENV === 'production',
  /** Whether we're running in development mode */
  isDev: process.env.NODE_ENV === 'development',
  /** Whether we're running in test mode */
  isTest: process.env.NODE_ENV === 'test',
  /** API base URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  /** Application URL */
  appUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  /** Debug mode */
  debug: process.env.DEBUG === 'true',
} as const;

/** Development-only code guard */
export function devOnly(fn: () => void) {
  if (env.isDev) {
    fn();
  }
}

/** Extended console logging in development */
export const logger = {
  log: (...args: any[]) => {
    if (env.isDev) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (env.isDev) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (env.isDev) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (env.isDev) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (env.debug) {
      console.debug(...args);
    }
  },
} as const;
