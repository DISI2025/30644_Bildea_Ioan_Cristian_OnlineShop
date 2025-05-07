import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import {AUTH_HEADER, buildAuthHeader, DEAL_ENDPOINTS, TOKEN_KEY} from "../utlis/constants.ts";
import Cookies from 'js-cookie';
import {AuthData, AuthRequest, BaseResponse, DealResponse} from "../types/transfer.ts";

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
    tagTypes: [],
    endpoints: (builder) => ({
        login: builder.mutation<DealResponse<AuthData>, AuthRequest>({
            query: (request: AuthRequest) => ({
                url: `${DEAL_ENDPOINTS.AUTH}/login`,
                method: "POST",
                body: request,
            }), transformErrorResponse: (response) => response.data as BaseResponse,
        }),
        //TODO Just as an example
        /*        getCourses: builder.query<DealResponse<Course[]>, void>({
                    query: () => Endpoints.courses,
                    transformErrorResponse: (response) => response.data as BaseResponse,
                    providesTags: ['Courses'],
                }),*/
    }),
});

export const {useLoginMutation} = api;
