import {createApi} from '@reduxjs/toolkit/query/react';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';
import {AUTH_HEADER, buildAuthHeader, DEAL_ENDPOINTS, HTTP_METHOD, TOKEN_KEY} from "../utils/constants.ts";
import Cookies from 'js-cookie';
import {
    AssignProductCategoryRequest,
    AuthData,
    AuthRequest,
    BaseResponse, CreateOrderRequest, CreatePaymentIntentRequest, CreateProductCategoryRequest,
    CreateProductRequest,
    CreateUserRequest,
    DealResponse,
    ForgotPasswordRequest,
    PaymentIntentResponse,
    ProductsFilter,
    ResetPasswordRequest, UpdateProductCategoryRequest,
    UpdateProductRequest,
    UpdateUserRequest,
    UserProfileUpdateRequest
} from "../types/transfer.ts";
import {Order, Product, ProductCategory, MainUser} from "../types/entities.ts";

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
    tagTypes: ['ProductCategories', 'Products', 'Users'],
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

        // User endpoints
        getUsers: builder.query<DealResponse<MainUser[]>, void>({
            query: () => DEAL_ENDPOINTS.USERS,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getUserById: builder.query<DealResponse<MainUser>, string>({
            query: (id) => `${DEAL_ENDPOINTS.USERS}/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getUserProfile: builder.query<DealResponse<MainUser>, string>({
            query: (id) => `${DEAL_ENDPOINTS.USERS}/profile/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
            providesTags: ['Users'],
        }),

        updateUserProfile: builder.mutation<DealResponse<MainUser>, UserProfileUpdateRequest & UpdateUserRequest>({
            query: ({ id, username, email, role, ...profileData }) => ({
                url: `${DEAL_ENDPOINTS.USERS}?${new URLSearchParams(Object.entries(profileData).filter(([_, v]) => v != null)).toString()}`,
                method: HTTP_METHOD.PATCH,
                body: { id, username, email, role },
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
            invalidatesTags: ['Users'],
        }),

        assignUserCategories: builder.mutation<DealResponse<MainUser>, AssignProductCategoryRequest>({
            query: (request) => ({
                url: `${DEAL_ENDPOINTS.USERS}/user-categories`,
                method: HTTP_METHOD.PATCH,
                body: request,
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

        // Product endpoints
        getProducts: builder.query<DealResponse<Product[]>, void>({
            query: () => `${DEAL_ENDPOINTS.PRODUCTS}?size=2147483647`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getProductsPaginated: builder.query<DealResponse<Product[]>, ProductsFilter>({
            query: (filter) => {
                const params = new URLSearchParams();
                
                if (filter.property) params.append('property', filter.property);
                if (filter.search) params.append('search', filter.search);
                if (filter.sort) params.append('sort', filter.sort);
                if (filter.page !== undefined) params.append('page', filter.page.toString());
                if (filter.size !== undefined) params.append('size', filter.size.toString());
                
                const queryString = params.toString();
                return queryString ? `${DEAL_ENDPOINTS.PRODUCTS}?${queryString}` : DEAL_ENDPOINTS.PRODUCTS;
            },
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getProductById: builder.query<DealResponse<Product>, string>({
            query: (id) => `${DEAL_ENDPOINTS.PRODUCTS}/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getProductsBySellerId: builder.query<DealResponse<Product[]>, string>({
            query: (sellerId) => `${DEAL_ENDPOINTS.PRODUCTS}/seller?id=${sellerId}`,
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

        // Order endpoints
        getOrders: builder.query<DealResponse<Order[]>, void>({
            query: () => DEAL_ENDPOINTS.ORDERS,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        getOrdersByBuyerId: builder.query<DealResponse<Order[]>, string>({
            query: (buyerId) => `${DEAL_ENDPOINTS.ORDERS}/buyer?id=${buyerId}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),
        getOrderById: builder.query<DealResponse<Order>, string>({
            query: (id) => `${DEAL_ENDPOINTS.ORDERS}/${id}`,
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),
        createOrder: builder.mutation<DealResponse<Order>, CreateOrderRequest>({
            query: (request) => ({
                url: DEAL_ENDPOINTS.ORDERS,
                method: HTTP_METHOD.POST,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),
        createPaymentIntent: builder.mutation<DealResponse<PaymentIntentResponse>, CreatePaymentIntentRequest>({
            query: (request) => ({
                url: `${DEAL_ENDPOINTS.ORDERS}/payment-intent`,
                method: HTTP_METHOD.POST,
                body: request,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),
        deleteOrder: builder.mutation<DealResponse<Order>, string>({
            query: (id) => ({
                url: `${DEAL_ENDPOINTS.ORDERS}/${id}`,
                method: HTTP_METHOD.DELETE,
            }),
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        // Recommendation endpoints
        getRecommendedProducts: builder.query<DealResponse<Product[]>, { userId: string; filter?: ProductsFilter }>({
            query: ({ userId, filter }) => {
                const params = new URLSearchParams();
                
                if (filter?.property) params.append('property', filter.property);
                if (filter?.search) params.append('search', filter.search);
                if (filter?.sort) params.append('sort', filter.sort);
                if (filter?.page !== undefined) params.append('page', filter.page.toString());
                if (filter?.size !== undefined) params.append('size', filter.size.toString());
                
                const queryString = params.toString();
                const baseUrl = `${DEAL_ENDPOINTS.RECOMMENDATIONS}/${userId}`;
                return queryString ? `${baseUrl}?${queryString}` : baseUrl;
            },
            transformErrorResponse: (response) => response.data as BaseResponse,
        }),

        trackProductView: builder.mutation<DealResponse<void>, { userId: string; productId: string }>({
            query: ({ userId, productId }) => ({
                url: `${DEAL_ENDPOINTS.RECOMMENDATIONS}/viewed-product/${userId}/${productId}`,
                method: HTTP_METHOD.POST,
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
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useAssignUserCategoriesMutation,
    useGetProductCategoriesQuery,
    useGetProductCategoryByIdQuery,
    useCreateProductCategoryMutation,
    useUpdateProductCategoryMutation,
    useDeleteProductCategoryMutation,
    useGetProductsQuery,
    useGetProductsPaginatedQuery,
    useGetProductByIdQuery,
    useGetProductsBySellerIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetOrdersQuery,
    useGetOrdersByBuyerIdQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useCreatePaymentIntentMutation,
    useDeleteOrderMutation,
    useGetRecommendedProductsQuery,
    useTrackProductViewMutation
} = api;
