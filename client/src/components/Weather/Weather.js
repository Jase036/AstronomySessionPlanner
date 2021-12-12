import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import {useNavigate} from 'react-router-dom'
import Spinner from '../Loading/Spinner';
import RenderDay from './RenderDay';
import { useAuth0 } from '@auth0/auth0-react';


const Weather = () => {
    let navigate = useNavigate();
    const { user, isAuthenticated } = useAuth0;
    const {state, setLoadingState, unsetLoadingState, setForecast, setLocation} = useContext(UserContext);

    let {lat, lon} = state.location
    const session = JSON.parse(localStorage.getItem('session'))

    useEffect( () => {
    if (!state.location && session) {    
        setLocation(session.location);
        lat = session.location.lat;
        lon = session.location.lat;
    }
    }, []); // eslint-disable-line

    useEffect( () => {
        
        if (!state.hasLoaded && !lat ) {
            
            window.alert("Please select a location first");
            navigate('/location')
            
        } 
        else { 
            setLoadingState()
            fetch(`/forecast/?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`, {
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
            unsetLoadingState();
            }
        }) }
    
        ;
  }, [state.location]); // eslint-disable-line

    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else {
        return (
            
            <div> 
                <p>Weather Forecast for Latitude:{state.location.lat} & Longitude:{state.location.lon}</p>
            {state.forecast.Days.map((day) => {
                console.log(day)
                return (
                    <div key={day.date}>
                        <RenderDay day={day}/>
                    </div>
                )
            })}
            </div>
        )
    }
}

export default Weather;