import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Shield, Zap, ChevronRight, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  msg: string;
  source: string;
}

export const CommandMatrix: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate real-time neural logs
    const interval = setInterval(() => {
      if (!isOpen) return;
      const sources = ['GEMINI-CORE', 'GROQ-NPU', 'DEEPSEEK-REASONER', 'SHIELD-V10'];
      const levels: ('INFO' | 'WARN' | 'ERROR' | 'CRITICAL')[] = ['INFO', 'INFO', 'WARN', 'ERROR'];
      const msg = [
        "Analyzing synapse response from nodes...",
        "Bypassing scraping protection layer 4...",
        "Neural sync optimal, link verified.",
        "Refining search vectors for deep extraction.",
        "Detected anti-bot snare, engaging ghost simulation..."
      ];

      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        msg: msg[Math.floor(Math.random() * msg.length)]
      };

      setLogs(prev => [...prev.slice(-50), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 p-3 bg-bg-panel border border-accent/20 rounded-xl shadow-2xl text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
      >
        <Terminal className="w-4 h-4" />
        <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">Command Matrix</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-y-0 left-0 w-full sm:w-96 bg-bg-panel/95 backdrop-blur-2xl border-r border-border z-[60] shadow-[huge] flex flex-col"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-accent" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Neural Console</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-2 space-y-2">
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="font-mono text-[9px] flex gap-2 items-start py-0.5 border-b border-white/5 last:border-0">
                    <span className="text-text-muted shrink-0">[{log.timestamp}]</span>
                    <span className={`font-bold shrink-0 ${
                      log.level === 'CRITICAL' ? 'text-red-500' :
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
                    }`}>[{log.source}]</span>
                    <span className="text-white/80 leading-relaxed uppercase">{log.msg}</span>
                  </div>
                ))}
              </div>

              <div className="bg-black/40 rounded-lg p-3 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] uppercase font-bold text-accent">Kernel Load</span>
                  <span className="text-[8px] font-mono text-white/50">84%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['80%', '95%', '85%'] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-full bg-accent shadow-[0_0_10px_#f97316]" 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-text-muted uppercase">
              <span>Uptime: 2.14.05</span>
              <span>Encrypted Sync: Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
