import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { API_SERVER_HOST } from "../../config/config";
import { useAppSelecter } from "../../app/hooks";
import { selectUserId } from "../../features/user/userSlice";

interface WhiteboardListProps {}

interface Whiteboard {
  id: string;
  name: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const WhiteboardContainer = styled.div`
  width: 90%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const WhiteboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WhiteboardItem = styled.div`
  padding: 1rem;
  background-color: #e1f5fe;
  border-radius: 8px;
  border-left: 5px solid #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b3e5fc;
  }
`;

export const NewWhiteboardList = () => {
  const userId = useAppSelecter(selectUserId);
  const history = useHistory();

  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);

  useEffect(() => {
    if (!userId) return;

    getWhiteboardList(userId.toString()).then(setWhiteboards);
  }, [userId]);

  const handleWhiteboardClick = (id: string) => {
    history.push(`/rooms/${id}`);
  };

  return (
    <Container>
      <Title>All Whiteboards</Title>
      <WhiteboardContainer>
        <WhiteboardListContainer>
          {whiteboards.map((whiteboard) => (
            <WhiteboardItem
              key={whiteboard.id}
              onClick={() => handleWhiteboardClick(whiteboard.id)}
            >
              {whiteboard.name} (ID: {whiteboard.id})
            </WhiteboardItem>
          ))}
        </WhiteboardListContainer>
      </WhiteboardContainer>
    </Container>
  );
};

function deleteWhiteboard(id: string) {
  return fetch(`${API_SERVER_HOST}/v1/whiteboards/${id}`, {
    method: "DELETE",
  });
}

function createWhiteboard(whiteboardData: { name: string; userId: number }) {
  const { name, userId } = whiteboardData;

  return fetch(`${API_SERVER_HOST}/v1/whiteboards`, {
    method: "POST",
    body: JSON.stringify({ "user-id": userId, name }),
  });
}

function getWhiteboardList(userId: string) {
  return fetch(`${API_SERVER_HOST}/v1/whiteboards?user-id=${userId}`).then(
    (resposne) => resposne.json(),
  );
}
