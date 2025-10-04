"use client";

import { useState } from 'react';
import { Power, AlertTriangle } from 'lucide-react';

interface GlobalControlsProps {
  votingEnabled: boolean;
  emergencyLockdown: boolean;
  onToggleVoting: () => Promise<void>;
  onToggleLockdown: () => Promise<void>;
}

export const GlobalControls = ({
  votingEnabled,
  emergencyLockdown,
  onToggleVoting,
  onToggleLockdown,
}: GlobalControlsProps) => {
  const [votingLoading, setVotingLoading] = useState(false);
  const [lockdownLoading, setLockdownLoading] = useState(false);

  const handleVotingToggle = async () => {
    setVotingLoading(true);
    try {
      await onToggleVoting();
    } finally {
      setVotingLoading(false);
    }
  };

  const handleLockdownToggle = async () => {
    setLockdownLoading(true);
    try {
      await onToggleLockdown();
    } finally {
      setLockdownLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Activate Voting Button */}
      <button
        onClick={handleVotingToggle}
        disabled={votingLoading || emergencyLockdown}
        className={`group relative overflow-hidden rounded-lg border-2 p-8 transition-all duration-300 ${
          votingEnabled
            ? 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
            : 'bg-slate-800/30 border-slate-700 hover:bg-blue-500/20 hover:border-blue-500'
        } ${emergencyLockdown ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Power className={`w-12 h-12 ${votingEnabled ? 'text-red-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
          <div className="text-center">
            <h3 className={`text-xl font-bold tracking-wider mb-1 ${
              votingEnabled ? 'text-red-400' : 'text-slate-300 group-hover:text-blue-400'
            }`}>
              {votingEnabled ? 'DEACTIVATE VOTING' : 'ACTIVATE VOTING'}
            </h3>
            <p className="text-xs text-slate-500">
              {votingEnabled ? 'System currently active' : 'Launch voting system'}
            </p>
          </div>
        </div>
        {votingEnabled && (
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
        )}
      </button>

      {/* Emergency Lockdown Button */}
      <button
        onClick={handleLockdownToggle}
        disabled={lockdownLoading}
        className={`group relative overflow-hidden rounded-lg border-2 p-8 transition-all duration-300 ${
          emergencyLockdown
            ? 'bg-orange-500/20 border-orange-500 hover:bg-orange-500/30'
            : 'bg-slate-800/30 border-slate-700 hover:bg-orange-500/20 hover:border-orange-500'
        }`}
      >
        <div className="relative z-10 flex flex-col items-center gap-4">
          <AlertTriangle className={`w-12 h-12 ${emergencyLockdown ? 'text-orange-400 animate-pulse' : 'text-slate-400 group-hover:text-orange-400'}`} />
          <div className="text-center">
            <h3 className={`text-xl font-bold tracking-wider mb-1 ${
              emergencyLockdown ? 'text-orange-400' : 'text-slate-300 group-hover:text-orange-400'
            }`}>
              {emergencyLockdown ? 'LIFT LOCKDOWN' : 'EMERGENCY LOCKDOWN'}
            </h3>
            <p className="text-xs text-slate-500">
              {emergencyLockdown ? 'Lockdown is active' : 'Disable all voting'}
            </p>
          </div>
        </div>
        {emergencyLockdown && (
          <div className="absolute inset-0 border-2 border-orange-500 animate-pulse" />
        )}
      </button>
    </div>
  );
};