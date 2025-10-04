"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Alert {
  id: string;
  message: string;
  timestamp: number;
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export const AlertSystem = ({ alerts, onDismiss }: AlertSystemProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="relative overflow-hidden rounded-lg border-2 border-blue-500 bg-slate-900/95 backdrop-blur-sm shadow-2xl shadow-blue-500/20 animate-slideInRight"
        >
          {/* Tesseract pulse effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse" />
          
          <div className="relative p-4 pr-12">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 mt-1 rounded-full bg-blue-500 animate-ping" />
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-400 tracking-wide mb-1">
                  S.H.I.E.L.D. ALERT
                </p>
                <p className="text-sm text-slate-200">
                  {alert.message}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDismiss(alert.id)}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>

          {/* Animated border */}
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-tesseractPulse pointer-events-none" />
        </div>
      ))}
    </div>
  );
};