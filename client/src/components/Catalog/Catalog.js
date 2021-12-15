import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Spinner from '../Loading/Spinner';
import { DataGrid } from '@mui/x-data-grid'


import { AstroContext } from '../context/AstroContext'; 
import { UserContext } from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const columns = [
    { 
        field: 'name',
        headerName: 'Catalog Name',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 150,
        valueGetter: (params) => params.row.fields.name
    },
    { 
        field: 'common_names', 
        headerName: 'Common Names',
        numeric: false, 
        disablePadding: true,
        editable: false,
        width: 200, 
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
        width: 100, 
        valueGetter: (params) => params.row.fields.object_definition,
    },
    {
        field: 'ra',
        headerName: 'Right Ascension',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 170, 
        valueGetter: (params) => params.row.fields.ra,
    },
    {
        field: 'dec',
        headerName: 'Declination',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 170, 
        valueGetter: (params) => params.row.fields.dec,
    },
  ];
  
  
const Catalog = () => {
    const { user, isAuthenticated, isLoading } = useAuth0
    const {astroCatalog, setAstroCatalog, selectedObjects, setSelectedObjects, plan, setPlan} = useContext(AstroContext);
    const { state, setLoadingState, unsetLoadingState, setLocation } = useContext(UserContext);
    

    let {lat, lon} = state.location;
    let navigate = useNavigate();

    const session = JSON.parse(localStorage.getItem('session'))

    useEffect( () => {
    if (!state.location.lat && session) {    
        setLocation(session.location);
        lat = session.location.lat;
        lon = session.location.lon;
    }

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

    
    useEffect( () => {
        
        
        if (!state.hasLoaded && !lat ) {
            
            window.alert("Please select a location first");
            navigate('/location')
            
        } else {
            setLoadingState()

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

    const createPlan = () => {
        if (selectedObjects.length === 0) {
            window.alert("You must select at least one object to create a plan!")
        } else {
            fetch("/add-plan/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                },
                body: JSON.stringify(selectedObjects),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== 200) {
                console.log(data);
                } else {
                    navigate('/schedule/')
                }
            })
        }
    }

    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else { 
        return (
            <Wrapper >
                <PlanButton onClick={createPlan}>Create Plan!</PlanButton>
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
export default Catalog;