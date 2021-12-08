import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import {useNavigate} from 'react-router-dom'
import Spinner from '../Loading/Spinner';
import RenderDay from './RenderDay';


const Weather = () => {
    let navigate = useNavigate();
    // const { user, isAuthenticated } = useAuth0();
    const {state, setLoadingState, unsetLoadingState, setForecast} = useContext(UserContext);

    const {lat, lon} = state.location

    if (!lat) {
        window.alert("Please select a location first");
        navigate('/location')
    }

    useEffect( () => {
        setLoadingState()

        fetch(`/forecast/?lat=${lat}&lon=${lon}`, {
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
        });
  }, []); // eslint-disable-line

    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else {
        return(
            state.forecast.Days.map((day) => {
                console.log(day)
                return (
                <RenderDay key={day.date} day={day}/>
                )
            })
        )
    }
}

export default Weather;