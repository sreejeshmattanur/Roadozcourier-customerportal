import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    Search, ShieldCheck, Clock, Headphones, PackageCheck, 
    Phone, ArrowRight, CheckCircle2, MapPin, Loader2 
} from "lucide-react";

import { 
    sendOtpAction, 
    verifyOtpAction, 
    setStep, 
    resetTracking 
} from "../store/trackingSlice";

import expressTruckImg from "../assets/images/Trackimage.jpg";
import safePackagingImg from "../assets/images/pexels-pavel-danilyuk-7674970.jpg";

const TrackOrderContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { step, loading, error } = useSelector((state) => state.tracking);

    const [formData, setFormData] = useState({ 
        trackingId: localStorage.getItem("trackingOrderId") || "", 
        phone: "", 
        otp: "" 
    });

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (!formData.trackingId) return;
        localStorage.setItem("trackingOrderId", formData.trackingId);
        dispatch(setStep(2));
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        dispatch(sendOtpAction(formData.phone));
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const result = await dispatch(verifyOtpAction({ 
            phone: formData.phone,  
            otp: formData.otp 
        }));

        if (verifyOtpAction.fulfilled.match(result)) {
            const orderId = formData.trackingId || localStorage.getItem("trackingOrderId");
            navigate(`/track-order/${orderId}`);
        }
    };

    const Stepper = () => (
        <div className="flex items-center justify-between mb-8 w-full px-1">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                        step >= i ? "bg-[#1a1a1a] border-[#1a1a1a] text-white" : "bg-white border-gray-300 text-gray-400"
                    }`}>
                        {step > i ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{i}</span>}
                    </div>
                    {i < 3 && (
                        <div className={`flex-1 h-[2px] mx-2 ${step > i ? "bg-[#dec06c]" : "bg-gray-200"}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <main className="font-sans antialiased text-[#1a1a1a] bg-[#e9ecef] min-h-screen">
            <section className="relative min-h-[650px] flex flex-col items-center justify-center px-5 py-20">
                <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600')` }}>
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]"></div>
                </div>

                <div className="relative z-10 text-center mb-10 text-white max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-[#dec06c]/20 border border-[#dec06c]/30 px-4 py-2 rounded-full mb-6 animate-bounce">
                        <MapPin size={16} className="text-[#dec06c]" />
                        <span className="text-sm font-bold tracking-wide uppercase">Fastest Delivery in Kerala</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                        Track Your <span className="text-[#dec06c]">Journey.</span>
                    </h1>
                </div>

                <div className="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 min-h-[440px] flex flex-col">
                    <Stepper />

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <Loader2 className="w-12 h-12 text-[#dec06c] animate-spin" />
                                <p className="font-bold text-gray-500 animate-pulse">Authenticating...</p>
                            </div>
                        ) : (
                            <>
                                {step === 1 && (
                                    <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#1a1a1a]">Track Order</h3>
                                            <p className="text-sm text-gray-500">Input your Tracking ID (ORD-XXXXX) to proceed.</p>
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                                            <input
                                                type="text"
                                                placeholder="Enter Tracking ID..."
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#dec06c] font-semibold"
                                                value={formData.trackingId}
                                                onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl">
                                            Locate Parcel <ArrowRight size={18} />
                                        </button>
                                    </form>
                                )}

                                {step === 2 && (
                                    <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-right-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#1a1a1a]">Verification</h3>
                                            <p className="text-sm text-gray-500">Linked to Order: {formData.trackingId}</p>
                                        </div>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-5 bg-gray-100 border-2 border-r-0 border-gray-100 rounded-l-2xl text-gray-600 font-bold">+91</span>
                                            <input
                                                type="tel"
                                                placeholder="999 999 9999"
                                                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-r-2xl outline-none focus:border-[#dec06c] font-medium"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-[#1a1a1a] text-white font-bold py-5 rounded-2xl shadow-lg">
                                            Send OTP Code
                                        </button>
                                        <button type="button" onClick={() => dispatch(setStep(1))} className="w-full text-gray-400 text-xs font-semibold hover:text-[#dec06c]">
                                            ← Change Tracking ID
                                        </button>
                                    </form>
                                )}

                                {step === 3 && (
                                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-8">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold text-[#1a1a1a]">Final Step</h3>
                                            <p className="text-sm text-gray-500">Enter code sent to +91 {formData.phone}</p>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="000000"
                                            className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-4xl font-black tracking-[0.4em] outline-none focus:border-[#dec06c]"
                                            maxLength={6}
                                            value={formData.otp}
                                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                            required
                                        />
                                        <button type="submit" className="w-full bg-[#dec06c] text-[#1a1a1a] font-bold py-5 rounded-2xl shadow-lg">
                                            Verify & Track Order
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-20 lg:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-24 sm:space-y-32 lg:space-y-48">
                <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-16 bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dec06c]/10 rounded-full blur-3xl"></div>
                    <div className="flex-1 space-y-4 sm:space-y-6 relative z-10 text-center lg:text-left">
                        <span className="text-[#dec06c] font-extrabold text-[10px] sm:text-xs tracking-[0.2em] uppercase bg-[#dec06c]/10 px-3 py-1.5 rounded-full">Fastest in the Region</span>
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-black text-[#1a1a1a] leading-tight">Precision Logistics,<br className="hidden sm:block" /><span className="text-[#dec06c]">Global Reach</span></h2>
                        <div className="h-1 w-16 sm:w-24 bg-[#dec06c] rounded-full mx-auto lg:mx-0"></div>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                            Experience our flagship <span className="font-bold text-[#1a1a1a]">24-hour delivery service</span> spanning across every corner of Kerala. 
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <img src={expressTruckImg} alt="Express Truck" className="rounded-xl sm:rounded-[2.5rem] shadow-xl w-full object-cover h-60 sm:h-80 md:h-[400px] lg:h-[450px] border-4 border-[#dec06c]/10" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center gap-10 sm:gap-16">
                    <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
                        <span className="text-[#1a1a1a] font-extrabold text-[10px] sm:text-xs tracking-[0.2em] uppercase bg-gray-200 px-3 py-1.5 rounded-full">Secure Handling</span>
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-black text-[#1a1a1a] leading-tight">Your Goods,<br className="hidden sm:block" /><span className="text-[#dec06c]">Our Responsibility</span></h2>
                        <div className="h-1 w-16 sm:w-24 bg-[#1a1a1a] rounded-full mx-auto lg:mx-0"></div>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                            Our protocol involves multi-layered shockproof packaging and climate-controlled transit for delicate items.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <img src={safePackagingImg} alt="Safe Packaging" className="rounded-xl sm:rounded-[2.5rem] shadow-xl w-full object-cover h-60 sm:h-80 md:h-[400px] lg:h-[450px] border-4 border-white" />
                    </div>
                </div>
            </section>

            {/* ICON BAR (Benefits) */}
            <div className="bg-white border-y border-gray-100 py-12 sm:py-16 md:py-20 px-5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {[
                        { icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Secure Transit", desc: "Insured & Guarded" },
                        { icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Kerala 24h", desc: "Next Day Delivery" },
                        { icon: <Headphones className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Live Support", desc: "Always Available" },
                        { icon: <PackageCheck className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Full Visibility", desc: "End-to-End Tracking" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center sm:items-start gap-4 group text-center sm:text-left">
                            <div className="p-4 sm:p-5 bg-[#e9ecef] shadow-sm rounded-xl sm:rounded-2xl text-[#1a1a1a] group-hover:bg-[#dec06c] transition-all duration-300">
                                {item.icon}
                            </div>
                            <div>
                                <p className="font-bold text-base sm:text-lg text-[#1a1a1a]">{item.title}</p>
                                <p className="text-xs sm:text-sm text-gray-500 font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUPPORT BANNER */}
            <section className="px-5 sm:px-10 py-16 sm:py-24">
                <div className="max-w-6xl mx-auto bg-[#1a1a1a] rounded-2xl sm:rounded-[3rem] lg:rounded-[4rem] p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#dec06c]/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                    <div className="max-w-xl text-center lg:text-left relative z-10">
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">Need help with <br className="hidden sm:block" />your delivery?</h2>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed">
                            Our support centers are open 24/7. Call us if you're having trouble with your tracking ID.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 relative z-10 w-full sm:w-auto">
                        <button className="bg-[#dec06c] hover:bg-white text-[#1a1a1a] px-8 py-4 sm:px-12 sm:py-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 sm:gap-4 font-black transition-all hover:scale-[1.03] shadow-2xl text-base sm:text-lg w-full sm:w-auto">
                            <Phone size={20} className="sm:w-6 sm:h-6" /> CALL US NOW
                        </button>
                        <p className="text-gray-500 text-center text-[10px] sm:text-xs font-bold tracking-widest uppercase">TOLL FREE: 1800-ROADOZ-KRL</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TrackOrderContent;