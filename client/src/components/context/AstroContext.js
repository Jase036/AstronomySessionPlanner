//import dependencies
import React, { createContext, useState } from "react";

//This context holds the catalog data, plans for the scheduler and 
//the selected objects array.

export const AstroContext = createContext(null);


export const AstroProvider = ({ children }) => {
    
    const [astroCatalog, setAstroCatalog] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [plan, setPlan] = useState([])


    return (
        <AstroContext.Provider
            value={{
                astroCatalog, 
                setAstroCatalog,
                selectedObjects, 
                setSelectedObjects,
                plan,
                setPlan,
            }}
        >
            {children}
        </AstroContext.Provider>
    );
}