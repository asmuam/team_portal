import React, { createContext, useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/use-axios-private";

// Create a context
const TeamsContext = createContext();

// Create a provider component
export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  return (
    <TeamsContext.Provider value={{ teams, setTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

// Custom hook to use the TeamsContext
export const useTeams = () => useContext(TeamsContext);
