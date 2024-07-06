import React from 'react';
import { helix } from 'ldrs';
import { useContext } from 'react';
import LoadingContext from './context/LoadingContext';

helix.register();

const GlobalLoader = () => {
  const { isLoading } = useContext(LoadingContext);

  return (
    isLoading && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-100 z-50">
        <l-helix size="100" speed="2.5" color="white"></l-helix>
      </div>
    )
  );
};

export default GlobalLoader;
