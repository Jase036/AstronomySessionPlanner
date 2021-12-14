import React from 'react';
import styled from 'styled-components';



const RenderDay = ({day, sg}) => {
    
    const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dateArr = day.date.split('/').reverse();
    const dateString = dateArr.join('-')

    
    const astroForecast = sg.filter((dayObject) => {
        return dayObject.time.includes(dateString)
    })
    

    let fTime=[]
    let formattedTimeArray = []
    let fillArray = []
    if (day.Timeframes.length < 8){
        const tempArray = Array(8-day.Timeframes.length).fill('')
        fillArray = tempArray.concat(day.Timeframes)
    } else {
        fillArray = [...day.Timeframes]
    }
    
    fillArray.forEach((timeSlotDetails)=>{
        if (timeSlotDetails !== '') {
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
        } else {
            formattedTimeArray.push('')
        }
        })
    
    
    return(
        <>
        <Wrapper>
            <DetailsContainer>
                <Date>
                    <Day>{dateArr[2]}</Day>
                    <Month>{months[dateArr[1] - 1]}</Month>
                    <Year>{dateArr[0]}</Year>
                </Date>
                <MoonData>
                    <p>Moon Phase img here</p>
                    <p>{Math.floor(astroForecast[0]?.moonFraction*100)}% </p>
                    <p>moonrise_time{day.moonrise_time}</p>
                    <p>moonset_time{day.moonset_time}</p>
                    <p>sunrise_time{day.sunrise_time}</p>
                    <p>sunset_time{day.sunset_time}</p>
                </MoonData>
                <HourData>
                    {formattedTimeArray.map((timeSlot,i)=>{
                            return (
                            <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlot}</p>
                            )
                        })
                    }
                </HourData>
                
                <Clouds>Cloud (Coverage %)</Clouds>
                <CloudsData>
                    { fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlotDetails.cloudtotal_pct}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </CloudsData>
                
                <Prec>Precipitation Probability</Prec>
                <PrecpData>
                    {fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlotDetails.prob_precip_pct}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </PrecpData>
                
                <Temp>Temperature (&deg;C)</Temp>
                <TempData>
                    {fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlotDetails.temp_c}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </TempData>

                <Visib>Visibility (Km)</Visib>
                <VisibData>
                    {fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlotDetails.vis_km}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </VisibData>

                <Dew>Dew Point (&deg;C)</Dew>
                <DewData>
                    {fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}>{timeSlotDetails.dewpoint_c}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </DewData>
                
                
                
                <Wind>Wind Speed and Direction (Km, compass)</Wind>
                <WindData>
                    {fillArray.map((timeSlotDetails, i)=>{
                            if (timeSlotDetails !== '') {
                                return <p key={timeSlotDetails.time}>{timeSlotDetails.windspd_kmh} <br /> {timeSlotDetails.winddir_compass}</p>
                            } else {
                                return <p key={i*Math.floor((Math.random()*10000)+1)}></p>
                            }
                        })
                    }
                </WindData>
                
                
                
            </DetailsContainer>
            
        </Wrapper>
        </>
    )
}


const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    padding: 30px;
`
const MoonData = styled.div`
    display:flex;
    flex-direction: column;
    grid-area: Moon-Sun-Info;
`
const DetailsContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 2.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr;
    gap: 5px 5px;
    grid-auto-flow: row;
    grid-template-areas:
        "Date Moon-Sun-Info HourData HourData HourData HourData HourData HourData HourData HourData"
        "Clouds Clouds CloudsData CloudsData CloudsData CloudsData CloudsData CloudsData CloudsData CloudsData"
        "Prec Prec PrecpData PrecpData PrecpData PrecpData PrecpData PrecpData PrecpData PrecpData"
        "Temp Temp TempData TempData TempData TempData TempData TempData TempData TempData"
        "Visib Visib VisibData VisibData VisibData VisibData VisibData VisibData VisibData VisibData"
        "Dew Dew DewData DewData DewData DewData DewData DewData DewData DewData"
        "Wind-Spd-Dir Wind-Spd-Dir WindData WindData WindData WindData WindData WindData WindData WindData";
`

const HourData = styled.div `
    grid-area: HourData;
    display: flex;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;

}
`

const Year = styled.p`
    font-size: 25px;
`
const Month = styled.p`
    font-size: 20px;
`
const Day = styled.p`
    font-size: 40px;
`

const Prec = styled.div `
    grid-area: Prec;
`

const PrecpData = styled.div `
    display: flex;
    grid-area: PrecpData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

const Temp = styled.div `
    grid-area: Temp;
`

const TempData = styled.div `
    display: flex;
    grid-area: TempData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

const Visib = styled.div `
    grid-area: Visib;
`

const VisibData = styled.div `
    display: flex;
    grid-area: VisibData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

const Dew = styled.div `
    grid-area: Dew;
`

const DewData = styled.div `
    display: flex;
    grid-area: DewData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

const Date = styled.div `
    display:flex;
    flex-direction: column;
    margin-right: 10px
    justify-content:center;
    align-items: center;
    grid-area: Date;
`

const Clouds = styled.div `
    grid-area: Clouds;
`
const CloudsData = styled.div `
    display: flex;
    grid-area: CloudsData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

const Wind = styled.div `
    grid-area: Wind-Spd-Dir;
`

const WindData = styled.div `
    display: flex;
    grid-area: WindData;
    justify-content: space-between;

& p {
    width: 60px;
    margin: 5px;
    text-align: center;
}
`

export default RenderDay;