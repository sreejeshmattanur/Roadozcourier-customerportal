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
      state.messages = []; 
    },
    addMessage: (state, action) => {
      const msg = action.payload;
      const currentAgentId = state.activeAgent?.id;
      
      // Ensure the message belongs to the currently active conversation
      const isRelevant = (msg.sender_id === currentAgentId || msg.receiver_id === currentAgentId);
      
      if (isRelevant) {
        // Prevent duplicate messages (IDs check)
        const exists = state.messages.find(m => m.id === msg.id && msg.id !== undefined);
        if (!exists) {
          state.messages.push({
            ...msg,
            created_at: msg.created_at || new Date().toISOString()
          });
        }
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
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      });
  }
});

export const { setActiveAgent, addMessage, setConnectionStatus } = chatSlice.actions;
export default chatSlice.reducer;