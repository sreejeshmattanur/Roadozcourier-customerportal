import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSupportAgentsApi, fetchChatHistoryApi } from '../Service/apiCalls';

export const fetchAgents = createAsyncThunk('chat/fetchAgents', async () => {
  const response = await fetchSupportAgentsApi();
  return response.data.agents; 
});

export const fetchChatHistory = createAsyncThunk('chat/fetchHistory', async (agentId) => {
  const response = await fetchChatHistoryApi(agentId);
  return response.data.messages;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    agents: [],
    activeAgent: null,
    messages: [],
    isConnected: false,
    loading: false
  },
  reducers: {
    setActiveAgent: (state, action) => {
      state.activeAgent = action.payload;
      state.messages = []; // Clear current messages to show history of new agent
    },
    addMessage: (state, action) => {
      // Logic: Only add message if it belongs to the current conversation
      const msg = action.payload;
      const currentAgentId = state.activeAgent?.id;
      
      // Show message if I sent it to active agent OR active agent sent it to me
      if (msg.sender_id === currentAgentId || msg.receiver_id === currentAgentId) {
        // Prevent duplicate IDs if backend sends 'sent' event back
        const exists = state.messages.find(m => m.id === msg.id);
        if (!exists) state.messages.push(msg);
      }
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agents = action.payload;
        if (action.payload.length > 0 && !state.activeAgent) {
          state.activeAgent = action.payload[0];
        }
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  }
});

export const { setActiveAgent, addMessage, setConnectionStatus } = chatSlice.actions;
export default chatSlice.reducer;