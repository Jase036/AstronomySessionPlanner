//import dependencies
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

//import states & context
import { UserContext } from '../context/UserContext';

//import components
import Spinner from '../Loading/Spinner';
import RenderDay from './RenderDay';


//main weather component function
const Weather = () => {

    const {state, setLoadingState, unsetLoadingState, setForecast, setLocation, setSGForecast} = useContext(UserContext);

    const session = JSON.parse(localStorage.getItem('session'))
    
    useEffect( () => {
        if (!state.location && session) {    
            setLocation(session.location);
        } 
    }, []); // eslint-disable-line
    
    //if location changes we change our forecast
    useEffect( () => {
        
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
    
        ;
  }, [state.location]); // eslint-disable-line


    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else {
        return (
            <Wrapper> 
                <h2>Weather Forecast for Latitude: {session.location.lat.toFixed(3)} & Longitude: {session.location.lon.toFixed(3)}</h2>
            {state.forecast.map((day) => {
                
                return (
                    <div key={day.date}>
                        <RenderDay day={day} sg={state.sgForecast}/>
                        <Divider></Divider>
                    </div>
                )
            })}
            </Wrapper>
        )
    }
}

const Wrapper = styled.div`
    margin-top: 10px;
    width: 100%;

& h2{
    margin: 10px auto;
    text-align:center;
}
`

const Divider = styled.div`
    width: 95%;
    margin: 0 auto;
    height: 5px;
    background-color: #ddd;
`
export default Weather;