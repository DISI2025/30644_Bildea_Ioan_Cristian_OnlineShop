import {OrderStatus} from "../utils/constants.ts";

export enum UserRole
{
    USER = "USER",
    ADMIN = "ADMIN",
}
export interface BaseEntity {
    id: string;
}

export interface  User extends BaseEntity {
    username: string;
    role: UserRole;
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