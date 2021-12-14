import React, {createContext, useReducer, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";


export const UserContext = createContext(null);

const initialState = {
    hasLoaded: false,
    location: {},
    forecast: {},
    sgForecast: []
};

const reducer = (state, action) => {
    switch (action.type) {
    
        case "set-loading-state": {
            return {
                ...state,
                hasLoaded: action.hasLoaded,
            };
        }

        case "unset-loading-state": {
            return {
                ...state,
                hasLoaded: action.hasLoaded,
            };
        }

        case "set-location": {
            return {
                ...state,
                location: action.location,
            };
        }

        case "set-forecast": {
            return {
                ...state,
                forecast: action.forecast,
            };
        }

        case "set-sgforecast": {
            return {
                ...state,
                sgForecast: action.sgForecast,
            };
        }


        default:
            throw new Error(`Unrecognized action: ${action.type}`);
    }
}

export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const session = JSON.parse(localStorage.getItem('session'))

    useEffect (()=>{
        
    }, [])
    
    //Loading state will allow us to use a loading component during async operations in other components
    const setLoadingState = () => {
        dispatch({
        type: "set-loading-state",
        hasLoaded: false,
        });
    };

    //revert loading state to true when async operations are done
    const unsetLoadingState = () => {
        dispatch({
        type: "unset-loading-state",
        hasLoaded: true,
        });
    };

    //add location data to state
    const setLocation = (data) => {
        console.log(data)
        dispatch({
        type: "set-location",
        location: data
        });
    };

    //Store weather forecast in state to avoid unneeded fetches to weather API
    const setForecast = (data) => {
        
        dispatch({
        type: "set-forecast",
        forecast: data
        });
    };

    //Store Strom Glass weather forecast in state to avoid unneeded fetches to weather API
    const setSGForecast = (data) => {
        
        dispatch({
        type: "set-sgforecast",
        sgForecast: data
        });
    };

    return (
        <UserContext.Provider
            value={{
                state,
                setLoadingState,
                unsetLoadingState,
                setLocation,
                setForecast,
                setSGForecast
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
