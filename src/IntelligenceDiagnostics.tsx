import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Database, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface ConfigStatus {
  GEMINI: boolean;
  SERPER: boolean;
  GROQ: boolean;
  OPENROUTER: boolean;
  MISTRAL: boolean;
  DEEPSEEK: boolean;
  SCRAPINGBEE: boolean;
  FIRECRAWL: boolean;
  APOLLO: boolean;
  STATUS: string;
}

export const IntelligenceDiagnostics: React.FC = () => {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/system/config-status');
        const data = await res.json();
        setConfig(data);
      } catch (e) {
        console.error('Failed to fetch config status');
      } finally {
        setLoading(false);
      }
    };
    checkConfig();
  }, []);

  if (loading) return null;

  const totalCritical = (config?.GEMINI ? 0 : 1) + (config?.SERPER ? 0 : 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-20 right-4 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto">
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className={`p-3 rounded-full shadow-lg border backdrop-blur-md transition-all ${
              totalCritical > 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-accent/20 border-accent/30'
            }`}
          >
            <Cpu className={`w-5 h-5 ${totalCritical > 0 ? 'text-red-400 animate-pulse' : 'text-accent'}`} />
          </button>
        ) : (
          <Card className="bg-bg-panel/95 backdrop-blur-xl border-border shadow-2xl overflow-hidden w-72">
            <CardHeader className="p-3 border-b border-white/5 bg-accent/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-accent" />
                <span className="text-[10px] uppercase font-black text-white tracking-widest">Neural Kernel</span>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-text-muted hover:text-white">
                <ShieldCheck className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-1.5">
                <DiagnosticItem label="Gemini" active={config?.GEMINI || false} critical />
                <DiagnosticItem label="Search" active={config?.SERPER || false} critical />
                <DiagnosticItem label="Groq" active={config?.GROQ || false} />
                <DiagnosticItem label="Failover" active={config?.OPENROUTER || config?.MISTRAL || config?.DEEPSEEK || false} />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${totalCritical > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <span className="text-[8px] text-text-muted uppercase">{config?.STATUS}</span>
                </div>
                <span className="text-[8px] font-mono opacity-40">KONY-83 V5</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

const DiagnosticItem: React.FC<{ label: string; active: boolean; critical?: boolean }> = ({ label, active, critical }) => (
  <div className={`p-2 rounded-lg border flex flex-col gap-1 transition-all ${
    active ? 'bg-emerald-500/5 border-emerald-500/20' : critical ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'
  }`}>
    <div className="flex items-center justify-between">
      <span className={`text-[9px] font-medium uppercase truncate ${active ? 'text-emerald-400' : 'text-text-muted'}`}>{label}</span>
      {active ? <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> : <AlertTriangle className={`w-2.5 h-2.5 ${critical ? 'text-red-500' : 'text-gray-500'}`} />}
    </div>
    <div className="flex items-center gap-1">
      <div className={`h-1 flex-1 rounded-full ${active ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
      <span className="text-[7px] font-bold text-white/40">{active ? 'OK' : 'ERR'}</span>
    </div>
  </div>
);
