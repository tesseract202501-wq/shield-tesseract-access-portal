"use client";

import { Lock, BarChart3, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const sections = [
    { id: 'projects', icon: Lock, label: 'LOCK/UNLOCK PROJECTS', badge: 'TESSERACT' },
    { id: 'analytics', icon: BarChart3, label: 'VOTE ANALYTICS' },
    { id: 'controls', icon: Settings, label: 'SYSTEM CONTROLS' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-blue-500/30 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-blue-500/30">
        <h1 className="text-2xl font-bold text-blue-400 tracking-wider">
          S.H.I.E.L.D.
        </h1>
        <p className="text-xs text-slate-400 mt-1">ADMIN CONSOLE v2.0</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-blue-500/20 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-blue-500/30'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <div className="flex-1 text-left">
                <p className={`text-xs font-semibold tracking-wide ${
                  isActive ? 'text-blue-400' : 'text-slate-300'
                }`}>
                  {section.label}
                </p>
                {section.badge && (
                  <span className="text-[10px] text-blue-500/70 italic">{section.badge}</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-500/30">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
  );
};