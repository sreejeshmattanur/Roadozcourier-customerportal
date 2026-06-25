import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setConnectionStatus } from '../store/chatSlice';
import { getChatWSUrl } from '../Service/apiCalls';

export const useChatSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { activeAgent } = useSelector((state) => state.chat);

  useEffect(() => {
    const connect = () => {
      const wsUrl = getChatWSUrl();
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        dispatch(setConnectionStatus(true));
        console.log("WebSocket Connection Established");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch(addMessage(data));
      };

      socket.onclose = () => {
        dispatch(setConnectionStatus(false));
        // Try to reconnect after 5 seconds if the chat is still open
        setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [dispatch]);

  const sendMessage = (messageText) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && activeAgent) {
      const payload = {
        receiver_id: activeAgent.id,
        receiver_type: activeAgent.user_type || "user", 
        message: messageText
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  return { sendMessage };
};