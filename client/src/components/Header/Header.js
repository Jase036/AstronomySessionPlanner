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
            <div>Logo Title</div>
            {isAuthenticated? <SignOutButton /> : <SignInButton />}
        </Wrapper>

    )

}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

export default Header;