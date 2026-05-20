import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CallState {
  incoming: { from: string; type: 'audio' | 'video'; conversationId: string } | null;
  outbound: { to: string; type: 'audio' | 'video'; conversationId: string } | null;
}

const initialState: CallState = {
  incoming: null,
  outbound: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<CallState["incoming"]>) => {
      state.incoming = action.payload;
      state.outbound = null;
    },
    setOutboundCall: (state, action: PayloadAction<CallState["outbound"]>) => {
      state.outbound = action.payload;
      state.incoming = null;
    },
    clearCall: (state) => {
      state.incoming = null;
      state.outbound = null;
    },
  },
});

export const { setIncomingCall, setOutboundCall, clearCall } = callSlice.actions;
export default callSlice.reducer;
