import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cool-gray-50 dark:bg-cool-gray-900">
      <div className="w-16 h-16 border-4 border-sky-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;