import { User } from "../../types/entities";
import {TOKEN_KEY, USER_KEY} from "../../utils/constants.ts";
import Cookies from 'js-cookie';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { AuthData } from "../../types/transfer.ts";
import {RootState} from "../index.ts";

export interface AuthState {
   user: User | null;
   token: string | null;
   loggedIn: boolean;
}

const getInitialUser = (): User | null => {
   const storedUser = localStorage.getItem(USER_KEY);
   if (storedUser) {
      return JSON.parse(storedUser) as User;
   }

   return null;
};

const initialState: AuthState = {
   user: getInitialUser(),
   token: Cookies.get(TOKEN_KEY) ?? null,
   loggedIn: !!Cookies.get(TOKEN_KEY),
};

const doInitialCheck = () => {
   if (!initialState.user || !Cookies.get(TOKEN_KEY)) {
      localStorage.removeItem(USER_KEY);
      initialState.loggedIn = false;
      initialState.token = null;
      initialState.user = null;
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
         Cookies.remove(TOKEN_KEY);
         localStorage.removeItem(USER_KEY);
      },

      startSession: (state, action: PayloadAction<AuthData>) => {
         state.user = action.payload.user;
         state.loggedIn = true;
         Cookies.set(TOKEN_KEY, action.payload.accessToken, { expires: 1, secure: true });
         localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      },

   },
});

export const {
   startSession,
   endSession,
} = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth as AuthState;
export default authSlice.reducer;