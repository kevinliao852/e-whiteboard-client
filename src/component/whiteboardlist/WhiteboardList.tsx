import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelecter } from "../../app/hooks";
import { API_SERVER_HOST } from "../../config/config";
import { selectUserId } from "../../features/user/user-slice";
import { Button } from "../common/Button";
import { Container } from "../common/Container";
import { FlexDiv } from "../common/FlexDiv";

interface WhiteboardListProps {}

interface Whiteboard {
  id: string;
  name: string;
}

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
    (resposne) => resposne.json()
  );
}

export const WhiteboardList: FC<WhiteboardListProps> = () => {
  const userId = useAppSelecter(selectUserId);
  const [list, setList] = useState<Whiteboard[]>([]);

  useEffect(() => {
    if (!userId) return;

    getWhiteboardList(userId.toString()).then(setList);
  }, [userId]);

  return (
    <Container>
      <Button>create a new whiteboard</Button>
      <div>
        {list.map((whiteboard) => (
          <WhiteboardRow key={whiteboard.id}>
            <div>{whiteboard.id}</div>
            <div>{whiteboard.name}</div>
            <div>
              <Button>delete</Button>
            </div>
          </WhiteboardRow>
        ))}
      </div>
    </Container>
  );
};

const WhiteboardRow = styled(FlexDiv)`
  align-items: center;
  justify-content: space-between;
  border-bottom-color: black;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 1rem;
`;

const WhiteboardCell = styled.div``;
