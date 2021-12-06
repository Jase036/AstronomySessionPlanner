
//Setup our API key gor gmaps and add the 'places' library so we can use autocomplete for location search
export const bootstrapURLKeys={
    key: process.env.REACT_APP_GMAP_KEY, 
    libraries: ['places'].join(',')
} 
