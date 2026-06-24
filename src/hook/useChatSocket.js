import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { addMessage, setConnectionStatus } from '../store/chatSlice';

export const useChatSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { activeAgent } = useSelector((state) => state.chat);

  useEffect(() => {
    const token = Cookies.get("access_token")?.replace(/['"]+/g, '').trim();
    if (!token) return;

    // Use the WS URL from your requirement
    const wsUrl = `ws://127.0.0.1:8000/api/v1/ws/admin/chat?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => dispatch(setConnectionStatus(true));
    socketRef.current.onclose = () => dispatch(setConnectionStatus(false));
    
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Backend returns "event": "sent" or "event": "message"
      dispatch(addMessage(data));
    };

    return () => {
      socketRef.current?.close();
    };
  }, [dispatch]);

  const sendMessage = (messageText) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && activeAgent) {
      const payload = {
        receiver_id: activeAgent.id,
        receiver_type: activeAgent.user_type, // "user" based on your JSON
        message: messageText
      };
      socketRef.current.send(JSON.stringify(payload));
      
      // Optimistically add to UI (optional, usually handled by 'onmessage' response)
    }
  };

  return { sendMessage };
};