import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../../app/store";

interface authState {
  status: authStatus;
}

export enum AuthStatus {
  Checking = "CHECKING",
  Login = "LOGIN",
  Logout = "LOGOUT",
}

export type authStatus = AuthStatus;

const initialState: authState = {
  status: AuthStatus.Checking,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeAuthStatus(state, action: PayloadAction<authStatus>) {
      state.status = action.payload;
    },
    setAuthData(state, action: PayloadAction<authStatus>) {
      state.status = action.payload;
    },
  },
});

export const { changeAuthStatus } = authSlice.actions;

export default authSlice.reducer;

// select data

export const selectAuthStatus = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth.status
);
