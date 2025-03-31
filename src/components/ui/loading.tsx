import React from 'react';
import StatusBar from '../StatusBar';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StatusBar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-32 h-32 mb-4"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 