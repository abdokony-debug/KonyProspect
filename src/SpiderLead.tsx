import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Zap, 
  MapPin, 
  Target, 
  Activity, 
  CheckCircle2, 
  Cpu, 
  Globe, 
  Search, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  Brain, 
  FileTerminal, 
  Fingerprint,
  MoreVertical,
  Plus,
  Rocket
} from 'lucide-react';
import { Lead } from './lib/gemini';

interface SpiderLeadProps {
  lead: Lead;
  onEnrich: () => void;
  isEnriching: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('twitter') || p.includes('x.com')) return <span className="text-white font-black text-[10px]">𝕏</span>;
  if (p.includes('linkedin')) return <Plus className="w-3 h-3 text-blue-500 fill-blue-500" />;
  if (p.includes('reddit')) return <div className="w-3 h-3 rounded-full bg-orange-500" />;
  if (p.includes('facebook')) return <div className="w-3 h-3 rounded bg-blue-600" />;
  if (p.includes('instagram')) return <div className="w-3 h-3 rounded bg-pink-500" />;
  return <Globe className="w-3 h-3 text-text-muted" />;
};

const ContactIcon = ({ type, value }: { type: string, value: string }) => {
  const t = type.toLowerCase();
  if (t === 'email') return <Mail className="w-3 h-3" />;
  if (t === 'telegram') return <span className="text-[10px]">📱</span>;
  if (t === 'whatsapp') return <span className="text-[10px]">🟢</span>;
  if (t === 'dm') return <Zap className="w-3 h-3" />;
  return <Globe className="w-3 h-3" />;
};

const SentimentIndicator = ({ sentiment }: { sentiment?: 'positive' | 'neutral' | 'negative' }) => {
  if (!sentiment) return null;
  const colors = {
    positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    neutral: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    negative: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return (
    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${colors[sentiment]}`}>
      Sentiment: {sentiment}
    </div>
  );
};

export const SpiderLead: React.FC<SpiderLeadProps> = ({ 
  lead, 
  onEnrich, 
  isEnriching,
  onSave,
  isSaving
}) => {
  return (
    <Card className="sophisticated-card hover:bg-accent/5 transition-all group border-l-4 border-l-transparent hover:border-l-accent overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-bg-input border border-border flex items-center justify-center text-accent font-serif italic text-lg sm:text-2xl shadow-inner group-hover:bg-accent/10 transition-colors">
                    {lead.user[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-bg-panel border border-border rounded-lg p-1 shadow-lg scale-75 sm:scale-100">
                    <PlatformIcon platform={lead.platform} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base sm:text-xl text-text-main tracking-tight group-hover:text-accent transition-colors">{lead.user}</h4>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[7px] sm:text-[8px] bg-accent/5 text-accent border-accent/20 h-3.5 sm:h-4 px-1">
                        {lead.category || 'Lead'}
                      </Badge>
                      <Badge className="hidden sm:flex text-[8px] font-bold h-4 px-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        Intent
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-text-muted mt-0.5 font-mono uppercase tracking-widest opacity-70">
                    {lead.platform} • {lead.date}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl font-light text-text-main leading-none">{lead.compositeScore}</span>
                  <span className="text-[10px] text-text-muted">%</span>
                </div>
                <div className={`mt-1 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border ${
                  lead.compositeScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  lead.compositeScore >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {lead.compositeScore >= 80 ? 'High' : lead.compositeScore >= 50 ? 'Qualified' : 'Cold'}
                </div>
              </div>
            </div>
            
            {/* Content & Verification */}
            <div className="space-y-3">
              <div className="relative pl-3 border-l-2 border-accent/20 py-1">
                <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed font-light italic">"{lead.content}"</p>
                <div className="mt-2">
                  <SentimentIndicator sentiment={lead.sentiment} />
                </div>
              </div>

              {lead.buyingIntent && (
                <div className="bg-accent/5 border border-accent/10 p-3 sm:p-4 rounded-xl space-y-2">
                  <p className="text-[11px] sm:text-xs text-text-main/80 leading-relaxed font-medium">
                    {lead.buyingIntent}
                  </p>
                </div>
              )}
            </div>

            {/* Intelligence Metrics Grid - Hidden on smallest mobile */}
            <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              {[
                { label: 'Intent', value: lead.intentScore, color: 'accent' },
                { label: 'Urgency', value: lead.urgencyScore, color: 'emerald-400' },
                { label: 'Authority', value: lead.authorityScore, color: 'amber-400' },
                { label: 'Engagement', value: lead.engagementScore, color: 'accent' }
              ].map((metric) => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">{metric.label}</span>
                    <span className="text-[8px] font-mono text-white">{metric.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      className={`h-full bg-${metric.color === 'accent' ? 'accent' : 'emerald-400'}`}
                      style={{ backgroundColor: metric.color === 'accent' ? 'var(--accent-custom)' : undefined }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Meta Info & Contact Mapping - The Gateway */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">
                <div className="flex items-center gap-2 group/meta">
                  <MapPin className="w-3.5 h-3.5 text-accent group-hover/meta:scale-110 transition-transform" />
                  <span className="group-hover/meta:text-accent transition-colors">{lead.location || 'Geo: Global'}</span>
                </div>
                <div className="flex items-center gap-2 group/meta">
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                  <a href={lead.url} target="_blank" rel="noopener noreferrer" className="group-hover/meta:text-accent transition-colors flex items-center gap-1.5">
                    Source
                    <Badge className="bg-emerald-500/20 text-emerald-500 text-[6px] h-3 px-1 border-none uppercase">Validated</Badge>
                  </a>
                </div>
                <div className="flex items-center gap-3 group/meta">
                  <div className="p-1 px-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover/meta:bg-emerald-500 group-hover/meta:text-bg-main transition-all flex items-center gap-1.5">
                    <ContactIcon type="primary" value={lead.contactInfo} />
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                  <span className="group-hover/meta:text-accent transition-colors underline decoration-accent/30 underline-offset-4 font-mono">{lead.contactInfo}</span>
                </div>
              </div>

              {lead.contactMethods && (lead.contactMethods as any[]).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    Communication Gateway Channels
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(lead.contactMethods as any[]).map((method, i) => (
                      <div key={i} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg px-2.5 py-1.5 transition-all hover:bg-emerald-500/10 cursor-default">
                        <div className="text-emerald-400 opacity-70">
                          <ContactIcon type={method.type} value={method.value} />
                        </div>
                        <span className="text-[9px] font-mono text-text-main/70 lowercase">{method.value}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-500 text-[6px] h-3 px-1 border-none uppercase">Verified</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Bar */}
            <div className="flex lg:flex-col justify-end gap-2 sm:gap-3 lg:border-l border-border lg:pl-8 lg:min-w-[180px]">
              <div className="flex items-center gap-2 justify-center lg:justify-end mb-1 sm:mb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={onEnrich}
                        disabled={isEnriching}
                        className={`w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-border transition-all active:scale-95 ${isEnriching ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'hover:border-blue-500 hover:bg-blue-500/10 text-text-muted hover:text-blue-500'}`}
                      >
                        <Cpu className={`w-4 h-4 ${isEnriching ? 'animate-spin' : ''}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Deep Contact Enrichment</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2 w-full">
                <Button 
                    variant="outline"
                    className="sophisticated-btn-outline h-10 flex-1 sm:w-full rounded-xl gap-2 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]"
                    asChild
                    nativebutton={false}
                >
                    <a href={lead.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Source
                    </a>
                </Button>

                {onSave && (
                  <Button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="sophisticated-btn-primary h-10 flex-1 sm:w-full rounded-xl gap-2 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]"
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Capture
                  </Button>
                )}
              </div>
            
            <div className="flex-1" />
            
            <div className="text-right hidden lg:block">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <Rocket className="w-3 h-3 text-accent" />
                <span className="text-[8px] font-black text-accent uppercase tracking-widest">Priority Reach</span>
              </div>
              <p className="text-[8px] text-text-muted italic opacity-50 uppercase tracking-tighter">Verified Stealth Routing Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
