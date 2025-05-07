export const DEAL_ENDPOINTS = {
    BASE: "/api",
    IS: "/is",
    AUTH: "/is/auth"
}

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const AUTH_HEADER = 'Authorization';

export const buildAuthHeader = (token: string): string => `Bearer ${token}`;