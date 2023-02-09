import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserState {
  id: number | null;
  displayName: string | null;
  email: string | null;
}

export interface UserInfo {
  id: number;
  displayName: string;
  email: string;
}

const initialState: UserState = {
  id: null,
  displayName: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.id = action.payload.id;
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const selectUserId = createSelector(
  (state: RootState) => state.user,
  (user) => user.id
);
