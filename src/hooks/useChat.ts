import { useEffect, useRef, useState } from "react";

export function useChatWebSocket(id: string) {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const host = process.env.REACT_APP_WEBSOCKET_CHAT_HOST;
    if (!host) {
      console.error("REACT_APP_WEBSOCKET_CHAT_HOST is not defined");
      return;
    }

    const ws = new WebSocket(`${host}/${id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.close();
    };
  }, [id]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  };

  return { messages, sendMessage };
}
