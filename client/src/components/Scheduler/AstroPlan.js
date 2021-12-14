import React, { useContext, useEffect } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_readonly'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_all_timed'
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { AstroContext } from '../context/AstroContext';


//Create a window object - required by the DHTMLX library.
//Initialize the container that will wrap the scheduler library
const scheduler = window.scheduler;
let schedulerContainer=''

//This component initializes the week scheduler
const AstroPlan = () => {
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
    }, []); // eslint-disable-line
    
    //  Things to happen on mount 
    useEffect(() => {
        
        
            //configure the toolbar
        scheduler.config.header = [
            'day',
            'week',
            'date',
            'prev',
            'today',
            'next',
        ];

        scheduler.config.lightbox.sections=[
            {name:"Description", height:72, map_to:"text", type:"textarea" , focus:true},
            {name:"Notes", height:200, map_to:"notes", type:"textarea"},
            { name:"time",        height:72, type:"time",     map_to:"auto"} 
        ];

        //initialize the scheduler and parse the incoming events

        scheduler.config.drag_resize = false;
        scheduler.config.drag_move = false;
        scheduler.config.details_on_create = true;
        scheduler.config.details_on_dblclick = true;
        scheduler.config.icons_select = ["icon_details","icon_delete"];
        scheduler.config.prevent_cache = true;
        scheduler.config.hour_size_px = 30;
        scheduler.parse(plan);
        scheduler.attachEvent("onBeforeDrag",block_readonly)
		scheduler.attachEvent("onClick",block_readonly)
        scheduler.attachEvent("onEventDrag",block_readonly)
        scheduler.attachEvent('onEventAdded', (id, ev) => {onDataUpdated('create', ev, id);});
        scheduler.attachEvent('onEventChanged', (id, ev) => {onDataUpdated('update', ev, id)});
        scheduler.attachEvent('onEventDeleted', (id, ev) => {onDataUpdated('delete', ev, id)});
        
        scheduler.config.all_timed = 'short'
        scheduler.init(schedulerContainer, new Date(2021, 11, 13));
        
    }, [plan])


    const block_readonly = (id) => {
            
        if (!id) return false
        return scheduler.getEvent(id).readonly
    }
    
    const onDataUpdated = (action, ev, id) => {
        switch (action) {
            case 'create':
                const newPlan = [...plan]
                setPlan(newPlan.push(ev));
                break;
            case 'update':
                const updateIndex = plan.findIndex((ev) => ev.id === id)
                const updatePlan = plan.splice(updateIndex,1, ev);
                setPlan(updatePlan);
                break;
            case 'delete':
                const deleteIndex = plan.findIndex((ev) => ev.id === id)
                const deletePlan = plan.splice(deleteIndex,1);
                setPlan(deletePlan);
                break;
        }
    };
    
    // return the wrapped scheduler and use the ref attribute to make the element selectable
    return <ScheduleWrapper ref={ (input) => { schedulerContainer = input } }></ScheduleWrapper>
    
}


const ScheduleWrapper = styled.div`
    width: 100vw;
    height: 87vh;
    background-color: #555;
    overflow:hidden;

& div.dhx_cal_date, 
.dhx_cal_tab_first,
.dhx_cal_today_button,
.dhx_cal_prev_button {
    color: #fff
}

& div.dhx_cal_event {
    opacity: 0.9;
}
`

export default AstroPlan;
