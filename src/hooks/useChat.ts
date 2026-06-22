import { useEffect, useRef, useState } from "react";
import { API_SERVER_HOST } from "../config/config";
import {
  buildApiUrl,
  getApiHostErrorMessage,
  parseJsonResponse,
} from "../utils/api";

interface ChatHistoryItem {
  id: number;
  "room-id": string;
  message: string;
}

export function useChatWebSocket(id?: string) {
  const [messages, setMessages] = useState<string[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
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

    if (!id) {
      setMessages([]);
      setHistoryError(null);
      setHistoryLoaded(false);
      return () => {
        isActive = false;
      };
    }

    fetch(
      buildApiUrl(API_SERVER_HOST, "/v1/chat-messages", {
        "room-id": id,
      }),
      {
        credentials: "include",
      },
    )
      .then((response) => parseJsonResponse<ChatHistoryItem[]>(response))
      .then((history) => {
        if (!isActive) {
          return;
        }

        setMessages(history.map((item) => item.message));
        setHistoryError(null);
        setHistoryLoaded(true);
      })
      .catch((error: Error) => {
        if (!isActive) {
          return;
        }

        setHistoryError(error.message);
        setHistoryLoaded(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    const host = process.env.REACT_APP_WEBSOCKET_CHAT_HOST;
    if (!host || !id || !historyLoaded) {
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
  }, [historyLoaded, id]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  };

  return { messages, sendMessage, historyError };
}
