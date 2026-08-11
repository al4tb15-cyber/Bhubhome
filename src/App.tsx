import React from 'react';
import { 
  HermesAgent, 
  SystemEvent, 
  CRMLead, 
  CRMCompany, 
  CRMDeal, 
  Invoice, 
  SupportTicket, 
  Project, 
  PartnerReferral, 
  KnowledgeArticle, 
  WorkspaceIntegrationStatus 
} from './types';

import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginModal } from './auth/LoginModal';
import { Navbar } from './components/Navbar';
import { PublicWebsiteView } from './components/PublicWebsiteView';
import { MissionControlView } from './components/MissionControlView';
import { HermesWorkforceView } from './components/HermesWorkforceView';
import { WorkspaceIntegrationView } from './components/WorkspaceIntegrationView';
import { CRMView } from './components/CRMView';
import { ClientPortalView } from './components/ClientPortalView';
import { PartnerPortalView } from './components/PartnerPortalView';
import { StaffPortalView } from './components/StaffPortalView';
import { AIToolsView } from './components/AIToolsView';
import { EventBusView } from './components/EventBusView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { WorkflowAutomatorView } from './components/WorkflowAutomatorView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { FooterMenu } from './components/FooterMenu';

const safeFetchJson = async (url: string, fallback: any) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) return fallback;
    return await res.json();
  } catch (err) {
    return fallback;
  }
};

function MainLayout() {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = React.useState('website');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = React.useState(false);

  // Core Global Data State
  const [stats, setStats] = React.useState<any>(null);
  const [agents, setAgents] = React.useState<HermesAgent[]>([]);
  const [leads, setLeads] = React.useState<CRMLead[]>([]);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [companies, setCompanies] = React.useState<CRMCompany[]>([]);
  const [deals, setDeals] = React.useState<CRMDeal[]>([]);
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [referrals, setReferrals] = React.useState<PartnerReferral[]>([]);
  const [events, setEvents] = React.useState<SystemEvent[]>([]);
  const [articles, setArticles] = React.useState<KnowledgeArticle[]>([]);
  const [workspaceStatus, setWorkspaceStatus] = React.useState<WorkspaceIntegrationStatus>({
    driveConnected: false,
    sheetsConnected: false,
    calendarConnected: false,
    driveFilesCount: 14,
    syncedSheetsCount: 3,
    calendarEventsCount: 8
  });

  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch initial state from API Gateway
  const refreshAllData = async () => {
    try {
      const [
        statsRes,
        agentsRes,
        leadsRes,
        invoicesRes,
        companiesRes,
        dealsRes,
        ticketsRes,
        projectsRes,
        referralsRes,
        eventsRes,
        articlesRes,
        wsRes
      ] = await Promise.all([
        safeFetchJson('/api/mission-control/stats', null),
        safeFetchJson('/api/ai/agents', []),
        safeFetchJson('/api/crm/leads', []),
        safeFetchJson('/api/crm/invoices', []),
        safeFetchJson('/api/crm/companies', []),
        safeFetchJson('/api/crm/deals', []),
        safeFetchJson('/api/crm/tickets', []),
        safeFetchJson('/api/projects', []),
        safeFetchJson('/api/referrals', []),
        safeFetchJson('/api/events', []),
        safeFetchJson('/api/knowledge', []),
        safeFetchJson('/api/workspace/status', null)
      ]);

      if (statsRes) setStats(statsRes);
      setAgents(Array.isArray(agentsRes) ? agentsRes : (agentsRes?.agents || []));
      setLeads(Array.isArray(leadsRes) ? leadsRes : (leadsRes?.leads || []));
      setInvoices(Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes?.invoices || []));
      setCompanies(Array.isArray(companiesRes) ? companiesRes : (companiesRes?.companies || []));
      setDeals(Array.isArray(dealsRes) ? dealsRes : (dealsRes?.deals || []));
      setTickets(Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes?.tickets || []));
      setProjects(Array.isArray(projectsRes) ? projectsRes : (projectsRes?.projects || []));
      setReferrals(Array.isArray(referralsRes) ? referralsRes : (referralsRes?.referrals || []));
      setEvents(Array.isArray(eventsRes) ? eventsRes : (eventsRes?.events || []));
      setArticles(Array.isArray(articlesRes) ? articlesRes : (articlesRes?.articles || []));
      if (wsRes) setWorkspaceStatus(wsRes);
    } catch (err) {
      console.error('Error fetching system state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  // Action Handlers
  const handleDispatchAgentTask = async (agentId: string, taskDescription: string, priority?: string) => {
    const res = await fetch(`/api/ai/agents/${agentId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskDescription, priority })
    });
    await refreshAllData();
    return res.json();
  };

  const handleCreateLead = async (leadData: Partial<CRMLead>) => {
    const res = await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    await refreshAllData();
    return res.json();
  };

  const handleCreateInvoice = async (invData: Partial<Invoice>) => {
    const res = await fetch('/api/crm/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invData)
    });
    await refreshAllData();
    return res.json();
  };

  const handlePayInvoice = async (id: string) => {
    const res = await fetch(`/api/crm/invoices/${id}/pay`, {
      method: 'POST'
    });
    await refreshAllData();
    return res.json();
  };

  const handleSubmitTicket = async (subject: string, message: string) => {
    const res = await fetch('/api/crm/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, clientName: 'Client Portal User' })
    });
    await refreshAllData();
    return res.json();
  };

  const handlePublishEvent = async (type: string, title: string, sourceModule: string, payload: any) => {
    const res = await fetch('/api/events/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, sourceModule, payload })
    });
    await refreshAllData();
    return res.json();
  };

  const handleRunAiAssessment = async (companyInfo: any) => {
    const res = await fetch('/api/ai/tools/readiness-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyInfo })
    });
    await refreshAllData();
    return res.json();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-sky-500 selection:text-black flex flex-col justify-between">
      <div>
        {/* Top Fixed Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={userRole}
          onOpenAIAssistant={() => setIsAiAssistantOpen(true)}
          eventCount={events.length}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {isLoading && !stats ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-white/50 font-mono">BOOTING BUSINESS HUB OS CORE...</p>
            </div>
          ) : (
            <>
              {activeTab === 'website' && (
                <PublicWebsiteView
                  onSelectTab={setActiveTab}
                  onOpenAIAssistant={() => setIsAiAssistantOpen(true)}
                />
              )}

              {activeTab === 'mission-control' && (
                <MissionControlView
                  stats={stats}
                  agents={agents}
                  events={events}
                  onTriggerAgent={handleDispatchAgentTask}
                  onSelectTab={setActiveTab}
                  onRefresh={refreshAllData}
                />
              )}

              {activeTab === 'ai-workforce' && (
                <HermesWorkforceView
                  agents={agents}
                  onDispatchTask={handleDispatchAgentTask}
                />
              )}

              {activeTab === 'workflow-automator' && (
                <WorkflowAutomatorView
                  agents={agents}
                  onEventEmitted={refreshAllData}
                />
              )}

              {activeTab === 'workspace' && (
                <WorkspaceIntegrationView
                  status={workspaceStatus}
                  onRefresh={refreshAllData}
                />
              )}

              {activeTab === 'crm' && (
                <CRMView
                  leads={leads}
                  companies={companies}
                  deals={deals}
                  invoices={invoices}
                  tickets={tickets}
                  onCreateLead={handleCreateLead}
                  onCreateInvoice={handleCreateInvoice}
                  onPayInvoice={handlePayInvoice}
                />
              )}

              {activeTab === 'client-portal' && (
                <ClientPortalView
                  projects={projects}
                  invoices={invoices}
                  tickets={tickets}
                  onPayInvoice={handlePayInvoice}
                  onSubmitTicket={handleSubmitTicket}
                  onCreateInvoice={handleCreateInvoice}
                />
              )}

              {activeTab === 'partner-portal' && (
                <PartnerPortalView referrals={referrals} />
              )}

              {activeTab === 'staff-portal' && (
                <StaffPortalView projects={projects} />
              )}

              {activeTab === 'ai-tools' && (
                <AIToolsView
                  onRunAssessment={handleRunAiAssessment}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'event-bus' && (
                <EventBusView
                  events={events}
                  onPublishEvent={handlePublishEvent}
                />
              )}

              {activeTab === 'knowledge' && (
                <KnowledgeBaseView articles={articles} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Permanent Footer Menu */}
      <FooterMenu
        userRole={userRole}
        onSelectTab={setActiveTab}
        onOpenAIAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Sophisticated Dark Theme Meta Footer */}
      <footer className="h-10 border-t border-white/10 bg-black flex flex-wrap items-center justify-between px-8 text-[10px] text-white/30 tracking-widest uppercase font-mono py-2">
        <div>Session: AUTH_ID_9921_AF83</div>
        <div>&copy; 2026 Business HUB OS &bull; Proprietary Agentic Architecture</div>
        <div>Latency: 12ms &bull; Encryption: AES-256-GCM</div>
      </footer>

      {/* Floating Gemini AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onSelectTab={setActiveTab}
      />

      {/* Authentication Modal */}
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
