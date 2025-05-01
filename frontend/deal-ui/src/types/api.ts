// TODO Adapt it here only on the features for be integration. This is only a draft code base

// Generic API Types
export type DealError = {
  message: string;
}

export interface DealResponseBody<T = unknown> {
  message: string;
  status: number;
  payload?: T;
  errors?: DealError[];
}

export interface DealResponse<T = unknown> {
  body: DealResponseBody<T>;
  message: string;
  status: number;
  headers: Record<string, string>;
}

// Auth Types
export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface RegisterResponse {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HTTPStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type APIStatus = typeof API_STATUS[keyof typeof API_STATUS]; 