import React, { createContext, useContext } from "react";

const TyppoContext = createContext({});

export function TyppoProvider({ config, children }) {
    return <TyppoContext value={config}>{children}</TyppoContext>;
}

export function useTyppoConfig() {
    return useContext(TyppoContext);
}
