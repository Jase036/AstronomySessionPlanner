import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <LogOutButton
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        Log Out
      </LogOutButton>
    )
  );
};

const LogOutButton = styled.button`
  padding: 8px 20px;
  background-color: var(--cool-gray);
  color: white;
  border-radius: 10px;
  border: 4px solid white;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    transition: all 0.2s ease-in-out;
    transform: scale(1.1);
  }
`;

export default LogoutButton;
