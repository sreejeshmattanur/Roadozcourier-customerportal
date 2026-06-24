import React, { useRef, useState } from 'react';
import { MapPin, Phone, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const ContactFormSection = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const inputStyle = "w-full bg-[#E5E7EB] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E9D16D] outline-none transition-all";

  const handleSendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace these with your actual IDs from EmailJS Dashboard
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        toast.success("Message sent successfully! Our team will get back to you shortly.", {
          duration: 5000,
          style: {
            border: '1px solid #dec06c',
            padding: '16px',
            color: '#3e4450',
            fontWeight: 'bold',
            background: '#fff',
          },
          iconTheme: {
            primary: '#dec06c',
            secondary: '#fff',
          },
        });
        form.current.reset();
      }, (error) => {
        toast.error("Failed to send message. Please try again or contact us via WhatsApp.");
        console.error("EmailJS Error:", error.text);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Contact Details */}
        <div className="lg:w-1/2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Precision in Communication</h2>
            <p className="text-gray-600">
              Reach out to us through any of our channels. Our dedicated support team ensures your queries are handled with professional urgency.
            </p>
          </div>

          <div className="space-y-8">
            {/* Headquarters */}
            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl h-fit"><MapPin className="text-blue-900" size={20}/></div>
              <div>
                <h4 className="font-bold text-gray-900">Our Headquarters</h4>
                <p className="text-gray-500 text-sm">Roadoz pvt Ltd , 1st Floor<br/>A..., 1st main koramangala, 1st Block Bengaluru, 560034</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl h-fit"><Phone className="text-blue-900" size={20}/></div>
              <div>
                <h4 className="font-bold text-gray-900">Phone Support</h4>
                <p className="text-gray-500 text-sm">Main: 9496630687<br/>Support: 9496630687</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex gap-4">
              <div className="bg-green-50 p-3 rounded-xl h-fit"><MessageSquare className="text-green-600" size={20}/></div>
              <div>
                <h4 className="font-bold text-gray-900">WhatsApp Business</h4>
                <p className="text-gray-500 text-sm italic">Instant support available 24/7</p>
                <p className="text-gray-500 text-sm">+91 9496630687</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">Franchise Inquiries</h4>
            <p className="text-gray-500 text-sm mb-4">Join our growing network of professional couriers.</p>
            <a href="/franchise" className="text-[#B29E53] font-bold flex items-center gap-2 hover:underline">
              Learn More <ArrowRight size={16}/>
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:w-1/2">
          <form ref={form} onSubmit={handleSendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold mb-2">Name</label>
                <input 
                  type="text" 
                  name="user_name" 
                  required 
                  placeholder="Your Name" 
                  className={inputStyle} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Email id</label>
                <input 
                  type="email" 
                  name="user_email" 
                  required 
                  placeholder="email@example.com" 
                  className={inputStyle} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2">Subject</label>
              <select name="subject" className={inputStyle}>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Support">Support</option>
                <option value="Franchise">Franchise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Message</label>
              <textarea 
                name="message" 
                required 
                rows="6" 
                placeholder="How can we help you?" 
                className={inputStyle}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#E9D16D] hover:bg-[#d4bd5a] text-gray-900 font-bold py-3 px-10 rounded-full shadow-md transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;  