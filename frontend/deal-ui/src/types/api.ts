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