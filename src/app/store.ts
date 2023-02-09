import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "../features/whiteboard/whiteboard-slice";
import authReducer from "../features/auth/auth-slice";
import userReducer from "../features/user/user-slice";

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
