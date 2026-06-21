import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Canvas } from "../whiteboard/Canvas";
import { useAppSelecter } from "../../app/hooks";
import { useChatWebSocket } from "../../hooks/useChat";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 1rem;
`;

const InfoContainer = styled.div`
  width: 90%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoItem = styled.div`
  font-size: 1rem;
  color: #333;
`;

const StatusIndicator = styled.span<{ connected: boolean }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.connected ? "#28a745" : "#dc3545")};
  margin-right: 0.5rem;
`;

const WhiteboardContainer = styled.div`
  flex: 2;
  width: 90%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 2px solid #ccc;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Whiteboard = styled.div`
  width: 100%;
  height: 400px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #e1f5fe;
  border-radius: 5px;
  border-left: 5px solid #007bff;
`;

const ChatInputContainer = styled.div`
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 0.5rem;
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Room = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValue, setInputValue] = React.useState("");
  const { messages, sendMessage } = useChatWebSocket(id);
  const status = useAppSelecter((state) => state.whiteboard.status);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container>
      <InfoContainer>
        <InfoItem>
          <StatusIndicator connected={status === "connected"} />
          Room ID: {id}
        </InfoItem>
        <InfoItem>Status: {status}</InfoItem>
      </InfoContainer>
      <WhiteboardContainer>
        <Whiteboard>
          <Canvas />
        </Whiteboard>
      </WhiteboardContainer>
      <ChatContainer>
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index}>{message}</Message>
          ))}
        </ChatMessages>
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <SendButton onClick={handleSendMessage}>Send</SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </Container>
  );
};
