"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, ShieldAlert, Lock } from "lucide-react";

export default function ShieldLoginPortal() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // Demo credentials
      const validUser = email === "agent@shield.gov" && password === "stark2025";
      const validAdmin = email === "admin@shield.gov" && password === "fury2025";

      if ((isAdmin && validAdmin) || (!isAdmin && validUser)) {
        // Success - redirect to dashboard
        router.push("/dashboard");
      } else {
        // Error - show glitch effect
        setShowGlitch(true);
        setError("ACCESS DENIED – CODE RED");
        setIsLoading(false);
        setTimeout(() => setShowGlitch(false), 300);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#001a33] via-[#002b52] to-[#001a33] flex items-center justify-center p-4">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 150, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 150, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanline opacity-50" />
      
      {/* Random scan lines */}
      <div className="absolute top-[20%] left-0 right-0 h-px bg-cyan-400/30" />
      <div className="absolute top-[45%] left-0 right-0 h-px bg-cyan-400/20" />
      <div className="absolute top-[70%] left-0 right-0 h-px bg-cyan-400/30" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-400/50" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-400/50" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400/50" />

      <Card 
        className={`w-full max-w-md relative z-10 bg-[#001a33]/90 backdrop-blur-sm border-2 transition-all duration-300 ${
          showGlitch ? "glitch" : ""
        } ${
          isAdmin 
            ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] glow-pulse" 
            : "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] glow-pulse"
        }`}
      >
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className={`w-6 h-6 ${isAdmin ? "text-red-500" : "text-cyan-400"}`} />
            <h1 className={`text-2xl font-bold tracking-wider ${
              isAdmin ? "text-red-500" : "text-cyan-400"
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              S.H.I.E.L.D.
            </h1>
          </div>
          <div className="text-center">
            <p className={`text-xs tracking-widest font-mono ${
              isAdmin ? "text-red-400" : "text-cyan-300"
            }`}>
              TESSERACT 2025 // ACCESS TERMINAL
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-red-500" : "bg-cyan-400"} animate-pulse`} />
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">SECURE CONNECTION</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert className={`border-red-500 bg-red-950/50 ${showGlitch ? "glitch" : ""}`}>
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400 font-mono text-xs tracking-wider">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-mono text-xs tracking-wider">
                AGENT ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="agent.id@shield.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-[#002b52]/50 border ${
                  isAdmin ? "border-red-500/50 focus:border-red-500" : "border-cyan-400/50 focus:border-cyan-400"
                } text-cyan-100 placeholder:text-gray-500 font-mono`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-mono text-xs tracking-wider">
                CLEARANCE CODE
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-[#002b52]/50 border ${
                  isAdmin ? "border-red-500/50 focus:border-red-500" : "border-cyan-400/50 focus:border-cyan-400"
                } text-cyan-100 placeholder:text-gray-500 font-mono`}
                required
              />
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center justify-center py-2">
              <div className="relative inline-flex items-center bg-[#002b52]/70 rounded-full p-1 border border-cyan-400/30">
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  className={`relative z-10 px-6 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                    !isAdmin 
                      ? "text-cyan-900 font-bold" 
                      : "text-cyan-400 hover:text-cyan-300"
                  }`}
                >
                  PARTICIPANT MODE
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  className={`relative z-10 px-6 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                    isAdmin 
                      ? "text-red-900 font-bold" 
                      : "text-red-400 hover:text-red-300"
                  }`}
                >
                  ADMIN MODE
                </button>
                <div 
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ${
                    isAdmin 
                      ? "translate-x-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" 
                      : "translate-x-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                  }`}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full font-mono tracking-widest text-sm font-bold relative overflow-hidden ${
                isAdmin
                  ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-400"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Fingerprint className="w-5 h-5 fingerprint-scan" />
                  <span>SCANNING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  <span>INITIATE LOGIN</span>
                </div>
              )}
            </Button>
          </form>

          <div className="pt-2 border-t border-cyan-400/20">
            <p className="text-center text-[10px] text-gray-500 font-mono tracking-wider">
              CLASSIFIED // LEVEL {isAdmin ? "10" : "7"} CLEARANCE REQUIRED
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="pt-2 border-t border-cyan-400/10">
            <p className="text-center text-[9px] text-gray-600 font-mono">
              Demo: agent@shield.gov / stark2025 (user) | admin@shield.gov / fury2025 (admin)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-cyan-400/30 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-cyan-400">
        <span>SYSTEM STATUS: OPERATIONAL</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          SECURE
        </span>
      </div>
    </div>
  );
}