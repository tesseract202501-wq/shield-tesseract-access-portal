"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Activity, Users, FileText, LogOut, Lock, Zap } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a33] via-[#002b52] to-[#001a33] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-[#001a33]/90 backdrop-blur-sm border-2 border-cyan-400 rounded-lg p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                S.H.I.E.L.D. COMMAND CENTER
              </h1>
              <p className="text-xs text-cyan-300 font-mono tracking-wider">
                TESSERACT 2025 // DASHBOARD
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#001a33] font-mono text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-mono text-cyan-300">ACTIVE AGENTS</CardTitle>
            <Users className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              1,247
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-green-400/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-mono text-green-300">MISSIONS</CardTitle>
            <Activity className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              89
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              24 active operations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-mono text-yellow-300">THREATS</CardTitle>
            <Zap className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              7
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              3 critical alerts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-mono text-purple-300">CLASSIFIED</CardTitle>
            <Lock className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              342
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Level 10 documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <CardHeader>
            <CardTitle className="text-cyan-400 font-mono flex items-center gap-2">
              <FileText className="w-5 h-5" />
              RECENT MISSION LOGS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "M-2025-047", name: "Operation Tesseract", status: "Active", color: "text-green-400" },
              { id: "M-2025-046", name: "Project Insight", status: "Completed", color: "text-cyan-400" },
              { id: "M-2025-045", name: "Hydra Investigation", status: "Pending", color: "text-yellow-400" },
              { id: "M-2025-044", name: "Alien Tech Recovery", status: "Active", color: "text-green-400" },
            ].map((mission) => (
              <div key={mission.id} className="flex items-center justify-between p-3 bg-[#002b52]/50 rounded border border-cyan-400/30">
                <div>
                  <p className="text-sm font-mono text-cyan-300">{mission.id}</p>
                  <p className="text-xs text-gray-400">{mission.name}</p>
                </div>
                <span className={`text-xs font-mono ${mission.color}`}>{mission.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#001a33]/90 backdrop-blur-sm border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <CardHeader>
            <CardTitle className="text-cyan-400 font-mono flex items-center gap-2">
              <Activity className="w-5 h-5" />
              SYSTEM STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Security Protocols", level: 98, color: "bg-green-500" },
              { name: "Satellite Network", level: 87, color: "bg-cyan-500" },
              { name: "Field Operations", level: 92, color: "bg-blue-500" },
              { name: "Data Encryption", level: 100, color: "bg-purple-500" },
            ].map((system) => (
              <div key={system.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-400">{system.name}</span>
                  <span className="text-xs font-mono text-cyan-400">{system.level}%</span>
                </div>
                <div className="w-full h-2 bg-[#002b52]/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${system.color} transition-all duration-500`}
                    style={{ width: `${system.level}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer Status Bar */}
      <div className="max-w-7xl mx-auto mt-8 bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono text-cyan-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SYSTEM OPERATIONAL
          </span>
          <span>|</span>
          <span>CLEARANCE: LEVEL 7</span>
        </div>
        <div className="text-xs font-mono text-gray-400">
          LAST SYNC: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}