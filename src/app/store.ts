import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "../features/whiteboard/whiteboard-slice";
import authReducer from "../features/auth/auth-slice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
    auth: authReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
