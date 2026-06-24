import React, { useState } from 'react';
import { X, Loader2, ArrowLeft } from 'lucide-react';
import { registerApi, sendOtpEmailApi, verifyOtpEmailApi } from '../Service/apiCalls';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function LoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', otp: '' });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerApi({ name: formData.name, email: formData.email }); 
      toast.success("Account created!");
      triggerOtpSend();
    } catch (error) {
      if (error.response?.status === 400 || error.response?.data?.message?.includes("exists")) {
        triggerOtpSend();
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
        setLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    triggerOtpSend();
  };

  const triggerOtpSend = async () => {
    setLoading(true);
    try {
      await sendOtpEmailApi(formData.email);
      toast.success("OTP sent to " + formData.email);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length < 4) return toast.error("Enter valid OTP");
    setLoading(true);
    try {
      const res = await verifyOtpEmailApi({ email: formData.email, otp: formData.otp });
      
      // UPDATED: Mapping to your specific API response keys
      dispatch(loginSuccess({ 
        token: res.data.access_token, 
        user: res.data.user 
      }));
      
      toast.success(`Welcome back, ${res.data.user.name}!`);
      onClose(); // Closes the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#3e4450] w-full max-w-md rounded-2xl p-8 border border-[#dec06c]/30 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-[#dec06c]"><X /></button>
        {step > 1 && (
            <button onClick={() => setStep(step === 3 ? 2 : 1)} className="absolute left-4 top-4 text-gray-400 hover:text-[#dec06c]">
                <ArrowLeft size={20} />
            </button>
        )}
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#dec06c]">
                {step === 1 ? 'Create Account' : step === 2 ? 'Welcome Back' : 'Verify Email'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
                {step === 3 ? `Enter the code sent to ${formData.email}` : 'Start your journey with Roadoz'}
            </p>
        </div>

        <form onSubmit={step === 1 ? handleRegister : step === 2 ? handleLoginSubmit : handleVerifyOtp} className="space-y-4">
          {step === 1 && (
            <input
              type="text" name="name" placeholder="Full Name" required
              className="w-full bg-[#2d323c] border border-gray-600 rounded-xl p-3 text-white focus:border-[#dec06c] outline-none"
              value={formData.name} onChange={handleInputChange}
            />
          )}
          
          {(step === 1 || step === 2) && (
            <input
              type="email" name="email" placeholder="Email Address" required
              className="w-full bg-[#2d323c] border border-gray-600 rounded-xl p-3 text-white focus:border-[#dec06c] outline-none"
              value={formData.email} onChange={handleInputChange}
            />
          )}

          {step === 3 && (
            <input
              type="text" name="otp" placeholder="0 0 0 0" maxLength={4} required
              className="w-full bg-[#2d323c] border border-gray-600 rounded-xl p-4 text-center text-3xl font-bold tracking-[0.5em] text-[#dec06c] focus:border-[#dec06c] outline-none"
              value={formData.otp} onChange={handleInputChange}
              autoFocus
            />
          )}

          <button
            disabled={loading}
            className="w-full bg-[#dec06c] text-[#3e4450] font-bold py-4 rounded-xl hover:bg-[#cbb062] transition-all flex justify-center items-center shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : step === 3 ? 'Verify & Login' : 'Continue'}
          </button>
        </form>

        {step !== 3 && (
          <p className="text-gray-400 text-sm mt-6 text-center">
            {step === 1 ? (
                <>Already have an account? <button onClick={() => setStep(2)} className="text-[#dec06c] font-bold hover:underline">Login</button></>
            ) : (
                <>New here? <button onClick={() => setStep(1)} className="text-[#dec06c] font-bold hover:underline">Create Account</button></>
            )}
          </p>
        )}
      </div>
    </div>
  );
}