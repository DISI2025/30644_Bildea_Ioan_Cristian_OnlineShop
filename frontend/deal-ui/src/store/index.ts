import {configureStore} from "@reduxjs/toolkit";
import {api} from "./api.ts";
import {setupListeners} from "@reduxjs/toolkit/query";

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false,}).concat(api.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;