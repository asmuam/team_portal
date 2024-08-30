import React, { createContext, useState, useContext } from 'react';

const DriveLinkContext = createContext();

export function useDriveLink() {
  return useContext(DriveLinkContext);
}

export function DriveLinkProvider({ children }) {
  const [linkDrive, setLinkDrive] = useState(null);

  return (
    <DriveLinkContext.Provider value={{ linkDrive, setLinkDrive }}>
      {children}
    </DriveLinkContext.Provider>
  );
}
