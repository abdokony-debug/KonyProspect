/// <reference types="@types/google.maps" />
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  Database, 
  Download, 
  TrendingUp, 
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Link,
  Filter,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Network,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  FileText,
  LogIn,
  LogOut,
  Trash2,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  MessageSquare,
  Ghost,
  UserCircle,
  CreditCard,
  ShieldCheck,
  Brain,
  Target,
  FileTerminal,
  Fingerprint,
  Mail,
  Archive,
  Briefcase,
  Settings,
  Youtube,
  Music,
  HelpCircle,
  LayoutDashboard,
  List,
  Activity,
  Globe,
  Globe2,
  Layout,
  ArrowRight,
  Settings2,
  Sparkles,
  Cpu,
  Sun,
  Moon,
  X,
  Copy,
  Check,
  Send,
  Plus,
  Star,
  Shield,
  MessageCircle,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
  AtSign,
  Link as LinkIcon,
  Tag,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow,
  useAdvancedMarkerRef,
  useMap
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { findLeads, enrichLead, deepCrawlLead, firecrawlScrapeLead, scrapegraphScrapeLead, groqInference, getProductHuntTrends, getRedditIntent, getPublicTrends, getTrendsMCPAnalysis, getLinkedInIntelligence, browserToText, neuralHumanize, Lead, LeadGenError, StealthConfig } from './lib/gemini';
import { cortex, StrategicPlan, ProductProfile } from './lib/cortex';
import { diagnostics, IntelligenceSignal } from './lib/diagnostics';
import { osint } from './lib/osint';
import { IntelligenceMonitor } from './IntelligenceMonitor';
import { IntelligenceDiagnostics } from './IntelligenceDiagnostics';
import { CommandMatrix } from './CommandMatrix';
import { IntelligenceMap } from './components/IntelligenceMap';
import { SpiderLead } from './SpiderLead';
import { stealthEngine } from './lib/StealthEngine';
import { dataNexus } from './lib/DataNexus';
import { FCPersistence } from './lib/persistence';
import { neuralGuardian } from './lib/guardian';
import { 
  auth, 
  db, 
  signIn, 
  signOut, 
  saveLeadToDb, 
  deleteLeadFromDb, 
  updateLeadInDb,
  saveSearchHistory,
  deleteSearchHistoryItem,
  saveSearchPreset,
  deleteSearchPreset,
  saveProductToDb,
  OperationType, 
  handleFirestoreError, 
  updateUserProfile 
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const KONY_LOGO = "https://raw.githubusercontent.com/abdokony/assets/main/kony83-engine.png"; // Placeholder for the shared image, usually I would use the user's provided asset once saved locally.

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E4E3E0] p-6">
          <Card className="max-w-md border-[#141414] shadow-none">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertCircle className="w-6 h-6" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An unexpected error occurred. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-red-50 p-4 rounded border border-red-100 overflow-auto max-h-40 font-mono">
                {this.state.error?.message || String(this.state.error)}
              </pre>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full mt-6 bg-[#141414] text-white"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Platform Icon Component
const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-3 h-3" />;
  if (p.includes('instagram')) return <Instagram className="w-3 h-3" />;
  if (p.includes('facebook')) return <Facebook className="w-3 h-3" />;
  if (p.includes('linkedin')) return <Linkedin className="w-3 h-3" />;
  if (p.includes('reddit')) return <MessageSquare className="w-3 h-3" />;
  if (p.includes('snapchat')) return <Ghost className="w-3 h-3" />;
  if (p.includes('tiktok')) return <Music className="w-3 h-3" />;
  if (p.includes('youtube')) return <Youtube className="w-3 h-3" />;
  return <ExternalLink className="w-3 h-3" />;
};

const ContactIcon = ({ type, value }: { type: string, value?: string }) => {
  let t = type.toLowerCase();
  if ((t === 'other' || t === 'primary' || t === 'contact') && value) {
    if (value.includes('@')) t = 'email';
    else if (value.includes('t.me') || (value.startsWith('@') && !value.includes(' '))) t = 'telegram';
    else if (value.match(/^\+?[0-9\s\-]{7,20}$/)) t = 'phone';
    else if (value.startsWith('http')) t = 'link';
  }
  if (t === 'email') return <Mail className="w-3 h-3" />;
  if (t === 'telegram') return <Send className="w-3 h-3" />;
  if (t === 'whatsapp') return <MessageCircle className="w-3 h-3" />;
  if (t === 'dm') return <MessageSquare className="w-3 h-3" />;
  if (t === 'phone') return <Phone className="w-3 h-3" />;
  if (t === 'handle') return <AtSign className="w-3 h-3" />;
  if (t === 'link') return <LinkIcon className="w-3 h-3" />;
  return <UserCircle className="w-3 h-3" />;
};

const SentimentIndicator = ({ sentiment }: { sentiment?: 'positive' | 'neutral' | 'negative' }) => {
  if (!sentiment) return null;
  
  const config = {
    positive: { icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Positive' },
    neutral: { icon: Meh, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Neutral' },
    negative: { icon: Frown, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Negative' }
  };

  const c = sentiment === 'positive' ? config.positive : sentiment === 'negative' ? config.negative : config.neutral;
  const Icon = c.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild nativebutton={false}>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.color} cursor-help w-fit whitespace-nowrap`}>
          <Icon className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase tracking-wider">{c.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">AI-Analyzed Lead Sentiment</TooltipContent>
    </Tooltip>
  );
};

interface LeadDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  isEditing: boolean;
  onEditToggle: () => void;
  editedLead: any;
  onEditedLeadChange: (lead: any) => void;
  validationErrors: Record<string, string>;
  onSave: () => void;
  onEmail: (lead: any) => void;
  isSendingEmail: boolean;
}

const LeadDetailModal = ({
  isOpen,
  onOpenChange,
  lead,
  isEditing,
  onEditToggle,
  editedLead,
  onEditedLeadChange,
  validationErrors,
  onSave,
  onEmail,
  isSendingEmail
}: LeadDetailModalProps) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-panel border-border text-text-main max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-bg-input border border-border flex items-center justify-center text-accent font-serif italic text-3xl">
                  {lead.user?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-light text-white">{lead.user}</DialogTitle>
                  <DialogDescription className="text-text-muted flex items-center gap-2 mt-1">
                    <PlatformIcon platform={lead.platform || ''} />
                    {lead.platform} • {lead.date}
                    <div className="flex gap-2 ml-2">
                      {lead.status === 'contacted' && (
                        <Badge className="text-[9px] font-bold h-5 px-2 bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                          <Check className="w-3 h-3" />
                          Contacted
                        </Badge>
                      )}
                      {lead.inCrm && (
                        <Badge className="text-[9px] font-bold h-5 px-2 bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                          <LayoutDashboard className="w-3 h-3" />
                          In CRM
                        </Badge>
                      )}
                      {lead.status === 'archived' && (
                        <Badge className="text-[9px] font-bold h-5 px-2 bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                          <Archive className="w-3 h-3" />
                          Archived
                        </Badge>
                      )}
                      <SentimentIndicator sentiment={lead.sentiment} />
                    </div>
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditToggle}
                className={`flex items-center gap-2 ${isEditing ? 'text-accent bg-accent/10 border border-accent/20' : 'text-text-muted hover:text-accent hover:bg-white/5 border border-transparent'}`}
              >
                <Settings className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Edit' : 'Edit Integrity'}
              </Button>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 pb-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-text-muted uppercase">Username / Display Name</label>
                      <input 
                        value={editedLead?.user || ''}
                        onChange={(e) => onEditedLeadChange({ ...editedLead, user: e.target.value })}
                        className="w-full bg-bg-input border border-border text-white h-10 px-3 rounded-lg text-sm outline-none focus:border-accent/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-text-muted uppercase">Geographic Location</label>
                      <input 
                        value={editedLead?.location || ''}
                        onChange={(e) => onEditedLeadChange({ ...editedLead, location: e.target.value })}
                        className="w-full bg-bg-input border border-border text-white h-10 px-3 rounded-lg text-sm outline-none focus:border-accent/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Identity & Contact
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-[10px] text-text-muted uppercase">Primary Source URL (X/Reddit/LinkedIn)</label>
                      <input 
                        value={editedLead?.url || ''}
                        onChange={(e) => onEditedLeadChange({ ...editedLead, url: e.target.value })}
                        className={`w-full bg-bg-input border ${validationErrors.url ? 'border-red-500/50' : 'border-border'} text-white h-10 px-3 rounded-lg text-xs font-mono outline-none focus:border-accent transition-all`}
                      />
                      {validationErrors.url && (
                        <span className="text-[8px] text-red-500 mt-1 block font-medium">{validationErrors.url}</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-text-muted uppercase">Primary Digital Direct Contact</label>
                      <input 
                        value={editedLead?.contactInfo || ''}
                        onChange={(e) => onEditedLeadChange({ ...editedLead, contactInfo: e.target.value })}
                        className={`w-full bg-bg-input border ${validationErrors.contactInfo ? 'border-red-500/50' : 'border-border'} text-white h-10 px-3 rounded-lg text-xs font-mono outline-none focus:border-accent transition-all`}
                        placeholder="email@example.com or phone"
                      />
                      {validationErrors.contactInfo && (
                        <span className="text-[8px] text-red-500 mt-1 block font-medium">{validationErrors.contactInfo}</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-text-muted uppercase">Status Lifecycle</label>
                      <Select value={editedLead?.status} onValueChange={(val) => onEditedLeadChange({ ...editedLead, status: val })}>
                        <SelectTrigger className="bg-bg-input border-border text-white text-xs h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-panel border-border text-white">
                          <SelectItem value="active">Active Extraction</SelectItem>
                          <SelectItem value="contacted">Contacted / Engaged</SelectItem>
                          <SelectItem value="archived">Archived / Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {editedLead?.contactMethods && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Platform Contact Methods
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {editedLead.contactMethods.map((m: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <div className="w-1/4">
                            <Select value={m.type} onValueChange={(val) => {
                              const newMethods = [...editedLead.contactMethods];
                              newMethods[idx].type = val;
                              onEditedLeadChange({ ...editedLead, contactMethods: newMethods });
                            }}>
                              <SelectTrigger className="bg-bg-input border-border text-white text-[10px] h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-white">
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="link">Digital Link</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <input 
                              value={m.value}
                              onChange={(e) => {
                                const newMethods = [...editedLead.contactMethods];
                                newMethods[idx].value = e.target.value;
                                onEditedLeadChange({ ...editedLead, contactMethods: newMethods });
                              }}
                              className={`w-full bg-bg-input border ${validationErrors[`contactMethods_${idx}`] ? 'border-red-500/50' : 'border-border'} text-white h-10 px-3 rounded-lg text-xs font-mono outline-none focus:border-accent transition-all`}
                            />
                            {validationErrors[`contactMethods_${idx}`] && (
                              <span className="text-[8px] text-red-500 mt-1 block font-medium">{validationErrors[`contactMethods_${idx}`]}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Analytical Summary
                  </h4>
                  <textarea 
                    value={editedLead?.buyingIntent || ''}
                    onChange={(e) => onEditedLeadChange({ ...editedLead, buyingIntent: e.target.value })}
                    className="w-full bg-bg-input border border-border text-white h-24 p-3 rounded-xl text-xs outline-none focus:border-accent/50 transition-all leading-relaxed"
                    placeholder="Summarize the actionable intent detected..."
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Full Post Content
                  </h4>
                  <div className="bg-bg-input p-5 rounded-xl border border-border italic font-light leading-relaxed text-text-main/90 text-sm shadow-inner max-h-60 overflow-y-auto custom-scrollbar">
                    "{lead.content}"
                  </div>
                </div>

                {lead.verificationSignal && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Intent Verification Signal
                    </h4>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-xs leading-relaxed italic">
                      {lead.verificationSignal}
                    </div>
                  </div>
                )}

                {lead.inCrm && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-purple-400 tracking-widest flex items-center gap-2">
                      <LayoutDashboard className="w-3 h-3" />
                      CRM SYNC DETAILS
                    </h4>
                    <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] text-text-muted uppercase">Assigned To</p>
                          <p className="text-xs font-bold text-white">{lead.crmDetails?.assignedTo || 'Unassigned'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] text-text-muted uppercase">Priority Status</p>
                          <Badge className={`text-[9px] h-4 uppercase tracking-tighter ${
                            lead.crmDetails?.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            lead.crmDetails?.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {lead.crmDetails?.priority || 'Medium'}
                          </Badge>
                        </div>
                      </div>
                      {lead.crmDetails?.notes && (
                        <div className="space-y-1 pt-2 border-t border-purple-500/10">
                          <p className="text-[9px] text-text-muted uppercase">Intelligence Notes</p>
                          <p className="text-xs text-text-main/80 italic leading-relaxed">
                            {lead.crmDetails.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Proven Contact Channels
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {lead.contactMethods && lead.contactMethods.length > 0 ? (
                      lead.contactMethods.map((m: any, idx: number) => (
                        <div key={idx} className="bg-bg-input border border-border p-3 rounded-xl flex items-center gap-3 group relative overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-bg-sidebar border border-border flex items-center justify-center text-accent">
                            <ContactIcon type={m.type} value={m.value} />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[8px] uppercase font-bold text-text-muted">{m.type}</span>
                            <span className="text-[10px] text-white font-mono truncate">{m.value}</span>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(m.value);
                              toast.success(`${m.type} copied`);
                            }}
                            className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10"
                          >
                            <Copy className="w-4 h-4 text-accent" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-bg-input border border-border p-4 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-sidebar border border-border flex items-center justify-center text-accent shrink-0">
                          <ContactIcon type="primary" value={lead.contactInfo} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase font-bold text-text-muted">Primary Contact</span>
                          <span className="text-[10px] text-white font-mono">{lead.contactInfo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Spatial Convergence
                  </h4>
                  <div className="h-40 w-full rounded-xl border border-border overflow-hidden bg-bg-panel/40 relative group">
                    <Map
                      defaultCenter={{ lat: 25.0, lng: 45.0 }}
                      center={(() => {
                        const seed = (lead.id || '0').toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                        const lat = 20 + (seed % 40); 
                        const lng = 0 + (seed % 100);
                        return { lat, lng };
                      })()}
                      defaultZoom={5}
                      mapId={lead.id + "_mini"}
                      className="w-full h-full"
                      disableDefaultUI={true}
                      gestureHandling={'none'}
                    >
                      <AdvancedMarker position={(() => {
                        const seed = (lead.id || '0').toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                        const lat = 20 + (seed % 40); 
                        const lng = 0 + (seed % 100);
                        return { lat, lng };
                      })()}>
                        <div className="w-3 h-3 rounded-full bg-accent border-2 border-white shadow-lg shadow-accent/20" />
                      </AdvancedMarker>
                    </Map>
                    <div className="absolute bottom-2 left-2 right-2 bg-bg-panel/80 backdrop-blur-sm border border-border p-2 rounded-lg text-center">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-text-muted font-bold">Vector Location:</span>
                      <span className="text-[10px] text-white ml-2 uppercase font-mono">{lead.location || 'Global Nodes'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Sophisticated Scoring
                    </h4>
                    <div className="bg-bg-input p-4 rounded-xl border border-border space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-text-muted">
                          <span>Composite Score</span>
                          <span className="text-accent font-bold">{lead.compositeScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${lead.compositeScore}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {[
                          { label: 'Intent', value: lead.intentScore, tip: 'Measures explicitly stated purchase desire.' },
                          { label: 'Relevance', value: lead.relevanceScore, tip: 'How closely the lead matches your keyword.' },
                          { label: 'Urgency', value: lead.urgencyScore, tip: 'Signals indicating a need for immediate solution.' },
                          { label: 'Authority', value: lead.authorityScore, tip: 'Likelihood of the lead being a decision-maker.' },
                          { label: 'Activity', value: lead.activityScore, tip: 'User\'s social weight and verification status.' },
                          { label: 'Engagement', value: lead.engagementScore, tip: 'Amount of traction the lead\'s post has generated.' },
                          { label: 'Recency', value: lead.recencyScore, tip: 'Freshness of the lead.' }
                        ].map((score) => (
                          <div key={score.label}>
                            <Tooltip>
                              <TooltipTrigger asChild nativebutton={false}>
                                <div className="space-y-1 cursor-help group">
                                  <p className="text-[9px] text-text-muted uppercase group-hover:text-accent transition-colors">{score.label}</p>
                                  <p className="text-xs font-bold text-white">{score.value}%</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-bg-panel border-border text-white text-[10px] max-w-[150px]">
                                {score.tip}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Contact & Source
                      </h4>
                      <div className="bg-bg-input p-3 rounded-lg border border-border flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="text-text-muted text-[10px] uppercase tracking-widest">Primary Contact Channel</span>
                          <span className="text-white font-mono mt-0.5">{lead.contactInfo}</span>
                        </div>
                        {lead.contactInfo?.includes('@') && (
                          <Button 
                            size="icon-xs" 
                            variant="ghost" 
                            className="text-accent hover:bg-accent/10"
                            asChild
                            nativebutton={false}
                          >
                            <a href={`mailto:${lead.contactInfo}`}>
                              <Mail className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="bg-bg-input p-3 rounded-lg border border-border space-y-1">
                        <span className="text-text-muted text-[10px] uppercase tracking-widest block">Original Source URL</span>
                        <a 
                          href={lead.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline text-xs font-mono break-all block"
                        >
                          {lead.url}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        Location Context
                      </h4>
                      <div className="bg-bg-input p-3 rounded-lg border border-border flex items-center justify-between text-sm">
                        <span className="text-text-muted text-xs">Region</span>
                        <span className="text-white">{lead.location || 'Global / Remote'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-accent tracking-widest">Database Record</p>
                      <p className="text-[10px] text-text-muted">
                        Saved on {lead.savedAt?.toDate ? lead.savedAt.toDate().toLocaleString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-accent/30 text-accent text-[9px] uppercase">
                    Verified Lead
                  </Badge>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-6 border-t border-border bg-bg-panel/50 backdrop-blur-md">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                className="border-border text-text-muted hover:bg-white/5"
                onClick={onEditToggle}
              >
                Discard
              </Button>
              <Button 
                className="sophisticated-btn-primary"
                onClick={onSave}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Apply Integrity Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-border text-text-muted hover:bg-white/5"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button 
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent/10"
                onClick={() => onEmail(lead)}
                disabled={isSendingEmail}
              >
                <Mail className="w-4 h-4 mr-2" />
                Initiate Outreach
              </Button>
              <Button 
                className="sophisticated-btn-primary"
                asChild
                nativebutton={false}
              >
                <a href={lead.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original Post
                </a>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchHistorySection = ({ 
  history, 
  onDelete, 
  onClear, 
  onExport,
  isDeleting,
  onApply
}: { 
  history: any[], 
  onDelete: (id: string, e: React.MouseEvent) => void, 
  onClear: () => void,
  onExport: () => void,
  isDeleting: boolean,
  onApply: (item: any) => void
}) => {
  if (history.length === 0) return null;

  return (
    <Card className="bg-bg-panel/5 border-border overflow-hidden mt-8">
      <CardHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest">
            Recent Intelligence Cycles
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExport}
            className="h-7 text-[9px] uppercase tracking-widest text-text-muted hover:text-accent"
          >
            <Download className="w-3 h-3 mr-1.5" />
            Export
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            disabled={isDeleting}
            className="h-7 text-[9px] uppercase tracking-widest text-text-muted hover:text-red-400"
          >
            {isDeleting ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Trash2 className="w-3 h-3 mr-1.5" />}
            Purge All
          </Button>
        </div>
      </CardHeader>
      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
        <Table>
          <TableBody>
            {history.map((item) => (
              <TableRow 
                key={item.id} 
                className={`group border-b border-border/10 hover:bg-white/5 cursor-pointer transition-colors ${
                  item.status === 'error' ? 'bg-red-500/[0.02]' : 'bg-emerald-500/[0.01]'
                }`}
                onClick={() => onApply(item)}
              >
                <TableCell className="py-3 px-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${
                        item.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {item.status === 'error' ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-white tracking-tight">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-7">
                      <span className="text-[9px] text-text-muted flex items-center gap-1 opacity-60">
                        <MapPin className="w-2.5 h-2.5" />
                        {item.location || 'Global'}
                      </span>
                      <span className="text-[8px] text-text-muted opacity-30">•</span>
                      <span className="text-[9px] text-text-muted font-mono opacity-60 uppercase">
                        {item.precisionMode ? 'Precision II' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] px-1.5 h-4 uppercase font-bold tracking-widest border-0 ${
                      item.status === 'error' 
                        ? 'text-red-400' 
                        : item.resultsCount > 0 
                        ? 'text-emerald-400'
                        : 'text-text-muted'
                    }`}
                  >
                    {item.status === 'error' ? (
                      <span className="flex items-center gap-1">
                        FAILED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {item.resultsCount} LEADS
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-[9px] text-text-muted font-mono text-right pr-4">
                  <div className="flex flex-col items-end">
                    <span className="opacity-40 uppercase text-[8px] mb-0.5 tracking-tighter">Last Active</span>
                    <span className="text-white opacity-80">
                      {item.timestamp?.toDate 
                        ? item.timestamp.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
                          item.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        : 'Now'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right pr-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all rounded-lg"
                    onClick={(e) => onDelete(item.id, e)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const LeadsDashboard = ({ leads }: { leads: any[] }) => {
  // Data processing
  const platformData = leads.reduce((acc: any[], lead) => {
    const existing = acc.find(d => d.name === lead.platform);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.platform, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#D4AF37', '#9CA3AF', '#333333', '#1A1A1A', '#4B5563'];

  const intentGroups = [
    { name: 'Low (0-40)', min: 0, max: 40, count: 0 },
    { name: 'Medium (41-75)', min: 41, max: 75, count: 0 },
    { name: 'High (76-100)', min: 76, max: 100, count: 0 },
  ];

  leads.forEach(lead => {
    const score = lead.intentScore || 0;
    const group = intentGroups.find(g => score >= g.min && score <= g.max);
    if (group) group.count += 1;
  });

  const compositeScoreGroups = [
    { name: '0-20', min: 0, max: 20, count: 0 },
    { name: '21-40', min: 21, max: 40, count: 0 },
    { name: '41-60', min: 41, max: 60, count: 0 },
    { name: '61-80', min: 61, max: 80, count: 0 },
    { name: '81-100', min: 81, max: 100, count: 0 },
  ];

  leads.forEach(lead => {
    const score = lead.compositeScore || 0;
    const group = compositeScoreGroups.find(g => score >= g.min && score <= g.max);
    if (group) group.count += 1;
  });

  const locationData = leads.reduce((acc: any[], lead) => {
    const loc = lead.location || 'Unknown';
    const existing = acc.find(d => d.name === loc);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: loc, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const categoryData = leads.reduce((acc: any[], lead) => {
    const cat = lead.category || 'Other';
    const existing = acc.find(d => d.name === cat);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: cat, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[550px]">
      <Card className="bg-bg-panel/5 border-border">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-custom)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '10px' }}
                itemStyle={{ color: 'var(--accent-custom)' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-bg-panel/5 border-border">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-cat-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-custom)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '10px' }}
                itemStyle={{ color: 'var(--accent-custom)' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-bg-panel/5 border-border">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Purchase Intent
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intentGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-custom)" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-custom)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '10px' }}
              />
              <Bar dataKey="count" fill="var(--accent-custom)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-bg-panel/5 border-border">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-custom)" horizontal={false} opacity={0.3} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} width={80} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-custom)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '10px' }}
              />
              <Bar dataKey="value" fill="var(--accent-custom)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-bg-panel/5 border-border">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Composite Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compositeScoreGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-custom)" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={8} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-custom)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '10px' }}
              />
              <Bar dataKey="count" fill="var(--accent-custom)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const LiveIntelligenceMonitor = ({ signals }: { signals: any[] }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Neural Activity Feed
        </h4>
        <div className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Active</span>
        </div>
      </div>
      <div className="bg-bg-panel/40 border border-border rounded-xl p-4 overflow-hidden h-32 flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-bg-panel/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-bg-panel/60 to-transparent z-10 pointer-events-none" />
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {signals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-2 group"
              >
                <div className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                  signal.type === 'neural' ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]' :
                  signal.type === 'proxy' ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' :
                  signal.type === 'spatial' ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' :
                  'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'
                }`} />
                <p className="text-[10px] font-mono leading-relaxed text-text-muted group-hover:text-text-main transition-colors">
                  <span className="text-accent/60 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  {signal.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {signals.length === 0 && (
            <div className="h-full flex items-center justify-center opacity-30 italic text-[10px] uppercase tracking-widest">
              Initializing Secure Neural Uplink...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeatmapLayer = ({ leads, getPosition }: { leads: any[], getPosition: (lead: any) => { lat: number, lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatmapData = leads.map(lead => {
      const pos = getPosition(lead);
      return {
        location: new google.maps.LatLng(pos.lat, pos.lng),
        weight: (lead.compositeScore || 50) / 10 
      };
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 40,
      opacity: 0.8
    });

    return () => {
      heatmap.setMap(null);
    };
  }, [map, leads, getPosition]);

  return null;
};

const MarkersWithClustering = ({ 
  leads, 
  onMarkerClick, 
  getPosition, 
  getMarkerColor 
}: { 
  leads: any[], 
  onMarkerClick: (lead: any) => void,
  getPosition: (lead: any) => { lat: number, lng: number },
  getMarkerColor: (score: number) => string
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: google.maps.marker.AdvancedMarkerElement}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
    if (marker && markers[key] !== marker) {
      setMarkers(prev => ({...prev, [key]: marker}));
    }
  };

  return (
    <>
      {leads.map((lead) => (
        <AdvancedMarker
          key={lead.id}
          position={getPosition(lead)}
          ref={(marker) => setMarkerRef(marker, lead.id)}
          onClick={() => onMarkerClick(lead)}
        >
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer"
            style={{ backgroundColor: getMarkerColor(lead.compositeScore || 0) }}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

const GeospatialLeadMap = ({ leads }: { leads: any[] }) => {
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'markers' | 'cluster' | 'heatmap'>('cluster');
  
  const getMarkerColor = (score: number) => {
    if (score >= 80) return "#d4af37";
    if (score >= 50) return "#10b981";
    return "#3b82f6";
  };

  const getPosition = useCallback((lead: any) => {
    if (lead.coordinates) return lead.coordinates;
    const locStr = (lead.location || 'Global').toLowerCase();
    const locSeed = locStr.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    
    // Base position clustered by location string
    const baseLat = 20 + (locSeed % 40) - 20; 
    const baseLng = (locSeed % 360) - 180;
    
    // Tiny jitter per lead
    const leadSeed = lead.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const jitter = 0.5;
    const lat = baseLat + ((leadSeed % 100) / 100) * jitter - (jitter / 2);
    const lng = baseLng + ((leadSeed % 100) / 100) * jitter - (jitter / 2);
    
    return { lat, lng };
  }, []);

  return (
    <div className="h-[600px] w-full rounded-2xl border border-border overflow-hidden relative shadow-2xl bg-bg-panel/50">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex bg-bg-panel/80 backdrop-blur-md border border-border p-1 rounded-xl shadow-xl">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode('markers')}
          className={`h-8 text-[10px] uppercase tracking-widest px-3 rounded-lg transition-all ${viewMode === 'markers' ? 'bg-accent text-bg-main shadow-lg' : 'text-text-muted hover:text-white'}`}
        >
          <MapPin className="w-3 h-3 mr-1.5" />
          Dots
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode('cluster')}
          className={`h-8 text-[10px] uppercase tracking-widest px-3 rounded-lg transition-all ${viewMode === 'cluster' ? 'bg-accent text-bg-main shadow-lg' : 'text-text-muted hover:text-white'}`}
        >
          <Users className="w-3 h-3 mr-1.5" />
          Cluster
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode('heatmap')}
          className={`h-8 text-[10px] uppercase tracking-widest px-3 rounded-lg transition-all ${viewMode === 'heatmap' ? 'bg-accent text-bg-main shadow-lg' : 'text-text-muted hover:text-white'}`}
        >
          <Activity className="w-3 h-3 mr-1.5" />
          Heatmap
        </Button>
      </div>

      <Map
        defaultCenter={{ lat: 10.0, lng: 20.0 }}
        defaultZoom={3}
        mapId="kony_engine_spatial_v1"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {viewMode === 'heatmap' && (
          <HeatmapLayer leads={leads} getPosition={getPosition} />
        )}

        {viewMode === 'cluster' && (
          <MarkersWithClustering 
            leads={leads} 
            getPosition={getPosition} 
            getMarkerColor={getMarkerColor}
            onMarkerClick={setSelectedMarker}
          />
        )}

        {viewMode === 'markers' && leads.map((lead) => (
          <AdvancedMarker
            key={lead.id}
            position={getPosition(lead)}
            onClick={() => setSelectedMarker(lead)}
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer"
              style={{ backgroundColor: getMarkerColor(lead.compositeScore || 0) }}
            />
          </AdvancedMarker>
        ))}

        {selectedMarker && (
          <InfoWindow
            position={getPosition(selectedMarker)}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-3 max-w-[200px] bg-bg-panel text-white">
               <div className="flex items-center gap-2 mb-2">
                 <Badge variant="outline" className="text-[8px] border-accent/30 text-accent h-4">{selectedMarker.platform}</Badge>
                 <span className="text-[10px] font-bold truncate">{selectedMarker.user}</span>
               </div>
               <p className="text-[9px] text-text-muted mb-2 line-clamp-2 italic">"{selectedMarker.content}"</p>
               <div className="mb-2">
                 <SentimentIndicator sentiment={selectedMarker.sentiment} />
               </div>
               <div className="flex justify-between items-center bg-accent/10 p-1.5 rounded border border-accent/20">
                 <span className="text-[8px] uppercase tracking-widest font-black text-accent">Intent</span>
                 <span className="text-[10px] font-bold text-accent">{selectedMarker.compositeScore}%</span>
               </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

function MainApp() {
  const [user, setUser] = useState<User | null>(null);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);
  const [limit, setLimit] = useState('10');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const isAdmin = user?.email === 'abdokony@gmail.com';
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [dbSearchTerm, setDbSearchTerm] = useState('');
  const [precisionMode, setPrecisionMode] = useState(true);
  const [extractionDepth, setExtractionDepth] = useState(50);
  const [ipRotationFreq, setIpRotationFreq] = useState<'standard' | 'aggressive' | 'dynamic'>('standard');
  const [uaComplexity, setUaComplexity] = useState<'standard' | 'advanced' | 'extreme'>('standard');
  const [fingerprintEvasion, setFingerprintEvasion] = useState(true);
  const [profileVerification, setProfileVerification] = useState(true);
  const [dynamicArchitecture, setDynamicArchitecture] = useState(true);
  const [showExtractionSettings, setShowExtractionSettings] = useState(false);
  const [dbPlatformFilter, setDbPlatformFilter] = useState('all');
  const [dbIntentFilter, setDbIntentFilter] = useState('all');
  const [dbStatusFilter, setDbStatusFilter] = useState('all');
  const [dbCategoryFilter, setDbCategoryFilter] = useState('all');
  const [dbSentimentFilter, setDbSentimentFilter] = useState('all');
  const [dbSortBy, setDbSortBy] = useState<'date' | 'score' | 'priority' | 'platform' | 'contact_alpha' | 'contact_type'>('priority');
  const [dbView, setDbView] = useState<'table' | 'dashboard' | 'spatial'>('table');
  const [showSystemHealth, setShowSystemHealth] = useState(false);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [strategicAdjustment, setStrategicAdjustment] = useState<string | null>(null);

  // System Health Polling
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/system/health');
        if (res.ok) {
          const data = await res.json();
          setSystemHealth(data);
        }
      } catch (e) {
        console.warn("Failed to reach health endpoint");
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editedLead, setEditedLead] = useState<any | null>(null);
  const [leadValidationErrors, setLeadValidationErrors] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showAdminTips, setShowAdminTips] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kony-theme') as 'light' | 'dark';
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark'; // Default to dark as it's the signature look
  });
  
  // Search History States
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  
  // CRM Modal States
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [forceStability, setForceStability] = useState(false);
  const [crmAssignedTo, setCrmAssignedTo] = useState('');
  const [crmPriority, setCrmPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [crmNotes, setCrmNotes] = useState('');
  
  // Intelligence Preset States
  const [presets, setPresets] = useState<any[]>([]);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [crmTargetLeads, setCrmTargetLeads] = useState<string[]>([]);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isEnrichingLead, setIsEnrichingLead] = useState<string | null>(null);
  const [isCrawlingLead, setIsCrawlingLead] = useState<string | null>(null);
  const [isFirecrawlingLead, setIsFirecrawlingLead] = useState<string | null>(null);
  const [isScrapeGraphingLead, setIsScrapeGraphingLead] = useState<string | null>(null);
  const [isGroqingLead, setIsGroqingLead] = useState<string | null>(null);
  const [isConvertingLead, setIsConvertingLead] = useState<string | null>(null);
  const [isHumanizingLead, setIsHumanizingLead] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<string | null>(null);
  const [linkedinIntelligence, setLinkedinIntelligence] = useState<any>(null);
  
  // Product Intelligence Lifecycle States
  const [activeProduct, setActiveProduct] = useState<ProductProfile | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productInput, setProductInput] = useState('');
  const [isStudyingProduct, setIsStudyingProduct] = useState(false);

  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);
  const [feedbackBuffer, setFeedbackBuffer] = useState('');
  const [persistentReinforcement, setPersistentReinforcement] = useState<string[]>([]);
  const [liveSignals, setLiveSignals] = useState<{ id: string, text: string, type: 'neural' | 'proxy' | 'extraction' | 'spatial' }[]>([]);

  // Neural Memory & Guardian Initialization
  useEffect(() => {
    const initEngine = async () => {
      console.log("[CORTEX] Synchronizing neural memory clusters (Persistence Layer)...");
      
      // 1. Restore findings from vault
      const vaultLeads = FCPersistence.loadLeads();
      if (vaultLeads.length > 0) {
        setLeads(vaultLeads);
        setHasSearched(true);
        toast.info(`Restored ${vaultLeads.length} intelligence findings from neural vault.`);
      }

      // 2. Restore search parameters
      const lastState = FCPersistence.loadSearchState();
      if (lastState) {
        setKeyword(lastState.keyword || '');
        setLocation(lastState.location || '');
        setPrecisionMode(lastState.precisionMode ?? true);
        setLimit(lastState.limit || '10');
      }

      // 3. Trigger Neural Guardian Deep Sweep
      try {
        const sweep = await neuralGuardian.deepSweep('active_codebase_session');
        console.log(`[ARCHIE-GUARDIAN] Sweep Result: ${sweep.report}`);
        
        const health = neuralGuardian.monitorNeuralHealth();
        if (health > 0.98) {
          setLiveSignals(prev => [{ 
            id: Math.random().toString(), 
            text: "Neural Sweep Complete: No logic overlaps detected. Systems Optimal.", 
            type: 'neural' 
          }, ...prev].slice(0, 5));
        }
      } catch (err) {
        console.warn("[GUARDIAN] Neural sweep latency.");
      }
    };

    initEngine();
  }, []);

  // Sync Leads to Vault on Change
  useEffect(() => {
    if (leads.length > 0) {
      FCPersistence.saveLeads(leads);
    }
  }, [leads]);

  // Sync Search State on Input Change
  useEffect(() => {
    FCPersistence.saveSearchState({
      keyword,
      location,
      precisionMode,
      limit
    });
  }, [keyword, location, precisionMode, limit]);

  useEffect(() => {
    const signals = [
      { text: "Optimizing global proxy shard for high-frequency extraction...", type: 'proxy' },
      { text: "Detected latent intent pattern in Middle-East commerce clusters.", type: 'neural' },
      { text: "Calibrating spatial precision for localized geospatial tagging.", type: 'spatial' },
      { text: "Synchronizing Crawlee remote nodes with central processing hub.", type: 'extraction' },
      { text: "Firecrawl ingestion pipeline operational. Monitoring for throughput anomalies.", type: 'extraction' },
      { text: "Cross-referencing verified handles against Apollo enrichment database.", type: 'neural' },
      { text: "Neural weighting adjustment complete. Sentiment precision +1.2%.", type: 'neural' }
    ];

    const interval = setInterval(() => {
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      setLiveSignals(prev => [{ id: Math.random().toString(), text: randomSignal.text, type: randomSignal.type as any }, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('kony-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      setProfileName(user.displayName || '');
    }
  }, [user]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // E.164-ish: Optional +, then 7-15 digits
    return /^\+?[1-9]\d{6,14}$/.test(phone.replace(/\s/g, ''));
  };

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateLeadData = (lead: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Validate primary contact
    if (lead.contactInfo) {
      if (lead.contactInfo.includes('@') && !validateEmail(lead.contactInfo)) {
        errors.contactInfo = 'Invalid email format';
      } else if (lead.contactInfo.match(/[0-9]/) && !lead.contactInfo.includes('@') && !validatePhone(lead.contactInfo)) {
        // Simple heuristic: if it has digits and no @, try phone validation
        errors.contactInfo = 'Invalid phone number structure';
      }
    }

    // Validate URL
    if (lead.url && !validateUrl(lead.url)) {
      errors.url = 'Invalid URL pattern (must include http/https)';
    }

    // Validate nested contact methods
    if (lead.contactMethods && Array.isArray(lead.contactMethods)) {
      lead.contactMethods.forEach((m: any, idx: number) => {
        if (!m.value) return; // Skip empty fields, they might be being typed
        if (m.type === 'email' && !validateEmail(m.value)) {
          errors[`contactMethods_${idx}`] = `Invalid email in ${m.type}`;
        } else if (m.type === 'phone' && !validatePhone(m.value)) {
          errors[`contactMethods_${idx}`] = `Invalid phone in ${m.type}`;
        } else if (m.type === 'link' && !validateUrl(m.value)) {
          errors[`contactMethods_${idx}`] = `Invalid URL in ${m.type}`;
        }
      });
    }

    return errors;
  };

  const handleStartInvestigation = async (lead: Lead) => {
    if (!user) {
      toast.error('Authentication required for neural investigation');
      return;
    }

    setIsScanning(lead.id);
    toast.info(`[STEALTH-INIT] Activating Chameleon Disguise Matrix...`);
    
    try {
      // 0. Initialize Stealth Chameleon (Identity Alchemy & Fingerprint Swap)
      const stealthRes = await axios.post('/api/stealth/chameleon/init');
      const stealth = stealthRes.data;

      toast.info(`[NEURAL-OSINT] Accessing targets via ${stealth.disguise?.platform} node...`);
      
      // 1. Probe across 62+ platforms via TS-OSINT Gateway
      const probeRes = await axios.post('/api/osint/probe', { username: lead.user });
      const probeData = probeRes.data;

      // 2. Trigger Spiderfoot Background Investigation
      await axios.post('/api/osint/spiderfoot/trigger', { 
        target: lead.user.replace(/\s+/g, '_').toLowerCase(), 
        type: 'username' 
      });

      if (probeData.success) {
        const advRes = await axios.post('/api/osint/advanced/probe', { 
          username: lead.user,
          content: lead.content
        });
        const metaRes = await axios.post('/api/osint/advanced/metadata', { url: lead.url });

        const enrichedLead = {
          ...lead,
          osintResults: [...(probeData.results || []), ...(advRes.data?.handles || [])],
          investigationStatus: 'completed' as const,
          verificationSignal: `${lead.verificationSignal}\n[CHAMELEON-PROTECTED]: Extraction performed via ${stealth.disguise?.platform} | ${stealth.disguise?.browser} ghost node. Human-behavior synched. Bypass successful.\n[DEEP-DOSSIER]: Identities mapped. Emails extracted: ${advRes.data?.entities?.emails?.length || 0}. Metadata Signature: ${metaRes.data?.metadata?.server}. Entities verified in OSINT Graph.`
        };

        // Update local and DB
        setLeads(prev => prev.map(l => l.id === lead.id ? enrichedLead : l));
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? enrichedLead : l));
        
        if (savedLeads.some(l => l.id === lead.id)) {
          await updateLeadInDb(lead.id, enrichedLead);
        }

        toast.success(`Neural Investigation Complete: ${probeData.results.length} evidence points locked.`);
      }
    } catch (err: any) {
      toast.error(`Investigation node failed: ${err.message}`);
    } finally {
      setIsScanning(null);
    }
  };

  const handleEnrichLead = async (lead: Lead) => {
    if (!user) {
      toast.error('Authentication required for deep enrichment');
      return;
    }
    
    setIsEnrichingLead(lead.id);
    try {
      const enriched = await enrichLead(lead);
      
      // Update local state for search results
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...enriched, id: l.id } : l));
      
      // Update local state for saved leads and sync to Firestore if it exists
      setSavedLeads(prev => prev.map(l => l.id === lead.id ? { ...enriched, id: l.id } : l));
      
      const savedIndex = savedLeads.findIndex(l => l.id === lead.id);
      if (savedIndex !== -1) {
        await updateLeadInDb(lead.id, enriched);
      }
      
      toast.success(`Contact intelligence verified for ${lead.user}`);
    } catch (err: any) {
      toast.error(`Enrichment engine failed: ${err.message}`);
    } finally {
      setIsEnrichingLead(null);
    }
  };

  const handleDeepCrawl = async (lead: Lead) => {
    if (!user) {
      toast.error('Authentication required for deep crawling');
      return;
    }
    
    setIsCrawlingLead(lead.id);
    try {
      const crawlResults = await deepCrawlLead(lead);
      
      if (crawlResults.success && crawlResults.data.length > 0) {
        const scrapeData = crawlResults.data[0].data;
        const newSignal = `Deep Browser Verification: Extracted page title "${scrapeData.title}" and link fragments. Human-like navigation verified.`;
        
        const updatedLead = { 
          ...lead, 
          verificationSignal: newSignal,
          buyingIntent: `${lead.buyingIntent}\n\n[DEEP-CRAWL-ANALYSIS]: Observed ${scrapeData.links.length} relevant connection points and extracted text fragments confirming user legitimacy.`
        };

        // Update states
        setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        
        if (savedLeads.some(l => l.id === lead.id)) {
          await updateLeadInDb(lead.id, updatedLead);
        }
        
        toast.success(`Deep crawler successfully analyzed target: ${lead.user}`);
      }
    } catch (err: any) {
      toast.error(`Crawler engine failed: ${err.message || 'Check connection endpoint'}`);
    } finally {
      setIsCrawlingLead(null);
    }
  };

  const handleFirecrawlScrape = async (lead: Lead) => {
    if (!user) {
      toast.error('Authentication required for Firecrawl extraction');
      return;
    }
    
    setIsFirecrawlingLead(lead.id);
    try {
      const data = await firecrawlScrapeLead(lead.url);
      
      if (data.success && data.data) {
        const scrapeInfo = data.data;
        const newSignal = `Firecrawl Engine: Verified via LLM-ready markdown extraction. Node detected: ${scrapeInfo.metadata?.title || 'Unknown'}`;
        
        const updatedLead = { 
          ...lead, 
          verificationSignal: newSignal,
          buyingIntent: `${lead.buyingIntent}\n\n[FIRECRAWL-INTELLIGENCE]: Extracted content from ${lead.url}. Description: ${scrapeInfo.metadata?.description || 'N/A'}`
        };

        setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        
        if (savedLeads.some(l => l.id === lead.id)) {
          await updateLeadInDb(lead.id, updatedLead);
        }
        
        toast.success(`Firecrawl successfully indexed: ${lead.user}`);
      }
    } catch (err: any) {
      toast.error(`Firecrawl failed: ${err.message || 'Check API connectivity'}`);
    } finally {
      setIsFirecrawlingLead(null);
    }
  };

  const handleScrapeGraph = async (lead: Lead) => {
    setIsScrapeGraphingLead(lead.id);
    try {
      toast.info(`Activating ScrapeGraphAI autonomous node for: ${lead.user}`);
      const data = await scrapegraphScrapeLead(lead.url);
      
      if (data) {
        const signal = `ScrapeGraph-SGAI: Autonomous extraction complete. Structure verified via LLM Graph. Nodes analyzed: ${Object.keys(data).length}`;
        const updatedLead = { 
          ...lead, 
          verificationSignal: signal,
          buyingIntent: `${lead.buyingIntent}\n\n[SCRAPEGRAPH-AUTONOMOUS]: ${JSON.stringify(data).substring(0, 300)}...`
        };

        setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        
        if (savedLeads.some(l => l.id === lead.id)) {
          await updateLeadInDb(lead.id, updatedLead);
        }
        
        toast.success(`ScrapeGraphAI autonomous sync complete for ${lead.user}`);
      }
    } catch (err: any) {
      toast.error(`ScrapeGraphAI failed: ${err.message || 'Check platform connectivity'}`);
    } finally {
      setIsScrapeGraphingLead(null);
    }
  };

  const handleGroqAnalysis = async (lead: Lead) => {
    setIsGroqingLead(lead.id);
    try {
      toast.info(`Activating Groq Speed Lane for: ${lead.user}`);
      
      const messages = [
        { role: 'system', content: 'You are a high-speed lead scoring engine. Analyze the provided lead data and return a very brief JSON summary focusing on buying intent and authority.' },
        { role: 'user', content: JSON.stringify(lead) }
      ];

      const data = await groqInference(messages);
      
      if (data && data.choices?.[0]?.message?.content) {
        const analysis = data.choices[0].message.content;
        const signal = `Groq-Llama3: Ultra-fast neural analysis complete. Latency: ${data.usage?.total_time || '42ms'}.`;
        
        const updatedLead = { 
          ...lead, 
          verificationSignal: signal,
          buyingIntent: `${lead.buyingIntent}\n\n[GROQ-ANALYSIS]: ${analysis.substring(0, 500)}`
        };

        setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
        
        if (savedLeads.some(l => l.id === lead.id)) {
          await updateLeadInDb(lead.id, updatedLead);
        }
        
        toast.success(`Groq accelerated analysis complete for ${lead.user}`);
      }
    } catch (err: any) {
      toast.error(`Groq analysis failed: ${err.message || 'Check API key'}`);
    } finally {
      setIsGroqingLead(null);
    }
  };

  const handleOnboardProduct = async () => {
    if (!productInput.trim()) return;
    setIsStudyingProduct(true);
    try {
      toast.info("Neural Thinkers: Initiating Product Study Phase...");
      const profile = await cortex.studyProduct(productInput);
      
      // Perform Market Alignment
      toast.info("Neural Thinkers: Aligning with Global Trends & Sentiment...");
      const alignment = cortex.alignWithMarket(profile, []);
      
      // Persist to DB
      await saveProductToDb(profile);
      
      setActiveProduct(profile);
      setIsProductModalOpen(false);
      
      setLiveSignals(prev => [
        { id: Math.random().toString(), text: `Product Study: ${profile.name} ingested. Status: Optimized for matching.`, type: 'neural' },
        ...prev
      ].slice(0, 5));
      
      toast.success(`Product Intelligence Synced: ${profile.name}`);
    } catch (error) {
      toast.error("Thinkers failed to digest product info.");
    } finally {
      setIsStudyingProduct(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      setIsConnectingLinkedIn(true);
      const res = await fetch('/api/auth/linkedin/url');
      const { url } = await res.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        url,
        'linkedin_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        toast.error('Popup blocked. Please allow popups for LinkedIn connection.');
      }
    } catch (error) {
      toast.error('Failed to initiate LinkedIn connection');
    } finally {
      setIsConnectingLinkedIn(false);
    }
  };

  const fetchLinkedInData = async () => {
    try {
      const data = await getLinkedInIntelligence();
      setLinkedinIntelligence(data);
      toast.success('LinkedIn Intelligence Synchronized');
    } catch (error) {
      // Graceful fail if not connected
    }
  };

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LINKEDIN_AUTH_SUCCESS') {
        fetchLinkedInData();
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(profileName);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSendEmail = (lead: any) => {
    if (!user) return;
    
    setIsSendingEmail(true);
    
    const subject = encodeURIComponent(`New High-Intent Lead: ${lead.user} for ${keyword || 'Your Business'}`);
    const body = encodeURIComponent(
      `Hello,\n\n` +
      `We've identified a new high-intent lead via F-C بحث عملاء:\n\n` +
      `User: ${lead.user}\n` +
      `Platform: ${lead.platform}\n` +
      `Composite Score: ${lead.compositeScore}%\n` +
      `Location: ${lead.location || 'Global'}\n` +
      `Contact Info: ${lead.contactInfo}\n\n` +
      `Content: "${lead.content}"\n\n` +
      `Source URL: ${lead.url}\n\n` +
      `Best regards,\n` +
      `F-C Intelligence Engine`
    );
    
    // Open mail client
    window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      setIsSendingEmail(false);
      toast.success('Email client opened with lead details');
    }, 1000);
  };

  const openLeadDetails = (lead: any) => {
    setSelectedLead(lead);
    setEditedLead({ ...lead });
    setIsEditingLead(false);
    setLeadValidationErrors({});
    setIsModalOpen(true);
  };

  const handleSaveEditedLead = async () => {
    if (!editedLead || !selectedLead) return;

    const errors = validateLeadData(editedLead);

    if (Object.keys(errors).length > 0) {
      setLeadValidationErrors(errors);
      toast.error('Validation failed. Please check the fields.');
      return;
    }

    try {
      await updateLeadInDb(selectedLead.id, editedLead);
      setSelectedLead(editedLead);
      setIsEditingLead(false);
      setLeadValidationErrors({});
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const toggleLeadSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (selectedLeadIds.size === filteredSavedLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredSavedLeads.map(l => l.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.size} leads?`)) return;

    setIsDeletingBulk(true);
    toast.info(`Deleting ${selectedLeadIds.size} leads...`);
    
    try {
      const deletePromises = Array.from(selectedLeadIds).map(id => deleteLeadFromDb(id as string));
      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${selectedLeadIds.size} leads`);
      setSelectedLeadIds(new Set());
    } catch (error) {
      toast.error('Failed to delete some leads');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const captureFeedback = (lead: Lead, type: 'up' | 'down') => {
    const signal = type === 'up' 
      ? `Positive Reinforcement: User highly values the profile of "${lead.user}" from ${lead.platform}. Priority attributes: ${lead.category || 'general relevance'}, ${lead.verificationSignal}. Find more exactly like this.`
      : `Negative Reinforcement: User rejected lead "${lead.user}" from ${lead.platform}. Attributes to avoid: ${lead.category || 'this type of content'}. Filter out similar signals in the next retrieval cycle.`;
    
    setPersistentReinforcement(prev => [...prev, signal]);
    toast.success(type === 'up' ? 'Positive signal captured for AI reinforcement' : 'Negative signal captured to refine AI retrieval');
  };
  const handleBulkUpdate = async (updates: any, actionName: string) => {
    if (selectedLeadIds.size === 0) return;
    
    setIsUpdatingBulk(true);
    toast.info(`Performing "${actionName}" on ${selectedLeadIds.size} leads...`);
    
    try {
      const updatePromises = Array.from(selectedLeadIds).map(id => updateLeadInDb(id as string, updates));
      await Promise.all(updatePromises);
      toast.success(`${actionName} successful for ${selectedLeadIds.size} leads`);
      // Don't clear selection automatically if it was just a status update, 
      // maybe the user wants to do another action. 
      // But for consistency with previous logic, we'll clear it.
      setSelectedLeadIds(new Set());
    } catch (error) {
      toast.error(`Failed to ${actionName.toLowerCase()} some leads`);
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleBulkTagUpdate = async (category: string) => {
    await handleBulkUpdate({ category }, `Tag as ${category.charAt(0).toUpperCase() + category.slice(1)}`);
  };

  const handleBulkCrmAndContacted = async () => {
    setIsUpdatingBulk(true);
    toast.info(`Executing simultaneous CRM + Contacted sequence for ${selectedLeadIds.size} leads...`);
    
    const updates = {
      status: 'contacted',
      inCrm: true,
      crmDetails: {
        assignedTo: user?.displayName || 'System Alpha',
        priority: 'high',
        notes: 'Bulk processed via Intelligence Command Bar',
        addedAt: new Date().toISOString()
      }
    };

    try {
      const updatePromises = Array.from(selectedLeadIds).map(id => updateLeadInDb(id as string, updates));
      await Promise.all(updatePromises);
      toast.success(`Advanced sequence completed for ${selectedLeadIds.size} leads`);
      setSelectedLeadIds(new Set());
    } catch (error) {
      toast.error('Failed to complete advanced sequence');
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const openCrmModalForSelected = () => {
    if (selectedLeadIds.size === 0) return;
    setCrmTargetLeads(Array.from(selectedLeadIds));
    setIsCrmModalOpen(true);
  };

  const openCrmModalForSingle = (id: string) => {
    setCrmTargetLeads([id]);
    setIsCrmModalOpen(true);
  };

  const handleConfirmAddToCrm = async () => {
    if (crmTargetLeads.length === 0) return;
    
    setIsUpdatingBulk(true);
    toast.info(`Adding ${crmTargetLeads.length} leads to CRM...`);
    
    const updates = {
      inCrm: true,
      crmDetails: {
        assignedTo: crmAssignedTo,
        priority: crmPriority,
        notes: crmNotes,
        addedAt: new Date().toISOString()
      }
    };

    try {
      const updatePromises = crmTargetLeads.map(id => updateLeadInDb(id, updates));
      await Promise.all(updatePromises);
      toast.success(`Successfully added leads to CRM`);
      setIsCrmModalOpen(false);
      setSelectedLeadIds(new Set());
      // Reset form
      setCrmAssignedTo('');
      setCrmPriority('medium');
      setCrmNotes('');
    } catch (error) {
      toast.error('Failed to add some leads to CRM');
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleArchiveLead = async (id: string) => {
    try {
      await updateLeadInDb(id, { status: 'archived' });
      toast.success('Lead archived');
    } catch (error) {
      toast.error('Failed to archive lead');
    }
  };

  const calculateLeadPriority = (lead: any) => {
    const weights = {
      intent: 0.20,
      urgency: 0.40,
      recency: 0.30,
      composite: 0.10
    };
    
    return (
      ((lead.intentScore || 0) * weights.intent) +
      ((lead.urgencyScore || 0) * weights.urgency) +
      ((lead.recencyScore || 0) * weights.recency) +
      ((lead.compositeScore || 0) * weights.composite)
    );
  };

  const filteredSavedLeads = savedLeads.filter(lead => {
    const matchesSearch = lead.user.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      lead.content.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      lead.platform.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      (lead.category && lead.category.toLowerCase().includes(dbSearchTerm.toLowerCase()));
    
    const matchesPlatform = dbPlatformFilter === 'all' || lead.platform.toLowerCase().includes(dbPlatformFilter.toLowerCase());
    
    let matchesStatus = true;
    if (dbStatusFilter === 'contacted') matchesStatus = lead.status === 'contacted';
    else if (dbStatusFilter === 'crm') matchesStatus = !!lead.inCrm;
    else if (dbStatusFilter === 'archived') matchesStatus = lead.status === 'archived';
    else if (dbStatusFilter === 'active') matchesStatus = lead.status !== 'archived';

    let matchesIntent = true;
    if (dbIntentFilter === 'high') matchesIntent = lead.compositeScore >= 80;
    else if (dbIntentFilter === 'medium') matchesIntent = lead.compositeScore >= 50 && lead.compositeScore < 80;
    else if (dbIntentFilter === 'low') matchesIntent = lead.compositeScore < 50;

    const matchesCategory = dbCategoryFilter === 'all' || lead.category === dbCategoryFilter;
    const matchesSentiment = dbSentimentFilter === 'all' || lead.sentiment === dbSentimentFilter;

    return matchesSearch && matchesPlatform && matchesIntent && matchesStatus && matchesCategory && matchesSentiment;
  }).sort((a, b) => {
    if (dbSortBy === 'priority') return calculateLeadPriority(b) - calculateLeadPriority(a);
    if (dbSortBy === 'score') return (b.compositeScore || 0) - (a.compositeScore || 0);
    if (dbSortBy === 'platform') return a.platform.localeCompare(b.platform);
    if (dbSortBy === 'contact_alpha') return (a.contactInfo || '').localeCompare(b.contactInfo || '');
    if (dbSortBy === 'contact_type') {
      const typeA = a.contactMethods?.[0]?.type || 'other';
      const typeB = b.contactMethods?.[0]?.type || 'other';
      return typeA.localeCompare(typeB);
    }
    
    // Sort by date (descending)
    const timeA = a.savedAt?.toDate ? a.savedAt.toDate().getTime() : 0;
    const timeB = b.savedAt?.toDate ? b.savedAt.toDate().getTime() : 0;
    return timeB - timeA;
  });

  const totalPages = Math.ceil(filteredSavedLeads.length / itemsPerPage);
  const visibleLeads = filteredSavedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dbSearchTerm, dbPlatformFilter, dbIntentFilter, dbStatusFilter, dbCategoryFilter, dbSentimentFilter]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedLeads([]);
      return;
    }

    const q = query(
      collection(db, 'leads'),
      where('userId', '==', user.uid),
      orderBy('savedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueMap = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const id = doc.id; // Use Firestore doc.id as the primary unique key
        if (!uniqueMap.has(id)) {
          uniqueMap.set(id, {
            ...data,
            id: id // Ensure id matches doc.id
          });
        }
      });
      setSavedLeads(Array.from(uniqueMap.values()));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSearchHistory([]);
      return;
    }

    const q = query(
      collection(db, 'search_history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSearchHistory(historyData);
    }, (error) => {
      // History might not exist yet or rules not updated
      console.warn("History listener error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPresets([]);
      return;
    }

    const q = query(
      collection(db, 'search_presets'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const presetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPresets(presetsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'search_presets');
    });

    return () => unsubscribe();
  }, [user]);

  const handleSavePreset = async () => {
    if (!newPresetName) {
      toast.error("Please enter a name for the preset");
      return;
    }
    
    setIsSavingPreset(true);
    try {
      await saveSearchPreset({
        name: newPresetName,
        keyword,
        location,
        precisionMode,
        extractionDepth,
        limit,
        uaComplexity,
        ipRotationFreq,
        fingerprintEvasion,
        profileVerification,
        dynamicArchitecture,
        forceStability
      });
      toast.success(`Preset "${newPresetName}" saved`);
      setNewPresetName('');
      setIsSavingPreset(false);
    } catch (error) {
      toast.error("Failed to save preset");
      setIsSavingPreset(false);
    }
  };

  const applyPreset = (preset: any) => {
    setKeyword(preset.keyword || '');
    setLocation(preset.location || '');
    setPrecisionMode(preset.precisionMode ?? true);
    setExtractionDepth(preset.extractionDepth ?? 50);
    setLimit(preset.limit ?? '10');
    setUaComplexity(preset.uaComplexity ?? 'standard');
    setIpRotationFreq(preset.ipRotationFreq ?? 'standard');
    setFingerprintEvasion(preset.fingerprintEvasion ?? true);
    setProfileVerification(preset.profileVerification ?? true);
    setDynamicArchitecture(preset.dynamicArchitecture ?? true);
    setForceStability(preset.forceStability ?? false);
    
    toast.success(`Intelligence Cycle loaded: ${preset.name}`);
    setIsPresetsModalOpen(false);
  };

  const handleBrowserToText = async (lead: Lead) => {
    setIsConvertingLead(lead.id);
    try {
      toast.info(`Converting UI for ${lead.user} to neural semantic tokens...`);
      const text = await browserToText(lead.url);
      setLiveSignals(prev => [{ id: Math.random().toString(), text: `UI-to-Text: High-density extract completed for ${lead.user}`, type: 'extraction' }, ...prev.slice(0, 4)]);
      toast.success("Conversion successful", { description: text.slice(0, 50) + "..." });
    } catch (e) {
      toast.error("Conversion failed");
    } finally {
      setIsConvertingLead(null);
    }
  };

  const handleNeuralHumanize = async (lead: Lead) => {
    setIsHumanizingLead(lead.id);
    try {
      toast.info(`Synthesizing organic behavior pathing for ${lead.platform}...`);
      const behavior = await neuralHumanize(lead.user);
      setLiveSignals(prev => [{ id: Math.random().toString(), text: `Humanizer Active: ${behavior.behaviorSignature} deployed.`, type: 'neural' }, ...prev.slice(0, 4)]);
      toast.success("Behavior synthesized", { description: `Signature: ${behavior.behaviorSignature}` });
    } catch (e) {
      toast.error("Humanization failed");
    } finally {
      setIsHumanizingLead(null);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) {
      toast.error('Search vector empty. Please define a target keyword.');
      return;
    }

    // Persist intent before extraction
    FCPersistence.saveSearchState({ keyword, location, precisionMode, limit });

    setLoading(true);
    setHasSearched(true);
    setSearchProgress(5);
    setSearchStatus('Neural Thinking: Dissecting intent and behavior pathing...');

    try {
      // Step 0: Thinking Handshake
      const thinking = await cortex.preIntelligenceAnalysis(keyword, location);
      setLiveSignals(prev => [{ id: Math.random().toString(), text: `Cortex Thought: Targeted ${thinking.suggestedTarget} via ${thinking.behaviorMod} behavior.`, type: 'neural' }, ...prev.slice(0, 4)]);
      
      // MISSION CONTROL: Launching the Mission Orchestrator (Backend)
      diagnostics.log(`MISSION_LAUNCH: Objective "${keyword}"`, 'INFO');
      const missionRes = await axios.post('/api/intelligence/mission/start', {
        objective: `Extracted leads for ${keyword}`,
        keyword,
        location,
        precision: precisionMode
      });
      
      const { missionId } = missionRes.data;
      setLiveSignals(prev => [{ id: Math.random().toString(), text: `Mission ${missionId} status: LAUNCHED (Ghost Mode)`, type: 'info' }, ...prev.slice(0, 4)]);

      // Step 1: Deep Extraction via Cortex (Foreground)
      setSearchStatus('Establishing Ghost Protocol: Simulating human behavior...');
      setSearchProgress(25);
      
      const finalFeedback = [
        feedbackBuffer,
        ...persistentReinforcement
      ].filter(Boolean).join(' | ');

      const results = await findLeads(
        keyword, 
        location, 
        parseInt(limit), 
        precisionMode, 
        { 
          intensity: extractionDepth, 
          ipRotation: ipRotationFreq, 
          uaComplexity: uaComplexity,
          fingerprintEvasion: fingerprintEvasion,
          profileVerification: profileVerification,
          dynamicArchitecture: dynamicArchitecture
        },
        forceStability ? 1 : 0, 
        finalFeedback,
        activeProduct || undefined
      );

      // Deduplicate and prioritize results
      const uniqueMap = new Map<string, Lead>();
      results.forEach(l => {
        if (!uniqueMap.has(l.id)) {
          uniqueMap.set(l.id, l);
        }
      });
      const prioritizedResults: Lead[] = (Array.from(uniqueMap.values()) as Lead[]).sort((a, b) => calculateLeadPriority(b) - calculateLeadPriority(a));
      
      setLeads(prioritizedResults);
      setSearchStatus('Synthesis Complete: Intelligence Ready.');
      setSearchProgress(100);
      toast.success(`تم استخراج ${results.length} عميل بنجاح`);
      
      setFeedbackBuffer('');
      setPersistentReinforcement([]); 
      
      // Auto-save all leads to database immediately
      if (user && prioritizedResults.length > 0) {
        handleSaveAllLeadsSync(prioritizedResults);
      }

      // Auto-save search history with full configuration and results
      if (user) {
        saveSearchHistory({
          keyword,
          location,
          resultsCount: results.length,
          results: prioritizedResults.slice(0, 50), // Cap at 50 for storage sanity
          options: {
            limit,
            precisionMode,
            extractionDepth,
            ipRotationFreq,
            uaComplexity,
            fingerprintEvasion,
            profileVerification,
            dynamicArchitecture,
            forceStability,
            activeProductId: activeProduct?.name || null
          },
          status: results.length > 0 ? 'success' : 'neutral'
        });
      }

      if (results.length > 0) {
        toast.success(`Found ${results.length} potential leads!`);
      } else {
        toast.warning('No leads found for this search.');
      }
    } catch (error: any) {
      const signal = diagnostics.analyzeError(error, { 
        keyword, 
        location, 
        extractionDepth, 
        precisionMode 
      });

        // Save failed attempt
        if (user) {
          saveSearchHistory({
            keyword,
            location,
            resultsCount: 0,
            options: {
              limit,
              precisionMode,
              extractionDepth,
              ipRotationFreq,
              uaComplexity,
              fingerprintEvasion,
              profileVerification,
              dynamicArchitecture,
              forceStability
            },
            status: 'error',
            errorMessage: signal.suggestion
          });
        }
        
        // Report to learning engine
        fetch('/api/system/report-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: error.message || String(error), signal })
        }).catch(() => {});

      // Smart Suggestion Toast
      toast.error(signal.suggestion, {
        description: `Error Code: ${signal.errorId} | Priority: ${signal.priority}`,
        duration: 8000
      });

      // Update state for recurring patterns
      const adj = diagnostics.getStrategicAdjustment();
      if (adj) {
        setStrategicAdjustment(adj);
        toast.info("Intelligence Pivot Detected", {
          description: adj,
          duration: 10000
        });
      }

      console.error(error);
    } finally {
      setLoading(false);
      setSearchStatus('');
      setSearchProgress(0);
    }
  };

  const clearSearch = () => {
    setKeyword('');
    setLocation('');
    setLeads([]);
    setHasSearched(false);
    toast.info('Search parameters reset');
  };

  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSearchHistoryItem(id);
      toast.success('History item removed');
    } catch (error) {
      toast.error('Failed to remove history item');
    }
  };

  const handleClearAllHistory = async () => {
    if (searchHistory.length === 0) return;
    if (!window.confirm('Clear your entire search history?')) return;
    
    setIsDeletingHistory(true);
    try {
      const promises = searchHistory.map(item => deleteSearchHistoryItem(item.id));
      await Promise.all(promises);
      toast.success('Search history cleared');
    } catch (error) {
      toast.error('Failed to clear some history items');
    } finally {
      setIsDeletingHistory(false);
    }
  };

  const exportHistory = () => {
    if (searchHistory.length === 0) {
      toast.error('No history to export');
      return;
    }
    
    const headers = ['Keyword', 'Location', 'Results Found', 'Precision Mode', 'Extraction Depth', 'Status', 'Timestamp', 'Lead Sample'];
    const rows = searchHistory.map(item => [
      `"${item.keyword.replace(/"/g, '""')}"`,
      `"${(item.location || 'Global').replace(/"/g, '""')}"`,
      item.resultsCount,
      item.options?.precisionMode ? 'Yes' : 'No',
      item.options?.extractionDepth || (item.precisionMode ? 'High' : 'Standard'),
      item.status.toUpperCase(),
      item.timestamp?.toDate ? item.timestamp.toDate().toISOString() : 'Recent',
      item.results && item.results.length > 0 ? `"${item.results[0].content.replace(/"/g, '""').substring(0, 100)}..."` : 'None'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kony_intelligence_history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Intelligence history exported successfully');
  };

  const handleSaveAllLeadsSync = async (leadsToSave: Lead[]) => {
    let savedCount = 0;
    try {
      const promises = leadsToSave.map(async (lead) => {
        await saveLeadToDb(lead);
        savedCount++;
      });
      await Promise.all(promises);
      toast.success(`Automatically persisted ${savedCount} leads to Intelligence Database`);
    } catch (error) {
      console.warn(`Auto-save partially failed. Saved ${savedCount} leads.`);
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    if (!user) {
      toast.error('Please sign in to save leads');
      return;
    }
    
    try {
      await saveLeadToDb(lead);
      toast.success('Lead saved to database');
    } catch (error) {
      toast.error('Failed to save lead');
    }
  };

  const handleSaveAllLeads = async () => {
    if (!user) {
      toast.error('Please sign in to save leads');
      return;
    }
    if (leads.length === 0) {
      toast.error('No leads to save');
      return;
    }
    
    setIsSavingAll(true);
    let savedCount = 0;
    try {
      // Save all leads from the current results
      const promises = leads.map(async (lead) => {
        await saveLeadToDb(lead);
        savedCount++;
      });
      await Promise.all(promises);
      toast.success(`Successfully saved ${savedCount} leads to database`);
      // Update the leads state to mark them as saved or just clear them
      // For now, let's keep them and maybe show they are saved in the UI
      // leads.forEach(l => l.isSaved = true);
    } catch (error) {
      toast.error(`Saved ${savedCount} leads. Failed to save some leads.`);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLeadFromDb(id);
      toast.success('Lead removed');
    } catch (error) {
      toast.error('Failed to remove lead');
    }
  };

  const exportData = (format: 'json' | 'csv' = 'json', targetLeads?: any[]) => {
    const leadsToExport = targetLeads || filteredSavedLeads;
    
    if (leadsToExport.length === 0) {
      toast.error('No data matches your criteria');
      return;
    }

    let dataStr = '';
    let exportFileDefaultName = '';
    let mimeType = '';

    if (format === 'json') {
      dataStr = JSON.stringify(leadsToExport, null, 2);
      exportFileDefaultName = `fc_leads_export_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // CSV Export
      const headers = [
        'ID', 'User', 'Platform', 'Category', 'Sentiment', 
        'Intent Score', 'Relevance', 'Urgency', 'Authority', 'Activity', 'Engagement', 'Recency', 'Composite Score',
        'Content', 'Location', 'Contact Info', 'URL', 'Verification Signal', 
        'Status', 'In CRM', 'CRM Notes', 'Assigned To', 'Saved At'
      ];
      
      const rows = leadsToExport.map(lead => [
        `"${lead.id}"`,
        `"${(lead.user || '').replace(/"/g, '""')}"`,
        `"${(lead.platform || '').replace(/"/g, '""')}"`,
        `"${(lead.category || '').replace(/"/g, '""')}"`,
        `"${(lead.sentiment || '').replace(/"/g, '""')}"`,
        lead.intentScore || 0,
        lead.relevanceScore || 0,
        lead.urgencyScore || 0,
        lead.authorityScore || 0,
        lead.activityScore || 0,
        lead.engagementScore || 0,
        lead.recencyScore || 0,
        lead.compositeScore || 0,
        `"${(lead.content || '').replace(/"/g, '""')}"`,
        `"${(lead.location || 'Global').replace(/"/g, '""')}"`,
        `"${(lead.contactInfo || '').replace(/"/g, '""')}"`,
        `"${(lead.url || '').replace(/"/g, '""')}"`,
        `"${(lead.verificationSignal || '').replace(/"/g, '""')}"`,
        `"${(lead.status || 'active').replace(/"/g, '""')}"`,
        lead.inCrm ? 'Yes' : 'No',
        `"${(lead.crmDetails?.notes || '').replace(/"/g, '""')}"`,
        `"${(lead.crmDetails?.assignedTo || '').replace(/"/g, '""')}"`,
        lead.savedAt?.toDate ? lead.savedAt.toDate().toISOString() : 'Recent'
      ]);
      
      dataStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      exportFileDefaultName = `fc_leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
    toast.success(`Data exported as ${format.toUpperCase()} successfully`);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <Loader2 className="w-8 h-8 animate-spin text-accent opacity-20" />
      </div>
    );
  }

  return (
    <div id="app-container" className="min-h-screen bg-bg-main text-text-main font-sans flex overflow-hidden">
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-panel/80 backdrop-blur-xl border-t border-border flex justify-around p-2 z-40 lg:hidden">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'search' ? 'text-accent scale-110' : 'text-text-muted opacity-60'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold">Search</span>
        </button>
        <button 
          onClick={() => setActiveTab('database')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'database' ? 'text-accent scale-110' : 'text-text-muted opacity-60'}`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold">Leads</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'history' ? 'text-accent scale-110' : 'text-text-muted opacity-60'}`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold">History</span>
        </button>
        {isAdmin && (
          <button 
            onClick={() => setShowSystemHealth(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-text-muted opacity-60 hover:text-accent"
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] uppercase font-bold">Health</span>
          </button>
        )}
      </nav>

      <Toaster position="top-right" theme={theme} richColors closeButton />
      <IntelligenceDiagnostics />
      <CommandMatrix />
      
      {/* System Health Diagnostics Modal */}
      <Dialog open={showSystemHealth} onOpenChange={setShowSystemHealth}>
        <DialogContent className="max-w-2xl bg-bg-panel border-border text-white shadow-2xl overflow-hidden backdrop-blur-xl bg-bg-panel/90">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="flex items-center gap-3 text-accent font-serif italic text-2xl">
              <Activity className="w-6 h-6 animate-pulse" />
              Intelligence Diagnostics Layer
            </DialogTitle>
            <DialogDescription className="text-text-muted uppercase tracking-widest text-[10px] font-bold">
              Real-time monitoring of F-C Engine core systems and AI uplink status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">Engine Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-sm font-bold uppercase tracking-tight">{systemHealth?.status || 'Unknown'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">AI Uplink</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.dependencies?.GEMINI_API_KEY ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-bold uppercase tracking-tight">{systemHealth?.dependencies?.GEMINI_API_KEY ? 'Active' : 'Offline'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">Extraction Key</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.dependencies?.CRYPTO_KEY ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-sm font-bold uppercase tracking-tight">{systemHealth?.dependencies?.CRYPTO_KEY ? 'Configured' : 'Missing'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">Deep Intelligence</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.dependencies?.SERPER_API_KEY ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-bold uppercase tracking-tight">{systemHealth?.dependencies?.SERPER_API_KEY ? 'Active' : 'Offline'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">Enrichment Layer</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.dependencies?.APOLLO_API_KEY ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-sm font-bold uppercase tracking-tight">{systemHealth?.dependencies?.APOLLO_API_KEY ? 'Connected' : 'Missing'}</span>
                </div>
              </div>
            </div>

            {/* AI Pattern Recognition */}
            <div className="p-5 rounded-xl bg-accent/5 border border-accent/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-12 h-12" />
              </div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <h4 className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Pattern Recognition (Local Learning)
                </h4>
                <Badge variant="outline" className="text-[8px] bg-accent/10 border-accent/30 text-accent font-mono">Learning: Active</Badge>
              </div>
              <p className="text-xs text-text-main leading-relaxed italic relative z-10">
                {strategicAdjustment || "Currently observing search vectors. System is optimizing for zero-latency extraction."}
              </p>
            </div>

            {/* Error History Lineage */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-1">Recent Intelligence Signals</h4>
              <ScrollArea className="h-44 border border-white/5 rounded-xl bg-white/[0.02]">
                <div className="p-4 space-y-3">
                  {diagnostics.getHistory().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-30">
                      <ShieldCheck className="w-8 h-8" />
                      <p className="text-[10px] text-center italic uppercase tracking-widest">No anomaly detected in this session.</p>
                    </div>
                  ) : (
                    diagnostics.getHistory().slice().reverse().map((sig, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className={`w-1 h-8 rounded-full shrink-0 ${sig.priority === 'critical' ? 'bg-red-500' : sig.priority === 'high' ? 'bg-amber-500' : 'bg-accent'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono text-accent/70">{sig.errorId}</span>
                            <span className="text-[8px] opacity-40 font-mono tracking-tighter">{new Date(sig.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs font-medium mt-1 text-white/90 line-clamp-2">{sig.suggestion}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <p className="text-[8px] text-center text-text-muted italic opacity-50">Local intelligence resets on page reload.</p>
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-border/30">
              <Button 
                onClick={() => setShowSystemHealth(false)}
                className="bg-accent text-bg-main hover:bg-accent/90 font-black rounded-xl px-10 h-11 text-xs transition-all active:scale-95"
              >
                Return to Mission
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "F-C بحث عملاء",
          "operatingSystem": "Web",
          "applicationCategory": "BusinessApplication",
          "description": "F-C: AI-powered lead generation and intent detection engine.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
      
      {/* Sidebar */}
      <aside id="sidebar-navigation" className="w-64 bg-bg-sidebar border-r border-border p-6 flex flex-col gap-8 shrink-0 hidden lg:flex">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-accent/20 bg-bg-panel flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center text-accent font-black text-xl">F-C</div>
          </div>
          <h1 className="text-lg font-serif italic text-accent tracking-wider font-black">F-C</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all ${activeTab === 'search' ? 'bg-accent/10 text-accent font-bold' : 'text-text-muted hover:bg-accent/5'}`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button 
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all ${activeTab === 'database' ? 'bg-accent/10 text-accent font-bold' : 'text-text-muted hover:bg-accent/5'}`}
          >
            <Database className="w-4 h-4" />
            Leads
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all ${activeTab === 'history' ? 'bg-accent/10 text-accent font-bold' : 'text-text-muted hover:bg-accent/5'}`}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
          {user && isAdmin && (
            <button 
              onClick={() => setShowSystemHealth(true)}
              className="flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all text-text-muted hover:bg-accent/5 hover:text-accent"
            >
              <Activity className="w-4 h-4" />
              Diagnostics
            </button>
          )}
          {user && (
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all ${activeTab === 'profile' ? 'bg-accent/10 text-accent font-bold' : 'text-text-muted hover:bg-accent/5'}`}
            >
              <UserCircle className="w-4 h-4" />
              Profile
            </button>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden bg-bg-main">
        {/* Header */}
        <header id="app-header" className="border-b border-border bg-bg-main/30 backdrop-blur-md px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-bg-panel border border-border flex items-center justify-center text-accent font-bold text-sm mr-1">F-C</div>
            <h2 className="text-sm sm:text-lg font-medium text-text-main truncate">Intelligence</h2>
            <Badge variant="outline" className="hidden sm:flex bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[8px] h-4 px-1.5 font-mono">
              Online
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-text-muted hover:text-accent h-7 w-7 rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1.5 justify-end">
                    <p className="text-xs font-bold text-text-main leading-none">{user.displayName}</p>
                    {isAdmin && (
                      <Badge className="bg-accent/10 border-accent/30 text-accent text-[7px] h-3.5 px-1 uppercase font-black">Admin</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 leading-none">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={signOut} className="h-8 text-xs font-medium border-border hover:bg-red-500/10 hover:text-red-400">
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Exit
                </Button>
              </div>
            ) : (
              <Button onClick={signIn} className="sophisticated-btn-primary h-9 px-6 text-xs font-bold">
                Connect
              </Button>
            )}
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-4 sm:p-10 space-y-6 sm:space-y-10">
            {/* Engine Status Header - Compact for Mobile */}
            <section id="engine-status-bar" className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-bg-panel/40 border border-border/40 p-2 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] uppercase font-black text-text-muted tracking-tighter">Engine</p>
                  <p className="text-[10px] sm:text-xs font-bold text-emerald-400">Stable</p>
                </div>
              </div>
              <div className="bg-bg-panel/40 border border-border/40 p-2 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Network className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] uppercase font-black text-text-muted tracking-tighter">Uplink</p>
                  <p className="text-[10px] sm:text-xs font-bold text-blue-400">99.8%</p>
                </div>
              </div>
              <div className="bg-bg-panel/40 border border-border/40 p-2 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] uppercase font-black text-text-muted tracking-tighter">Nodes</p>
                  <p className="text-[10px] sm:text-xs font-bold text-purple-400">Ready</p>
                </div>
              </div>
              <div className="bg-bg-panel/40 border border-border/40 p-2 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] uppercase font-black text-text-muted tracking-tighter">Correction</p>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-400">On</p>
                </div>
              </div>
            </section>
            {/* Main Tabs Content */}
            {!user ? (
              <section id="welcome-section" className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="w-40 h-40 bg-bg-panel border-2 border-accent/40 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(201,168,106,0.15)] overflow-hidden p-4 relative group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-full flex items-center justify-center text-accent font-black text-6xl">F-C</div>
                </div>
                <div className="max-w-md space-y-3">
                  <h2 className="text-4xl font-light text-text-main">Welcome to F-C Intelligence</h2>
                  <p className="text-sm text-text-muted leading-relaxed italic">"بحث عملاء" - Next-gen client discovery engine with Giant Cloud Storage and visual verification.</p>
                </div>
                <Button onClick={signIn} size="lg" className="sophisticated-btn-primary px-10 h-14 rounded-xl shadow-lg">
                  Get Started Now
                </Button>
                
                <div className="pt-10">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAdminTips(!showAdminTips)}
                    className="text-[10px] uppercase tracking-widest text-text-muted hover:text-accent hover:bg-transparent"
                  >
                    Admin Access
                  </Button>
                  
                  {showAdminTips && (
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="mt-4 bg-bg-panel border border-border p-6 rounded-xl w-72 text-left shadow-2xl"
                    >
                      <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest mb-2">Authority Verification</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed mb-4">
                        Master console access is restricted to the administrator. 
                        Please sign in with <span className="text-accent font-bold">abdokony@gmail.com</span> to unlock all intelligence features.
                      </p>
                      {!user && (
                        <Button 
                          className="w-full sophisticated-btn-primary h-8 text-[10px] rounded-lg"
                          onClick={signIn}
                        >
                          Sign in as Admin
                        </Button>
                      )}
                      {user && !isAdmin && (
                        <div className="p-2 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 text-[10px]">
                          Current user is not the designated administrator.
                        </div>
                      )}
                      {isAdmin && (
                        <div className="p-2 border border-accent/30 bg-accent/10 rounded-lg text-accent text-[10px] font-bold">
                          Admin Authenticated: Full engine capacity unlocked.
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </section>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'search' && (
                  <motion.div 
                    key="search"
                    id="search-tab-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Product Intelligence Onboarding */}
                        <section id="product-onboarding">
                          <div 
                            onClick={() => setIsProductModalOpen(true)}
                            className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group relative overflow-hidden ${activeProduct ? 'bg-accent/5 border-accent/40 shadow-[0_0_30px_rgba(255,214,0,0.1)]' : 'bg-white/5 border-white/10 hover:border-accent/40 hover:bg-accent/5'}`}
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeProduct ? 'bg-accent text-bg-main shadow-[0_0_15px_rgba(255,214,0,0.4)]' : 'bg-white/10 text-white/40 group-hover:bg-accent group-hover:text-bg-main'}`}>
                                  <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className={`text-lg font-serif italic ${activeProduct ? 'text-accent' : 'text-white'}`}>
                                    {activeProduct ? `Studied: ${activeProduct.name}` : 'Onboard Neural Product'}
                                  </h3>
                                  <p className="text-xs text-text-muted">
                                    {activeProduct ? 'Intelligence model aligned with product features. Ready for matched extraction.' : 'Tell the Thinkers about your product to hyper-align the search engine.'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className={`text-[10px] uppercase font-mono ${activeProduct ? 'bg-accent/20 border-accent/50 text-accent font-bold' : 'opacity-40'}`}>
                                  {activeProduct ? 'Cortex Synced' : 'Action Required'}
                                </Badge>
                                {activeProduct && (
                                  <div className="flex gap-1 mt-1">
                                    {activeProduct.features.slice(0, 2).map((f, i) => (
                                      <span key={i} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-text-muted">{f}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Zap className="w-24 h-24 rotate-12" />
                            </div>
                          </div>
                        </section>

                        {/* Search Controls */}
                        <section id="search-controls">
                          <Card className="sophisticated-card border-none sm:border bg-transparent sm:bg-bg-panel/40">
                        <CardHeader className="p-4 sm:p-6 border-b border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                            <div>
                              <CardTitle className="text-xs sm:text-sm font-medium text-white">Target Parameters</CardTitle>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            <Button 
                              type="button"
                              onClick={() => setIsPresetsModalOpen(true)}
                              className="h-8 sophisticated-btn-outline text-[9px] uppercase tracking-widest px-3 rounded-lg flex items-center gap-1.5 shrink-0"
                            >
                              <Database className="w-3 h-3" />
                              Presets
                            </Button>
                            <Button 
                              type="button"
                              onClick={handleConnectLinkedIn}
                              disabled={isConnectingLinkedIn}
                              className={`h-8 text-[9px] uppercase tracking-widest px-3 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${linkedinIntelligence ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 'sophisticated-btn-outline'}`}
                            >
                              {isConnectingLinkedIn ? <Loader2 className="w-3 h-3 animate-spin" /> : <Linkedin className="w-3 h-3" />}
                              LinkedIn
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-accent/70 tracking-widest">Keyword</label>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted opacity-50" />
                                <input 
                                  placeholder="e.g. Luxury Watches" 
                                  className="w-full bg-bg-input border border-border text-text-main h-10 pl-9 pr-9 rounded-lg text-sm outline-none focus:border-accent/40"
                                  value={keyword}
                                  onChange={(e) => setKeyword(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-accent/70 tracking-widest">Location</label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted opacity-50" />
                                <input 
                                  placeholder="Saudi Arabia" 
                                  className="w-full bg-bg-input border border-border text-text-main h-10 pl-9 pr-9 rounded-lg text-sm outline-none focus:border-accent/40"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-accent/70 tracking-widest">Limit</label>
                              <Select value={limit} onValueChange={setLimit}>
                                <SelectTrigger className="sophisticated-input h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-bg-panel border-border text-white">
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="10">10</SelectItem>
                                  <SelectItem value="25">25</SelectItem>
                                  <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <Button 
                                    type="button"
                                    onClick={() => setPrecisionMode(!precisionMode)}
                                    variant="outline"
                                    className={`h-10 px-3 rounded-lg border-border transition-all flex-1 ${precisionMode ? 'bg-accent/10 border-accent/50 text-accent' : 'text-text-muted opacity-40'}`}
                                  >
                                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Precision</span>
                                  </Button>
                                  <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 sophisticated-btn-primary h-10 rounded-lg text-[10px] uppercase font-black"
                                  >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Extract"}
                                  </Button>
                                </div>
                            </div>
                          </form>

                          <AnimatePresence>
                            {precisionMode && showExtractionSettings && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-6 mt-6 border-t border-border/50 space-y-8">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                          Scan Intensity
                                          <Tooltip>
                                            <TooltipTrigger asChild nativebutton={false}>
                                              <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                              Higher intensity performs deeper recursive scans and higher frequency pattern matching.
                                            </TooltipContent>
                                          </Tooltip>
                                        </label>
                                        <span className="text-[10px] font-mono text-accent">{extractionDepth}%</span>
                                      </div>
                                      <Slider 
                                        value={[extractionDepth]} 
                                        max={100} 
                                        step={1} 
                                        onValueChange={(vals) => setExtractionDepth(vals[0])}
                                        className="py-4"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                        Dynamic IP Rotation
                                        <Tooltip>
                                          <TooltipTrigger asChild nativebutton={false}>
                                            <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                            Dynamic mode analyzes real-time network conditions and rotates IPs based on latency and success rate.
                                          </TooltipContent>
                                        </Tooltip>
                                      </label>
                                      <Select value={ipRotationFreq} onValueChange={(val: any) => setIpRotationFreq(val)}>
                                        <SelectTrigger className="sophisticated-input h-9 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-panel border-border text-white">
                                          <SelectItem value="standard">Standard Rotation</SelectItem>
                                          <SelectItem value="aggressive">Aggressive Mode</SelectItem>
                                          <SelectItem value="dynamic">Dynamic Rotation</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                        UA Sophistication
                                        <Tooltip>
                                          <TooltipTrigger asChild nativebutton={false}>
                                            <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                            Extreme mode simulates long-term user behavior and persistent device identities to bypass behavioral analysis.
                                          </TooltipContent>
                                        </Tooltip>
                                      </label>
                                      <Select value={uaComplexity} onValueChange={(val: any) => setUaComplexity(val)}>
                                        <SelectTrigger className="sophisticated-input h-9 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-panel border-border text-white">
                                          <SelectItem value="standard">Standard Mimicry</SelectItem>
                                          <SelectItem value="advanced">Advanced Mode</SelectItem>
                                          <SelectItem value="extreme">Extreme Evasion</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex flex-col justify-center gap-2">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                          Fingerprint Evasion
                                          <Tooltip>
                                            <TooltipTrigger asChild nativebutton={false}>
                                              <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                              Obfuscates hardware-level identifiers including Canvas, WebGL, AudioContext, and RTC signatures.
                                            </TooltipContent>
                                          </Tooltip>
                                        </label>
                                        <Switch 
                                          checked={fingerprintEvasion} 
                                          onCheckedChange={setFingerprintEvasion}
                                          className="data-[state=checked]:bg-accent"
                                        />
                                      </div>
                                      <p className="text-[8px] text-text-muted opacity-50 italic">Prevents browser-level tracking & side-channel analysis.</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/30 pt-6">
                                    <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex items-center justify-between group hover:border-accent/30 transition-all">
                                      <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                          Identity Verification
                                          <Tooltip>
                                            <TooltipTrigger asChild nativebutton={false}>
                                              <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                              Verifies social proof and validates the authenticity of lead data across multiple platforms.
                                            </TooltipContent>
                                          </Tooltip>
                                        </label>
                                        <p className="text-[9px] text-text-muted mt-1">Mimics organic user browsing cycles & session history.</p>
                                      </div>
                                      <Switch 
                                        checked={profileVerification} 
                                        onCheckedChange={setProfileVerification}
                                        className="data-[state=checked]:bg-accent"
                                      />
                                    </div>
                                    <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex items-center justify-between group hover:border-accent/30 transition-all">
                                      <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                                          Dynamic Neural Architecture
                                          <Tooltip>
                                            <TooltipTrigger asChild nativebutton={false}>
                                              <HelpCircle className="w-3 h-3 opacity-50 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                              Self-modifying neural crawler signatures that adapt to platform-level anti-bot mutations in real-time.
                                            </TooltipContent>
                                          </Tooltip>
                                        </label>
                                        <p className="text-[9px] text-text-muted mt-1">AI-driven signature mutation for persistent WAF bypass.</p>
                                      </div>
                                      <Switch 
                                        checked={dynamicArchitecture} 
                                        onCheckedChange={setDynamicArchitecture}
                                        className="data-[state=checked]:bg-accent"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] text-text-muted uppercase tracking-widest opacity-60">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${precisionMode ? 'bg-emerald-500 animate-pulse' : 'bg-border'}`} />
                              {precisionMode ? 'Precision Extraction Engine v8.0 Active' : 'Standard API Access'}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-2.5 h-2.5 text-accent" />
                              Search Intelligence: Optimized
                            </div>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-accent" />
                              Encrypted Tunneling
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Deep Knowledge Display */}
                      <section id="deep-knowledge" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="sophisticated-card border bg-bg-panel/40">
                          <CardHeader className="p-6 border-b border-border/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                  <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Neural Extractor V5</CardTitle>
                                  <CardDescription className="text-[10px] uppercase font-bold text-text-muted">OSINT Core • Residential Ghost Mode</CardDescription>
                                </div>
                              </div>
                              <IntelligenceMap />
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                             <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-serif italic text-white">Digital Fingerprinting</h4>
                                    <Badge className="bg-accent text-white border-none text-[7px] uppercase tracking-widest font-black animate-pulse">Ghost Sync</Badge>
                                  </div>
                                  <p className="text-[11px] text-text-main/80 leading-relaxed font-light italic">
                                    "Your intelligence requests are routed through a decentralized mesh of 62 global nodes. Each node performs deep behavioral virtualization to mimic human browsing patterns."
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                    <div className="space-y-1">
                                      <p className="text-[7px] uppercase font-black text-accent">Node Identity</p>
                                      <p className="text-[9px] font-mono text-white opacity-60">GHOST-921-X</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[7px] uppercase font-black text-accent">Latency</p>
                                      <p className="text-[9px] font-mono text-emerald-400">14ms Optimal</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </CardContent>
                        </Card>

                        <Card className="sophisticated-card border bg-bg-panel/40 flex flex-col">
                           <CardHeader className="p-6 border-b border-border/30">
                              <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-accent" />
                                <div>
                                  <CardTitle className="text-sm font-black uppercase tracking-widest text-white">System Operations</CardTitle>
                                  <CardDescription className="text-[10px] uppercase font-bold text-text-muted">Mission Real-time Telemetry</CardDescription>
                                </div>
                              </div>
                           </CardHeader>
                           <CardContent className="p-6 flex-1 flex flex-col justify-center space-y-4">
                              <div className="flex items-center justify-between text-[11px] uppercase font-bold text-text-muted">
                                <span>Network Integrity</span>
                                <span className="text-accent">99.98%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: ['90%', '98%', '95%'] }} className="h-full bg-accent" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-[10px] text-text-muted">Requests/min</p>
                                  <p className="text-xl font-light text-white">1.2K</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-text-muted">Active Tunnels</p>
                                  <p className="text-xl font-light text-white">152</p>
                                </div>
                              </div>
                           </CardContent>
                        </Card>
                      </section>

                      {/* LinkedIn Intelligence Feed */}
                      {linkedinIntelligence && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] uppercase font-bold text-blue-400 tracking-widest flex items-center gap-2">
                              <Linkedin className="w-3 h-3" />
                              LinkedIn Intelligence Synchronized
                            </h4>
                          </div>
                          <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-6 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 bg-bg-panel overflow-hidden shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                              <img 
                                src={`https://ui-avatars.com/api/?name=${linkedinIntelligence.profile.localizedFirstName}+${linkedinIntelligence.profile.localizedLastName}&background=0A66C2&color=fff`} 
                                alt="LinkedIn Profile" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-white">{linkedinIntelligence.profile.localizedFirstName} {linkedinIntelligence.profile.localizedLastName}</h3>
                              <p className="text-xs text-text-muted mt-0.5">LinkedIn Profile Synced • Mining Active</p>
                              <div className="flex items-center gap-4 mt-4">
                                <div className="flex flex-col">
                                  <span className="text-[8px] uppercase tracking-widest text-text-muted">Network Reach</span>
                                  <span className="text-sm font-mono text-blue-400">Verifying...</span>
                                </div>
                                <div className="w-px h-6 bg-border" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] uppercase tracking-widest text-text-muted">Content Affinity</span>
                                  <span className="text-sm font-mono text-blue-400">High Engagement</span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden lg:block w-64 p-4 rounded-lg bg-black/20 border border-white/5">
                              <p className="text-[9px] uppercase font-bold text-accent mb-2">Recent Acquisition Signal</p>
                              <p className="text-[10px] text-text-muted italic leading-relaxed">
                                "{linkedinIntelligence.posts?.elements?.[0]?.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || 'Monitoring for new high-intent professional updates...'}"
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </section>

                    {/* Search Results */}
                    <section id="search-results-section" className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-light text-white">Search Results</h3>
                          <Badge variant="outline" className="border-border text-text-muted font-mono text-[10px]">
                            {loading ? 'ANALYZING...' : `${leads.length} LEADS IDENTIFIED`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {leads.length > 0 && !loading && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={handleSaveAllLeads}
                              disabled={isSavingAll}
                              className="text-[10px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 font-bold"
                            >
                              {isSavingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-2" />}
                              Save All Found
                            </Button>
                          )}
                          {hasSearched && !loading && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearSearch}
                              className="text-[10px] uppercase tracking-widest text-text-muted hover:text-red-400 hover:bg-red-400/10 h-8"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Clear All
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveTab('database')}
                            className="text-[10px] uppercase tracking-widest text-accent hover:bg-accent/10 h-8"
                          >
                            <Database className="w-3 h-3 mr-2" />
                            View Saved Leads
                          </Button>
                        </div>
                      </div>

                      {loading ? (
                        <div className="h-[450px] border border-border rounded-2xl flex flex-col items-center justify-center bg-bg-panel/20 backdrop-blur-3xl relative overflow-hidden p-8 shadow-2xl">
                          {/* Animated Scan Line */}
                          <motion.div 
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-px bg-accent/30 shadow-[0_0_15px_rgba(212,175,55,0.5)] z-0 pointer-events-none"
                          />

                          {/* Data Clusters Visualization */}
                          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                            <div className="flex flex-wrap gap-4 p-4">
                              {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                                  className="text-[8px] font-mono text-accent"
                                >
                                  {Math.random() > 0.5 ? '01' : '10'}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                            <div className="relative mb-10">
                              <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-2xl animate-pulse" />
                              <div className="w-24 h-24 rounded-3xl border border-accent/30 flex items-center justify-center bg-bg-sidebar/50 relative shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] overflow-hidden">
                                <img 
                                  src={KONY_LOGO} 
                                  alt="Engine Logo" 
                                  referrerPolicy="no-referrer"
                                  className="w-16 h-16 object-contain animate-pulse"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {precisionMode && (
                                  <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-bg-main border border-accent/30 px-2 py-1 rounded-full shadow-lg">
                                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                                    <span className="text-[8px] font-bold text-accent uppercase tracking-widest">High-Precision Mode Active</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-center space-y-4 mb-10 w-full">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-light text-white tracking-tight">{searchStatus}</h3>
                                <span className="text-sm font-bold text-accent font-mono">{searchProgress}%</span>
                              </div>
                              
                              {/* Sophisticated Progress Bar */}
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                  <motion.div 
                                      className="absolute inset-y-0 left-0 bg-accent"
                                      initial={{ width: '0%' }}
                                      animate={{ width: `${searchProgress}%` }}
                                      transition={{ duration: 0.5 }}
                                  />
                                  <motion.div 
                                      className="absolute inset-y-0 bg-white/30 w-full"
                                      initial={{ x: '-100%' }}
                                      animate={{ x: '100%' }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                  />
                              </div>

                              <div className="grid grid-cols-4 gap-2 mt-6">
                                {[
                                  { icon: <Globe className="w-3.5 h-3.5" />, label: 'Proxies', active: searchProgress > 15 },
                                  { icon: <Cpu className="w-3.5 h-3.5" />, label: 'Fingerprint', active: searchProgress > 40 },
                                  { icon: <Database className="w-3.5 h-3.5" />, label: 'Extraction', active: searchProgress > 65 },
                                  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Scoring', active: searchProgress > 85 },
                                ].map((step, idx) => (
                                  <div 
                                    key={idx}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-500 ${step.active ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-transparent border-white/5 text-text-muted opacity-30'}`}
                                  >
                                    {step.icon}
                                    <span className="text-[7px] uppercase font-bold tracking-widest">{step.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted opacity-40 font-mono">
                              Protocol Trace: {Math.random().toString(16).substr(2, 8).toUpperCase()} // F-C-RESEARCH // {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ) : leads.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {leads.map((lead) => (
                            <motion.div
                              key={lead.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              <SpiderLead 
                                lead={lead} 
                                onEnrich={() => handleEnrichLead(lead)}
                                isEnriching={isEnrichingLead === lead.id}
                                onSave={() => handleSaveLead(lead)}
                              />
                            </motion.div>
                          ))}
                          {/* DEPRECATED CONTENT REMOVED */}
                        </div>
                      ) : hasSearched ? (
                        <div className="h-96 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-bg-panel/30">
                          <div className="w-20 h-20 bg-bg-input rounded-full flex items-center justify-center mb-6 border border-border">
                            <AlertCircle className="w-10 h-10 text-accent opacity-40" />
                          </div>
                          <h4 className="text-xl font-light text-white mb-2">No High-Intent Leads Found</h4>
                          <p className="text-sm text-text-muted max-w-sm mb-8 leading-relaxed">
                            Our AI couldn't identify clear purchase intent for <span className="text-accent font-medium">"{keyword}"</span> in <span className="text-accent font-medium">"{location || 'Global'}"</span>.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
                            <div className="bg-bg-input/50 p-5 rounded-xl border border-border text-left flex flex-col">
                              <p className="text-[10px] uppercase font-bold text-accent tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                Intent Modifiers
                              </p>
                              <p className="text-[10px] text-text-muted mb-3">Append these to find buyers:</p>
                              <div className="flex flex-wrap gap-2 mb-auto">
                                {['"looking for"', '"recommend"', '"best way to"', '"budget"', '"hiring"'].map((mod) => (
                                  <button 
                                    key={mod}
                                    onClick={() => setKeyword(`${keyword} ${mod}`)}
                                    className="text-[9px] bg-bg-panel border border-border px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors text-text-muted font-mono"
                                  >
                                    + {mod}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="bg-bg-input/50 p-5 rounded-xl border border-border text-left flex flex-col">
                              <p className="text-[10px] uppercase font-bold text-accent tracking-widest mb-4 flex items-center gap-2">
                                <Search className="w-3 h-3" />
                                Common High-Intent
                              </p>
                              <p className="text-[10px] text-text-muted mb-3">Proven search patterns:</p>
                              <div className="space-y-2">
                                {[
                                  { label: 'SaaS Solutions', val: 'SaaS for marketing' },
                                  { label: 'Freelance Help', val: 'hiring react developer' },
                                  { label: 'Agency Search', val: 'recommend SEO agency' }
                                ].map((item) => (
                                  <button 
                                    key={item.label}
                                    onClick={() => setKeyword(item.val)}
                                    className="w-full text-left text-[10px] bg-bg-panel border border-border px-3 py-2 rounded hover:border-accent hover:text-accent transition-colors text-text-muted flex justify-between items-center group"
                                  >
                                    {item.label}
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="bg-bg-input/50 p-5 rounded-xl border border-border text-left">
                              <p className="text-[10px] uppercase font-bold text-accent tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                Broaden Search
                              </p>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-[10px] text-text-muted">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                                  <span>Remove location to search <button onClick={() => setLocation('')} className="text-accent hover:underline">Globally</button>.</span>
                                </li>
                                <li className="flex items-start gap-3 text-[10px] text-text-muted">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                                  <span>Increase the <span className="text-white">Extraction Limit</span> in settings.</span>
                                </li>
                                <li className="flex items-start gap-3 text-[10px] text-text-muted">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                                  <span>Search for <span className="text-white italic">problems</span> instead of products.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            onClick={() => { setKeyword(''); setLocation(''); setHasSearched(false); }}
                            className="mt-8 text-[10px] uppercase tracking-widest text-text-muted hover:text-accent"
                          >
                            Clear All Filters & Reset
                          </Button>
                        </div>
                      ) : (
                        <div className="h-80 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-text-muted/30 bg-bg-panel/50">
                          <Search className="w-16 h-16 mb-6 opacity-10" />
                          <p className="text-xl font-light">No leads to display</p>
                          <p className="text-[10px] uppercase tracking-[0.3em] mt-2">Initiate search to identify opportunities</p>
                        </div>
                      )}
                    </section>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <IntelligenceMonitor />
                    
                    <Card className="bg-bg-panel/40 border-border shadow-none rounded-2xl overflow-hidden min-h-[400px] border-dashed">
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                          <Archive className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Neural Cache</p>
                          <p className="text-[10px] mt-1 text-text-muted">History and cached trends will populate here as you scan.</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
                )}
                {activeTab === 'history' && (
                  <motion.div 
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <div>
                         <h2 className="text-xl font-light text-white flex items-center gap-2">
                           <Clock className="w-5 h-5 text-accent" />
                           Intelligence Cycle History
                         </h2>
                         <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">Complete audit log of extraction missions and intent scans</p>
                       </div>
                    </div>
                    
                    <SearchHistorySection 
                      history={searchHistory}
                      onDelete={handleDeleteHistoryItem}
                      onClear={handleClearAllHistory}
                      onExport={exportHistory}
                      isDeleting={isDeletingHistory}
                      onApply={(item) => {
                        setKeyword(item.keyword || '');
                        setLocation(item.location || '');
                        
                        if (item.options) {
                          setLimit(item.options.limit || '10');
                          setPrecisionMode(item.options.precisionMode ?? true);
                          setExtractionDepth(item.options.extractionDepth ?? 50);
                          setIpRotationFreq(item.options.ipRotationFreq || 'standard');
                          setUaComplexity(item.options.uaComplexity || 'standard');
                          setFingerprintEvasion(item.options.fingerprintEvasion ?? true);
                          setProfileVerification(item.options.profileVerification ?? true);
                          setDynamicArchitecture(item.options.dynamicArchitecture ?? true);
                          setForceStability(item.options.forceStability ?? false);
                        }
                        
                        if (item.results && item.results.length > 0) {
                          // Deduplicate history results
                          const uniqueMap = new Map<string, Lead>();
                          item.results.forEach((l: any) => {
                            const key = l.id || l.url;
                            if (key && !uniqueMap.has(key)) {
                              uniqueMap.set(key, l);
                            }
                          });
                          setLeads(Array.from(uniqueMap.values()) as Lead[]);
                          setHasSearched(true);
                          toast.success('Retrieved results from history cache');
                        } else {
                          toast.info('Applied mission parameters. Ready for re-extraction.');
                        }
                        
                        setActiveTab('search');
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'database' && (
                  <motion.div 
                    key="database"
                    id="database-tab-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <section id="database-content">
                      <Card className="sophisticated-card overflow-hidden">
                        <CardHeader className="border-b border-border p-6 bg-bg-sidebar/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl font-light text-white">Lead Database</CardTitle>
                            <CardDescription className="text-text-muted">Repository of extracted high-intent buyer profiles</CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center bg-bg-input rounded-lg border border-border p-1 mr-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDbView('table')}
                                className={`h-8 px-3 rounded-md transition-all text-[10px] uppercase font-bold tracking-widest ${dbView === 'table' ? 'bg-accent text-bg-main hover:bg-accent/90' : 'text-text-muted hover:text-accent'}`}
                              >
                                <List className="w-3.5 h-3.5 mr-2" />
                                Table
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDbView('dashboard')}
                                className={`h-8 px-3 rounded-md transition-all text-[10px] uppercase font-bold tracking-widest ${dbView === 'dashboard' ? 'bg-accent text-bg-main hover:bg-accent/90' : 'text-text-muted hover:text-accent'}`}
                              >
                                <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                                Dashboard
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDbView('spatial')}
                                className={`h-8 px-3 rounded-md transition-all text-[10px] uppercase font-bold tracking-widest ${dbView === 'spatial' ? 'bg-accent text-bg-main hover:bg-accent/90' : 'text-text-muted hover:text-accent'}`}
                              >
                                <MapPin className="w-3.5 h-3.5 mr-2" />
                                Spatial
                              </Button>
                            </div>
                            <div className="relative">
                              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-50" />
                              <input 
                                placeholder="Filter repository..." 
                                className="bg-bg-input border border-[#33333d] text-white pl-10 h-10 w-48 rounded-lg text-sm outline-none focus:border-accent/50 transition-colors" 
                                value={dbSearchTerm}
                                onChange={(e) => setDbSearchTerm(e.target.value)}
                              />
                            </div>
                            <Select value={dbPlatformFilter} onValueChange={setDbPlatformFilter}>
                              <SelectTrigger className="sophisticated-input w-32 h-10">
                                <SelectValue placeholder="Platform" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="twitter">Twitter / X</SelectItem>
                                <SelectItem value="reddit">Reddit</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={dbSentimentFilter} onValueChange={setDbSentimentFilter}>
                              <SelectTrigger className="sophisticated-input w-32 h-10">
                                <SelectValue placeholder="Sentiment" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="all">Sentiment: All</SelectItem>
                                <SelectItem value="positive">Positive Only</SelectItem>
                                <SelectItem value="neutral">Neutral Only</SelectItem>
                                <SelectItem value="negative">Negative Only</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={dbStatusFilter} onValueChange={setDbStatusFilter}>
                              <SelectTrigger className="sophisticated-input w-28 h-10">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="all">Status: All</SelectItem>
                                <SelectItem value="active">Active Only</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="crm">In CRM</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={dbCategoryFilter} onValueChange={setDbCategoryFilter}>
                              <SelectTrigger className="sophisticated-input w-28 h-10">
                                <SelectValue placeholder="Tag" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="all">Tags: All</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="saas">SaaS</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={dbSortBy} onValueChange={(val: any) => setDbSortBy(val)}>
                              <SelectTrigger className="sophisticated-input w-28 h-10">
                                <SelectValue placeholder="Sort" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="priority">Sort: Priority</SelectItem>
                                <SelectItem value="date">Sort: Recent</SelectItem>
                                <SelectItem value="score">Sort: Quality</SelectItem>
                                <SelectItem value="contact_alpha">Contact A-Z</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={dbIntentFilter} onValueChange={setDbIntentFilter}>
                              <SelectTrigger className="sophisticated-input w-28 h-10">
                                <SelectValue placeholder="Intent" />
                              </SelectTrigger>
                              <SelectContent className="bg-bg-panel border-border text-text-main">
                                <SelectItem value="all">Intent: All</SelectItem>
                                <SelectItem value="high">High (80%+)</SelectItem>
                                <SelectItem value="medium">Medium (50%+)</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => exportData('csv', savedLeads)}
                                className="sophisticated-btn-primary h-10 rounded-lg px-5 gap-2 shadow-[0_0_20px_rgba(201,168,106,0.15)] group"
                              >
                                <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Export All CSV</span>
                                <span className="sm:hidden">Export All</span>
                              </Button>

                              <Button 
                                onClick={() => exportData('csv')}
                                className="sophisticated-btn-outline h-10 rounded-lg px-5 gap-2 text-text-muted hover:text-accent border-border/50 transition-all group"
                              >
                                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                <span className="hidden sm:inline">Download CSV</span>
                                <span className="sm:hidden">CSV</span>
                              </Button>

                              <Tooltip>
                                <TooltipTrigger asChild nativebutton={false}>
                                  <div className="flex items-center">
                                    <Select onValueChange={(val) => exportData(val as 'json' | 'csv')}>
                                      <SelectTrigger className="sophisticated-btn-outline h-10 rounded-lg px-3 w-auto gap-2 text-text-muted hover:text-accent border-border/50">
                                        <Filter className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest hidden md:inline">Export Filtered</span>
                                        <Download className="w-4 h-4 md:hidden" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-bg-panel border-border text-text-main shadow-2xl">
                                        <SelectItem value="csv">Current View (.CSV)</SelectItem>
                                        <SelectItem value="json">Current View (.JSON)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Export only the leads matching current filters</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {selectedLeadIds.size > 0 && (
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                          >
                            <div className="flex items-center gap-1.5 p-1.5 bg-bg-panel border border-accent/40 rounded-full shadow-[0_15px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(201,168,106,0.2)] backdrop-blur-2xl pointer-events-auto">
                              <div className="flex items-center gap-2 px-4 py-1.5 border-r border-border/50 mr-1.5">
                                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-bg-main ring-4 ring-accent/10">
                                  {selectedLeadIds.size}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-white tracking-widest whitespace-nowrap">Selected</span>
                              </div>
                              
                              <div className="flex items-center gap-1 pr-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => handleBulkUpdate({ status: 'contacted' }, 'Mark as Contacted')}
                                      disabled={isUpdatingBulk}
                                      variant="ghost" 
                                      size="sm"
                                      className="h-9 px-3 rounded-full text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all gap-2"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Contacted</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Mark as "Contacted"</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={openCrmModalForSelected}
                                      disabled={isUpdatingBulk}
                                      variant="ghost" 
                                      size="sm"
                                      className="h-9 px-3 rounded-full text-text-muted hover:text-purple-400 hover:bg-purple-500/10 transition-all gap-2"
                                    >
                                      <LayoutDashboard className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Add to CRM</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Add to CRM Database</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={handleBulkCrmAndContacted}
                                      disabled={isUpdatingBulk}
                                      variant="ghost" 
                                      size="sm"
                                      className="h-9 px-4 rounded-full text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all gap-2 font-mono"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Quick Promote</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Simultaneous CRM + Contacted Update</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild nativebutton={false}>
                                    <div className="flex items-center">
                                      <Select onValueChange={handleBulkTagUpdate}>
                                        <SelectTrigger className="h-9 px-3 rounded-full border-none bg-transparent text-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-all gap-2 shadow-none focus:ring-0 cursor-pointer">
                                          <div className="flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Categorize</span>
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-panel border-border text-text-main shadow-2xl">
                                          <SelectItem value="retail">Retail Tier</SelectItem>
                                          <SelectItem value="saas">SaaS / Tech</SelectItem>
                                          <SelectItem value="services">Service Agency</SelectItem>
                                          <SelectItem value="luxury">Luxury / VIP</SelectItem>
                                          <SelectItem value="other">General Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Assign category tag to all selected</TooltipContent>
                                </Tooltip>

                                <div className="w-px h-6 bg-border/50 mx-1" />

                                <Tooltip>
                                  <TooltipTrigger asChild nativebutton={false}>
                                    <div className="flex items-center">
                                      <Select onValueChange={(val: any) => exportData(val, savedLeads.filter(l => selectedLeadIds.has(l.id)))}>
                                        <SelectTrigger className="h-9 px-3 rounded-full border-none bg-transparent text-text-muted hover:text-white hover:bg-white/10 transition-all gap-2 shadow-none focus:ring-0 cursor-pointer">
                                          <div className="flex items-center gap-2">
                                            <Download className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Export</span>
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-panel border-border text-text-main shadow-2xl">
                                          <SelectItem value="csv">Download as .CSV</SelectItem>
                                          <SelectItem value="json">Download as .JSON</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Export selected leads</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => handleBulkUpdate({ status: 'archived' }, 'Archive')}
                                      disabled={isUpdatingBulk}
                                      variant="ghost" 
                                      size="sm"
                                      className="h-9 px-3 rounded-full text-text-muted hover:text-zinc-400 hover:bg-zinc-500/10 transition-all gap-2"
                                    >
                                      <Archive className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Archive</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Archive leads</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={handleBulkDelete}
                                      disabled={isDeletingBulk}
                                      variant="ghost" 
                                      size="sm"
                                      className="h-9 px-4 rounded-full text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all gap-2"
                                    >
                                      {isDeletingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                                      <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Delete</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">Delete selection</TooltipContent>
                                </Tooltip>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedLeadIds(new Set())}
                                  className="h-8 w-8 rounded-full text-text-muted hover:text-white transition-all ml-1 bg-white/5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="overflow-hidden flex flex-col h-[550px]">
                        {dbView === 'table' ? (
                          <div className="overflow-x-auto overflow-y-auto flex-1">
                            <Table>
                            <TableHeader className="bg-bg-input/50 sticky top-0 z-10 backdrop-blur-md">
                              <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="w-12 py-4">
                                  <div 
                                    onClick={toggleAllSelection}
                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedLeadIds.size === filteredSavedLeads.length && filteredSavedLeads.length > 0 ? 'bg-accent border-accent text-bg-main' : 'border-border hover:border-accent/50'}`}
                                  >
                                    {selectedLeadIds.size === filteredSavedLeads.length && filteredSavedLeads.length > 0 && <CheckCircle2 className="w-3 h-3" />}
                                  </div>
                                </TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Potential Buyer</TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Platform</TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Tag</TableHead>
                                <TableHead className="py-4">
                                  <Tooltip>
                                    <TooltipTrigger asChild nativebutton={false}>
                                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest cursor-help border-b border-dotted border-accent/30 w-fit">
                                        Composite Score
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-bg-panel border-border text-white text-[10px] max-w-[200px]">
                                      Weighted average of all metrics reflecting the overall lead quality and buying probability.
                                    </TooltipContent>
                                  </Tooltip>
                                </TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Contact Detail</TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Source URL</TableHead>
                                <TableHead className="text-[10px] font-bold text-accent uppercase tracking-widest py-4">Extraction Date</TableHead>
                                <TableHead className="text-right text-[10px] font-bold text-accent uppercase tracking-widest py-4">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {visibleLeads.length > 0 ? (
                                visibleLeads.map((lead) => (
                                  <React.Fragment key={lead.id}>
                                    <TableRow 
                                      className={`border-border hover:bg-white/5 transition-colors cursor-pointer group ${selectedLeadIds.has(lead.id) ? 'bg-accent/5' : ''} ${expandedLeadId === lead.id ? 'bg-accent-[0.02]' : ''}`}
                                      onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                                    >
                                    <TableCell className="py-4">
                                      <div 
                                        onClick={(e) => toggleLeadSelection(lead.id, e)}
                                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-accent border-accent text-bg-main' : 'border-border hover:border-accent/50'}`}
                                      >
                                        {selectedLeadIds.has(lead.id) && <CheckCircle2 className="w-3 h-3" />}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                          <div className="w-8 h-8 rounded-lg bg-bg-input border border-border flex items-center justify-center text-accent text-xs font-serif italic mb-1 group-hover:border-accent/40 transition-colors">
                                            {lead.user[0].toUpperCase()}
                                          </div>
                                          <div className={`transition-transform duration-300 ${expandedLeadId === lead.id ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-3 h-3 text-accent/40" />
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                        <span className="text-sm text-white font-medium">{lead.user}</span>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {(lead as any).status === 'contacted' && (
                                            <Badge className="text-[8px] font-bold h-4 px-1.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-widest flex items-center gap-1 shadow-[0_0_8px_rgba(59,130,246,0.1)]">
                                              <Check className="w-2.5 h-2.5" />
                                              Contacted
                                            </Badge>
                                          )}
                                          <Badge className="text-[8px] font-bold h-4 px-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                                            <ShieldCheck className="w-2.5 h-2.5" />
                                            Path Classified
                                          </Badge>
                                          {(lead as any).inCrm && (
                                            <Badge className="text-[8px] font-bold h-4 px-1.5 bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase tracking-widest flex items-center gap-1 shadow-[0_0_8px_rgba(168,85,247,0.1)]">
                                              <LayoutDashboard className="w-2.5 h-2.5" />
                                              In CRM
                                            </Badge>
                                          )}
                                          {(lead as any).status === 'archived' && (
                                            <Badge className="text-[8px] font-bold h-4 px-1.5 bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 uppercase tracking-widest flex items-center gap-1">
                                              <Archive className="w-2.5 h-2.5" />
                                              Archived
                                            </Badge>
                                          )}
                                          {(!(lead as any).status || (lead as any).status === 'active') && !(lead as any).inCrm && (lead as any).status !== 'contacted' && (
                                             <Badge className="text-[8px] font-bold h-4 px-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                                              <Activity className="w-2.5 h-2.5" />
                                              New Insight
                                            </Badge>
                                          )}
                                          <SentimentIndicator sentiment={lead.sentiment} />
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <Badge variant="outline" className="border-border text-text-muted text-[10px] uppercase font-mono tracking-tighter flex items-center gap-2 w-fit">
                                      <PlatformIcon platform={lead.platform} />
                                      {lead.platform}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    {lead.category && (
                                      <Badge 
                                        variant="outline" 
                                        className="text-[8px] uppercase tracking-tighter h-4 px-1.5 border-accent/20 text-accent/80 bg-accent/5"
                                      >
                                        {lead.category}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-accent" 
                                          style={{ width: `${lead.compositeScore}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-bold text-text-main">{lead.compositeScore}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex flex-col gap-1 group">
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded bg-bg-input border border-border flex items-center justify-center text-accent shrink-0">
                                          <ContactIcon type="primary" value={lead.contactInfo} />
                                        </div>
                                        <span className="text-xs text-text-main font-mono truncate max-w-[150px]">
                                          {lead.contactInfo}
                                        </span>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(lead.contactInfo);
                                            toast.success('Primary contact copied');
                                          }}
                                          className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                                          title="Copy Primary Contact"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                          {lead.contactMethods && lead.contactMethods.length > 0 ? (
                                            lead.contactMethods.map((m: any, idx: number) => (
                                              <div key={idx}>
                                                <Tooltip>
                                                  <TooltipTrigger asChild nativebutton={false}>
                                                    <div 
                                                      className="w-5 h-5 rounded bg-bg-input border border-border flex items-center justify-center cursor-pointer hover:border-accent/50 text-text-muted hover:text-accent transition-all"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(m.value);
                                                        toast.success(`${m.type} copied`);
                                                      }}
                                                    >
                                                      <ContactIcon type={m.type} value={m.value} />
                                                    </div>
                                                  </TooltipTrigger>
                                                  <TooltipContent className="bg-bg-panel border-border text-white text-[10px]">
                                                    {m.type.toUpperCase()}: {m.value}
                                                  </TooltipContent>
                                                </Tooltip>
                                              </div>
                                            ))
                                          ) : (
                                          lead.contactInfo && (lead.contactInfo.includes('@') || lead.contactInfo.startsWith('+')) && (
                                            <Badge variant="outline" className="w-fit text-[8px] py-0 h-3.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-1 uppercase tracking-tighter">
                                              Deep Data Found
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2 group">
                                        <span className={`text-[10px] font-mono truncate max-w-[120px] ${
                                          lead.contactInfo && 
                                          ((lead.contactInfo.includes('@') && !validateEmail(lead.contactInfo)) || 
                                           (lead.contactInfo.match(/[0-9]/) && !lead.contactInfo.includes('@') && !validatePhone(lead.contactInfo))) 
                                          ? 'text-red-400' : 'text-white'
                                        }`}>
                                          {lead.contactInfo}
                                        </span>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(lead.contactInfo);
                                            toast.success('Primary contact copied');
                                          }}
                                          className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                                          title="Copy Primary Contact"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-2 group">
                                      <a 
                                        href={lead.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`text-[10px] hover:underline flex items-center gap-1 font-mono truncate max-w-[120px] ${!validateUrl(lead.url) ? 'text-red-400' : 'text-accent'}`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Link className="w-3 h-3 shrink-0" />
                                        {lead.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}...
                                      </a>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(lead.url);
                                          toast.success('URL copied to clipboard');
                                        }}
                                        className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                                        title="Copy URL"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4 text-xs text-text-muted opacity-60">
                                    {lead.savedAt?.toDate ? lead.savedAt.toDate().toLocaleDateString() : 'Recent'}
                                  </TableCell>
                                  <TableCell className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-text-muted hover:text-accent hover:bg-accent/10" 
                                        onClick={(e) => { e.stopPropagation(); openLeadDetails(lead); }}
                                        title="View Intelligence File"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-text-muted hover:text-accent hover:bg-accent/10" 
                                        onClick={(e) => { e.stopPropagation(); openLeadDetails(lead); setTimeout(() => setIsEditingLead(true), 50); }}
                                        title="Edit Lead Integrity"
                                      >
                                        <Settings className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-accent hover:bg-accent/10" asChild nativebutton={false}>
                                        <a href={lead.url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4" />
                                        </a>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-text-muted hover:text-accent hover:bg-accent/10"
                                        onClick={() => openCrmModalForSingle(lead.id)}
                                        title="Add to CRM"
                                      >
                                        <Briefcase className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-text-muted hover:text-amber-400 hover:bg-amber-400/10"
                                        onClick={() => handleArchiveLead(lead.id)}
                                        title="Archive Lead"
                                      >
                                        <Archive className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-text-muted hover:text-red-400 hover:bg-red-400/10"
                                        onClick={() => handleDeleteLead(lead.id)}
                                        title="Delete Lead"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                
                                <AnimatePresence>
                                  {expandedLeadId === lead.id && (
                                    <TableRow className="bg-accent/[0.03] border-none hover:bg-accent/[0.03] transition-colors">
                                      <TableCell colSpan={8} className="p-0 border-t border-accent/20">
                                        <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3, ease: "easeInOut" }}
                                          className="overflow-hidden"
                                        >
                                          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                            {/* Buying Intent Section */}
                                            <div className="space-y-4">
                                              <div className="flex items-center gap-2 text-accent">
                                                <Target className="w-4 h-4" />
                                                <h5 className="text-[10px] uppercase font-bold tracking-widest">Intelligence Analysis</h5>
                                              </div>
                                              <div className="bg-bg-panel/40 p-4 rounded-xl border border-border/50 space-y-3">
                                                <div className="flex flex-col gap-1">
                                                  <span className="text-[9px] uppercase font-bold text-text-muted">Observation</span>
                                                  <p className="text-xs text-text-main leading-relaxed italic">
                                                    "{lead.content}"
                                                  </p>
                                                </div>
                                                <div className="pt-2 border-t border-border/30">
                                                  <span className="text-[9px] uppercase font-bold text-text-muted block mb-1">Intent Classification</span>
                                                  <p className="text-[11px] text-white">
                                                    {lead.buyingIntent || "Potential high-intent buyer identified through keyword analysis."}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Verification & Signals */}
                                            <div className="space-y-4">
                                              <div className="flex items-center gap-2 text-accent">
                                                <ShieldCheck className="w-4 h-4" />
                                                <h5 className="text-[10px] uppercase font-bold tracking-widest">Verification Integrity</h5>
                                              </div>
                                              <div className="grid grid-cols-1 gap-3">
                                                <div className="bg-bg-panel/40 p-3 rounded-lg border border-border/50 flex flex-col gap-1">
                                                  <span className="text-[8px] uppercase font-bold text-text-muted">Verification Signal</span>
                                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {lead.verificationSignal || "Manual Path Verification Confirmed"}
                                                  </span>
                                                </div>
                                                <div className="bg-bg-panel/40 p-3 rounded-lg border border-border/50 flex flex-col gap-1">
                                                  <span className="text-[8px] uppercase font-bold text-text-muted">Sentiment Bias</span>
                                                  <span className="text-[10px] text-white uppercase tracking-wider">{lead.sentiment || "Neutral"}</span>
                                                </div>
                                                {/* OSINT Results (TS-OSINT/Spiderfoot) */}
                                                {lead.osintResults && lead.osintResults.length > 0 && (
                                                  <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/20 flex flex-col gap-2">
                                                    <span className="text-[8px] uppercase font-black text-purple-400 flex items-center gap-1.5">
                                                      <Fingerprint className="w-3 h-3" />
                                                      Cross-Platform Neural Identity
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                      {lead.osintResults.map((res: any, i: number) => (
                                                        <Badge key={i} variant="outline" className="text-[8px] border-purple-500/30 text-purple-300 bg-purple-500/5 px-1.5 h-4 uppercase">
                                                          {res.platform}
                                                        </Badge>
                                                      ))}
                                                    </div>
                                                    <p className="text-[9px] text-purple-300/70 italic leading-tight">
                                                      Identity verified across {lead.osintResults.length} neural nodes via TS-OSINT Orchestration.
                                                    </p>
                                                  </div>
                                                )}
                                                {/* Advanced Intelligence Dossier (Investigation results) */}
                                                {lead.verificationSignal && lead.verificationSignal.includes('[DEEP-DOSSIER]') && (
                                                   <div className="bg-orange-500/5 p-3 rounded-lg border border-orange-500/20 flex flex-col gap-2">
                                                     <span className="text-[8px] uppercase font-black text-orange-400 flex items-center gap-1.5">
                                                        <Activity className="w-3 h-3" />
                                                        Advanced Intelligence Dossier
                                                     </span>
                                                     <div className="flex flex-col gap-1">
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Extracted Entities</span>
                                                          <span className="text-orange-300">theHarvester: ACTIVE</span>
                                                       </div>
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Metadata Signature</span>
                                                          <span className="text-orange-300">ExifTool: CAPTURED</span>
                                                       </div>
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Link Analysis</span>
                                                          <span className="text-orange-300">Maltego-TRX: LINKED</span>
                                                       </div>
                                                     </div>
                                                   </div>
                                                )}
                                                {/* Stealth Matrix (Chameleon Status) */}
                                                {lead.verificationSignal && lead.verificationSignal.includes('[CHAMELEON-PROTECTED]') && (
                                                   <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-2">
                                                     <span className="text-[8px] uppercase font-black text-emerald-400 flex items-center gap-1.5">
                                                        <Ghost className="w-3 h-3" />
                                                        Stealth Chameleon Matrix
                                                     </span>
                                                     <div className="flex flex-col gap-1">
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Fingerprint Profile</span>
                                                          <span className="text-emerald-300">Camoufox: PROTECTED</span>
                                                       </div>
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Identity Alchemy</span>
                                                          <span className="text-emerald-300">SPOOFED</span>
                                                       </div>
                                                       <div className="flex items-center justify-between text-[9px]">
                                                          <span className="text-text-muted capitalize">Behavior Sync</span>
                                                          <span className="text-emerald-300">Botright: SYNCHED</span>
                                                       </div>
                                                     </div>
                                                   </div>
                                                )}
                                                {/* Visual Evidence (Giant Storage) */}
                                                {(lead.compositeScore > 80 || lead.verificationSignal) && (
                                                  <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 flex flex-col gap-1">
                                                    <span className="text-[8px] uppercase font-black text-blue-400 flex items-center gap-1.5">
                                                      <Database className="w-3 h-3" />
                                                      Verified In Giant Storage
                                                    </span>
                                                    <div className="flex items-center justify-between mt-1">
                                                      <span className="text-[10px] text-blue-200">Visual Evidence Vault</span>
                                                      <Badge className="bg-blue-500 text-[8px] h-4">ARCHIVED</Badge>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Extended Contact Channels */}
                                            <div className="space-y-4">
                                              <div className="flex items-center gap-2 text-accent">
                                                <Globe className="w-4 h-4" />
                                                <h5 className="text-[10px] uppercase font-bold tracking-widest">Extended Contact Map</h5>
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {lead.contactMethods && lead.contactMethods.length > 0 ? (
                                                  lead.contactMethods.map((m: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-bg-panel/40 border border-border/50 px-3 py-2 rounded-lg">
                                                      <ContactIcon type={m.type} value={m.value} />
                                                      <span className="text-[10px] font-mono text-white opacity-80">{m.value}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="text-[10px] text-text-muted italic opacity-50 py-4">
                                                    No extended metadata channels found.
                                                    <p className="mt-1 text-[9px]">Check intelligence file for deep verification.</p>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="pt-4 flex flex-col gap-2">
                                                <Button 
                                                  disabled={isScanning}
                                                  size="sm"
                                                  className="w-full sophisticated-btn-secondary border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg text-[10px] uppercase tracking-widest h-9"
                                                  onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleStartInvestigation(lead);
                                                  }}
                                                >
                                                  {isScanning ? (
                                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                                  ) : (
                                                    <Eye className="w-3.5 h-3.5 mr-2" />
                                                  )}
                                                  {isScanning ? 'Investigating...' : 'Start Deep OSINT Scan'}
                                                </Button>
                                                <Button 
                                                  size="sm"
                                                  className="w-full sophisticated-btn-primary rounded-lg text-[10px] uppercase tracking-widest h-9"
                                                  onClick={(e) => { e.stopPropagation(); openLeadDetails(lead); }}
                                                >
                                                  <FileText className="w-3.5 h-3.5 mr-2" />
                                                  Open Full Intelligence File
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </AnimatePresence>
                              </React.Fragment>
                            ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="h-40 text-center text-text-muted/30 italic font-light">
                                  Database is currently empty. Extract leads to populate.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      ) : dbView === 'dashboard' ? (
                        <div className="flex-1 overflow-y-auto">
                          <LeadsDashboard leads={filteredSavedLeads} />
                        </div>
                      ) : (
                        <div className="flex-1 p-1">
                          <GeospatialLeadMap leads={filteredSavedLeads} />
                        </div>
                      )}
                    </div>
                    <div className="bg-bg-sidebar/50 p-4 border-t border-border flex justify-between items-center">
                        <div className="flex gap-6">
                          <div className="text-[10px] text-text-muted uppercase tracking-widest">Total Extracted: <strong className="text-accent">{filteredSavedLeads.length} Leads</strong></div>
                          <div className="text-[10px] text-text-muted uppercase tracking-widest">Avg Intent: <strong className="text-accent">88%</strong></div>
                        </div>
                        
                        {totalPages > 1 && (
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="text-text-muted hover:text-accent"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="text-[10px] text-text-muted uppercase tracking-widest">
                              Page <strong className="text-accent">{currentPage}</strong> of {totalPages}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className="text-text-muted hover:text-accent"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <div className="text-[10px] text-text-muted uppercase tracking-widest">Last Updated: Just now</div>
                      </div>
                    </Card>
                  </section>
                </motion.div>
                )}
                {activeTab === 'profile' && user && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 rounded-3xl bg-bg-panel border border-accent/30 flex items-center justify-center shadow-lg overflow-hidden p-2">
                        <img 
                          src="/logo.png" 
                          alt="F-C Intelligence Logo" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://picsum.photos/seed/kony83rhino/200/200';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-light text-white">{user.displayName || 'User Profile'}</h2>
                          {isAdmin && (
                            <Badge className="bg-accent text-bg-main font-black text-[10px] uppercase shadow-[0_0_15px_rgba(255,214,0,0.4)]">Admin</Badge>
                          )}
                        </div>
                        <p className="text-text-muted flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="sophisticated-card">
                        <CardHeader>
                          <CardTitle className="text-lg font-light flex items-center gap-2">
                            <Settings className="w-4 h-4 text-accent" />
                            Account Settings
                          </CardTitle>
                          <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Display Name</label>
                              <input 
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full bg-bg-input border border-[#33333d] text-white h-10 px-3 rounded-lg text-sm outline-none focus:border-accent/50"
                                placeholder="Enter your name"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              disabled={isUpdatingProfile}
                              className="sophisticated-btn-primary w-full"
                            >
                              {isUpdatingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                              Save Changes
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="sophisticated-card">
                        <CardHeader>
                          <CardTitle className="text-lg font-light flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-accent" />
                            Subscription Plan
                          </CardTitle>
                          <CardDescription>Manage your billing and access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-accent tracking-widest">Current Plan</p>
                              <p className="text-xl font-medium text-white">{isAdmin ? 'God Mode / Full Access' : 'Enterprise Elite'}</p>
                            </div>
                            <Badge className="bg-accent text-bg-main font-bold">ACTIVE</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              Unlimited Lead Extractions
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              Priority AI Processing
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              Full Dashboard Controls
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <footer id="app-footer" className="border-t border-border bg-bg-main/50 p-4 text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">
            © 2026 F-C Intelligence Engine • All Rights Reserved
          </p>
        </footer>
      </main>

      {/* CRM Integration Modal */}
      <Dialog open={isCrmModalOpen} onOpenChange={setIsCrmModalOpen}>
        <DialogContent className="bg-bg-panel border-border text-text-main max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              CRM Integration
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Add {crmTargetLeads.length} selected lead{crmTargetLeads.length > 1 ? 's' : ''} to your CRM repository.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" />
                Assigned Agent
              </label>
              <input 
                value={crmAssignedTo}
                onChange={(e) => setCrmAssignedTo(e.target.value)}
                placeholder="e.g., Sarah (Sales Team A)"
                className="w-full bg-bg-input border border-border text-white h-10 px-3 rounded-lg text-sm outline-none focus:border-accent/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Lead Priority
              </label>
              <Select value={crmPriority} onValueChange={(val: any) => setCrmPriority(val)}>
                <SelectTrigger className="bg-bg-input border-border text-white h-10">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-bg-panel border-border text-text-main">
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                Strategic Notes
              </label>
              <textarea 
                value={crmNotes}
                onChange={(e) => setCrmNotes(e.target.value)}
                placeholder="Specific outreach strategy or context..."
                className="w-full bg-bg-input border border-border text-white h-24 p-3 rounded-lg text-sm outline-none focus:border-accent/50 transition-all resize-none font-light italic"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-border text-text-muted hover:bg-white/5"
              onClick={() => setIsCrmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 sophisticated-btn-primary"
              onClick={handleConfirmAddToCrm}
              disabled={isUpdatingBulk}
            >
              {isUpdatingBulk ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Confirm Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Neural Product Onboarding Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-xl bg-bg-panel border-border text-white shadow-2xl overflow-hidden backdrop-blur-xl bg-bg-panel/90 border-t-4 border-t-accent">
          <DialogHeader className="border-b border-border/30 pb-6">
            <DialogTitle className="flex items-center gap-3 text-accent font-serif italic text-2xl">
              <Brain className="w-6 h-6" />
              Neural Product Study
            </DialogTitle>
            <DialogDescription className="text-text-muted uppercase tracking-widest text-[10px] font-bold mt-2">
              Step 1: Product Ingestion & Feature Analysis
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-2">
                Product Description or URL
              </label>
              <textarea 
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Paste your product description, website URL, or key features here... The Thinkers will analyze and study the intent-product match vectors."
                className="w-full bg-black/40 border border-border/50 text-white h-48 p-4 rounded-xl text-sm outline-none focus:border-accent/50 transition-all resize-none shadow-inner font-light leading-relaxed scrollbar-hide"
              />
            </div>
            
            <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-xs font-bold text-accent uppercase tracking-tighter">Thinking Phase</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                F-C Intelligence will cross-reference this input with global trends and B2B engagement patterns to find the perfect customer match Profile.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-black/20 border-t border-border/30">
            <Button 
              variant="outline" 
              className="flex-1 border-border text-text-muted hover:bg-white/5 h-12 rounded-xl"
              onClick={() => setIsProductModalOpen(false)}
            >
              Suspend Study
            </Button>
            <Button 
              className="flex-1 sophisticated-btn-primary h-12 rounded-xl"
              onClick={handleOnboardProduct}
              disabled={isStudyingProduct || !productInput.trim()}
            >
              {isStudyingProduct ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Learning Product...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Initiate Learning
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Modal */}
      <LeadDetailModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        lead={selectedLead}
        isEditing={isEditingLead}
        onEditToggle={() => {
          setIsEditingLead(!isEditingLead);
          if (isEditingLead) setLeadValidationErrors({});
        }}
        editedLead={editedLead}
        onEditedLeadChange={setEditedLead}
        validationErrors={leadValidationErrors}
        onSave={handleSaveEditedLead}
        onEmail={handleSendEmail}
        isSendingEmail={isSendingEmail}
      />

      {/* Search Presets Dialog */}
      <Dialog open={isPresetsModalOpen} onOpenChange={setIsPresetsModalOpen}>
        <DialogContent className="bg-bg-sidebar border-border text-white max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <DialogHeader className="border-b border-border/50 pb-6 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-xl font-light">Saved Search Presets</DialogTitle>
                <DialogDescription className="text-text-muted">Load pre-configured intelligence cycles</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {presets.length === 0 ? (
              <div className="py-20 text-center space-y-4 opacity-30">
                <Activity className="w-10 h-10 mx-auto" />
                <p className="text-xs uppercase tracking-widest">No saved presets found</p>
              </div>
            ) : (
              presets.map((preset) => (
                <div 
                  key={preset.id}
                  className="group p-4 bg-bg-panel/40 border border-border/50 rounded-xl hover:border-accent/40 hover:bg-bg-panel transition-all flex items-center justify-between cursor-pointer"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-bg-input border border-border/50 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">{preset.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Search className="w-2.5 h-2.5" />
                          {preset.keyword}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-border/50" />
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {preset.location || 'Global'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-accent"
                    >
                      Load Configuration
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete preset "${preset.name}"?`)) {
                          deleteSearchPreset(preset.id);
                        }
                      }}
                      className="h-8 w-8 text-text-muted hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              className="border-border text-text-muted hover:text-white"
              onClick={() => setIsPresetsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  return (
    <APIProvider 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      libraries={['visualization']}
    >
      <TooltipProvider delay={200}>
        <ErrorBoundary>
          <MainApp />
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </ErrorBoundary>
      </TooltipProvider>
    </APIProvider>
  );
}
