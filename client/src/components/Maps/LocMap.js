import React, { useRef, useContext } from "react";
import GoogleMapReact from 'google-map-react';
import { bootstrapURLKeys } from "./bootstrapURLKeys";
import { UserContext } from "../context/UserContext"
import { Link } from "react-router-dom";



let searchBar = {};

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const options = {
  fields: ['place_id', 'name', 'geometry']
};


const LocMap = () => {
  
  const {setLocation} = useContext(UserContext)
  const searchInput = useRef();

  let placeId = '';

  const defaultProps = {
    center: {
      lat: 51.059127,
      lng: -114.004114
    },
    zoom: 11
  };

  const handleClick = ({lat, lng}) => {
    setLocation({lat: lat.toFixed(3), lon: lng.toFixed(3)})
  }


  const handleApiLoaded = (map, maps) => {
    
    searchBar = new maps.places.Autocomplete(searchInput.current, options);
    searchBar.bindTo("bounds", map);
    map.controls[maps.ControlPosition.TOP_LEFT].push(searchInput.current);
    searchBar.addListener('place_changed', ()=> {
      let place = searchBar.getPlace();
      const coordString= JSON.stringify(place.geometry.location);
      const coordenates= JSON.parse(coordString)
      setLocation({lat: coordenates.lat.toFixed(3), lon: coordenates.lng.toFixed(3)})
      
      !place.geometry ? searchInput.current.placeholder = 'Enter a valid address or location' : placeId = place.place_id
  
      const marker = new maps.Marker({ map: map });

        map.setZoom(15);
        map.setCenter(place.geometry.location);

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
          placeId: place.place_id,
          location: place.geometry.location,
        });
        marker.setVisible(true);
      })
    }

  

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '90vh', width: '100%' }}>
      <input ref={searchInput} type="text" placeholder="Search Box"  />
      {console.log('InputLoaded')}
      <GoogleMapReact 
        onClick={handleClick}
        bootstrapURLKeys={bootstrapURLKeys}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        
        <AnyReactComponent
          lat= "51.059127"
          lng= "-114.004114"
          text="My Marker"
        />
      </GoogleMapReact>
      <Link to="/weather">Weather</Link>
    </div>
  );
}

export default LocMap