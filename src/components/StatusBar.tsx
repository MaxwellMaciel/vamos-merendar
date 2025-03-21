
import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

const StatusBar: React.FC = () => {
  // Get current time in HH:MM format
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="flex justify-between items-center py-1 px-3 text-xs text-black">
      <div>{currentTime}</div>
      <div className="flex items-center space-x-1">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  );
};

export default StatusBar;
