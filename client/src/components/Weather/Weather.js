import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext'
import { useAuth0 } from "@auth0/auth0-react";

const Weather = () => {
    const { user, isAuthenticated } = useAuth0();
    const {state, setLoadingState, unsetLoadingState} = useContext(UserContext);
    
    const lat = 51;
    const lon = -114
    
    useEffect( () => {
        setLoadingState()

        fetch(`/forecast/?${lat}&lon=${lon}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.status !== 200) {
            console.log(data);
            } else {
            console.log(data.forecast);
            unsetLoadingState();
            }
        });
  }, []); // eslint-disable-line

    return (
        <div>Weather Forecast</div>
    )
}

export default Weather;