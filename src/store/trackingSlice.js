import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    sendOtpByPhoneApi, 
    verifyOtpByPhoneApi, 
    fetchOrderDetailsByBarcodeApi 
} from "../Service/apiCalls";
import Cookies from "js-cookie";

export const verifyOtpAction = createAsyncThunk(
    "tracking/verifyOtp",
    async ({ phone, otp }, { rejectWithValue }) => {
        try {
            const response = await verifyOtpByPhoneApi({ phone, otp });
            const data = response.data;
            
            if (data.access_token) {
                const isHttps = window.location.protocol === 'https:';
                
                Cookies.set("access_token", data.access_token, { 
                    expires: 7, 
                    secure: isHttps,
                    sameSite: 'Lax'
                });
                return data;
            } else {
                return rejectWithValue("Verification failed: No token received");
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Invalid OTP");
        }
    }
);

export const fetchOrderAction = createAsyncThunk(
    "tracking/fetchOrder",
    async (orderNumber, { rejectWithValue }) => {
        try {
            const response = await fetchOrderDetailsByBarcodeApi(orderNumber);
            return response.data.data || response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Unable to fetch order");
        }
    }
);

export const sendOtpAction = createAsyncThunk(
    "tracking/sendOtp",
    async (phone, { rejectWithValue }) => {
        try {
            const response = await sendOtpByPhoneApi(phone);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);

const trackingSlice = createSlice({
    name: "tracking",
    initialState: {
        orderData: null,
        loading: false,
        step: 1, 
        error: null,
    },
    reducers: {
        setStep: (state, action) => { state.step = action.payload; },
        resetTracking: (state) => {
            state.orderData = null;
            state.step = 1;
            state.error = null;
            Cookies.remove("access_token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtpAction.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendOtpAction.fulfilled, (state) => { state.loading = false; state.step = 3; })
            .addCase(sendOtpAction.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(verifyOtpAction.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(verifyOtpAction.fulfilled, (state) => { state.loading = false; state.step = 4; })
            .addCase(verifyOtpAction.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchOrderAction.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrderAction.fulfilled, (state, action) => {
                state.loading = false;
                state.orderData = action.payload;
            })
            .addCase(fetchOrderAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setStep, resetTracking } = trackingSlice.actions;
export default trackingSlice.reducer;