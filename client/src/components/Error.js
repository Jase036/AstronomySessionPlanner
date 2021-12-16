//import dependencies
import React from 'react';
import styled from 'styled-components';

const Home = () => {

    return (
        <Wrapper>
            <HomeImage alt='deep space photos' src='../assets/error.jpg' />
            <ErrorMessage>404 Error</ErrorMessage>
            <Message>There are a LOT of things in the night sky, but we couldn't find what you're looking for here.</Message>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const HomeImage = styled.img`
    margin: 25px 80px;
    box-shadow: 2px 2px 4px #222;
    max-width: 1100px;
`

const Message = styled.p`
    max-width: 1100px;
    font-size:25px;
    text-align: center;
    margin: 5px 80px;
`

const ErrorMessage = styled.p`
    max-width: 1100px;
    font-size:80px;
    text-align: center;
    margin: 5px 80px;
`
export default Home;