"use client";

import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface Project {
  id: number;
  teamName: string;
  voteCount: number;
  isLocked: boolean;
}

interface ProjectTableProps {
  projects: Project[];
  onToggleLock: (projectId: number, currentLockState: boolean) => Promise<void>;
}

export const ProjectTable = ({ projects, onToggleLock }: ProjectTableProps) => {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = async (projectId: number, currentLockState: boolean) => {
    setTogglingId(projectId);
    try {
      await onToggleLock(projectId, currentLockState);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 border-b border-blue-500/30">
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                Vote Count
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                Control
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${
                  index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                  #{project.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200 tracking-wide">
                      {project.teamName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                    {project.voteCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      project.isLocked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}
                  >
                    {project.isLocked ? (
                      <>
                        <Lock className="w-3 h-3" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3" />
                        Unlocked
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggle(project.id, project.isLocked)}
                    disabled={togglingId === project.id}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
                      project.isLocked
                        ? 'bg-red-500/30 border border-red-500/50'
                        : 'bg-blue-500/30 border border-blue-500/50'
                    } ${togglingId === project.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-slate-900 border-2 transition-transform duration-300 ${
                        project.isLocked
                          ? 'translate-x-1 border-red-500'
                          : 'translate-x-9 border-blue-500'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {projects.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          No projects found
        </div>
      )}
    </div>
  );
};