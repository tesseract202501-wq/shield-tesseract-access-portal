"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Trophy } from 'lucide-react';

interface LiveStatsProps {
  totalVotes: number;
  topProject: { team_name: string; vote_count: number } | null;
  activeUsers: number;
}

export const LiveStats = ({ totalVotes, topProject, activeUsers }: LiveStatsProps) => {
  const [displayVotes, setDisplayVotes] = useState(0);
  const [displayUsers, setDisplayUsers] = useState(0);

  useEffect(() => {
    const animateNumber = (target: number, setter: (n: number) => void) => {
      let current = 0;
      const increment = target / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
      return interval;
    };

    const votesInterval = animateNumber(totalVotes, setDisplayVotes);
    const usersInterval = animateNumber(activeUsers, setDisplayUsers);

    return () => {
      clearInterval(votesInterval);
      clearInterval(usersInterval);
    };
  }, [totalVotes, activeUsers]);

  const stats = [
    {
      icon: TrendingUp,
      label: 'TOTAL VOTES',
      value: displayVotes.toLocaleString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Trophy,
      label: 'TOP PROJECT',
      value: topProject?.team_name || 'N/A',
      subValue: topProject ? `${topProject.vote_count} votes` : '',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: Users,
      label: 'ACTIVE USERS',
      value: displayUsers.toLocaleString(),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <div className={`w-2 h-2 rounded-full ${stat.color.replace('text', 'bg')} animate-pulse`} />
            </div>
            <p className="text-xs text-slate-400 font-semibold tracking-wider mb-2">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color} tabular-nums`}>
              {stat.value}
            </p>
            {stat.subValue && (
              <p className="text-xs text-slate-500 mt-1">{stat.subValue}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};