import {createApi} from '@reduxjs/toolkit/query/react';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';
import {AUTH_HEADER, buildAuthHeader, DEAL_ENDPOINTS, HTTP_METHOD, TOKEN_KEY} from "../utils/constants.ts";
import Cookies from 'js-cookie';
import {
    AuthData,
    AuthRequest,
    BaseResponse, CreateProductCategoryRequest,
    CreateProductRequest,
    CreateUserRequest,
    DealResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest, UpdateProductCategoryRequest,
    UpdateProductRequest
} from "../types/transfer.ts";
import { Product, ProductCategory } from "../types/entities.ts";

const appBaseQuery = fetchBaseQuery({
    baseUrl: DEAL_ENDPOINTS.BASE, prepareHeaders: (headers: Headers /*{getState}*/) => {
        const token = Cookies.get(TOKEN_KEY) ?? '';
        if (token) {
            headers.set(AUTH_HEADER, buildAuthHeader(token));
        }
        return headers;
    },
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: appBaseQuery,
    tagTypes: ['ProductCategories', 'Products'],
    endpoints: (builder) => ({
        // Auth endpoints
        login: builder.mutation<DealResponse<AuthData>, AuthRequest>({
            query: (request: AuthRequest) => ({
                url: `${DEAL_ENDPOINTS.AUTH}/login`,
                method: HTTP_METHOD.POST,
                body: request,
            }), transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        register: builder.mutation<DealResponse<AuthData>, CreateUserRequest>({
            query: (request: CreateUserRequest) => ({
                url: `${DEAL_ENDPOINTS.AUTH}/register`,
                method: HTTP_METHOD.POST,
                body: request
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        forgotPassword: builder.mutation<DealResponse<unknown>, ForgotPasswordRequest>({
            query: (request) => ({
                url: `${DEAL_ENDPOINTS.AUTH}/forgot-password`,
                method: HTTP_METHOD.POST,
                body: request
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        resetPassword: builder.mutation<DealResponse<unknown>, ResetPasswordRequest>({
            query: (request) => ({
                url: `${DEAL_ENDPOINTS.AUTH}/reset-password`,
                method: HTTP_METHOD.POST,
                body: request
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        // Product Category endpoints
        getProductCategories: builder.query<DealResponse<ProductCategory[]>, void>({
            query: () => DEAL_ENDPOINTS.PRODUCT_CATEGORIES,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getProductCategoryById: builder.query<DealResponse<ProductCategory>, string>({
            query: (id) => `${DEAL_ENDPOINTS.PRODUCT_CATEGORIES}/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        createProductCategory: builder.mutation<DealResponse<ProductCategory>, CreateProductCategoryRequest>({
            query: (request) => ({
                url: DEAL_ENDPOINTS.PRODUCT_CATEGORIES,
                method: HTTP_METHOD.POST,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        updateProductCategory: builder.mutation<DealResponse<ProductCategory>, UpdateProductCategoryRequest>({
            query: (request) => ({
                url: DEAL_ENDPOINTS.PRODUCT_CATEGORIES,
                method: HTTP_METHOD.PATCH,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        deleteProductCategory: builder.mutation<DealResponse<ProductCategory>, string>({
            query: (id) => ({
                url: `${DEAL_ENDPOINTS.PRODUCT_CATEGORIES}/${id}`,
                method: HTTP_METHOD.DELETE,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse
        }),

        // Product endpoints -> //TODO Update the products api after merged be branch
        getProducts: builder.query<DealResponse<Product[]>, void>({
            query: () => DEAL_ENDPOINTS.PRODUCTS,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getProductById: builder.query<DealResponse<Product>, string>({
            query: (id) => `${DEAL_ENDPOINTS.PRODUCTS}/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        createProduct: builder.mutation<DealResponse<Product>, CreateProductRequest>({
            query: (request) => ({
                url: DEAL_ENDPOINTS.PRODUCTS,
                method: HTTP_METHOD.POST,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        updateProduct: builder.mutation<DealResponse<Product>, UpdateProductRequest>({
            query: (request) => ({
                url: DEAL_ENDPOINTS.PRODUCTS,
                method: HTTP_METHOD.PATCH,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        deleteProduct: builder.mutation<DealResponse<Product>, string>({
            query: (id) => ({
                url: `${DEAL_ENDPOINTS.PRODUCTS}/${id}`,
                method: HTTP_METHOD.DELETE,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetProductCategoriesQuery,
    useGetProductCategoryByIdQuery,
    useCreateProductCategoryMutation,
    useUpdateProductCategoryMutation,
    useDeleteProductCategoryMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = api;
