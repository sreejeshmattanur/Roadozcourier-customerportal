import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createFranchiseApi } from "../Service/apiCalls"; // Check this path!
import toast from "react-hot-toast";

export const submitFranchiseApplication = createAsyncThunk(
  "franchise/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createFranchiseApi(formData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Submission failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const franchiseSlice = createSlice({
  name: "franchise",
  initialState: { loading: false, success: false, error: null },
  reducers: {
    resetFranchiseState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFranchiseApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFranchiseApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitFranchiseApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetFranchiseState } = franchiseSlice.actions;
export default franchiseSlice.reducer;