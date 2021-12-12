import React from 'react';
import styled from 'styled-components';



const RenderDay = ({day}) => {
    
    let fTime=[]
    let formattedTimeArray = []
    day.Timeframes.forEach((timeSlotDetails)=>{
        switch (timeSlotDetails.time.toString().length) {
            case 1:
                formattedTimeArray.push('00:00')
                break;
            case 3:
                fTime = timeSlotDetails.time.toString().split("");
                fTime.splice(0, 0, "0");
                fTime.splice(2, 0, ':');
                formattedTimeArray.push(fTime.join(''));
                break;
            case 4:
                fTime = timeSlotDetails.time.toString().split("");
                fTime.splice(2, 0, ':');
                formattedTimeArray.push(fTime.join(''));
                break;
        }
        })
    
    
    return(
        <Wrapper>
            <VisibleAlways>
                <div>{day.date}</div>
                <MoonData>
                    <p>Moon Phase img here</p>
                    <p>illumination % here</p>
                    <p>moonrise_time{day.moonrise_time}</p>
                    <p>moonset_time{day.moonset_time}</p>
                </MoonData>
                <DataRow>
                    {formattedTimeArray.map((timeSlot)=>{
                            return <p key={timeSlot}>{timeSlot}</p>
                        })
                    }
                </DataRow>
                <p>sunrise_time{day.sunrise_time}</p>
                <p>sunset_time{day.sunset_time}</p>
            </VisibleAlways>
            <DetailsContainer>
                <DataGridRow>
                    <p>Total Clouds</p>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.cloudtotal_pct}</p>
                        })
                    }
                </DataGridRow>
                <DataGridRow>
                    <p>Prec Prob</p>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.prob_precip_pct}</p>
                        })
                    }
                </DataGridRow>
                <DataGridRow>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.temp_c}</p>
                        })
                    }
                </DataGridRow>
                <DataGridRow>
                    <p>Visib</p>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.vis_km}</p>
                        })
                    }
                </DataGridRow>
                <DataGridRow>
                    <p>Dew</p>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.dewpoint_c}</p>
                        })
                    }
                </DataGridRow>
                <DataGridRow>
                    <p>Wind Spd and Dir</p>
                    {day.Timeframes.map((timeSlotDetails)=>{
                            return <p key={timeSlotDetails.time}>{timeSlotDetails.winddir_compass}, {timeSlotDetails.windspd_kmh}</p>
                        })
                    }
                </DataGridRow>
            </DetailsContainer>
            
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
const MoonData = styled.div`
    display:flex;
    flex-direction: column;
`
const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;

`
const VisibleAlways = styled.div`
    display:flex;
`
const DataRow = styled.div`
    display: flex;

& p {
    margin:5px;

}
`
const DataGridRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    border: 1px solid red;
    
& p {
    flex-grow: 1;

}

& p:nth-child(1) {
    flex-grow: 3;
    }


`
export default RenderDay;
