import { createSlice } from "@reduxjs/toolkit";

interface WhiteBoardState {
  status: WhiteBoardStatus;
}

type WhiteBoardStatus = "connecting" | "connected" | "disconnected";

const initialState: WhiteBoardState = {
  status: "disconnected",
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    changeStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { changeStatus } = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
