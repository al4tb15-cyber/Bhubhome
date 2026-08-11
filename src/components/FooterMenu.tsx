import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';
import { 
  Globe, 
  LayoutDashboard, 
  Bot, 
  GitMerge, 
  Briefcase, 
  Layers, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Newspaper, 
  Calendar, 
  PhoneCall, 
  Coins, 
  Cpu, 
  ArrowUpRight,
  HelpCircle,
  FileText
} from 'lucide-react';

interface FooterMenuProps {
  onSelectTab: (tab: string) => void;
  onOpenAIAssistant?: () => void;
  onBookCall?: () => void;
  onTalkWithAI?: () => void;
  userRole?: UserRole;
}

const roleLevels: Record<string, number> = {
  visitor: 0,
  lead: 0,
  client: 1,
  partner: 2,
  staff: 3,
  manager: 3,
  admin: 4,
  ceo: 4
};

export const FooterMenu: React.FC<FooterMenuProps> = ({
  onSelectTab,
  onOpenAIAssistant,
  onBookCall,
  onTalkWithAI,
  userRole: propUserRole
}) => {
  let activeRole: UserRole = 'visitor';
  try {
    const auth = useAuth();
    activeRole = propUserRole || auth.userRole || 'visitor';
  } catch (err) {
    activeRole = propUserRole || 'visitor';
  }

  const level = roleLevels[activeRole] ?? 0;
  const isClientPlus = level >= 1;
  const isPartnerPlus = level >= 2;
  const isStaffPlus = level >= 3;
  const isAdminPlus = level >= 4;

  const hasPortalsVisible = isClientPlus || isPartnerPlus || isStaffPlus || isAdminPlus;

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-[#d0d0d0] font-sans pt-12 pb-8 mt-16 shadow-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Callout Strip */}
        <div className="bg-gradient-to-r from-zinc-900 via-[#0a0a0a] to-zinc-900 border border-white/10 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Ready to Scale Your Operations?</span>
            </div>
            <h3 className="text-xl font-serif text-white italic">Deploy Your Autonomous AI Workforce Today</h3>
            <p className="text-xs text-white/60">Schedule a 15-minute strategy call or evaluate your system feasibility with our AI Senior Consultant.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onTalkWithAI && (
              <button
                onClick={onTalkWithAI}
                className="px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold uppercase rounded transition-colors flex items-center space-x-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-300" />
                <span>Talk with AI Consultant</span>
              </button>
            )}

            <button
              onClick={() => onBookCall ? onBookCall() : onSelectTab('website')}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-bold uppercase rounded transition-colors flex items-center space-x-1.5 shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>Book Strategy Call</span>
            </button>
          </div>
        </div>

        {/* Permanent Links Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pt-4">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('website')}>
              <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center font-bold text-black text-base shadow-sm font-mono">
                B
              </div>
              <div>
                <h2 className="font-serif italic text-lg tracking-tight text-white flex items-center">
                  Business HUB
                </h2>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-sans">
              The autonomous B2B enterprise platform combining AI consulting, agentic workforces, native CRM, and daily business help articles.
            </p>

            <div className="pt-1 flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hermes Event Bus: Optimal</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation (Gated for Staff+) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li>
                <button onClick={() => onSelectTab('website')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-white/40" />
                  <span>Public Website</span>
                </button>
              </li>
              {isStaffPlus && (
                <>
                  <li>
                    <button onClick={() => onSelectTab('mission-control')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <LayoutDashboard className="w-3.5 h-3.5 text-white/40" />
                      <span>Mission Control Triage</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onSelectTab('ai-workforce')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <Bot className="w-3.5 h-3.5 text-white/40" />
                      <span>Hermes AI Workforce</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onSelectTab('workflow-automator')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <GitMerge className="w-3.5 h-3.5 text-white/40" />
                      <span>Workflow Canvas</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onSelectTab('crm')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-white/40" />
                      <span>Native Enterprise CRM</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Business & Tech News (Public) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Business & Tech News
            </h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li>
                <button onClick={() => onSelectTab('website')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-white/40" />
                  <span>AI Industry News</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('website')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-white/40" />
                  <span>Business Help Articles</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('knowledge')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-white/40" />
                  <span>Knowledge Base & Guides</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('ai-tools')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white/40" />
                  <span>AI Readiness Diagnostic</span>
                </button>
              </li>
              <li className="pt-1 text-[11px] text-white/40 font-mono italic">
                Author: Business HUB AI Agent
              </li>
            </ul>
          </div>

          {/* Column 4: Portals & Operations (Role Gated) */}
          {hasPortalsVisible && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Portals & Operations
              </h4>
              <ul className="space-y-2 text-xs font-sans text-white/70">
                {isClientPlus && (
                  <li>
                    <button onClick={() => onSelectTab('client-portal')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-white/40" />
                      <span>Client Workspace & Invoices</span>
                    </button>
                  </li>
                )}
                {isPartnerPlus && (
                  <li>
                    <button onClick={() => onSelectTab('partner-portal')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-white/40" />
                      <span>Partner & Referral Portal</span>
                    </button>
                  </li>
                )}
                {isStaffPlus && (
                  <li>
                    <button onClick={() => onSelectTab('staff-portal')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
                      <span>Staff Workspace & Payroll</span>
                    </button>
                  </li>
                )}
                {isAdminPlus && (
                  <li>
                    <button onClick={() => onSelectTab('event-bus')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-white/40" />
                      <span>Event Bus API Telemetry</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 5: Free AI Tools (Public) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Free AI Tools
            </h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li>
                <button onClick={() => onSelectTab('ai-tools')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>AI Readiness Audit Tool</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('website')} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive ROI Calculator</span>
                </button>
              </li>
              {onOpenAIAssistant && (
                <li>
                  <button onClick={onOpenAIAssistant} className="hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ask Business HUB Assistant</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Permanent Legal Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4">
          <div>
            &copy; {new Date().getFullYear()} Business HUB OS Inc. All rights reserved. Built with Gemini 3.6 Flash.
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => onSelectTab('website')} className="hover:text-white/80 transition-colors">Privacy Policy</button>
            <button onClick={() => onSelectTab('website')} className="hover:text-white/80 transition-colors">Terms of Service</button>
            {isStaffPlus && (
              <button onClick={() => onSelectTab('event-bus')} className="hover:text-white/80 transition-colors">Zero-Trust Security</button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
