export interface BaseEntity {
    id: string;
}

export enum UserRole
{
    USER = "USER",
    ADMIN = "ADMIN",
}

export interface  User extends BaseEntity {
    username: string;
    role: UserRole;
}

export interface ProductCategory {
    id: string;
    categoryName: string;
}

export interface Product extends BaseEntity {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
}