import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "../features/whiteboard/whiteboard-slice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
