//import dependencies
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//import states & context
import { UserContext } from '../context/UserContext';

//import components
import Spinner from '../Loading/Spinner';
import RenderDay from './RenderDay';


//main weather component function
const Weather = () => {

    const {state, setLoadingState, unsetLoadingState, setForecast, setLocation, setSGForecast} = useContext(UserContext);
    const {forecast} = state

    const session = JSON.parse(localStorage.getItem('session'))
    
    let navigate = useNavigate()

    //if location changes we change our forecast
    useEffect( () => {
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
        } else {
            window.alert("No location has been set")
            navigate('/location/')
        }
        ;
  }, []); // eslint-disable-line


    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else {
        
        return (
            <Wrapper> 
                <h2>Weather Forecast for Latitude: {state.location.lat.toFixed(3)} & Longitude: {state.location.lon.toFixed(3)}</h2>
            {forecast?.map((day) => {
                
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