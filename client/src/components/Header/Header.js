//import dependencies
import React, {useContext, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

//import components
import SignInButton from '../Auth0/SignInButton'
import SignOutButton from '../Auth0/SignOutButton'
import NavMenu from './NavMenu';
import { UserContext } from '../context/UserContext';


const Header = () => {
    const { user, isAuthenticated } = useAuth0();
    const {setForecast, setSGForecast, setLoadingState, unsetLoadingState, setLocation} = useContext(UserContext)
    const session = JSON.parse(localStorage.getItem('session'))

    useEffect(() => {
        if (session) {    
            setLocation(session.location);
        
            setLoadingState()
            fetch(`/forecast/?lat=${session.location.lat.toFixed(3)}&lon=${session.location.lon.toFixed(3)}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== 200) {
                console.log(data);
                } else {
                setForecast(data.forecast);
                setSGForecast(data.sgForecast)
                unsetLoadingState();
                }
            }) 
        }
        ;
    }, []); // eslint-disable-line

    return(
        <Wrapper>
            <NavMenu />
            <Logo alt='astro planner logo' src='../assets/Astro-Logo.png' />
            <User>
                {isAuthenticated? <SignOutButton /> : <SignInButton />}
                {isAuthenticated? <p> Hi, {user.given_name}</p> : <p>Sign In</p>}
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