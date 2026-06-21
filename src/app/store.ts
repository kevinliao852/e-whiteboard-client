import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "../features/whiteboard/whiteboardSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
    auth: authReducer,
    user: userReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
