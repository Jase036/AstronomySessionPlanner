import { useAuth0 } from '@auth0/auth0-react';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import SignInButton from '../Auth0/SignInButton'
import SignOutButton from '../Auth0/SignOutButton'
import { AstroContext } from '../context/AstroContext';
import NavMenu from './NavMenu';

const Header = () => {
    const { user, isAuthenticated } = useAuth0();
    const { setPlan } = useContext(AstroContext)

    useEffect(() => {
        if (isAuthenticated) {
            fetch("/user/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                },
                body: JSON.stringify(user),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== 200) {
                console.log(data);
                } else {
                    setPlan(data.data)
                }
            })
        }
    }, [isAuthenticated]);


    return(
        <Wrapper>
            <NavMenu />
            <Logo alt='astro planner logo' src='../assets/Astro-Logo.png' />
            <User>
                {isAuthenticated? <SignOutButton /> : <SignInButton />}
                {isAuthenticated? <p> Hi, {user.given_name}</p> : null}
            </User>
        </Wrapper>

    )

}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    box-shadow: 3px 0 10px #000;
    z-index: 100;
    align-items: center;
    
}
`

const Logo = styled.img`
    height: 80px;
    width: auto;

`
const User = styled.div`
    display:flex;
    flex-direction: column;
`

export default Header;