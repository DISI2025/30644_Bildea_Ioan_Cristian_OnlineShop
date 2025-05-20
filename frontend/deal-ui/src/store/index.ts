import {configureStore} from "@reduxjs/toolkit";
import {api} from "./api.ts";
import {setupListeners} from "@reduxjs/toolkit/query";
import {authSlice} from "./slices/auth-slice.ts";
import productCategoryReducer from "./slices/product-category-slice.ts";
import productReducer from "./slices/product-slice.ts";

const store = configureStore({
   reducer: {
      [api.reducerPath]: api.reducer,
      auth: authSlice.reducer,
      productCategory: productCategoryReducer,
      product: productReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false,})
      .concat(api.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;