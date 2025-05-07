import {User, UserRole} from "./entities.ts";

export interface BaseResponse {
    status: number;
    message: string;
    errors: DealError[] | null;
}

export interface DealResponse<T> extends BaseResponse {
    payload: T;
}

export type DealError = {
    message: string;
}

export interface AuthData
{
    token: string;
    user: User;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    role: UserRole;
}