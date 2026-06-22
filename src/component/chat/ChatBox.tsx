import { useEffect, useState, useRef } from "react";
import {
  WEBSOCKET_CHAT_HOST,
  getWebSocketHostErrorMessage,
} from "../../config/config";

type ChatMessage = {
  id: number;
  "room-id": string;
  "sender-id": number;
  "sender-name": string;
  message: string;
};

export const ChatBox = (): JSX.Element => {
  const [socket, setSocket] = useState<WebSocket>();
  const [input, setInput] = useState<string>("");
  const [text, setText] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const configError = getWebSocketHostErrorMessage(
      WEBSOCKET_CHAT_HOST,
      "REACT_APP_WEBSOCKET_CHAT_HOST",
    );

    if (configError) {
      console.error(configError);
      return;
    }

    const sockInstance = new WebSocket(WEBSOCKET_CHAT_HOST);
    setSocket(sockInstance);

    return () => {
      sockInstance.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = function ({ data }) {
      try {
        const parsed = JSON.parse(data) as ChatMessage;
        setText((prev) => [...prev, parsed]);
      } catch {
        console.warn("Ignoring malformed chat message payload", data);
      }
    };
  }, [socket]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.send(input);
  };

  const renderChatMessage = () =>
    text.map((item) => (
      <p key={item.id}>
        <strong>{item["sender-name"]}:</strong> {item.message}
      </p>
    ));
  return (
    <div>
      <div>{renderChatMessage()}</div>
      <form onSubmit={onHandleSubmit}>
        <input
          ref={inputRef}
          className="ui input"
          name="text"
          value={input}
          onChange={onInputChange}
        />
        <button className="ui button">submit</button>
      </form>
    </div>
  );
};
