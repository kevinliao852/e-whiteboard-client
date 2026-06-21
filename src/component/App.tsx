import styled from "styled-components";
import { GoogleAuthContextStore } from "../contexts/GoogleAuthContext";
import { Routes } from "./Routes";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const App = (): JSX.Element => {
  return (
    <Container>
      <GoogleAuthContextStore>
        <Routes />
      </GoogleAuthContextStore>
    </Container>
  );
};
