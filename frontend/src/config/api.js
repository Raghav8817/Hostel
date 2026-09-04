// Centralized API configuration
// In development: defaults to http://localhost:3000
// In production (e.g. Vercel build): defaults to /api unless VITE_API_URL is specified
export const BASE_URL = 
    import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? "http://localhost:3000" : "/api");
