import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';
import { 
  Activity, 
  Bot, 
  Briefcase, 
  ChevronDown, 
  Cpu, 
  FileText, 
  Globe, 
  LayoutDashboard, 
  Layers, 
  Radio, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Zap,
  HelpCircle,
  Menu,
  X,
  GitMerge,
  Newspaper,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  userRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onChangeRole?: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
  eventCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole: propCurrentRole,
  userRole: propUserRole,
  onSelectRole,
  onChangeRole,
  activeTab,
  onSelectTab,
  onOpenAIAssistant,
  eventCount = 24
}) => {
  let authUser = null;
  let authUserRole: UserRole = 'visitor';
  let setIsLoginModalOpen = (open: boolean) => {};
  let logout = async () => {};

  try {
    const auth = useAuth();
    authUser = auth.user;
    authUserRole = auth.userRole;
    setIsLoginModalOpen = auth.setIsLoginModalOpen;
    logout = auth.logout;
  } catch (err) {
    // Fallback if rendered outside AuthProvider
  }

  const currentRole = propCurrentRole || propUserRole || authUserRole || 'visitor';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { id: 'website', label: 'Public Website', icon: Globe, allowedRoles: ['visitor', 'lead', 'client', 'partner', 'staff', 'manager', 'admin', 'ceo'] },
    { id: 'news', label: 'Business & Tech News', icon: Newspaper, allowedRoles: ['visitor', 'lead', 'client', 'partner', 'staff', 'manager', 'admin', 'ceo'] },
    { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard, badge: 'Live', allowedRoles: ['ceo', 'admin', 'manager', 'staff'] },
    { id: 'ai-workforce', label: 'AI Workforce', icon: Bot, count: 21, allowedRoles: ['ceo', 'admin', 'manager', 'staff'] },
    { id: 'workflow-automator', label: 'Workflow Automator', icon: GitMerge, badge: 'Flows', allowedRoles: ['ceo', 'admin', 'manager', 'staff'] },
    { id: 'crm', label: 'Native CRM & Sales', icon: Briefcase, allowedRoles: ['ceo', 'admin', 'manager', 'staff'] },
    { id: 'client-portal', label: 'Client Portal', icon: Layers, allowedRoles: ['client', 'partner', 'staff', 'manager', 'admin', 'ceo'] },
    { id: 'partner-portal', label: 'Partner Portal', icon: Users, allowedRoles: ['partner', 'staff', 'manager', 'admin', 'ceo'] },
    { id: 'staff-portal', label: 'Staff Workspace', icon: ShieldCheck, allowedRoles: ['staff', 'manager', 'admin', 'ceo'] },
    { id: 'ai-tools', label: 'Free AI Tools', icon: Sparkles, badge: 'Lead Mag', allowedRoles: ['visitor', 'lead', 'client', 'partner', 'staff', 'manager', 'admin', 'ceo'] },
    { id: 'event-bus', label: 'Event Bus & API', icon: Radio, count: eventCount, allowedRoles: ['admin', 'ceo', 'manager', 'staff'] },
    { id: 'knowledge', label: 'Knowledge Base', icon: FileText, allowedRoles: ['visitor', 'lead', 'client', 'partner', 'staff', 'manager', 'admin', 'ceo'] }
  ];

  const visibleNavItems = navigationItems.filter(item => item.allowedRoles.includes(currentRole));

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-white/10 text-[#e0e0e0] shadow-2xl">
      {/* Top Meta Bar */}
      <div className="bg-[#050505] px-4 sm:px-8 py-2 text-xs border-b border-white/10 flex flex-wrap items-center justify-between gap-3 font-sans">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40">System Status</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              OPTIMAL / 99.98%
            </span>
          </div>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="hidden md:inline-flex items-center text-white/50 text-[11px] font-mono">
            <Cpu className="w-3 h-3 mr-1.5 text-sky-400" />
            HERMES CORE v2.4 &bull; 18 AGENTS ACTIVE
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Real Authentication Badge / Buttons */}
          {authUser ? (
            <div className="flex items-center space-x-2">
              <div className="bg-sky-500/10 border border-sky-500/30 rounded px-2.5 py-1 text-xs text-sky-300 font-mono flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold text-white">{authUser.name}</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 rounded uppercase font-bold">{authUser.role}</span>
              </div>
              <button
                onClick={() => logout()}
                className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-rose-300 text-xs px-2.5 py-1 rounded font-mono flex items-center space-x-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold px-3 py-1 rounded transition-colors flex items-center space-x-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Member Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenAIAssistant}
            className="flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs px-3 py-1.5 rounded-sm transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('website')}>
            <div className="w-8 h-8 bg-sky-500 rounded-sm flex items-center justify-center font-bold text-black text-base shadow-sm">
              B
            </div>
            <div>
              <h1 className="font-serif italic text-xl tracking-tight text-white flex items-center">
                Business HUB
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'news' && activeTab === 'website');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'news') {
                      onSelectTab('website');
                    } else {
                      onSelectTab(item.id);
                    }
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border-l-2 border-sky-500 font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-mono font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-sm text-[10px] font-mono font-bold bg-zinc-900 text-white/70 border border-white/10">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <div className="xl:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm bg-zinc-900 border border-white/10 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0a0a] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'news' && activeTab === 'website');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'news') {
                    onSelectTab('website');
                  } else {
                    onSelectTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border-l-2 border-sky-500 font-semibold'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
