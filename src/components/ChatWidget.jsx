import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, Headset, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAgents, fetchChatHistory, setActiveAgent } from '../store/chatSlice';
import { useChatSocket } from '../hook/useChatSocket';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgentList, setShowAgentList] = useState(true);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const { agents, activeAgent, messages, isConnected, loading } = useSelector((state) => state.chat);
  const { sendMessage } = useChatSocket();

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  useEffect(() => {
    if (activeAgent?.id) {
      dispatch(fetchChatHistory(activeAgent.id));
      setShowAgentList(false);
    } else {
      setShowAgentList(true);
    }
  }, [activeAgent, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showAgentList]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#3e4450] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {!showAgentList && (
                  <button onClick={() => dispatch(setActiveAgent(null))} className="text-[#dec06c] p-1 hover:bg-gray-700 rounded-full transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="flex flex-col">
                  <h4 className="text-[#dec06c] font-bold text-sm">
                    {showAgentList ? "Support Center" : activeAgent?.name}
                  </h4>
                  {!showAgentList && (
                    <span className="text-[10px] text-gray-300 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {isConnected ? 'Online' : 'Connecting...'}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {showAgentList ? (
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select an Agent</p>
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => dispatch(setActiveAgent(agent))}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent shadow-sm hover:border-[#dec06c] transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#3e4450]">
                      <Headset size={20}/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{agent.name}</p>
                      <p className="text-[10px] text-gray-500 truncate w-40">{agent.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4 custom-scrollbar">
                  {loading ? (
                    <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-gray-300" /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                      <MessageCircle className="mx-auto mb-2" size={32}/>
                      <p className="text-xs">Start a new conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.sender_type === "auth_user";
                      return (
                        <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            isMe ? 'bg-[#dec06c] text-[#3e4450] rounded-tr-none font-medium' : 'bg-white border text-gray-700 rounded-tl-none'
                          }`}>
                            {msg.message}
                            <p className={`text-[8px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                              {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-grow bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[#dec06c]/20 border border-transparent focus:border-[#dec06c] transition-all"
                  />
                  <button 
                    type="submit" 
                    disabled={!isConnected || !input.trim()}
                    className="bg-[#3e4450] text-[#dec06c] p-2.5 rounded-xl disabled:opacity-50 shadow-md active:scale-95 transition-all"
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
        className="bg-[#3e4450] text-[#dec06c] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#dec06c] relative"
      >
        {isOpen ? <X size={28} /> : (
          <>
            <MessageCircle size={28} />
            {isConnected && <span className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-[#3e4450]"></span>}
          </>
        )}
      </motion.button>
    </div>
  );
}