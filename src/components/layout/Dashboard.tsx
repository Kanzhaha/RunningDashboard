import React, { useState, useEffect } from 'react';
import { Activity, Heart, Timer, TrendingUp, Zap, MapPin, Flame, Play, Pause, LogOut, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../metrics/MetricCard';
import { PowerChart } from '../charts/PowerChart';
import { FatigueIndicator } from '../charts/FatigueIndicator';
import { ConnectionStatus } from '../metrics/ConnectionStatus';
import { SensorData, FatigueStatus } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useESPWebSocket } from '../../hooks/useESPWebSocket';

interface UserProfile {
  name: string;
  weight: string;
  height: string;
  gender: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [data, setData] = useState<SensorData[]>([]);
  const [latest, setLatest] = useState<SensorData | null>(null);
  const [fatigue, setFatigue] = useState<FatigueStatus>({
    level: 'normal',
    decoupling: 0,
    message: 'Performa optimal. Maintain current pace.'
  });
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const { gpsData, startTracking, stopTracking } = useGeolocation();
  const { wsState, connect, disconnect, sendSpeed } = useESPWebSocket();

  // Load user profile
  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  useEffect(() => {
  if (isRunning) {
    connect();
    startTracking();
  } else {
    stopTracking();
    disconnect();
  }

  return () => {
    stopTracking();
    disconnect();
  };
}, [isRunning, connect, disconnect, startTracking, stopTracking]);

useEffect(() => {
  if (gpsData.speed != null && wsState.isConnected) {
    sendSpeed(gpsData.speed);
  }
}, [gpsData.speed, wsState.isConnected, sendSpeed]);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      const newData: SensorData = {
        timestamp: Date.now(),
        runningPower: 250 + Math.random() * 40,
        heartRate: 145 + Math.random() * 25,
        cadence: 168 + Math.random() * 12,
        groundContactTime: 205 + Math.random() * 25,
        verticalOscillation: 7.8 + Math.random() * 1.5,
        elevation: gpsData.altitude ?? (45 + Math.sin(Date.now() / 10000) * 10),
        efficiencyIndex: 0.58 + Math.random() * 0.08
      };

      setLatest(newData);
      setData(prev => [...prev.slice(-50), newData]);

      const decoupling = newData.efficiencyIndex ? (newData.efficiencyIndex - 0.6) * 100 : 0;
      if (decoupling > 8) {
        setFatigue({
          level: 'critical',
          decoupling,
          message: 'Critical cardiac drift detected. Reduce intensity immediately.'
        });
      } else if (decoupling > 4) {
        setFatigue({
          level: 'warning',
          decoupling,
          message: 'Moderate fatigue building up. Monitor closely.'
        });
      } else {
        setFatigue({
          level: 'normal',
          decoupling,
          message: 'Optimal efficiency. Energy systems balanced.'
        });
      }
    }, 1000);

    const durationInterval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(durationInterval);
    };
  }, [isRunning, gpsData.altitude]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="galaxy-bg min-h-screen p-6 md:p-8 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Greeting */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
              Hello, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{userProfile?.name || 'Runner'}</span> !!!
            </h1>
            <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">
              We're Ready to RUN.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ConnectionStatus isConnected={!!latest} />
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3 rounded-full glass-card glow-cyan transition-all hover:scale-105 ${isRunning ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 rounded-full glass-card border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Hero Metrics - Large Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Power Gauge */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">Running Power</p>
                <h2 className="text-6xl md:text-7xl font-bold text-white font-mono-nums">
                  {latest ? Math.round(latest.runningPower) : '---'}
                  <span className="text-2xl text-slate-400 ml-2 font-sans font-medium">W</span>
                </h2>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400">
                <Zap size={28} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Target Zone: 240-260W
            </div>
            <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{width: `${latest ? (latest.runningPower / 300) * 100 : 0}%`}}
              ></div>
            </div>
          </div>

          {/* Heart Rate Gauge */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-1">Heart Rate</p>
                <h2 className="text-6xl md:text-7xl font-bold text-white font-mono-nums">
                  {latest ? Math.round(latest.heartRate) : '---'}
                  <span className="text-2xl text-slate-400 ml-2 font-sans font-medium">bpm</span>
                </h2>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
                <Heart size={28} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">Zone: <span className="text-pink-400 font-semibold">Aerobic</span></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Max: 185 bpm</span>
            </div>
            <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                style={{width: `${latest ? (latest.heartRate / 190) * 100 : 0}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <MetricCard
            title="Cadence"
            value={latest ? Math.round(latest.cadence) : '--'}
            unit="spm"
            icon={Activity}
            color="cyan"
            trend="+2%"
          />
          <MetricCard
            title="Ground Contact"
            value={latest ? Math.round(latest.groundContactTime) : '--'}
            unit="ms"
            icon={Timer}
            color="purple"
            trend="-5ms"
          />
          <MetricCard
            title="Vertical Osc."
            value={latest ? latest.verticalOscillation.toFixed(1) : '--'}
            unit="cm"
            icon={TrendingUp}
            color="pink"
          />
          <MetricCard
            title="Elevation"
            value={latest ? Math.round(latest.elevation) : '--'}
            unit="m"
            icon={MapPin}
            color="blue"
          />  
          <MetricCard
            title="Speed"
            value={gpsData.speed != null ? gpsData.speed.toFixed(2) : '--'}
            unit="m/s"
            icon={Zap}
            color="green"
          />  
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Power & Cardiac Response</h3>
                  <p className="text-slate-400 text-sm mt-1">Real-time physiological decoupling analysis</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                    <span className="text-slate-300">Power</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
                    <span className="text-slate-300">Heart Rate</span>
                  </div>
                </div>
              </div>
              <PowerChart data={data} />
            </div>

            {/* Efficiency Index Bar */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-300 font-medium">Efficiency Index</span>
                <span className="text-2xl font-bold text-white font-mono-nums">
                  {latest ? (latest.efficiencyIndex || 0).toFixed(2) : '--'}
                  <span className="text-sm text-slate-500 ml-1">bpm/W</span>
                </span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full rounded-full transition-all duration-500 ${
                    latest && (latest.efficiencyIndex || 0) > 0.65 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{width: `${latest ? Math.min((latest.efficiencyIndex || 0) * 100, 100) : 0}%`}}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Efficient</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FatigueIndicator status={fatigue} />
            
            {/* Session Stats */}
            <div className="glass-card rounded-3xl p-6 border border-white/10">
              <h4 className="font-semibold text-white mb-6 flex items-center gap-2 text-lg">
                <Flame className="text-orange-400" size={20} />
                Session Stats
              </h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Duration</span>
                  <span className="font-mono-nums text-2xl font-bold text-white">{formatDuration(duration)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Avg Power</span>
                  <span className="font-mono-nums text-xl font-bold text-cyan-400">247 W</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Distance</span>
                  <span className="font-mono-nums text-xl font-bold text-white">4.8 km</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Calories</span>
                  <span className="font-mono-nums text-xl font-bold text-orange-400">342 kcal</span>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">GPS</span>
                  <span className="font-mono-nums text-sm font-bold text-white">
                    {gpsData.isTracking ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Wifi size={14} />
                    ESP Link
                  </span>
                  <span className={`font-mono-nums text-sm font-bold ${wsState.isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                    {wsState.isConnected ? 'ON' : 'OFF'}
                  </span>
                </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};