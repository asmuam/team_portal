import React, {useEffect, createContext, useState, useContext } from 'react';

// Create a context
const TeamsContext = createContext();

// Create a provider component
export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched teams:", data);
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, []);
  return (
    <TeamsContext.Provider value={{ teams, setTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

// Custom hook to use the TeamsContext
export const useTeams = () => useContext(TeamsContext);
