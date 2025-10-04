"use client";

import { useEffect, useState } from 'react';
import { HolographicBackground } from '@/components/admin/HolographicBackground';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LiveStats } from '@/components/admin/LiveStats';
import { GlobalControls } from '@/components/admin/GlobalControls';
import { ProjectTable } from '@/components/admin/ProjectTable';
import { AlertSystem } from '@/components/admin/AlertSystem';

interface Project {
  id: number;
  teamName: string;
  voteCount: number;
  isLocked: boolean;
}

interface SystemState {
  votingEnabled: boolean;
  emergencyLockdown: boolean;
}

interface Stats {
  total_votes: number;
  top_project: { team_name: string; vote_count: number } | null;
  recent_activity_count: number;
}

interface Alert {
  id: string;
  message: string;
  timestamp: number;
}

export default function AdminConsole() {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [systemState, setSystemState] = useState<SystemState>({
    votingEnabled: false,
    emergencyLockdown: false,
  });
  const [stats, setStats] = useState<Stats>({
    total_votes: 0,
    top_project: null,
    recent_activity_count: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchProjects();
    fetchSystemState();
    fetchStats();
  }, []);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?limit=100&sort=voteCount&order=desc');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemState = async () => {
    try {
      const response = await fetch('/api/system-state');
      if (response.ok) {
        const data = await response.json();
        setSystemState({
          votingEnabled: data.votingEnabled,
          emergencyLockdown: data.emergencyLockdown,
        });
      }
    } catch (error) {
      console.error('Failed to fetch system state:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleToggleLock = async (projectId: number, currentLockState: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_locked: !currentLockState }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(
          projects.map((p) => (p.id === projectId ? { ...p, isLocked: updatedProject.isLocked } : p))
        );

        // Add alert
        const alertMessage = !currentLockState
          ? `PROJECT ${updatedProject.teamName.toUpperCase()} IS NOW LOCKED`
          : `PROJECT ${updatedProject.teamName.toUpperCase()} NOW LIVE`;
        addAlert(alertMessage);

        // Log activity
        await fetch('/api/admin/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: !currentLockState ? 'Project locked' : 'Project unlocked',
            details: `${updatedProject.teamName}`,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    }
  };

  const handleToggleVoting = async () => {
    try {
      const response = await fetch('/api/system-state', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voting_enabled: !systemState.votingEnabled }),
      });

      if (response.ok) {
        const data = await response.json();
        setSystemState((prev) => ({ ...prev, votingEnabled: data.votingEnabled }));
        addAlert(
          data.votingEnabled
            ? 'VOTING SYSTEM ACTIVATED'
            : 'VOTING SYSTEM DEACTIVATED'
        );

        await fetch('/api/admin/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: data.votingEnabled ? 'Voting activated' : 'Voting deactivated',
          }),
        });
      }
    } catch (error) {
      console.error('Failed to toggle voting:', error);
    }
  };

  const handleToggleLockdown = async () => {
    try {
      const response = await fetch('/api/system-state', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergency_lockdown: !systemState.emergencyLockdown }),
      });

      if (response.ok) {
        const data = await response.json();
        setSystemState((prev) => ({ ...prev, emergencyLockdown: data.emergencyLockdown }));
        addAlert(
          data.emergencyLockdown
            ? 'EMERGENCY LOCKDOWN ACTIVATED'
            : 'EMERGENCY LOCKDOWN LIFTED'
        );

        await fetch('/api/admin/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: data.emergencyLockdown ? 'Emergency lockdown activated' : 'Emergency lockdown lifted',
          }),
        });
      }
    } catch (error) {
      console.error('Failed to toggle lockdown:', error);
    }
  };

  const addAlert = (message: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
    };
    setAlerts((prev) => [alert, ...prev].slice(0, 3));

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-blue-400 text-xl">Loading admin console...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <HolographicBackground />
      
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 tracking-wider mb-2">
            ADMIN CONSOLE
          </h1>
          <p className="text-slate-400 text-sm">
            Strategic Homeland Intervention, Enforcement and Logistics Division
          </p>
        </header>

        <LiveStats
          totalVotes={stats.total_votes}
          topProject={stats.top_project}
          activeUsers={stats.recent_activity_count}
        />

        <GlobalControls
          votingEnabled={systemState.votingEnabled}
          emergencyLockdown={systemState.emergencyLockdown}
          onToggleVoting={handleToggleVoting}
          onToggleLockdown={handleToggleLockdown}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-200 mb-4 tracking-wider">
            PROJECT MANAGEMENT
          </h2>
          <ProjectTable projects={projects} onToggleLock={handleToggleLock} />
        </div>
      </main>

      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />
    </div>
  );
}