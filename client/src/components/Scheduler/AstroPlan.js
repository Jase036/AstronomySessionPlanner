import React, { useEffect } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
import styled from 'styled-components';

//Create a window object - required by the DHTMLX library.
//Initialize the container that will wrap the scheduler library
const scheduler = window.scheduler;
let schedulerContainer=''

//This component initializes the week scheduler
const AstroPlan = ({events}) => {
    
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
        scheduler.init(schedulerContainer, new Date(2020, 5, 10));
        scheduler.clearAll();
        scheduler.parse(events);
    }, [])

    
    // return the wrapped scheduler and use the ref attribute to make the element selectable
    return <ScheduleWrapper ref={ (input) => { schedulerContainer = input } }></ScheduleWrapper>
    
}


const ScheduleWrapper = styled.div`
    width: 100vw;
    height: 100vh;
`

export default AstroPlan;
