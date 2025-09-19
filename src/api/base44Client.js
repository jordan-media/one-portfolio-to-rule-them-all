import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68a0d4d0bc543c79d8cbfd4e", 
  requiresAuth: true // Ensure authentication is required for all operations
});
