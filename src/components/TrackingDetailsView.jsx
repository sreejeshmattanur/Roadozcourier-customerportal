import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { 
  ArrowLeft, Package, Truck, Warehouse, MapPin, 
  CheckCircle2, User, Phone, Receipt, Loader2, ShieldAlert
} from "lucide-react";
import { fetchOrderAction, resetTracking } from "../store/trackingSlice";

const TrackingDetailsView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { orderData, loading, error } = useSelector((state) => state.tracking);

    useEffect(() => {
        const token = Cookies.get("access_token");
        
        // 1. Strict Auth Check
        if (!token) {
            console.error("No access token found, redirecting...");
            navigate("/track-order");
            return;
        }

        // 2. Fetch data if we have an ID
        if (orderId) {
            dispatch(fetchOrderAction(orderId));
        }
    }, [orderId, dispatch, navigate]);

    const handleBack = () => {
        dispatch(resetTracking());
        navigate("/track-order");
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 text-[#dec06c] animate-spin mb-4" />
            <p className="font-bold text-gray-500">Verifying Credentials...</p>
        </div>
    );

    if (error) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <ShieldAlert size={60} className="text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
                {error.includes("401") || error.toLowerCase().includes("unauthorized") 
                  ? "Your session has expired. Please verify your phone number again." 
                  : "We couldn't retrieve the details for this order."}
            </p>
            <button onClick={handleBack} className="bg-black text-white px-10 py-4 rounded-2xl font-bold">
                Re-verify Phone Number
            </button>
        </div>
    );

    if (!orderData) return null;

    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${orderData.order_number}&code=Code128`;

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            <header className="bg-white border-b sticky top-0 z-20 px-4 h-16 flex items-center gap-4">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-lg">Tracking Details</h1>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">Live Tracking</p>
                        <h2 className="text-3xl font-black text-gray-900">#{orderData.order_number}</h2>
                    </div>
                    <div className="bg-[#f0f9ff] border border-blue-100 px-6 py-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Payment Status</p>
                        <p className="font-bold text-blue-900">₹{orderData.cod_amount} ({orderData.payment_method})</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipment Progress */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-xl mb-8">Journey Progress</h3>
                        <div className="space-y-0">
                            {/* Simple visual representation of status */}
                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                                <CheckCircle2 className="text-green-600" />
                                <div>
                                    <p className="font-bold text-green-900">{orderData.status}</p>
                                    <p className="text-xs text-green-700">Updated recently</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Barcode */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><MapPin size={20}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                                    <p className="font-bold text-gray-800">{orderData.consignee?.city}</p>
                                    <p className="text-xs text-gray-500">{orderData.consignee?.address_line_1}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6 border-t border-gray-50">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><User size={20}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Receiver</p>
                                    <p className="font-bold text-gray-800">{orderData.consignee?.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone size={12}/> +91 {orderData.consignee?.mobile}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex flex-col items-center">
                                <img src={barcodeUrl} alt="Barcode" className="h-10 mix-blend-multiply" />
                                <p className="text-[9px] font-mono mt-2 text-gray-400 tracking-widest">{orderData.order_number}</p>
                            </div>
                        </div>

                        <div className="bg-black rounded-2xl p-5 text-white flex justify-between items-center shadow-xl">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-white/10 rounded-lg"><Receipt size={18} className="text-blue-400"/></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Weight</span>
                            </div>
                            <span className="font-bold text-lg">{orderData.weight_summary?.total_weight_kg || '0'} KG</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrackingDetailsView;