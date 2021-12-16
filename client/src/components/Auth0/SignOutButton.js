//import dependencies
import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

//import icon
import { FiUserX } from "react-icons/fi";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <LogOutButton
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        <FiUserX />
      </LogOutButton>
    )
  );
};

const LogOutButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 25px;
  font-weight:700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export default LogoutButton;
