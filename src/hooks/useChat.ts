import { useEffect, useRef, useState } from "react";
import {
  API_SERVER_HOST,
  WEBSOCKET_CHAT_HOST,
  getWebSocketHostErrorMessage,
} from "../config/config";
import {
  buildApiUrl,
  getApiHostErrorMessage,
  parseJsonResponse,
} from "../utils/api";

interface ChatHistoryItem {
  id: number;
  "room-id": string;
  "sender-id": number;
  "sender-name": string;
  message: string;
}

export interface ChatMessage {
  id: number;
  roomId: string;
  senderId: number;
  senderName: string;
  message: string;
}

function normalizeChatMessage(item: ChatHistoryItem): ChatMessage {
  return {
    id: item.id,
    roomId: item["room-id"],
    senderId: item["sender-id"],
    senderName: item["sender-name"],
    message: item.message,
  };
}

export function useChatWebSocket(id?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

        setMessages(history.map(normalizeChatMessage));
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
    if (!id || !historyLoaded) {
      return;
    }

    const configError = getWebSocketHostErrorMessage(
      WEBSOCKET_CHAT_HOST,
      "REACT_APP_WEBSOCKET_CHAT_HOST",
    );

    if (configError) {
      console.error(configError);
      return;
    }

    const ws = new WebSocket(`${WEBSOCKET_CHAT_HOST}/${id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as ChatHistoryItem;
        setMessages((prev) => [...prev, normalizeChatMessage(parsed)]);
      } catch {
        console.warn("Ignoring malformed chat message payload", event.data);
      }
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
