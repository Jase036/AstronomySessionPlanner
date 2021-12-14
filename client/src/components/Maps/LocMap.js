import React, { useRef, useContext, useState } from "react";
import styled from "styled-components";
import GoogleMapReact from 'google-map-react';
import { bootstrapURLKeys } from "./bootstrapURLKeys";
import { UserContext } from "../context/UserContext"
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";



let searchBar = {};

const ClickMarkerComponent = () => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50">
      <g fill= "red" transform="scale(2)">
        <path d="M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z" />
        
      </g>
    </svg>)
};

const options = {
  fields: ['place_id', 'name', 'geometry']
};


const LocMap = () => {
  const [apiMaps, setApiMaps] = useState(null)
  
  const { user, isAuthenticated } = useAuth0;
  
  const {state, setLocation} = useContext(UserContext)
  const searchInput = useRef();

  let placeId = '';

  const defaultProps = {
    center: {
      lat: 51.059127,
      lng: -114.004114
    },
    zoom: 11
  };

  const handleClick = ({ map, lat, lng }) => {
    console.log (typeof lat)
    
    setLocation({lat: lat, lon: lng})
    
    isAuthenticated?
    window.localStorage.setItem('session', JSON.stringify({user: user.email, location: {lat: lat, lon: lng}})):
    window.localStorage.setItem('session', JSON.stringify({user: 'guest', location: {lat: lat, lon: lng}}))

    const clickMarker = new apiMaps.Marker({
      position: {lat: parseFloat(lat), lng: parseFloat(lng)},
      map: map
    })

    clickMarker.setVisible(true);
  }


  const handleApiLoaded = (map, maps) => {
    setApiMaps(maps)
    searchBar = new maps.places.Autocomplete(searchInput.current, options);
    searchBar.bindTo("bounds", map);
    map.controls[maps.ControlPosition.TOP_LEFT].push(searchInput.current);
    
    searchBar.addListener('place_changed', ()=> {
      let place = searchBar.getPlace();
      if (!place.geometry || !place.geometry.location) { window.alert ('Please select a location from the dropdown or click the map on your desired location') 
      } else {
        placeId = place.place_id

        
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
    // Important! Always set the container height explicitly
    <div style={{ height: '80vh', width: '100%' }}>
      <Search ref={searchInput} type="text" placeholder="Search Box"  />
      {console.log('InputLoaded')}
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
`
export default LocMap