import axios from "axios";
import Cookies from "js-cookie";
import { ENDPOINTS } from "./endpoints";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://api.roadozcourier.com/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      // Remove quotes if present from cookie storage
      const cleanToken = token.toString().replace(/['"]+/g, '').trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getChatWSUrl = () => {
  let wsBase = BASE_URL.replace(/^http/, "ws");
  
  wsBase = wsBase.replace(/\/+$/, "");
  
  const endpoint = ENDPOINTS.CHAT_WS.replace(/^\/+/, "");
  
  const token = Cookies.get("access_token")?.replace(/['"]+/g, '').trim();
  
  const finalUrl = `${wsBase}/${endpoint}?token=${token}`;
  
  return finalUrl;
};

export const fetchSupportAgentsApi = () => API.get(ENDPOINTS.GET_SUPPORT_AGENTS);
export const fetchChatHistoryApi = (receiverId) => 
  API.get(`${ENDPOINTS.GET_CHAT_MESSAGES}?receiver_id=${receiverId}`);


// Auth APIs
export const sendOtpByPhoneApi = (phone) => API.post(ENDPOINTS.SEND_OTP_PHONE, { phone });
export const verifyOtpByPhoneApi = (data) => API.post(ENDPOINTS.VERIFY_OTP_PHONE, data);
export const registerApi = (data) => API.post(ENDPOINTS.REGISTER, data);
export const sendOtpEmailApi = (email) => API.post(ENDPOINTS.SEND_OTP_EMAIL, { email });
export const verifyOtpEmailApi = (data) => API.post(ENDPOINTS.VERIFY_OTP_EMAIL, data);

// Tracking API
export const fetchOrderDetailsByBarcodeApi = (orderNumber) => {
  const sanitizedOrderNumber = orderNumber.replace(/\/$/, ""); 
  return API.get(`${ENDPOINTS.GET_SINGLE_ORDER}/${sanitizedOrderNumber}/`);
};

// Franchise API
export const createFranchiseApi = (formData) => {
    return API.post(ENDPOINTS.CREATE_FRANCHISE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export default API;