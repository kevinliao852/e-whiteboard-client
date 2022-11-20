import { emit } from "process";
import { FC } from "react";
import styled from "styled-components";
import { Button } from "./common/Button";
import { Container } from "./common/Container";
import { FlexDiv } from "./common/FlexDiv";

interface WhiteboardListProps {}

export const WhiteboardList: FC<WhiteboardListProps> = () => {
  const whiteboards = [
    { id: 0, name: "whiteboar01" },
    { id: 1, name: "whiteboard02" },
  ];

  return (
    <Container>
      <Button>create a new whiteboard</Button>
      <div>
        {whiteboards.map((whiteboard) => (
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
