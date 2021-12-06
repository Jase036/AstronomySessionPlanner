import React, {useRef} from "react";
import GoogleMapReact from 'google-map-react';
import { bootstrapURLKeys } from "./bootstrapURLKeys";



let searchBar = {};

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const options = {
  fields: ['place_id', 'name', 'types']
};


const LocMap = () => {
  
  const searchInput = useRef();

  let placeId = '';

  const defaultProps = {
    center: {
      lat: 51.059127,
      lng: -114.004114
    },
    zoom: 11
  };

  const handleClick = ({x, y, lat, lng}) => console.log(x, y, lat, lng)

  const onPlaceChanged = () => {
    let place = searchBar.getPlace();
    console.log(place);

    !place.geometry ? searchInput.current.placeholder = 'Enter a valid address or location' : placeId = place.place_id
  }

  const handleApiLoaded = (maps) => {
    
    searchBar = new maps.places.Autocomplete(searchInput.current, options);

    searchBar.addListener('place_changed', onPlaceChanged)
  };

  

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
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(maps)}
      >
        
        <AnyReactComponent
          lat= "51.059127"
          lng= "-114.004114"
          text="My Marker"
        />
      </GoogleMapReact>
      
    </div>
  );
}

export default LocMap