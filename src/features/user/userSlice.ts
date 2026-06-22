import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserState {
  id: number | null;
  displayName: string | null;
  email: string | null;
  role: UserRole | null;
}

export interface UserInfo {
  id: number;
  displayName: string;
  email: string;
  role: UserRole;
}

export type UserRole = "user" | "guest";

const initialState: UserState = {
  id: null,
  displayName: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.id = action.payload.id;
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUserInfo(state) {
      state.id = null;
      state.displayName = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const selectUserId = createSelector(
  (state: RootState) => state.user,
  (user) => user.id
);

export const selectUserRole = createSelector(
  (state: RootState) => state.user,
  (user) => user.role
);
