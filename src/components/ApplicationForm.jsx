import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitFranchiseApplication, resetFranchiseState } from "../store/franchiseSlice";
import toast from "react-hot-toast";
import { Loader2, Upload, User, MapPin, Briefcase, FileText, CheckCircle2, Building2, Wallet } from "lucide-react";

// Reusable Components
const FormCard = ({ title, icon: Icon, children, cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }) => (
  <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50">
      <div className="p-2 bg-[#dec06c]/10 rounded-lg text-[#dec06c]"><Icon size={22} /></div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className={`grid gap-6 ${cols}`}>{children}</div>
  </div>
);

const InputGroup = ({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name} type={type} required={required} placeholder={placeholder}
      value={value || ""} onChange={onChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#dec06c] outline-none transition-all"
    />
  </div>
);

const ApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.franchise);

  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", pincode: "", date_of_birth: "", gender: "male",
    current_address: "", permanent_address: "", nearby_landmark: "",
    proposed_location: "", ownership_type: "rented", detailed_business_address: "",
    prior_experience: "", years_active: "", preferred_service_area: "",
    office_space_sqft: "", office_ownership: "rented", staff_count: "",
    internet_availability: false, computer_laptop: false,
    investment_capacity: "", source_of_funds: "", bank_name: "", account_number: "", 
    existing_loans: false, agree_to_terms: false,
    submission_place: "Website", 
    submission_date: new Date().toISOString().split('T')[0]
  });

  const [files, setFiles] = useState({
    aadhar_file: null, pan_file: null, photo_file: null,
    business_registration_file: null, bank_statement_file: null
  });

  // --- UPDATED MESSAGE LOGIC START ---
  useEffect(() => {
    if (success) {
      toast.success(
        "Your application for franchise registration is sent successfully. After approved, you will be sent a mail.",
        { duration: 6000, id: "franchise-success" }
      );
      
      const timer = setTimeout(() => {  
        dispatch(resetFranchiseState());
        navigate("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    if (error) {
      toast.error(error);
      dispatch(resetFranchiseState());
    }
  }, [success, error, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit application");
      return;
    }

    if (!formData.agree_to_terms) {
      toast.error("You must agree to the terms");
      return;
    }

    const data = new FormData();

    // 1. Append Text and Boolean Fields
    Object.entries(formData).forEach(([key, value]) => {
      const val = typeof value === "boolean" ? String(value) : value;
      data.append(key, val);
    });

    // 2. Append Document Indicators
    data.append("doc_id_proof", files.aadhar_file ? "true" : "false");
    data.append("doc_address_proof", files.pan_file ? "true" : "false");
    data.append("doc_photographs", files.photo_file ? "true" : "false");
    data.append("doc_business_registration", files.business_registration_file ? "true" : "false");
    data.append("doc_bank_statement", files.bank_statement_file ? "true" : "false");

    // 3. Append Actual Files
    if (files.aadhar_file) data.append("aadhar_file", files.aadhar_file);
    if (files.pan_file) data.append("pan_file", files.pan_file);
    if (files.photo_file) data.append("photo_file", files.photo_file);
    if (files.business_registration_file) data.append("business_registration_file", files.business_registration_file);
    if (files.bank_statement_file) data.append("bank_statement_file", files.bank_statement_file);

    dispatch(submitFranchiseApplication(data));
  };

  const docLabels = {
    aadhar_file: "Aadhar Card",
    pan_file: "PAN Card",
    photo_file: "Photograph",
    business_registration_file: "Business Reg.",
    bank_statement_file: "Bank Statement"
  };

  return (
    <section className="bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-20 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-[#3e4450] rounded-2xl mb-4 shadow-lg">
            <Building2 className="text-[#dec06c]" size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#3e4450]">
            Franchise <span className="text-[#dec06c]">Application</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit}>         
          <FormCard title="Personal Information" icon={User}>
            <InputGroup label="Full Name" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
            <InputGroup label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" required />
            <InputGroup label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <InputGroup label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} type="date" required />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <InputGroup label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
          </FormCard>

          <FormCard title="Location Details" icon={MapPin} cols="grid-cols-1 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Address</label>
              <textarea name="current_address" value={formData.current_address} onChange={handleInputChange} rows="2" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#dec06c]"></textarea>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Permanent Address</label>
              <textarea name="permanent_address" value={formData.permanent_address} onChange={handleInputChange} rows="2" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#dec06c]"></textarea>
            </div>
            <InputGroup label="Business Address" name="detailed_business_address" value={formData.detailed_business_address} onChange={handleInputChange} required />
            <InputGroup label="Nearby Landmark" name="nearby_landmark" value={formData.nearby_landmark} onChange={handleInputChange} />
          </FormCard>

          <FormCard title="Business Proposal" icon={Briefcase}>
            <InputGroup label="Proposed Location" name="proposed_location" value={formData.proposed_location} onChange={handleInputChange} required />
            <InputGroup label="Preferred Service Area" name="preferred_service_area" value={formData.preferred_service_area} onChange={handleInputChange} required />
            <InputGroup label="Prior Experience" name="prior_experience" value={formData.prior_experience} onChange={handleInputChange} required />
            <InputGroup label="Years Active" name="years_active" type="number" value={formData.years_active} onChange={handleInputChange} required />
            <InputGroup label="Office Sqft" name="office_space_sqft" value={formData.office_space_sqft} onChange={handleInputChange} type="number" required />
            <InputGroup label="Staff Count" name="staff_count" value={formData.staff_count} onChange={handleInputChange} type="number" required />
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border h-[54px]">
               <input type="checkbox" name="internet_availability" checked={formData.internet_availability} onChange={handleInputChange} className="accent-[#dec06c] w-5 h-5" />
               <span className="text-sm font-semibold">Internet Available</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border h-[54px]">
               <input type="checkbox" name="computer_laptop" checked={formData.computer_laptop} onChange={handleInputChange} className="accent-[#dec06c] w-5 h-5" />
               <span className="text-sm font-semibold">Computer Available</span>
            </div>
          </FormCard>

          <FormCard title="Financial Information" icon={Wallet}>
            <InputGroup label="Investment Capacity" name="investment_capacity" value={formData.investment_capacity} onChange={handleInputChange} required />
            <InputGroup label="Source of Funds" name="source_of_funds" value={formData.source_of_funds} onChange={handleInputChange} required />
            <InputGroup label="Bank Name" name="bank_name" value={formData.bank_name} onChange={handleInputChange} required />
            <InputGroup label="Account Number" name="account_number" value={formData.account_number} onChange={handleInputChange} required />
          </FormCard>

          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Required Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.keys(docLabels).map((key) => (
                <div key={key} className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{docLabels[key]}</p>
                  <label className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${files[key] ? 'border-[#dec06c] bg-[#dec06c]/5' : 'border-gray-200 hover:border-[#dec06c]'}`}>
                    <Upload size={20} className={files[key] ? "text-[#dec06c]" : "text-gray-400"} />
                    <span className="text-[9px] mt-2 px-2 text-gray-500 truncate w-full text-center">
                      {files[key] ? files[key].name : 'Upload'}
                    </span>
                    <input type="file" name={key} onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#3e4450] rounded-3xl p-8 text-center shadow-xl">
            <label className="flex items-center justify-center gap-3 mb-6 cursor-pointer">
              <input type="checkbox" name="agree_to_terms" checked={formData.agree_to_terms} onChange={handleInputChange} className="w-5 h-5 accent-[#dec06c]" />
              <p className="text-gray-300 text-sm">I confirm that the information provided is accurate.</p>
            </label>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-[#dec06c] text-[#3e4450] font-black py-4 px-12 rounded-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ApplicationForm;