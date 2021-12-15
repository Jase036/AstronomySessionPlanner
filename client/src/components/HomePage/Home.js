import React from 'react';
import styled from 'styled-components';

const Home = () => {

    return (
        <Wrapper>
            <HomeImage alt='deep space photos' src='../assets/Whirpool.jpg' />
            <Welcome>Welcome to Astronomy Session Planner!</Welcome>
            <Welcome>This app will help you plan you observing or imaging session by providing all you need:</Welcome>
            <Welcome>Based on your location you can view weather forecasts, a catalog of deep space object visible from your location, session scheduler and ability to record notes!*</Welcome>
            <Welcome>Select your location and let's begin planning your next astronomy session.</Welcome>
            <Note>*Please note that some features, like the scheduler, require you to sign in</Note>
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

const Welcome = styled.p`
    max-width: 1100px;
    font-size:25px;
    text-align: center;
    margin: 5px 80px;
`
const Note = styled.p`
    max-width: 1100px;
    font-size:18px;
    text-align: center;
    margin: 5px 80px;
`
export default Home;