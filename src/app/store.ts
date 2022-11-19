import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "../features/whiteboard/whiteboard-slice";
import authReducer from "../features/auth/auth-slice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
