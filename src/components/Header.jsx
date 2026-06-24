import React, { useState } from 'react';
import { Menu, X, Phone, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import Logo from '../assets/images/Roadoz Golden.png';
import LoginModal from './LoginModal';
import toast from 'react-hot-toast';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get authentication state and user details from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const phoneNumber = "9447549256";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Franchise', path: '/franchise' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="bg-[#3e4450] text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 py-3">
          <Link to="/">
            <img src={Logo} alt="ROADOZ" className="h-9 sm:h-10 md:h-12 lg:h-14" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item, i) => (
              <Link key={i} to={item.path} className={`text-sm font-medium transition ${location.pathname === item.path ? 'text-[#dec06c]' : 'hover:text-[#dec06c]'}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* NEW: Show User Name if Logged In */}
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center gap-2 bg-[#4a515e] px-3 py-1.5 rounded-full border border-[#dec06c]/30">
                <User size={16} className="text-[#dec06c]" />
                <span className="text-xs font-semibold text-white capitalize">
                  {user.name}
                </span>
              </div>
            )}

            <a href={`tel:+91${phoneNumber}`} className="flex items-center gap-1 border border-[#dec06c] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-[#dec06c] hover:bg-[#dec06c] hover:text-[#3e4450] transition">
              <Phone size={16} />
              <span className="hidden sm:inline">Call</span>
            </a>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-red-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-red-400 hover:bg-red-400 hover:text-white transition"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="border border-[#dec06c] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-[#dec06c] hover:bg-[#dec06c] hover:text-[#3e4450] transition"
              >
                Login
              </button>
            )}

            <button onClick={() => setIsOpen(true)} className="lg:hidden text-[#dec06c] ml-1">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-50 transition ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[75%] max-w-[300px] bg-[#3e4450] p-6 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            {/* Show name in Mobile menu too */}
            {isAuthenticated && user && (
               <div className="flex items-center gap-2">
                 <div className="bg-[#dec06c] p-1.5 rounded-full"><User size={18} className="text-[#3e4450]" /></div>
                 <span className="text-[#dec06c] font-bold capitalize">{user.name}</span>
               </div>
            )}
            <button onClick={() => setIsOpen(false)}><X size={26} className="text-[#dec06c]" /></button>
          </div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item, i) => (
              <Link key={i} to={item.path} className={`text-base font-medium ${location.pathname === item.path ? 'text-[#dec06c]' : 'text-white'}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 space-y-4">
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 border border-red-400 px-4 py-3 rounded-full text-sm font-semibold text-red-400">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }} className="w-full border border-[#dec06c] px-4 py-3 rounded-full text-sm font-semibold text-[#dec06c]">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}