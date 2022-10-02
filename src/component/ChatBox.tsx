import { useEffect, useState, useRef } from "react";

export const ChatBox = (): JSX.Element => {
  const [socket, setSocket] = useState<WebSocket>();
  const [input, setInput] = useState<string>("");
  const [text, setText] = useState<Array<String>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const host = process.env.REACT_APP_WEBSOCKET_CHAT_HOST as string;
    const sockInstance = new WebSocket(host);
    setSocket(sockInstance);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = function ({ data }) {
      setText([...text, data]);
    };
  }, [text, socket]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.send(input);
  };

  const renderChatMessage = () =>
    text.map((item, index) => <p key={index}>{item}</p>);
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
