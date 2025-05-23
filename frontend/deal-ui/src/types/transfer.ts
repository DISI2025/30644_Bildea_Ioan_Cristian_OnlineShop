import {BaseUser, UserRole} from "./entities.ts";

//<---BaseResponse--->
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

//<---Auth--->
export interface AuthData {
    accessToken: string;
    user: BaseUser;
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

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
    token: string;
}

//<---User--->

export interface AssignProductCategoryRequest {
    userId: string;
    productCategoryIds: string[];
}

export interface UpdateUserRequest {
    id: string;
    username?: string;
    email?: string;
    role?: string;
}

export interface UserProfileUpdateRequest {
    id: string;
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    phoneNumber?: string;
    profileUrl?: string;
    storeAddress?: string;
}

//<---Product Category--->
export interface CreateProductCategoryRequest {
    categoryName: string;
}

export interface UpdateProductCategoryRequest extends CreateProductCategoryRequest {
    id: string;
}

//<---Product--->

export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categories: string[];
}

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categories: string[];
    sellerId: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
    id: string;
}