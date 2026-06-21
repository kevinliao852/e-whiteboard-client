import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WhiteBoardState {
  status: WhiteBoardStatus;
}

export type WhiteBoardStatus = "connecting" | "connected" | "disconnected";

const initialState: WhiteBoardState = {
  status: "disconnected",
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    changeStatus(state, action: PayloadAction<WhiteBoardStatus>) {
      state.status = action.payload;
    },
  },
});

export const { changeStatus } = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
