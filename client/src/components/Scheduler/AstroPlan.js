import React, { useContext, useEffect } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { AstroContext } from '../context/AstroContext';

//Create a window object - required by the DHTMLX library.
//Initialize the container that will wrap the scheduler library
const scheduler = window.scheduler;
let schedulerContainer=''

//This component initializes the week scheduler
const AstroPlan = ({events}) => {
    const {state, setLoadingState, unsetLoadingState } = useContext(UserContext)
    const {plan, setPlan} = useContext(AstroContext)

    useEffect(() => {
        setLoadingState()
        fetch('/plan/')
        .then((res) => res.json())
        .then((data) => {
            if (data.status !== 200) {
                console.log(data)
            } else {
                setPlan(data.data);
                unsetLoadingState();
            }
        })
    }, []);
    
    //  Things to happen on mount 
    useEffect(() => {
        
        //configure the toolbar
        scheduler.config.header = [
            'day',
            'week',
            'date',
            'prev',
            'today',
            'next'
        ];

        //initialize the scheduler and parse the incoming events
        scheduler.init(schedulerContainer, new Date(2021, 11, 13));
        scheduler.clearAll();
        scheduler.parse(plan);
    }, [])

    
    // return the wrapped scheduler and use the ref attribute to make the element selectable
    return <ScheduleWrapper ref={ (input) => { schedulerContainer = input } }></ScheduleWrapper>
    
}


const ScheduleWrapper = styled.div`
    width: 100vw;
    height: 100vh;
`

export default AstroPlan;
