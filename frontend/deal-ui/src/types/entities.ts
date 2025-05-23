import {OrderStatus} from "../utils/constants.ts";

export enum UserRole
{
    USER = "USER",
    ADMIN = "ADMIN",
}
export interface BaseEntity {
    id: string;
}

export interface BaseUser extends BaseEntity {
    username: string;
    role: UserRole;
}

export interface  MainUser extends BaseUser {
    email: string;
    createdAt: string;
    productCategories: ProductCategory[];
    fullName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    profileUrl: string;
    storeAddress: string;
}

export interface ProductCategory extends BaseEntity {
    categoryName: string;
}

export interface Product extends BaseEntity {
    title: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categories: ProductCategory[];
    sellerId: string;
}

export interface Order extends BaseEntity {
    buyerId: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
}

export interface OrderItem extends BaseEntity {
    orderId: string;
    quantity: number;
    product: Product;
}