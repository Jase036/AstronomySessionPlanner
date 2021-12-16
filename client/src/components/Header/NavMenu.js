//import dependencies
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';


const NavMenu = () => {
    const {isAuthenticated} = useAuth0();

    return(
        <Wrapper>
            <Menu to='/' >Home</Menu>
            <Menu to='/location' >Location</Menu>
            <Menu to='/weather' >Weather</Menu>
            <Menu to='/catalog' >Catalog</Menu>
            {isAuthenticated && <Menu to='/schedule' >Schedule</Menu>}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;

`
const Menu = styled(NavLink)`
    color: #fff;
    margin: 10px;
    font-size: 20px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;

&:hover {
    transform: scale(1.1);
    color: teal;
    text-decoration: underline;
`
export default NavMenu;