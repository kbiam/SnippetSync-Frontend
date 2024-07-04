import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ProtectedRoute = ({ children, requireVerified }) => {
  const verifiedToken = cookies.get('verifiedToken');
  const unverifiedToken = cookies.get('unverifiedToken');

  if (verifiedToken) {
    return children;
  } else if (unverifiedToken && !requireVerified) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
