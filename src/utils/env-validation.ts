/**
 * Environment Variables Validation Utility
 * 
 * Comprehensive validation for required environment variables with helpful error messages
 * and fallback values where appropriate.
 */

// ============================================================================
// Environment Variable Types
// ============================================================================

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_NEHTW_API_KEY: string;
  NEXT_PUBLIC_NEHTW_BASE_URL: string;
}

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
  config: Partial<EnvConfig>;
}

// ============================================================================
// Required Environment Variables
// ============================================================================

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_NEHTW_API_KEY',
  'NEXT_PUBLIC_NEHTW_BASE_URL'
] as const;

// ============================================================================
// Fallback Values
// ============================================================================

const FALLBACK_VALUES: Partial<EnvConfig> = {
  NEXT_PUBLIC_NEHTW_BASE_URL: 'https://nehtw.com/api'
};

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates a single environment variable
 */
function validateEnvVar(key: string, value: string | undefined): { isValid: boolean; message?: string } {
  if (!value) {
    return { isValid: false, message: `${key} is not defined` };
  }

  // Specific validations for different variables
  switch (key) {
    case 'NEXT_PUBLIC_SUPABASE_URL':
      if (!value.startsWith('http')) {
        return { isValid: false, message: `${key} must be a valid URL starting with http` };
      }
      if (!value.includes('supabase.co')) {
        return { isValid: false, message: `${key} should be a Supabase project URL` };
      }
      break;

    case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      if (value.length < 50) {
        return { isValid: false, message: `${key} appears to be too short for a valid Supabase key` };
      }
      break;

    case 'NEXT_PUBLIC_NEHTW_API_KEY':
      if (value.length < 10) {
        return { isValid: false, message: `${key} appears to be too short for a valid API key` };
      }
      break;

    case 'NEXT_PUBLIC_NEHTW_BASE_URL':
      if (!value.startsWith('http')) {
        return { isValid: false, message: `${key} must be a valid URL starting with http` };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Validates all required environment variables
 */
export function validateEnvironmentVariables(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  const config: Partial<EnvConfig> = {};

  // Check each required variable
  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    const validation = validateEnvVar(key, value);

    if (!validation.isValid) {
      missing.push(key);
      if (validation.message) {
        warnings.push(validation.message);
      }
    } else {
      config[key as keyof EnvConfig] = value as string;
    }
  }

  // Apply fallback values for missing variables
  for (const [key, fallbackValue] of Object.entries(FALLBACK_VALUES)) {
    if (!config[key as keyof EnvConfig] && fallbackValue) {
      config[key as keyof EnvConfig] = fallbackValue;
      warnings.push(`Using fallback value for ${key}: ${fallbackValue}`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    config
  };
}

/**
 * Logs environment variable validation results
 */
export function logEnvironmentValidation(): void {
  const result = validateEnvironmentVariables();

  console.group('🔧 Environment Variables Validation');

  if (result.isValid) {
    console.log('✅ All required environment variables are present and valid');
  } else {
    console.error('❌ Missing or invalid environment variables:');
    result.missing.forEach(key => {
      console.error(`  - ${key}`);
    });
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    result.warnings.forEach(warning => {
      console.warn(`  - ${warning}`);
    });
  }

  // Log current configuration (without sensitive values)
  console.log('📋 Current Configuration:');
  Object.entries(result.config).forEach(([key, value]) => {
    if (key.includes('KEY') || key.includes('SECRET')) {
      console.log(`  - ${key}: ${value ? '***' + value.slice(-4) : 'undefined'}`);
    } else {
      console.log(`  - ${key}: ${value || 'undefined'}`);
    }
  });

  console.groupEnd();
}

/**
 * Gets validated environment configuration
 */
export function getEnvironmentConfig(): EnvConfig {
  const result = validateEnvironmentVariables();

  if (!result.isValid) {
    const missingVars = result.missing.join(', ');
    throw new Error(
      `Missing required environment variables: ${missingVars}. ` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  return result.config as EnvConfig;
}

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Checks if the application is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Gets the current environment name
 */
export function getEnvironmentName(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Validates environment variables and throws error if invalid
 * Use this in critical parts of the application
 */
export function requireEnvironmentVariables(): EnvConfig {
  const result = validateEnvironmentVariables();

  if (!result.isValid) {
    const errorMessage = [
      '❌ Environment Variables Validation Failed',
      '',
      'Missing variables:',
      ...result.missing.map(key => `  - ${key}`),
      '',
      'Please check your .env.local file and ensure all required variables are set.',
      '',
      'Required variables:',
      ...REQUIRED_ENV_VARS.map(key => `  - ${key}`),
      '',
      'Example .env.local:',
      'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key',
      'NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key',
      'NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api'
    ].join('\n');

    throw new Error(errorMessage);
  }

  return result.config as EnvConfig;
}

/**
 * Safe environment variable getter with fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  return value || fallback;
}

/**
 * Safe environment variable getter that throws if missing
 */
export function requireEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not defined`);
  }
  return value;
}

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Development-only function to print environment status
 */
export function printEnvironmentStatus(): void {
  if (isDevelopment()) {
    logEnvironmentValidation();
  }
}

/**
 * Development-only function to validate environment on startup
 */
export function validateEnvironmentOnStartup(): void {
  if (isDevelopment()) {
    try {
      validateEnvironmentVariables();
      console.log('🚀 Environment validation completed successfully');
    } catch (error) {
      console.error('💥 Environment validation failed:', error);
    }
  }
}

// ============================================================================
// Export Default Configuration
// ============================================================================

const envValidation = {
  validate: validateEnvironmentVariables,
  getConfig: getEnvironmentConfig,
  require: requireEnvironmentVariables,
  log: logEnvironmentValidation,
  isDevelopment,
  isProduction,
  getEnvironmentName,
  getEnvVar,
  requireEnvVar,
  printStatus: printEnvironmentStatus,
  validateOnStartup: validateEnvironmentOnStartup
};

export default envValidation;
