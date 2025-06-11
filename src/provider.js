import React, { createContext, useContext } from "react";

const TdotContext = createContext({});

export function TdotProvider({ config, children }) {
    return (
        <TdotContext.Provider value={config}>{children}</TdotContext.Provider>
    );
}

export function useTdotConfig() {
    return useContext(TdotContext);
}
