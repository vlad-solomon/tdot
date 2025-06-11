import React, { createContext, useContext } from "react";

const TyppoContext = createContext({});

export function TyppoProvider({ config, children }) {
    return (
        <TyppoContext.Provider value={config}>{children}</TyppoContext.Provider>
    );
}

export function useTyppoConfig() {
    return useContext(TyppoContext);
}
