import React, {createContext, useReducer} from "react";
import { useAuth0 } from "@auth0/auth0-react";


export const UserContext = createContext(null);

const initialState = {
    hasLoaded: false,
    location: {lat:'', long: ''},
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

        default:
            throw new Error(`Unrecognized action: ${action.type}`);
    }
}

export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

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

    return (
        <UserContext.Provider
            value={{
                setLoadingState,
                unsetLoadingState
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
