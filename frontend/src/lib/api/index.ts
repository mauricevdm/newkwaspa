/**
 * API Provider Factory
 * 
 * Central entry point for the pluggable API layer.
 * Automatically selects the appropriate provider based on configuration.
 * 
 * Usage:
 * ```ts
 * import { api } from '@/lib/api';
 * 
 * // Get products
 * const products = await api.products.getProducts({ page: 1 });
 * 
 * // Add to cart
 * await api.cart.addToCart(productId, 1);
 * 
 * // Login
 * const { user, tokens } = await api.auth.login(email, password);
 * ```
 * 
 * Configuration:
 * Set NEXT_PUBLIC_API_PROVIDER environment variable:
 * - 'mock' (default): Use mock data for development
 * - 'magento': Use Magento 2 backend
 */

import type { ApiProvider, ProviderConfig, ProviderFactory } from './interface';
import { createMockProvider } from './providers/mock';
import { createMagentoProvider } from './providers/magento';

// Re-export types for convenience
export * from './types';
export * from './interface';

// ============================================================================
// Provider Registry
// ============================================================================

type ProviderName = 'mock' | 'magento';

const providerFactories: Record<ProviderName, ProviderFactory> = {
  mock: createMockProvider,
  magento: createMagentoProvider,
};

// ============================================================================
// Provider Instance Management
// ============================================================================

let currentProvider: ApiProvider | null = null;
let currentProviderName: ProviderName | null = null;

/**
 * Get the current API provider name from environment
 */
function getProviderName(): ProviderName {
  const envProvider = process.env.NEXT_PUBLIC_API_PROVIDER as ProviderName | undefined;
  
  // Validate provider name
  if (envProvider && providerFactories[envProvider]) {
    return envProvider;
  }
  
  // Default to mock
  return 'mock';
}

/**
 * Get the API provider instance
 * Creates the provider on first call, then returns cached instance
 */
export function getApiProvider(config?: ProviderConfig): ApiProvider {
  const providerName = getProviderName();
  
  // Return cached provider if same type
  if (currentProvider && currentProviderName === providerName) {
    return currentProvider;
  }
  
  // Create new provider
  const factory = providerFactories[providerName];
  if (!factory) {
    throw new Error(`Unknown API provider: ${providerName}`);
  }
  
  currentProvider = factory(config);
  currentProviderName = providerName;
  
  console.log(`API Provider initialized: ${providerName}`);
  
  return currentProvider;
}

/**
 * Reset the provider instance
 * Useful for testing or switching providers at runtime
 */
export function resetApiProvider(): void {
  currentProvider = null;
  currentProviderName = null;
}

/**
 * Register a custom provider factory
 * Allows extending the system with new backends
 */
export function registerProvider(name: string, factory: ProviderFactory): void {
  (providerFactories as Record<string, ProviderFactory>)[name] = factory;
}

// ============================================================================
// Default Export - Singleton API Instance
// ============================================================================

/**
 * Default API instance
 * Use this for most cases - automatically uses the configured provider
 */
export const api = new Proxy({} as ApiProvider, {
  get(_, prop: keyof ApiProvider) {
    const provider = getApiProvider();
    return provider[prop];
  },
});

export default api;
