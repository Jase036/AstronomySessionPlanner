//import dependencies
import React, {createContext, useReducer, useEffect} from "react";

//This context holds the loading state, location and forecast 
// states with a reducer to manage it.

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
        dispatch({
        type: "set-location",
        location: data
        });
    };

    //Store weather forecast in state
    const setForecast = (data) => {
        
        dispatch({
        type: "set-forecast",
        forecast: data
        });
    };

    //Store Storm Glass weather forecast (mainly for moon data)
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
