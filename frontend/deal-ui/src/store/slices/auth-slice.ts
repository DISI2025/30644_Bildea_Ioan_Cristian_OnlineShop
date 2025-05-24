import { BaseUser } from "../../types/entities";
import {TOKEN_KEY, USER_KEY} from "../../utils/constants.ts";
import Cookies from 'js-cookie';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { AuthData } from "../../types/transfer.ts";
import {RootState} from "../index.ts";

const THEME_STORAGE_KEY = 'dealshop-theme-preference';

export interface AuthState {
   user: BaseUser | null;
   token: string | null;
   loggedIn: boolean;
   isSeller: boolean;
}

const getInitialUser = (): BaseUser | null => {
   const storedUser = localStorage.getItem(USER_KEY);
   if (storedUser) {
      return JSON.parse(storedUser) as BaseUser;
   }

   return null;
};

const checkIfSeller = (user: BaseUser | null): boolean => {
   if (!user) return false;
   
   const storeAddress = (user as any).storeAddress;
   const isSeller = !!(storeAddress && typeof storeAddress === 'string' && storeAddress.trim() !== '');
   
   console.log('checkIfSeller:', { 
      userId: user.id, 
      username: user.username,
      storeAddress: storeAddress || 'null/undefined/empty', 
      isSeller 
   });
   
   return isSeller;
};

const initialState: AuthState = {
   user: getInitialUser(),
   token: Cookies.get(TOKEN_KEY) ?? null,
   loggedIn: !!Cookies.get(TOKEN_KEY),
   isSeller: checkIfSeller(getInitialUser()),
};

const doInitialCheck = () => {
   if (!initialState.user || !Cookies.get(TOKEN_KEY)) {
      localStorage.removeItem(USER_KEY);
      initialState.loggedIn = false;
      initialState.token = null;
      initialState.user = null;
      initialState.isSeller = false;
   }
};

doInitialCheck();
export const authSlice = createSlice({
   name: 'AuthSlice',
   initialState,
   reducers: {
      endSession: (state) => {
         state.user = null;
         state.loggedIn = false;
         state.isSeller = false;
         Cookies.remove(TOKEN_KEY);
         localStorage.removeItem(USER_KEY);
         localStorage.removeItem(THEME_STORAGE_KEY);
      },

      startSession: (state, action: PayloadAction<AuthData>) => {
         state.user = action.payload.user;
         state.loggedIn = true;
         state.isSeller = checkIfSeller(action.payload.user);
         Cookies.set(TOKEN_KEY, action.payload.accessToken, { expires: 1, secure: true });
         localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      },

      updateUserProfile: (state, action: PayloadAction<BaseUser>) => {
         state.user = action.payload;
         state.isSeller = checkIfSeller(action.payload);
         localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      },

   },
});

export const {
   startSession,
   endSession,
   updateUserProfile,
} = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth as AuthState;
export default authSlice.reducer;