import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, Headset, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAgents, fetchChatHistory, setActiveAgent } from '../store/chatSlice';
import { useChatSocket } from '../hook/useChatSocket';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgentList, setShowAgentList] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const { agents, activeAgent, messages, isConnected } = useSelector((state) => state.chat);
  const { sendMessage } = useChatSocket();

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  // Load history when agent changes OR chat opens
  useEffect(() => {
    if (activeAgent?.id) {
      dispatch(fetchChatHistory(activeAgent.id));
    }
  }, [activeAgent?.id, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, showAgentList]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  const handleSelectAgent = (agent) => {
    dispatch(setActiveAgent(agent));
    setShowAgentList(false); // Close list and show chat
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#3e4450] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!showAgentList && (
                    <button onClick={() => setShowAgentList(true)} className="text-[#dec06c] hover:bg-gray-700 p-1 rounded">
                        <ChevronLeft size={20} />
                    </button>
                )}
                <div>
                  <h4 className="text-[#dec06c] font-bold text-sm">
                    {showAgentList ? "Select Support" : activeAgent?.name}
                  </h4>
                  {!showAgentList && (
                    <span className="text-[10px] text-gray-300 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            {/* Content */}
            {showAgentList ? (
              <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gray-50">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full flex items-center gap-3 p-3 bg-white rounded-xl border transition-all ${activeAgent?.id === agent.id ? 'border-[#dec06c] bg-amber-50' : 'hover:border-gray-300'}`}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"><Headset size={18}/></div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-800">{agent.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{agent.user_type}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
                  {messages.length === 0 && (
                    <p className="text-center text-xs text-gray-400 mt-10">No messages yet. Start the conversation!</p>
                  )}
                  {messages.map((msg, i) => {
                    // Based on your JSON: sender_type "auth_user" is the Customer
                    const isCustomer = msg.sender_type === "auth_user";
                    return (
                      <div key={msg.id || i} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                          isCustomer 
                            ? 'bg-[#dec06c] text-[#3e4450] rounded-tr-none' 
                            : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                        }`}>
                          {msg.message}
                          <p className={`text-[9px] mt-1 opacity-70 ${isCustomer ? 'text-right' : 'text-left'}`}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Type message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-grow bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 ring-[#dec06c]"
                  />
                  <button 
                    type="submit" 
                    disabled={!isConnected || !input.trim()}
                    className="bg-[#3e4450] text-[#dec06c] p-2 rounded-xl disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#3e4450] text-[#dec06c] w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-2 border-[#dec06c]"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}