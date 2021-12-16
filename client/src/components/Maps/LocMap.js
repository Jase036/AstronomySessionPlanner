//import dependencies
import React, { useRef, useContext, useState } from "react";
import styled from "styled-components";
import GoogleMapReact from 'google-map-react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

//import context & URL keys
import { bootstrapURLKeys } from "./bootstrapURLKeys";
import { UserContext } from "../context/UserContext"


//declare variable that requires hoisting
let searchBar = {};

//component that renders the marker on the map
const ClickMarkerComponent = () => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50">
      <g fill= "red" transform="scale(2)">
        <path d="M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z" />
        
      </g>
    </svg>)
};

//Maps api options
const options = {
  fields: ['place_id', 'name', 'geometry']
};

//main maps location component function
const LocMap = () => {
  const [apiMaps, setApiMaps] = useState(null)
  
  const { user, isAuthenticated } = useAuth0();
  
  const {state, setLocation} = useContext(UserContext)
  
  const searchInput = useRef();

  let navigate = useNavigate()

  
  //default map center and zoom
  const defaultProps = {
    center: {
      lat: 51.059127,
      lng: -114.004114
    },
    zoom: 11
  };


  //handles click on the map to set the location state as well as the storage
  const handleClick = ({ map, lat, lng }) => {
    
    setLocation({lat: lat, lon: lng})
    
    isAuthenticated?
    window.localStorage.setItem('session', JSON.stringify({user: user.email, location: {lat: lat, lon: lng}})):
    window.localStorage.setItem('session', JSON.stringify({user: 'guest', location: {lat: lat, lon: lng}}))

    const clickMarker = new apiMaps.Marker({
      position: {lat: lat, lng: lng},
      map: map
    })

    clickMarker.setVisible(true);

    if (window.confirm(`Location has been set to lat: ${lat}, lon: ${lng}.  Do you wish to continue to the weather forecast?` )){
      navigate('/weather')
    }
  }


  //thing to happen after Maps API has loaded
  const handleApiLoaded = (map, maps) => {
    
    setApiMaps(maps)
    
    //initialize the Places search bar
    searchBar = new maps.places.Autocomplete(searchInput.current, options);
    searchBar.bindTo("bounds", map);
    
    //sets the bar to the top left corner
    map.controls[maps.ControlPosition.TOP_LEFT].push(searchInput.current);
    
    searchBar.addListener('place_changed', ()=> {
      let place = searchBar.getPlace();
      if (!place.geometry || !place.geometry.location) { window.alert ('Please select a location from the dropdown or click the map on your desired location') 
      } 
      else {
        
      const coordString= JSON.stringify(place.geometry.location);
      const coordenates= JSON.parse(coordString)
      setLocation({lat: coordenates.lat, lon: coordenates.lng})
      

      const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "red",
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new maps.Point(15, 30),
      };
    

      const marker = new maps.Marker({ 
        icon: svgMarker,
        map: map });

        map.setZoom(15);
        map.setCenter(place.geometry.location);

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
          placeId: place.place_id,
          location: place.geometry.location,
        });
        marker.setVisible(true);
      }
      
      
      })

  }
    

  return (
    // Important: set the container height explicitly
    <div style={{ height: '80vh', width: '100%' }}>
      <Search ref={searchInput} type="text" placeholder="Search Box"  />
      <GoogleMapReact 
        onClick={(map, ev) => {handleClick(map,ev)}}
        bootstrapURLKeys={bootstrapURLKeys}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        
        <ClickMarkerComponent
          lat= {state.location.lat}
          lng= {state.location.lon}
        />

      </GoogleMapReact>
    </div>
  );
}

const Search = styled.input`
  width: 250px;
  margin: 20px;
  height: 40px;
  box-shadow: 3px 2px 3px #999;
  outline: none;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 0 5px;
  color: #333;
`
export default LocMap