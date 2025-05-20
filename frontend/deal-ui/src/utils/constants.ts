export const DEAL_ENDPOINTS = {
    BASE: "/api",
    IS: "/is",
    PS: "/ps",
    PRODUCT_CATEGORIES: "/ps/product-categories",
    PRODUCTS: "/ps/products",
    AUTH: "/is/auth"
}

export const HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE"
}
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const AUTH_HEADER = 'Authorization';

export const buildAuthHeader = (token: string): string => `Bearer ${token}`;