//import dependencies
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid'
import styled from 'styled-components';

//import state & context
import { AstroContext } from '../context/AstroContext'; 
import { UserContext } from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';

//import modules
import Spinner from '../Loading/Spinner';

//declare the column info for the data grid
const columns = [
    { 
        field: 'name',
        headerName: 'Catalog Name',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 130,
        valueGetter: (params) => params.row.fields.name
    },
    { 
        field: 'common_names', 
        headerName: 'Common Names',
        numeric: false, 
        disablePadding: true,
        editable: false,
        width: 180, 
        valueGetter: (params) => params.row.fields.common_names,
    },
    {
        field: 'v_mag',
        headerName: 'Apparent Magnitude',
        numeric: true,
        disablePadding: false,
        editable: false,
        width: 100, 
        valueGetter: (params) => params.row.fields.v_mag,
    },
    {
        field: 'object_definition',
        headerName: 'Object Type',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.object_definition,
    },
    {
        field: 'ra',
        headerName: 'RA',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.ra,
    },
    {
        field: 'dec',
        headerName: 'DEC',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.dec,
    },
];

//get today's date for the date picker
let today = new Date();
today = Number(today.getDate())

const Catalog = () => {
    
    //initialize state and context
    const { user, isAuthenticated } = useAuth0();
    const {astroCatalog, setAstroCatalog, selectedObjects, setSelectedObjects } = useContext(AstroContext);
    const { state, setLoadingState, unsetLoadingState, setLocation } = useContext(UserContext);
    const [sessionDate,setSessionDate] = useState(today)
    
    //declare variables that require hoisting
    let navigate = useNavigate();
    let {lat, lon} = state.location;
    

    //get session info from localStorage
    const session = JSON.parse(localStorage.getItem('session'))

    useEffect(() => {
        if (!state.location.lat && session) {    
            setLocation(session.location);
        }
    }, []); // eslint-disable-line
    
    // If the location changes, fetch the catalog data again
    useEffect( () => {

        setLoadingState()
        if (lat) {
            fetch(`/astro/?lat=${lat}&lon=${lon}`, {
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
                setAstroCatalog(data.data);
                unsetLoadingState();
                }
            })
        }
        
    }, [state.location]); // eslint-disable-line

    //sends the selected objects and other info to BE to create the plan for the scheduler.
    const createPlan = () => {
        
        //check to see if objects have been selected
        if (selectedObjects.length === 0) {
            window.alert("You must select at least one object to create a plan!")
        } 
        
        else {

            //prep the info to be sent in the body of our post
            const planData = { selectedObjects, email: user.email, date: sessionDate }
            
            //send it to the BE and then navigate to the scheduler to view the plan
            fetch("/add-plan/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                },
                body: JSON.stringify(planData),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== 200) {
                console.log(data);
                window.alert(`${data.message}. Please select a different day or modify your existing plan through the schedule`)
                } else {
                    navigate('/schedule/')
                }
            })
        }
    }

    //handles change on the date selector
    const handleChange = (ev) => {
        setSessionDate(ev.target.value)
    }

    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else { 
        return (
            <Wrapper >
                {isAuthenticated && <PlanButton onClick={createPlan}>Create Plan!</PlanButton>}
                {isAuthenticated && 
                    <DateSelect>
                        <label>Choose a date</label>
                        <select name='date' onChange={handleChange}>
                            <option value={today}>{today}</option>
                            <option value={today +1}>{today + 1}</option>
                            <option value={today +2}>{today + 2}</option>
                            <option value={today +3}>{today + 3}</option>
                        </select>
                    </DateSelect>
                }
                <DataGrid
                rows={astroCatalog}
                getRowId={(astroCatalog) => astroCatalog._id}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(newSelection) => {
                    setSelectedObjects(newSelection);
                }}
                
                />
            </Wrapper>
            );
        }
        

}

const Wrapper = styled.div`
    height: 780px; 
    width: '100%';
    position: relative;

& .MuiDataGrid-root.css-1nytev6-MuiDataGrid-root {
    border:none; !important  
    }

`

const PlanButton = styled.button`
    background-color: #eee;
    color: #555;
    border: none;
    font-size: 20px;
    position: absolute;
    right: 15px;
    margin-top: 15px;
    cursor: pointer;
    box-shadow: 2px 2px 3px #333;
    transition: all 0.2s ease-in-out;
    z-index: 90;

&:hover {
    transform: scale(1.1);
    
}
`

const DateSelect = styled.div`
    z-index: 95;
    position: absolute;
    right: 150px;
    margin-top: 9px;
    display:flex;
    flex-direction:column;
`
export default Catalog;