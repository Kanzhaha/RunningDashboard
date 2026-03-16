import React from 'react';

interface Props {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<Props> = ({ isConnected }) => {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase glass-card border ${
      isConnected 
        ? 'text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
        : 'text-red-400 border-red-500/30'
    }`}>
      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
      {isConnected ? 'LIVE' : 'OFFLINE'}
    </div>
  );
};