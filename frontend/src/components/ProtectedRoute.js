import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to manage access based on authentication and role
const ProtectedRoute = ({ element, isAuthenticated, role, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Ensure role is an array for consistent checks
  const userRoles = Array.isArray(role) ? role : [role];

  // Check if the user role is included in the allowed roles
  const hasAccess = allowedRoles ? allowedRoles.some(allowedRole => userRoles.includes(allowedRole)) : true;

  if (!hasAccess) {
    return <Navigate to="/403" />;
  }
  
  return element;
};

export default ProtectedRoute;
