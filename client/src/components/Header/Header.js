import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import styled from 'styled-components';

import SignInButton from '../Auth0/SignInButton'
import SignOutButton from '../Auth0/SignOutButton'

const Header = () => {
    const {isAuthenticated} = useAuth0();
    
    return(
        <Wrapper>
            <div>Nav Menu</div>
            <Logo alt='astro planner logo' src='../assets/Astro-Logo.png' />
            {isAuthenticated? <SignOutButton /> : <SignInButton />}
        </Wrapper>

    )

}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    box-shadow: 3px 0 10px #000;
    z-index: 100;
`

const Logo = styled.img`
    height: 80px;
    width: auto;
`

export default Header;