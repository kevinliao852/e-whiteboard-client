import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuth";
import { AuthStatus } from "../../features/auth/authSlice";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const Message = styled.h1`
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const Button = styled(Link)`
  padding: 0.8rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const NotLoggedIn = () => {
  const authStatus = useAuthStatus();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (authStatus === AuthStatus.Login) {
      const state = history.location.state as any;
      const pathname = state?.location.pathname;

      if (location.pathname === "/not-login") {
        history.push(pathname);
      }
    }
  }, [authStatus, history]);

  return (
    <Container>
      <Message>
        You are not logged in. Please log in to access this page.
      </Message>
      <Button to="/login">Go to Login</Button>
    </Container>
  );
};
