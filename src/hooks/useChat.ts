import { useEffect, useRef, useState } from "react";
import { API_SERVER_HOST } from "../config/config";
import { getApiHostErrorMessage, parseJsonResponse } from "../utils/api";

interface ChatHistoryItem {
  id: number;
  "room-id": string;
  message: string;
}

export function useChatWebSocket(id: string) {
  const [messages, setMessages] = useState<string[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    let isActive = true;
    const configError = getApiHostErrorMessage(API_SERVER_HOST);

    if (configError) {
      setHistoryError(configError);
      return () => {
        isActive = false;
      };
    }

    fetch(`${API_SERVER_HOST}/chatMessages?room-id=${id}`)
      .then((response) => parseJsonResponse<ChatHistoryItem[]>(response))
      .then((history) => {
        if (!isActive) {
          return;
        }

        setMessages(history.map((item) => item.message));
        setHistoryError(null);
      })
      .catch((error: Error) => {
        if (!isActive) {
          return;
        }

        setHistoryError(error.message);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

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

  return { messages, sendMessage, historyError };
}
