import React from 'react';
import styled from 'styled-components';


const RenderDay = ({day}) => {

    return(
        <Wrapper>
            <p> Weather Forecast </p>
            <p>{day.date}</p>
            <p>sunrise_time{day.sunrise_time}</p>
            <p>sunset_time{day.sunset_time}</p>
            <p>moonrise_time{day.moonrise_time}</p>
            <p>moonset_time{day.moonset_time}</p>
        </Wrapper>
    )
}

{/* "sunrise_time": "09:25",
        "sunset_time": "17:30",
        "moonrise_time": "12:28",
        "moonset_time": "19:53",
        "temp_max_c": -14.4,
        "temp_max_f": 6.1,
        "temp_min_c": -16.5,
        "temp_min_f": 2.3,
        "precip_total_mm": 0,
        "precip_total_in": 0,
        "rain_total_mm": 0,
        "rain_total_in": 0,
        "snow_total_mm": 0,
        "snow_total_in": 0,
        "prob_precip_pct": 0,
        "humid_max_pct": 97,
        "humid_min_pct": 94,
        "windspd_max_mph": 4,
        "windspd_max_kmh": 7,
         */}

const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
`


export default RenderDay;
