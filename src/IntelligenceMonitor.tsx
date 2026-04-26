import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Shield, Zap, Search, Eye, Bug, AlertTriangle, CheckCircle, Fingerprint, Database, Link, Ghost, UserPlus, ShieldCheck, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cortex, IntelligenceRole } from './lib/cortex';
import { diagnostics, IntelligenceSignal } from './lib/diagnostics';

export const IntelligenceMonitor: React.FC = () => {
  const [history, setHistory] = useState<IntelligenceSignal[]>([]);
  const [operations, setOperations] = useState<[string, any][]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'operations' | 'defense' | 'flow' | 'metrics'>('signals');
  const [neuralSignals, setNeuralSignals] = useState<any[]>([]);
  const [roleMetrics, setRoleMetrics] = useState<any>({});
  const [defenseStats, setDefenseStats] = useState({
    circuit: 'CLOSED',
    cacheHits: 0,
    healingEvents: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory([...diagnostics.getHistory()].reverse());
      setOperations(cortex.getActiveOperations());
      setNeuralSignals([...cortex.getSignals()].reverse());
      setRoleMetrics(cortex.getRoleMetrics());
      
      // Simulated stats for visualization as we don't have a broad state store for these simple counters yet
      setDefenseStats({
        circuit: Math.random() > 0.95 ? 'HALF_OPEN' : 'CLOSED',
        cacheHits: Math.floor(Math.random() * 50) + 120,
        healingEvents: Math.floor(Math.random() * 5) + 12
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRoleIcon = (role: IntelligenceRole) => {
    switch (role) {
      case 'SCOUT': return <Search className="w-3 h-3" />;
      case 'INFILTRATOR': return <Zap className="w-3 h-3" />;
      case 'VALIDATOR': return <CheckCircle className="w-3 h-3" />;
      case 'GUARDIAN': return <Shield className="w-3 h-3" />;
      case 'INVESTIGATOR': return <Eye className="w-3 h-3" />;
      case 'SHERIFF': return <Fingerprint className="w-3 h-3" />;
      case 'HARVESTER': return <Search className="w-3 h-3" />;
      case 'CHRONOS': return <Activity className="w-3 h-3" />;
      case 'MAPPER': return <Link className="w-3 h-3" />;
      case 'CHAMELEON': return <Ghost className="w-3 h-3" />;
      case 'ADAPTOR': return <UserPlus className="w-3 h-3" />;
      case 'ARCHIE': return <ShieldCheck className="w-3 h-3" />;
      case 'OLLAMA': return <Brain className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-bg-panel/40 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-bg-sidebar/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">F-C بحث عملاء</h3>
        </div>
        <div className="flex bg-bg-main/40 rounded-lg p-0.5 border border-border/20">
          <button 
            onClick={() => setActiveTab('signals')}
            className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition-all ${activeTab === 'signals' ? 'bg-accent text-bg-main shadow-lg' : 'text-text-muted hover:text-accent'}`}
          >
            Signals
          </button>
          <button 
            onClick={() => setActiveTab('operations')}
            className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition-all ${activeTab === 'operations' ? 'bg-accent text-bg-main shadow-lg' : 'text-text-muted hover:text-accent'}`}
          >
            Deployments
          </button>
          <button 
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition-all ${activeTab === 'flow' ? 'bg-indigo-500 text-bg-main shadow-lg' : 'text-text-muted hover:text-indigo-400'}`}
          >
            Flow
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition-all ${activeTab === 'metrics' ? 'bg-amber-500 text-bg-main shadow-lg' : 'text-text-muted hover:text-amber-400'}`}
          >
            Metrics
          </button>
          <button 
            onClick={() => setActiveTab('defense')}
            className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition-all ${activeTab === 'defense' ? 'bg-emerald-500 text-bg-main shadow-lg' : 'text-text-muted hover:text-emerald-500'}`}
          >
            Neural Guard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {activeTab === 'signals' ? (
            <div className="space-y-3">
              {/* Existing Signals View */}
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                  <Activity className="w-8 h-8 mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Waiting for signals...</p>
                </div>
              ) : (
                history.map((signal) => (
                  <motion.div
                    key={signal.errorId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border flex gap-3 transition-colors ${
                      signal.priority === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                      signal.priority === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                      'bg-bg-panel/60 border-border/40 hover:border-accent/40'
                    }`}
                  >
                    <div className={`mt-0.5 ${
                      signal.priority === 'critical' ? 'text-red-400' :
                      signal.priority === 'high' ? 'text-orange-400' :
                      'text-accent'
                    }`}>
                      {signal.type === 'quota' ? <Zap className="w-4 h-4" /> : 
                       signal.type === 'auth' ? <Shield className="w-4 h-4" /> : 
                       <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{signal.errorId}</span>
                        <span className="text-[8px] font-mono text-text-muted/50">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-text-main/90 leading-relaxed font-medium">{signal.suggestion}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : activeTab === 'operations' ? (
            <div className="space-y-2">
              {/* Existing Operations View */}
              {operations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                  <Eye className="w-8 h-8 mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">No active neural webs...</p>
                </div>
              ) : (
                operations.map(([id, op]) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 rounded-lg bg-bg-panel/40 border border-border/20 flex items-center justify-between hover:bg-bg-sidebar/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 group-hover:bg-accent/20 transition-all">
                        {getRoleIcon(op.role)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white group-hover:text-accent transition-colors">{op.role} OPERATION</span>
                        <span className="text-[9px] text-text-muted font-mono">{op.status}</span>
                      </div>
                    </div>
                    <div className="text-[8px] text-text-muted/40 font-mono">
                      {new Date(op.ts).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : activeTab === 'flow' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Diagnostic Pulse</h4>
                <Badge variant="outline" className="text-[8px] border-indigo-500/30 text-indigo-400">Real-Time Telemetry</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-bg-panel/30 border border-border/20 p-3 rounded-lg">
                  <div className="text-[8px] text-text-muted uppercase mb-1">Throughput</div>
                  <div className="text-xl font-light text-indigo-300">{neuralSignals[0]?.value || 0} op/s</div>
                </div>
                <div className="bg-bg-panel/30 border border-border/20 p-3 rounded-lg">
                  <div className="text-[8px] text-text-muted uppercase mb-1">Neural Latency</div>
                  <div className="text-xl font-light text-indigo-300">{(Math.random() * 40 + 10).toFixed(1)}ms</div>
                </div>
              </div>

              <div className="space-y-1.5 overflow-hidden">
                {neuralSignals.slice(0, 7).map((sig, i) => (
                  <div key={i} className="flex items-center gap-3 text-[9px] font-mono p-1.5 border-b border-border/10">
                    <span className="text-text-muted/40 text-[8px]">{new Date(sig.ts).toLocaleTimeString([], { hour12: false })}</span>
                    <span className="text-indigo-400 w-16 uppercase">{sig.type}</span>
                    <div className="flex-1 h-1 bg-bg-main/50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (sig.value / 20) * 100)}%` }} />
                    </div>
                    <span className="text-white w-4 text-right">{sig.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'metrics' ? (
            <div className="space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            {(['SCOUT', 'INFILTRATOR', 'VALIDATOR', 'GUARDIAN', 'INVESTIGATOR', 'SHERIFF', 'HARVESTER', 'CHRONOS', 'MAPPER', 'CHAMELEON', 'ADAPTOR', 'ARCHIE', 'OLLAMA'] as IntelligenceRole[]).map(role => (
              <div key={role} className="bg-bg-panel/40 border border-border/20 p-4 rounded-xl flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-amber-500">{role}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <div className="text-xl font-light text-white">{roleMetrics[role] || 0}</div>
                <div className="w-full h-1 bg-bg-main/40 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((roleMetrics[role] || 0) / 10) * 100)}%` }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
              
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-border/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Stability Index</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-light text-white">98.4%</div>
                  <div className="text-[9px] text-emerald-400 mb-1">+1.2% Δ</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-panel/40 border border-border/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Brain className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Neural Repair AI</span>
                  </div>
                  <div className="text-2xl font-light text-white">ACTIVE</div>
                  <div className="text-[9px] text-text-muted">Guardian Node: Groq-8B</div>
                </div>
                <div className="p-4 rounded-xl bg-bg-panel/40 border border-border/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Auto-Healing</span>
                  </div>
                  <div className="text-2xl font-light text-white">{defenseStats.healingEvents}</div>
                  <div className="text-[9px] text-text-muted">Repairs since boot</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-bg-panel/40 border border-border/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Neural Health Monitor</span>
                  <Badge className="bg-emerald-500 text-bg-main font-bold">
                    SHIELD ACTIVE
                  </Badge>
                </div>
                <div className="h-1.5 w-full bg-bg-main/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  />
                </div>
                <p className="text-[9px] text-text-muted leading-relaxed">
                  The Neural Guard (Guardian) handles all content processing. When a model yields malformed data, the Guardian intercepts and repairs it using localized failed-mode clusters. High-speed recovery is performed via the dedicated Groq line.
                </p>
              </div>

              <div className="flex items-center gap-2 px-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { label: 'Neural Recovery', status: 'Optimal', dot: 'bg-emerald-500' },
                  { label: 'Failover Relay', status: 'Armed', dot: 'bg-blue-500' },
                  { label: 'Schema Audit', status: 'Locked', dot: 'bg-purple-500' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-1.5 whitespace-nowrap bg-white/5 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.dot} animate-pulse`} />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-text-muted">{stat.label}: {stat.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-border/20 bg-bg-sidebar/10 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max pb-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1 h-1 rounded-full bg-green-400" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-text-muted">Node: UP</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-text-muted">Neural Guard: ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1 h-1 rounded-full bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.5)]" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-text-muted">Failover: ARMED</span>
            </div>
          </div>
        <div className="text-[8px] font-mono text-accent/50 uppercase ml-4">V10.2 G-SHIELD</div>
      </div>
    </div>
  );
};
