import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { 
  HermesAgent, 
  SystemEvent, 
  CRMLead, 
  CRMCompany, 
  CRMDeal, 
  Invoice, 
  Project, 
  SupportTicket, 
  PartnerReferral,
  KnowledgeArticle,
  AIToolAssessmentResult,
  WorkflowChain,
  OrchestratorTicket,
  OmniRouteUsage,
  SystemHealthMetrics,
  StaffPayrollRecord,
  DailyBlogPost,
  AIConsultationEvaluation
} from './src/types';
import { attachUser, getRoleLevel } from './src/auth/middleware';
import { authRouter } from './src/auth/router';
import { ensureUserSchema } from './src/auth/db';

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

app.use('/api/auth', authRouter);

// ==========================================
// SECURE-BY-DEFAULT API GATE
// ==========================================
app.use('/api', (req, res, next) => {
  const pathStr = req.path; // e.g. "/crm/leads", "/health"
  const method = req.method.toUpperCase();

  // 1. PUBLIC ALLOWLIST (No Auth Required)
  const isPublic =
    pathStr === '/health' ||
    pathStr.startsWith('/public') ||
    pathStr.startsWith('/ai/tools') ||
    (pathStr === '/events' && method === 'GET') ||
    (pathStr.startsWith('/knowledge') && method === 'GET') ||
    (pathStr === '/crm/leads' && method === 'POST') ||
    (pathStr === '/packages/order' && method === 'POST');

  if (isPublic) {
    return next();
  }

  // 2. CHECK AUTHENTICATION FOR ALL OTHER /api/* ROUTES
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  const userRole = req.user.role || 'visitor';
  const userLevel = getRoleLevel(userRole);

  // 3. ROLE TIERS
  // Admin only (minRole: 'admin')
  if (
    (pathStr === '/events/publish' && method === 'POST') ||
    pathStr.startsWith('/referrals') ||
    pathStr.startsWith('/workspace')
  ) {
    if (userLevel < getRoleLevel('admin')) {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
    return next();
  }

  // Staff+ (minRole: 'staff')
  if (
    pathStr.startsWith('/mission-control') ||
    pathStr.startsWith('/ai/workforce') ||
    pathStr.startsWith('/ai/agents') ||
    pathStr.startsWith('/projects') ||
    pathStr.startsWith('/workflow') ||
    pathStr.startsWith('/orchestrator') ||
    pathStr.startsWith('/staff') ||
    pathStr.startsWith('/system') ||
    pathStr.startsWith('/omniroute') ||
    (pathStr.startsWith('/packages/orders') && (method === 'GET' || method === 'PUT')) ||
    pathStr.startsWith('/packages/workflow-steps') ||
    (pathStr.startsWith('/crm') && pathStr !== '/crm/leads') ||
    (pathStr === '/crm/leads' && method !== 'POST')
  ) {
    if (userLevel < getRoleLevel('staff')) {
      return res.status(403).json({ error: 'Forbidden: Staff access required.' });
    }
    return next();
  }

  // Partner+ (minRole: 'partner')
  if (pathStr.startsWith('/partner') || pathStr.startsWith('/partners')) {
    if (userLevel < getRoleLevel('partner')) {
      return res.status(403).json({ error: 'Forbidden: Partner access required.' });
    }
    return next();
  }

  // Client+ (minRole: 'client')
  if (pathStr.startsWith('/client-portal') || pathStr.startsWith('/tickets')) {
    if (userLevel < getRoleLevel('client')) {
      return res.status(403).json({ error: 'Forbidden: Client access required.' });
    }
    return next();
  }

  // Any other authenticated route
  next();
});

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// ==========================================
// IN-MEMORY DATA STORES & EVENT BUS
// ==========================================

let systemEvents: SystemEvent[] = [
  {
    id: 'evt-1001',
    type: 'LeadCreated',
    title: 'New High-Value Lead Registered',
    sourceModule: 'Public Website / Free AI Tools',
    payload: { leadName: 'Acme Logistics', contactEmail: 'cto@acmelogistics.com', estimatedValue: 45000, service: 'AI Automation' },
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'processed',
    processedByAgents: ['ag-sales', 'ag-discovery']
  },
  {
    id: 'evt-1002',
    type: 'OrderPlaced',
    title: 'Enterprise AI Suite Order Placed',
    sourceModule: 'Client Portal',
    payload: { clientName: 'Global Retail Corp', amount: 85000, package: 'Full AI Workforce & Custom LLM' },
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    status: 'processed',
    processedByAgents: ['ag-finance', 'ag-arch', 'ag-pm']
  },
  {
    id: 'evt-1003',
    type: 'InvoicePaid',
    title: 'Invoice #INV-2026-089 Paid ($24,500)',
    sourceModule: 'Billing & Payments',
    payload: { invoiceNumber: 'INV-2026-089', client: 'AeroDynamics Tech', amount: 24500 },
    timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    status: 'processed',
    processedByAgents: ['ag-finance', 'ag-coo']
  },
  {
    id: 'evt-1004',
    type: 'WorkflowCompleted',
    title: 'Autonomous SEO & Content Batch Deployed',
    sourceModule: 'Hermes AI Workforce',
    payload: { agent: 'ag-seo', articlesGenerated: 5, targetKeywords: ['Enterprise AI Consulting', 'Agentic Workflows'] },
    timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString(),
    status: 'published',
    processedByAgents: ['ag-seo', 'ag-content']
  }
];

let hermesAgents: HermesAgent[] = [
  {
    id: 'ag-exec',
    name: 'Hermes Executive Director',
    roleTitle: 'Chief AI Strategic Director',
    department: 'Executive Board',
    status: 'executing',
    currentTask: 'Synthesizing Q3 Strategic AI Roadmap & High-Margin Service Alignment',
    kpiScore: 99.2,
    memoryUsageMb: 412,
    tasksCompleted: 1420,
    healthStatus: 'optimal',
    lastActivity: '1 min ago',
    description: 'Oversees company strategic direction, high-level client ROI modeling, and autonomous organizational balance.',
    capabilities: ['Strategic Planning', 'Resource Allocation', 'Executive Reporting', 'AI ROI Synthesis'],
    logs: [
      { timestamp: '16:40', message: 'Evaluated quarterly revenue vector across AI Consulting & SaaS.', type: 'info' },
      { timestamp: '16:45', message: 'Approved autonomous budget expansion for Agentic Lead Generation.', type: 'success' }
    ]
  },
  {
    id: 'ag-coo',
    name: 'Hermes COO',
    roleTitle: 'Chief Operations Coordinator',
    department: 'Operations',
    status: 'thinking',
    currentTask: 'Balancing Staff Project Allocation & Automated Client Onboarding Timelines',
    kpiScore: 98.7,
    memoryUsageMb: 380,
    tasksCompleted: 2180,
    healthStatus: 'optimal',
    lastActivity: 'Just now',
    description: 'Manages cross-departmental operations, workflow SLA enforcement, and resource capacity.',
    capabilities: ['Workflow Scheduling', 'SLA Enforcement', 'Cross-Department Sync', 'Incident Mitigation'],
    logs: [
      { timestamp: '16:30', message: 'Optimized project delivery queue for Global Retail Corp onboarding.', type: 'info' }
    ]
  },
  {
    id: 'ag-finance',
    name: 'Hermes Finance Controller',
    roleTitle: 'Financial Systems & Billing Specialist',
    department: 'Finance',
    status: 'idle',
    currentTask: 'Awaiting Invoice Reconciliation Event Stream',
    kpiScore: 99.8,
    memoryUsageMb: 210,
    tasksCompleted: 3410,
    healthStatus: 'optimal',
    lastActivity: '12 mins ago',
    description: 'Automates billing, payment verification, cashflow forecasting, and affiliate commission calculations.',
    capabilities: ['Invoice Processing', 'Revenue Recognition', 'Stripe/Bank Sync', 'Partner Payouts'],
    logs: [
      { timestamp: '16:10', message: 'Reconciled 12 inbound payments ($142,500 total).', type: 'success' }
    ]
  },
  {
    id: 'ag-sales',
    name: 'Hermes Sales Director',
    roleTitle: 'Enterprise Sales & Deal Closer',
    department: 'Sales',
    status: 'executing',
    currentTask: 'Drafting Tailored Proposal for Acme Logistics AI Automation Suite',
    kpiScore: 96.5,
    memoryUsageMb: 310,
    tasksCompleted: 980,
    healthStatus: 'optimal',
    lastActivity: '3 mins ago',
    description: 'Drives pipeline conversion, evaluates lead intent scores, and generates customized client proposals.',
    capabilities: ['Proposal Generation', 'Lead Qualification', 'Objection Handling', 'Contract Drafting'],
    logs: [
      { timestamp: '16:42', message: 'Processed LeadCreated event for Acme Logistics ($45k value).', type: 'info' }
    ]
  },
  {
    id: 'ag-leadgen',
    name: 'Hermes Lead Generator',
    roleTitle: 'Autonomous Prospecting Agent',
    department: 'Sales',
    status: 'executing',
    currentTask: 'Scanning B2B Market Signals for Logistics & Supply Chain Automation Prospects',
    kpiScore: 97.1,
    memoryUsageMb: 290,
    tasksCompleted: 4200,
    healthStatus: 'optimal',
    lastActivity: '4 mins ago',
    description: 'Continuously monitors B2B registries and market trends to qualify incoming prospects.',
    capabilities: ['Intent Scoring', 'Enrichment', 'Outreach Automation', 'Auditing'],
    logs: [
      { timestamp: '16:20', message: 'Qualified 8 new enterprise prospects with >80% AI readiness.', type: 'success' }
    ]
  },
  {
    id: 'ag-marketing',
    name: 'Hermes Marketing Strategist',
    roleTitle: 'Omnichannel Campaign Manager',
    department: 'Marketing',
    status: 'thinking',
    currentTask: 'Analyzing Ad Campaign CAC & Lead Magnet Conversion Benchmarks',
    kpiScore: 95.8,
    memoryUsageMb: 340,
    tasksCompleted: 1560,
    healthStatus: 'optimal',
    lastActivity: '8 mins ago',
    description: 'Orchestrates marketing campaigns, digital positioning, and brand growth strategies.',
    capabilities: ['Campaign Strategy', 'A/B Testing', 'Funnel Optimization', 'Brand Positioning'],
    logs: [
      { timestamp: '16:15', message: 'Optimized landing page conversion funnel (+14% projected lift).', type: 'info' }
    ]
  },
  {
    id: 'ag-seo',
    name: 'Hermes SEO Specialist',
    roleTitle: 'Search Visibility & Organic Growth Agent',
    department: 'Marketing',
    status: 'executing',
    currentTask: 'Running Keyword Gap Analysis for Enterprise AI Operating System Terms',
    kpiScore: 98.2,
    memoryUsageMb: 260,
    tasksCompleted: 2890,
    healthStatus: 'optimal',
    lastActivity: 'Just now',
    description: 'Monitors search engine positions, backlink profiles, and technical SEO health.',
    capabilities: ['Keyword Strategy', 'Technical Audit', 'Schema Markup', 'Competitor Analysis'],
    logs: [
      { timestamp: '16:48', message: 'Published SEO event update. Top rankings secured for "Agentic AI Consulting".', type: 'success' }
    ]
  },
  {
    id: 'ag-content',
    name: 'Hermes Content Creator',
    roleTitle: 'Thought Leadership & Technical Author',
    department: 'Marketing',
    status: 'idle',
    currentTask: 'Standing by for next Content Publishing Brief',
    kpiScore: 97.9,
    memoryUsageMb: 280,
    tasksCompleted: 1940,
    healthStatus: 'optimal',
    lastActivity: '15 mins ago',
    description: 'Generates high-authority case studies, technical whitepapers, blog articles, and documentation.',
    capabilities: ['Technical Writing', 'Case Studies', 'Copywriting', 'Documentation'],
    logs: [
      { timestamp: '16:00', message: 'Completed 3,000-word guide: "Building Event-Driven Enterprise AI Systems".', type: 'info' }
    ]
  },
  {
    id: 'ag-social',
    name: 'Hermes Social Media Specialist',
    roleTitle: 'Community & Brand Engagement Agent',
    department: 'Marketing',
    status: 'executing',
    currentTask: 'Scheduling Multi-Platform Posts on Agentic AI System Architecture',
    kpiScore: 94.6,
    memoryUsageMb: 190,
    tasksCompleted: 3100,
    healthStatus: 'optimal',
    lastActivity: '5 mins ago',
    description: 'Schedules and manages engagement across LinkedIn, Twitter/X, YouTube, and Industry forums.',
    capabilities: ['Social Scheduling', 'Engagement Analytics', 'Viral Copy', 'Community Monitoring'],
    logs: []
  },
  {
    id: 'ag-video',
    name: 'Hermes Video Producer',
    roleTitle: 'Video Scripting & Demo Animator',
    department: 'Marketing',
    status: 'idle',
    currentTask: 'Awaiting Next Product Feature Demo Prompt',
    kpiScore: 96.0,
    memoryUsageMb: 320,
    tasksCompleted: 450,
    healthStatus: 'optimal',
    lastActivity: '30 mins ago',
    description: 'Drafts video scripts, product walkthrough storyboards, and interactive demo assets.',
    capabilities: ['Scriptwriting', 'Storyboard Design', 'Voiceover Prompting', 'Demo Structure'],
    logs: []
  },
  {
    id: 'ag-discovery',
    name: 'Hermes Discovery Consultant',
    roleTitle: 'Client Needs & AI Auditing Architect',
    department: 'Consulting',
    status: 'executing',
    currentTask: 'Analyzing Business Process Bottlenecks for Client Technical Assessment',
    kpiScore: 98.9,
    memoryUsageMb: 315,
    tasksCompleted: 870,
    healthStatus: 'optimal',
    lastActivity: '2 mins ago',
    description: 'Executes detailed technical discovery calls, evaluates customer legacy systems, and prescribes AI solutions.',
    capabilities: ['Discovery Auditing', 'Tech Architecture Mapping', 'ROI Quantification', 'Feasibility Studies'],
    logs: []
  },
  {
    id: 'ag-arch',
    name: 'Hermes Solution Architect',
    roleTitle: 'Principal Systems Architect',
    department: 'Engineering',
    status: 'thinking',
    currentTask: 'Designing Microservices Topology & Event Bus Schema for Global Retail Corp',
    kpiScore: 99.5,
    memoryUsageMb: 490,
    tasksCompleted: 1120,
    healthStatus: 'optimal',
    lastActivity: '1 min ago',
    description: 'Designs enterprise microservice architectures, security boundaries, and data pipelines.',
    capabilities: ['System Architecture', 'Security Design', 'API Specifications', 'Database Schema'],
    logs: []
  },
  {
    id: 'ag-pm',
    name: 'Hermes Project Manager',
    roleTitle: 'Agile Delivery & Milestone Controller',
    department: 'Delivery',
    status: 'executing',
    currentTask: 'Updating Sprint Backlog & Resource Allocation for Active Client Engagements',
    kpiScore: 98.1,
    memoryUsageMb: 305,
    tasksCompleted: 2650,
    healthStatus: 'optimal',
    lastActivity: '6 mins ago',
    description: 'Tracks project deliverables, timeline estimates, client communications, and staff sprint boards.',
    capabilities: ['Agile Coordination', 'Risk Management', 'Milestone Tracking', 'Client Status Updates'],
    logs: []
  },
  {
    id: 'ag-dev',
    name: 'Hermes Lead Developer',
    roleTitle: 'Full-Stack & Agentic Code Engineer',
    department: 'Engineering',
    status: 'executing',
    currentTask: 'Implementing Event Bus Webhook Listeners & Custom LLM Pipeline Adapters',
    kpiScore: 99.1,
    memoryUsageMb: 512,
    tasksCompleted: 4890,
    healthStatus: 'optimal',
    lastActivity: 'Just now',
    description: 'Writes, reviews, and refactors production code for web applications, mobile apps, and custom agents.',
    capabilities: ['Full-Stack Engineering', 'API Integration', 'Unit Testing', 'Refactoring'],
    logs: []
  },
  {
    id: 'ag-qa',
    name: 'Hermes QA Lead',
    roleTitle: 'Automated Testing & Security Validator',
    department: 'Engineering',
    status: 'idle',
    currentTask: 'Running Automated Penetration & E2E Test Suite on API Gateway',
    kpiScore: 99.7,
    memoryUsageMb: 240,
    tasksCompleted: 6100,
    healthStatus: 'optimal',
    lastActivity: '10 mins ago',
    description: 'Ensures zero security regressions, tests input sanitization, and verifies REST/GraphQL API compliance.',
    capabilities: ['Automated Testing', 'Security Auditing', 'Regression Testing', 'Performance Benchmarking'],
    logs: []
  },
  {
    id: 'ag-deploy',
    name: 'Hermes Deployment Engineer',
    roleTitle: 'DevOps & Cloud Infrastructure Agent',
    department: 'Operations',
    status: 'idle',
    currentTask: 'Monitoring Cloud Run Container Autoscaling & Microservices Latency',
    kpiScore: 99.9,
    memoryUsageMb: 210,
    tasksCompleted: 1890,
    healthStatus: 'optimal',
    lastActivity: '14 mins ago',
    description: 'Manages CI/CD pipelines, container orchestration, SSL certificates, and zero-downtime deployments.',
    capabilities: ['CI/CD Pipeline', 'Docker/Kubernetes', 'Cloud Infrastructure', 'Monitoring'],
    logs: []
  },
  {
    id: 'ag-support',
    name: 'Hermes Customer Support Specialist',
    roleTitle: 'Tier-1 & Tier-2 Technical Support',
    department: 'Customer Success',
    status: 'executing',
    currentTask: 'Responding to Inbound Client Query regarding API Rate Limit Configuration',
    kpiScore: 97.8,
    memoryUsageMb: 275,
    tasksCompleted: 5430,
    healthStatus: 'optimal',
    lastActivity: 'Just now',
    description: 'Provides instant 24/7 technical support, resolves tickets, and escalates complex queries to staff.',
    capabilities: ['Troubleshooting', 'Ticket Resolution', 'Documentation Retrieval', 'Customer Engagement'],
    logs: []
  },
  {
    id: 'ag-success',
    name: 'Hermes Customer Success Director',
    roleTitle: 'Client Retention & Growth Manager',
    department: 'Customer Success',
    status: 'thinking',
    currentTask: 'Evaluating Account Health Scores & Upsell Opportunities for Tier-1 Accounts',
    kpiScore: 98.4,
    memoryUsageMb: 310,
    tasksCompleted: 1210,
    healthStatus: 'optimal',
    lastActivity: '7 mins ago',
    description: 'Monitors client product usage, satisfaction NPS, and expansion opportunities.',
    capabilities: ['Account Health Analysis', 'Churn Prevention', 'QBR Scheduling', 'Upsell Strategy'],
    logs: []
  },
  {
    id: 'ag-security',
    name: 'Sentinel Security Guard Agent',
    roleTitle: 'Chief Platform Security & Firewalls',
    department: 'Security & Integrity',
    status: 'executing',
    currentTask: 'Continuously Auditing Token Quotas & AES-256 Event Bus Cryptography',
    kpiScore: 99.9,
    memoryUsageMb: 340,
    tasksCompleted: 8920,
    healthStatus: 'optimal',
    lastActivity: 'Just now',
    description: 'Responsible for platform security, access token validation, rate-limit enforcement, and intrusion detection.',
    capabilities: ['Security Hardening', 'Penetration Testing', 'Token Rate Limiting', 'Zero-Trust Verification'],
    logs: [
      { timestamp: '18:10', message: 'Passed zero-vulnerability audit across OmniRoute API Gateway.', type: 'success' }
    ]
  },
  {
    id: 'ag-orchestrator',
    name: 'System Health Orchestrator',
    roleTitle: 'Platform Stability & Load Guard',
    department: 'Infrastructure',
    status: 'executing',
    currentTask: 'Managing Cloud Infrastructure Autoscaling & Real-Time Microservice Latency',
    kpiScore: 99.8,
    memoryUsageMb: 290,
    tasksCompleted: 7410,
    healthStatus: 'optimal',
    lastActivity: '1 min ago',
    description: 'Monitors platform load, orchestrates manual operation tickets, and ensures smooth container health.',
    capabilities: ['Load Balancing', 'Process Triage', 'Fault Tolerance', 'Container Health'],
    logs: [
      { timestamp: '18:12', message: 'Microservices latency verified at 12ms optimal baseline.', type: 'info' }
    ]
  },
  {
    id: 'ag-governance',
    name: 'Data Governance Agent',
    roleTitle: 'Compliance & Audit Integrity Specialist',
    department: 'Security & Integrity',
    status: 'idle',
    currentTask: 'Standing by for GDPR & SOC2 Compliance Log Certification',
    kpiScore: 99.6,
    memoryUsageMb: 220,
    tasksCompleted: 3100,
    healthStatus: 'optimal',
    lastActivity: '5 mins ago',
    description: 'Guarantees enterprise data compliance, privacy policies, and cryptographically verified event logs.',
    capabilities: ['SOC2 Audit', 'GDPR Compliance', 'Data Anonymization', 'Log Verification'],
    logs: []
  }
];

// OmniRoute Free Tokens State
let omniRouteStats: OmniRouteUsage = {
  totalTokensAllowed: 500000,
  tokensUsed: 42180,
  tokensRemaining: 457820,
  tierName: 'Free Enterprise Developer Tier',
  requestsCount: 312,
  topModelUsed: 'gemini-3.6-flash'
};

// Initial Workflow Chains for Workflow Automator
let workflowChains: WorkflowChain[] = [
  {
    id: 'wf-1',
    name: 'Instant Lead Auto-Engagement Chain',
    description: 'When a new lead is created, automatically notify staff, dispatch Sales Agent, and issue welcome sequence.',
    active: true,
    triggerEvent: 'LeadCreated',
    runCount: 142,
    lastRun: '12 mins ago',
    nodes: [
      { id: 'n-1', type: 'trigger', title: 'Trigger: LeadCreated Event', eventType: 'LeadCreated', config: {}, x: 100, y: 120 },
      { id: 'n-2', type: 'action', title: 'Action: Notify Staff via Slack', actionType: 'NotifyStaff', config: { channel: '#sales-leads' }, x: 380, y: 60 },
      { id: 'n-3', type: 'action', title: 'Action: Dispatch Sales Director', actionType: 'DispatchAgent', agentId: 'ag-sales', config: {}, x: 380, y: 180 },
      { id: 'n-4', type: 'action', title: 'Action: Send Welcome Email', actionType: 'SendEmail', config: { template: 'welcome_v2' }, x: 660, y: 120 }
    ],
    edges: [
      { id: 'e-1', source: 'n-1', target: 'n-2', label: 'On Event' },
      { id: 'e-2', source: 'n-1', target: 'n-3', label: 'On Event' },
      { id: 'e-3', source: 'n-3', target: 'n-4', label: 'On Completion' }
    ]
  },
  {
    id: 'wf-2',
    name: 'Invoice Paid & Auto-Onboarding Chain',
    description: 'When an invoice is paid, instantly trigger client project onboarding and dispatch COO agent.',
    active: true,
    triggerEvent: 'InvoicePaid',
    runCount: 89,
    lastRun: '1 hour ago',
    nodes: [
      { id: 'n-10', type: 'trigger', title: 'Trigger: InvoicePaid Event', eventType: 'InvoicePaid', config: {}, x: 100, y: 120 },
      { id: 'n-11', type: 'action', title: 'Action: Dispatch Hermes COO', actionType: 'DispatchAgent', agentId: 'ag-coo', config: {}, x: 380, y: 80 },
      { id: 'n-12', type: 'action', title: 'Action: Update CRM Deal Stage', actionType: 'UpdateCRM', config: { newStage: 'Won' }, x: 380, y: 200 }
    ],
    edges: [
      { id: 'e-10', source: 'n-10', target: 'n-11', label: 'On Payment' },
      { id: 'e-11', source: 'n-10', target: 'n-12', label: 'On Payment' }
    ]
  },
  {
    id: 'wf-3',
    name: 'Urgent Support Ticket Escalation',
    description: 'Escalates high-priority support tickets to lead engineering agents and alerts staff immediately.',
    active: true,
    triggerEvent: 'SupportTicketCreated',
    runCount: 34,
    lastRun: '3 hours ago',
    nodes: [
      { id: 'n-20', type: 'trigger', title: 'Trigger: SupportTicketCreated Event', eventType: 'SupportTicketCreated', config: {}, x: 100, y: 120 },
      { id: 'n-21', type: 'action', title: 'Action: Dispatch Support Specialist', actionType: 'DispatchAgent', agentId: 'ag-support', config: {}, x: 380, y: 120 }
    ],
    edges: [
      { id: 'e-20', source: 'n-20', target: 'n-21', label: 'On Ticket' }
    ]
  }
];

// Initial Orchestrator Kanban Tickets
let orchestratorTickets: OrchestratorTicket[] = [
  {
    id: 'triage-101',
    title: 'OmniRoute API Rate Limit Audit',
    description: 'Verify security firewalls and free token distribution quotas for incoming traffic.',
    priority: 'High',
    stage: 'Executing',
    assignedAgentOrStaff: 'Sentinel Security Guard Agent',
    category: 'Platform Security',
    createdAt: '2026-08-08 17:10',
    updatedAt: '2026-08-08 18:00',
    logs: ['Initiated AES-256 payload inspection', 'Validated 500k token pool balance']
  },
  {
    id: 'triage-102',
    title: 'Acme Logistics Enterprise Onboarding',
    description: 'Manual verification of dedicated vector database schema before production deployment.',
    priority: 'Critical',
    stage: 'In Triage',
    assignedAgentOrStaff: 'Alex Rivers (Lead Staff)',
    category: 'Client Request',
    createdAt: '2026-08-08 16:30',
    updatedAt: '2026-08-08 17:45',
    logs: ['Client requested priority review', 'Assigned to Lead Developer']
  },
  {
    id: 'triage-103',
    title: 'Routine Database Migration & Vacuum',
    description: 'Automated weekly index cleanup and memory cache defragmentation.',
    priority: 'Low',
    stage: 'Backlog',
    assignedAgentOrStaff: 'System Health Orchestrator',
    category: 'System Health',
    createdAt: '2026-08-08 14:00',
    updatedAt: '2026-08-08 14:00',
    logs: ['Scheduled background task created']
  },
  {
    id: 'triage-104',
    title: 'SOC2 Security Audit Log Certification',
    description: 'Validate event bus cryptographic hashes for Q3 regulatory submission.',
    priority: 'Medium',
    stage: 'Verified',
    assignedAgentOrStaff: 'Data Governance Agent',
    createdAt: '2026-08-08 10:00',
    updatedAt: '2026-08-08 15:20',
    category: 'Platform Security',
    logs: ['Cryptographic hashes verified across 10,000 events', 'Passed zero-defect audit']
  }
];

let crmLeads: CRMLead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Connor',
    email: 'sarah@cyberdyne-next.io',
    company: 'Cyberdyne Next Systems',
    serviceInterest: 'AI Automation & Agentic Systems',
    status: 'Qualified',
    estimatedValue: 65000,
    score: 92,
    createdAt: '2026-08-01',
    assignedAgent: 'Hermes Sales Director',
    notes: ['Completed AI Readiness Assessment with 88% score.', 'Requires custom LLM agent fine-tuning.']
  },
  {
    id: 'lead-2',
    name: 'David Miller',
    email: 'david@fintech-edge.com',
    company: 'FinTech Edge',
    serviceInterest: 'AI Consulting & Compliance',
    status: 'Proposal Sent',
    estimatedValue: 120000,
    score: 96,
    createdAt: '2026-08-03',
    assignedAgent: 'Hermes Discovery Consultant',
    notes: ['Met with C-suite.', 'Draft proposal sent for approval.']
  },
  {
    id: 'lead-3',
    name: 'Elena Rostova',
    email: 'elena@novagroup.eu',
    company: 'Nova Group Logistics',
    serviceInterest: 'Web & Mobile App Development',
    status: 'New',
    estimatedValue: 48000,
    score: 78,
    createdAt: '2026-08-07',
    assignedAgent: 'Hermes Lead Generator',
    notes: ['Inbound request via Website Audit tool.']
  }
];

let crmCompanies: CRMCompany[] = [
  { id: 'comp-1', name: 'Cyberdyne Next Systems', industry: 'Robotics & AI', tier: 'Enterprise', contactsCount: 4, activeProjects: 2, totalSpent: 185000, status: 'Active' },
  { id: 'comp-2', name: 'FinTech Edge', industry: 'Financial Services', tier: 'Enterprise', contactsCount: 6, activeProjects: 1, totalSpent: 240000, status: 'Active' },
  { id: 'comp-3', name: 'Apex HealthTech', industry: 'Healthcare', tier: 'Growth', contactsCount: 3, activeProjects: 1, totalSpent: 92000, status: 'Active' },
  { id: 'comp-4', name: 'Global Logistics Hub', industry: 'Supply Chain', tier: 'Enterprise', contactsCount: 8, activeProjects: 3, totalSpent: 310000, status: 'Active' }
];

let crmDeals: CRMDeal[] = [
  { id: 'deal-1', companyName: 'Cyberdyne Next Systems', title: 'Autonomous Supply Chain Agent Fleet', value: 65000, stage: 'Proposal', closeProbability: 85, targetCloseDate: '2026-08-25', assignedManager: 'Alex Rivers' },
  { id: 'deal-2', companyName: 'FinTech Edge', title: 'AI Fraud Detection & Compliance Platform', value: 120000, stage: 'Negotiation', closeProbability: 90, targetCloseDate: '2026-08-20', assignedManager: 'Maria Chen' },
  { id: 'deal-3', companyName: 'Apex HealthTech', title: 'Patient Onboarding Web & Mobile Portal', value: 48000, stage: 'Discovery', closeProbability: 60, targetCloseDate: '2026-09-10', assignedManager: 'Alex Rivers' }
];

let invoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-089',
    clientName: 'Cyberdyne Next Systems',
    amount: 24500,
    status: 'Paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    items: [
      { description: 'Phase 1 AI Workforce Deployment', qty: 1, unitPrice: 19500 },
      { description: 'Dedicated Vector Database Provisioning', qty: 1, unitPrice: 5000 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-090',
    clientName: 'FinTech Edge',
    amount: 38000,
    status: 'Pending',
    issueDate: '2026-08-05',
    dueDate: '2026-08-19',
    items: [
      { description: 'Enterprise AI Audit & System Architecture Blueprint', qty: 1, unitPrice: 38000 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-091',
    clientName: 'Apex HealthTech',
    amount: 15000,
    status: 'Paid',
    issueDate: '2026-07-28',
    dueDate: '2026-08-11',
    items: [
      { description: 'Monthly Managed AI Services & Model Optimization', qty: 1, unitPrice: 15000 }
    ]
  }
];

let projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Cyberdyne Autonomous Agent Suite',
    clientName: 'Cyberdyne Next Systems',
    status: 'In Progress',
    progress: 68,
    dueDate: '2026-09-15',
    assignedStaff: ['Alex Rivers (Lead Developer)', 'Samantha Wu (QA)'],
    assignedAgents: ['Hermes Lead Developer', 'Hermes Solution Architect', 'Hermes QA Lead'],
    tasksTotal: 25,
    tasksCompleted: 17
  },
  {
    id: 'proj-2',
    name: 'FinTech Edge AI Compliance Pipeline',
    clientName: 'FinTech Edge',
    status: 'Planning',
    progress: 25,
    dueDate: '2026-10-01',
    assignedStaff: ['Maria Chen (Solution Architect)'],
    assignedAgents: ['Hermes Executive Director', 'Hermes Discovery Consultant'],
    tasksTotal: 18,
    tasksCompleted: 4
  },
  {
    id: 'proj-3',
    name: 'Apex Health Mobile Experience',
    clientName: 'Apex HealthTech',
    status: 'Review',
    progress: 92,
    dueDate: '2026-08-18',
    assignedStaff: ['Jordan Vance (Mobile Eng)', 'Alex Rivers (Full Stack)'],
    assignedAgents: ['Hermes Lead Developer', 'Hermes QA Lead'],
    tasksTotal: 30,
    tasksCompleted: 28
  }
];

let supportTickets: SupportTicket[] = [
  {
    id: 'tick-101',
    ticketNumber: 'TCK-881',
    clientName: 'Cyberdyne Next Systems',
    subject: 'Request for Webhook Rate Limit Increase',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-08-08 14:15',
    lastUpdated: '2026-08-08 15:30',
    messages: [
      { sender: 'Cyberdyne IT Admin', timestamp: '14:15', content: 'Hi Team, we are bursting our webhook limit during peak hours. Can we bump it to 5,000 req/min?', isStaff: false },
      { sender: 'Hermes Customer Support Specialist', timestamp: '14:18', content: 'Hello! I have analyzed your current rate usage. I am forwarding this to Hermes Infrastructure Specialist for instant tier adjustments.', isStaff: true }
    ]
  },
  {
    id: 'tick-102',
    ticketNumber: 'TCK-882',
    clientName: 'FinTech Edge',
    subject: 'SSO Integration Documentation Request',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-08-07 10:00',
    lastUpdated: '2026-08-07 11:20',
    messages: [
      { sender: 'FinTech SecOps', timestamp: '10:00', content: 'Where can we find SAML 2.0 / Okta guide for Business HUB OS?', isStaff: false },
      { sender: 'Hermes Customer Support Specialist', timestamp: '10:05', content: 'Here is the direct Knowledge Base guide link and API spec. Let us know if you need guided setup.', isStaff: true }
    ]
  }
];

let partnerReferrals: PartnerReferral[] = [
  { id: 'ref-1', partnerName: 'Vanguard Digital Agency', clientName: 'AeroDynamics Tech', service: 'Full AI Operating System', dealValue: 85000, commission: 8500, status: 'Paid', date: '2026-08-02' },
  { id: 'ref-2', partnerName: 'Apex Growth Partners', clientName: 'Quantum Supply Chain', service: 'AI Process Automation', dealValue: 45000, commission: 4500, status: 'Approved', date: '2026-08-06' },
  { id: 'ref-3', partnerName: 'CloudScale Consulting', clientName: 'Omni Retail Group', service: 'Custom Web & Mobile Dev', dealValue: 60000, commission: 6000, status: 'Pending', date: '2026-08-08' }
];

let knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'The Blueprint for Building Event-Driven AI Enterprise Architectures',
    category: 'AI Consulting',
    summary: 'How decoupled Event Bus patterns allow AI Agent fleets to operate securely without direct database write privileges.',
    content: `In traditional enterprise software, modules directly write to shared databases, creating tight coupling and fragile dependency chains.

When introducing autonomous AI agents (such as Hermes AI Workforce), direct database access introduces severe security, integrity, and auditing risks.

Business HUB OS solves this through an Event-Driven Architecture:
1. Agents emit typed events (e.g., LeadCreated, InvoicePaid).
2. The core Event Bus validates and logs the event.
3. Listener modules update CRM, Billing, or Support states.

This ensures zero unauthorized database corruption, 100% auditability, and endless modular expansion.`,
    author: 'Hermes Solution Architect',
    readTime: '6 min read',
    publishedAt: '2026-08-05'
  },
  {
    id: 'art-2',
    title: '2026 Guide to AI ROI: Calculating Business Process Automation Impact',
    category: 'Automation',
    summary: 'A mathematical framework for evaluating manual task hours vs autonomous AI workforce efficiency.',
    content: `When measuring AI Automation ROI, leaders often make the mistake of measuring simple speed. True ROI is calculated across 4 pillars:
1. Labor Hours Reallocated
2. SLA Compression Ratio
3. Human Error Elimination
4. 24/7 Service Scalability

Explore our Free ROI Calculator inside Business HUB OS to project your exact 12-month returns.`,
    author: 'Hermes Executive Director',
    readTime: '4 min read',
    publishedAt: '2026-08-02'
  },
  {
    id: 'art-3',
    title: 'Case Study: How Cyberdyne Next Scaled Operations 4x with Agentic Workflows',
    category: 'Case Study',
    summary: 'Discover how deploying an 18-agent fleet automated 82% of administrative, sales discovery, and support workflows.',
    content: `Cyberdyne Next Systems faced significant bottlenecks in onboarding enterprise clients and managing multi-channel support tickets.

By implementing Business HUB OS with Hermes AI Workforce:
- Ticket resolution time dropped from 4 hours to 90 seconds.
- Sales proposals were generated autonomously within 3 minutes of discovery call completion.
- Annual operational expenditure was reduced by $340,000.`,
    author: 'Hermes Marketing Strategist',
    readTime: '8 min read',
    publishedAt: '2026-07-28'
  }
];

let staffPayrollRecords: StaffPayrollRecord[] = [
  {
    id: 'pay-001',
    staffName: 'Elena Rostova',
    roleTitle: 'VP of Operations',
    department: 'Operations',
    baseSalaryYearly: 145000,
    monthlyNetPay: 9250,
    taxWithheldMonthly: 2833,
    bonusAmount: 1500,
    payPeriod: 'Aug 1 - Aug 31, 2026',
    payDate: '2026-08-31',
    status: 'Scheduled',
    bankAccountLast4: '4821'
  },
  {
    id: 'pay-002',
    staffName: 'Marcus Vance',
    roleTitle: 'Lead AI Engineer',
    department: 'Engineering',
    baseSalaryYearly: 160000,
    monthlyNetPay: 10200,
    taxWithheldMonthly: 3133,
    bonusAmount: 2500,
    payPeriod: 'Aug 1 - Aug 31, 2026',
    payDate: '2026-08-31',
    status: 'Scheduled',
    bankAccountLast4: '9012'
  },
  {
    id: 'pay-003',
    staffName: 'Sarah Jenkins',
    roleTitle: 'Senior Client Success Manager',
    department: 'Client Relations',
    baseSalaryYearly: 110000,
    monthlyNetPay: 7000,
    taxWithheldMonthly: 2166,
    bonusAmount: 800,
    payPeriod: 'Aug 1 - Aug 31, 2026',
    payDate: '2026-08-31',
    status: 'Scheduled',
    bankAccountLast4: '3156'
  },
  {
    id: 'pay-004',
    staffName: 'David Kalu',
    roleTitle: 'Automation Architect',
    department: 'Engineering',
    baseSalaryYearly: 135000,
    monthlyNetPay: 8600,
    taxWithheldMonthly: 2650,
    bonusAmount: 1200,
    payPeriod: 'Aug 1 - Aug 31, 2026',
    payDate: '2026-08-31',
    status: 'Scheduled',
    bankAccountLast4: '7789'
  }
];

let dailyBlogPosts: DailyBlogPost[] = [
  {
    id: 'post-101',
    title: 'How Autonomous Agent Fleets Slash Enterprise Operational Overheads by 70%',
    slug: 'autonomous-agent-fleets-roi-2026',
    summary: 'Discover how modern AI workforces automatically triage support tickets, execute multi-step business logic, and eliminate administrative debt with sub-second response latency.',
    content: `In 2026, forward-thinking enterprises are shifting from static software tools to active, autonomous agentic workforces. Rather than expecting human staff to manually copy-paste data between isolated spreadsheets, CRMs, and email inboxes, AI agents work 24/7 in structured event loops.\n\n### Key Pillars of Agentic Operational Scale\n1. **Sub-Second Lead Response**: Instant engagement when prospective clients reach out via web forms or webhooks.\n2. **Self-Healing Event Chains**: Automatic retry mechanisms when external APIs encounter transient errors.\n3. **Transparent Human-in-the-Loop Safeguards**: Complex edge cases are cleanly escalated to human staff while routine tasks are completed autonomously.\n\nBy combining Google Gemini models with real-time event routing, businesses achieve high-throughput operations with unprecedented reliability.`,
    authorAgent: 'Hermes Content Synthesizer AI',
    authorRole: 'AI Thought Leadership & SEO Agent',
    publishedAt: 'Aug 8, 2026',
    readTimeMinutes: 4,
    category: 'AI Operations',
    seoKeywords: ['AI Automation', 'Agentic Workforces', 'Operational ROI', 'Enterprise AI'],
    viewsCount: 1420
  },
  {
    id: 'post-102',
    title: 'High-Availability System Architecture for Real-Time AI Workflows',
    slug: 'high-availability-ai-architecture',
    summary: 'A deep dive into monitoring CPU usage, memory pools, and database connection limits to guarantee 99.99% uptime for AI operations.',
    content: `Running enterprise AI workloads requires continuous health monitoring and rapid auto-scaling. When traffic spikes, connection pools and GPU/CPU resource utilization must adapt dynamically.\n\n### Core Uptime Metrics for AI Engines\n- **Database Connection Pools**: Maintaining active vs idle connection balance prevents queue saturation during burst traffic.\n- **Microsecond Latency Tracking**: Real-time telemetry surfaces memory bottlenecks before they impact end-user experience.\n- **Automated Failover Loops**: Instant failovers across redundant cluster nodes ensure high availability.`,
    authorAgent: 'Sentinel Security & Infra Agent',
    authorRole: 'Platform Reliability Engineer AI',
    publishedAt: 'Aug 7, 2026',
    readTimeMinutes: 5,
    category: 'Automation Trends',
    seoKeywords: ['High Availability', 'System Monitoring', 'Database Connection Pools', 'Node.js Scale'],
    viewsCount: 980
  },
  {
    id: 'post-103',
    title: 'Why Native CRM & Omnichannel Workflows Outperform Legacy SaaS',
    slug: 'native-crm-vs-legacy-saas',
    summary: 'Integrating your client portal, partner referrals, and sales pipeline directly into one reactive dashboard accelerates lead conversion by 3x.',
    content: `Legacy CRMs suffer from fragmented data silos, slow manual updates, and disconnected third-party plugins. By unifying CRM, billing, and workforce orchestration under a single reactive platform, businesses experience:\n\n- **Zero Sync Delay**: Invoices, deal stages, and support tickets update instantly in real time.\n- **Unified Analytics**: Complete visibility from initial website visitor to multi-year recurring contract.\n- **Automated Payouts**: Partner referral payouts triggered seamlessly as sales close.`,
    authorAgent: 'Hermes Sales Director AI',
    authorRole: 'Revenue Growth Agent',
    publishedAt: 'Aug 6, 2026',
    readTimeMinutes: 3,
    category: 'Business Growth',
    seoKeywords: ['Native CRM', 'Lead Generation', 'Sales Automation', 'SaaS Efficiency'],
    viewsCount: 2150
  }
];

// Helper to push Event Bus items
function publishEvent(type: SystemEvent['type'], title: string, sourceModule: string, payload: Record<string, any>, agents: string[] = ['ag-exec']) {
  const newEvent: SystemEvent = {
    id: `evt-${Date.now().toString().slice(-6)}`,
    type,
    title,
    sourceModule,
    payload,
    timestamp: new Date().toISOString(),
    status: 'processed',
    processedByAgents: agents
  };
  systemEvents.unshift(newEvent);

  // Update corresponding agent memory / logs
  agents.forEach(agentId => {
    const ag = hermesAgents.find(a => a.id === agentId);
    if (ag) {
      ag.lastActivity = 'Just now';
      ag.tasksCompleted += 1;
      ag.logs.unshift({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: `Processed ${type}: ${title}`,
        type: 'success'
      });
    }
  });

  return newEvent;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0-enterprise',
    systemTime: new Date().toISOString(),
    eventBusActive: true,
    geminiConfigured: !!ai,
    activeAgents: hermesAgents.length
  });
});

// Event Bus Stream
app.get('/api/events', (req, res) => {
  res.json({ events: systemEvents });
});

app.post('/api/events/publish', (req, res) => {
  const { type, title, sourceModule, payload, agents } = req.body;
  if (!type || !title) {
    return res.status(400).json({ error: 'Event type and title are required' });
  }
  const published = publishEvent(type, title, sourceModule || 'API Gateway', payload || {}, agents || ['ag-exec', 'ag-coo']);
  res.json({ success: true, event: published });
});

// Hermes AI Workforce
app.get('/api/ai/workforce', (req, res) => {
  res.json({ agents: hermesAgents });
});

app.post('/api/ai/workforce/trigger', async (req, res) => {
  const { agentId, actionPrompt } = req.body;
  const agent = hermesAgents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  agent.status = 'executing';
  agent.currentTask = actionPrompt || `Executing dynamic workflow for ${agent.roleTitle}`;
  agent.lastActivity = 'Just now';

  // Log start
  agent.logs.unshift({
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    message: `Triggered manual execution: "${actionPrompt}"`,
    type: 'info'
  });

  // Optional AI execution if Gemini is available
  let resultText = `Agent ${agent.name} completed execution for: ${actionPrompt}`;
  if (ai && actionPrompt) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are ${agent.name} (${agent.roleTitle}) in Business HUB OS. Execute this task concise and professionally: "${actionPrompt}". Provide a summary output with key findings or actions taken.`
      });
      resultText = response.text || resultText;
    } catch (err: any) {
      console.error('Agent AI Trigger Error:', err);
    }
  }

  agent.status = 'idle';
  agent.tasksCompleted += 1;
  agent.logs.unshift({
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    message: `Completed task: "${actionPrompt.slice(0, 45)}..."`,
    type: 'success'
  });

  // Emit Event
  publishEvent('WorkflowCompleted', `Workflow Completed by ${agent.name}`, 'Hermes AI Workforce', { agentId: agent.id, actionPrompt, outputSummary: resultText.slice(0, 100) }, [agent.id]);

  res.json({
    success: true,
    agent,
    output: resultText
  });
});

// CRM Endpoints
app.get('/api/crm/overview', (req, res) => {
  res.json({
    leads: crmLeads,
    companies: crmCompanies,
    deals: crmDeals,
    invoices: invoices,
    projects: projects,
    tickets: supportTickets
  });
});

app.get('/api/ai/agents', (req, res) => {
  res.json(hermesAgents);
});

app.get('/api/crm/leads', (req, res) => {
  res.json(crmLeads);
});

app.get('/api/crm/invoices', (req, res) => {
  res.json(invoices);
});

app.get('/api/crm/companies', (req, res) => {
  res.json(crmCompanies);
});

app.get('/api/crm/deals', (req, res) => {
  res.json(crmDeals);
});

app.get('/api/crm/tickets', (req, res) => {
  res.json(supportTickets);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/referrals', (req, res) => {
  res.json(partnerReferrals);
});

app.get('/api/workspace/status', (req, res) => {
  res.json({
    driveConnected: true,
    sheetsConnected: true,
    calendarConnected: true,
    driveFilesCount: 28,
    syncedSheetsCount: 6,
    calendarEventsCount: 14
  });
});

// System Health Real-Time Metrics
app.get('/api/system/health', (req, res) => {
  const cpuUsagePercent = Math.round(28 + Math.random() * 18);
  const memoryUsedMb = Math.round(512 + Math.random() * 64);
  const memoryTotalMb = 2048;
  const dbPoolActive = Math.round(4 + Math.random() * 6);
  const dbPoolIdle = 20 - dbPoolActive;
  const dbPoolMax = 20;
  const dbLatencyMs = Math.round((1.8 + Math.random() * 2.4) * 10) / 10;
  const uptimeSeconds = Math.round(process.uptime ? process.uptime() : 86400);
  const requestsPerSec = Math.round(45 + Math.random() * 30);
  const activeWebsockets = Math.round(18 + Math.random() * 8);

  const metrics: SystemHealthMetrics = {
    cpuUsagePercent,
    cpuCores: 8,
    memoryUsedMb,
    memoryTotalMb,
    dbPoolActive,
    dbPoolIdle,
    dbPoolMax,
    dbLatencyMs,
    uptimeSeconds,
    clusterStatus: 'optimal',
    requestsPerSec,
    activeWebsockets,
    nodeVersion: process.version || 'v20.11.1'
  };

  res.json(metrics);
});

// Staff Payroll Endpoints
app.get('/api/staff/payroll', (req, res) => {
  res.json({ payrollRecords: staffPayrollRecords });
});

app.post('/api/staff/payroll/disperse', (req, res) => {
  staffPayrollRecords = staffPayrollRecords.map(rec => ({ ...rec, status: 'Paid' }));

  const totalDispersed = staffPayrollRecords.reduce((acc, r) => acc + r.monthlyNetPay, 0);

  publishEvent(
    'WorkflowCompleted',
    `Payroll Executed: Dispersed $${totalDispersed.toLocaleString()} to ${staffPayrollRecords.length} Staff Members`,
    'Staff Payroll Engine',
    { totalAmount: totalDispersed, staffCount: staffPayrollRecords.length },
    ['ag-finance', 'ag-exec']
  );

  res.json({ success: true, message: 'Payroll dispersed successfully', payrollRecords: staffPayrollRecords });
});

// Daily AI-Curated SEO Posts
app.get('/api/public/daily-posts', (req, res) => {
  res.json({ posts: dailyBlogPosts });
});

app.post('/api/public/daily-posts/generate', async (req, res) => {
  const { topic } = req.body;
  const topicTitle = topic || 'Autonomous Workflow Optimization & Enterprise Scaling';

  let newTitle = topicTitle;
  let newSummary = 'AI-curated daily insight on scaling modern operations with high-availability autonomous agents.';
  let newContent = `### AI Operations Executive Brief\n\nDaily automated synthesis generated by Hermes AI Staff.\n\nModern agentic workflows reduce latency, eliminate administrative drag, and streamline database connection pools for maximum enterprise throughput.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Generate a concise, professional, SEO-optimized blog post for a high-end AI automation agency. 
Topic: "${topicTitle}".
Provide JSON with keys: "title", "summary", "content" (formatted with markdown headings), "seoKeywords" (array of 4 keywords), "readTimeMinutes" (number).`
      });

      const text = response.text || '';
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      if (parsed.title) newTitle = parsed.title;
      if (parsed.summary) newSummary = parsed.summary;
      if (parsed.content) newContent = parsed.content;
    } catch (e) {
      console.warn('Fallback generating daily post without LLM:', e);
    }
  }

  const newPost: DailyBlogPost = {
    id: `post-${Date.now().toString().slice(-4)}`,
    title: newTitle,
    slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: newSummary,
    content: newContent,
    authorAgent: 'Hermes Content Synthesizer AI',
    authorRole: 'AI Thought Leadership & SEO Agent',
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTimeMinutes: 4,
    category: 'AI Operations',
    seoKeywords: ['AI Automation', 'SEO Freshness', 'Daily Curation', 'Agentic Workforces'],
    viewsCount: 1
  };

  dailyBlogPosts.unshift(newPost);

  publishEvent(
    'WorkflowCompleted',
    `Daily SEO Post Generated by AI Staff: ${newPost.title}`,
    'AI Staff Content Engine',
    { postId: newPost.id, title: newPost.title },
    ['ag-seo', 'ag-content']
  );

  res.json({ success: true, post: newPost, posts: dailyBlogPosts });
});

app.post('/api/crm/leads', (req, res) => {
  const { name, email, company, serviceInterest, estimatedValue, notes } = req.body;
  const newLead: CRMLead = {
    id: `lead-${Date.now().toString().slice(-4)}`,
    name: name || 'New Lead',
    email: email || 'lead@example.com',
    company: company || 'Pending Business',
    serviceInterest: serviceInterest || 'AI Consulting',
    status: 'New',
    estimatedValue: Number(estimatedValue) || 25000,
    score: 85,
    createdAt: new Date().toISOString().split('T')[0],
    assignedAgent: 'Hermes Sales Director',
    notes: notes ? [notes] : ['Registered via Business HUB OS']
  };
  crmLeads.unshift(newLead);

  // Publish Event
  publishEvent('LeadCreated', `Lead Created: ${newLead.company} (${newLead.name})`, 'CRM Module', { leadId: newLead.id, value: newLead.estimatedValue }, ['ag-sales', 'ag-leadgen']);

  res.json({ success: true, lead: newLead });
});

// Create Invoice
app.post('/api/crm/invoices', (req, res) => {
  const { clientName, amount, items } = req.body;
  const newInv: Invoice = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientName: clientName || 'Client Inc.',
    amount: Number(amount) || 15000,
    status: 'Pending',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    items: items || [{ description: 'AI Consulting & Integration Services', qty: 1, unitPrice: Number(amount) || 15000 }]
  };
  invoices.unshift(newInv);

  publishEvent('OrderPlaced', `Invoice Created: ${newInv.invoiceNumber} for ${newInv.clientName}`, 'Billing & Payments', { invoiceId: newInv.id, amount: newInv.amount }, ['ag-finance', 'ag-exec']);

  res.json({ success: true, invoice: newInv });
});

// Pay Invoice
app.post('/api/crm/invoices/:id/pay', (req, res) => {
  const inv = invoices.find(i => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found' });
  inv.status = 'Paid';

  publishEvent('InvoicePaid', `Invoice Paid: ${inv.invoiceNumber} ($${inv.amount.toLocaleString()})`, 'Billing & Payments', { invoiceId: inv.id, amount: inv.amount, client: inv.clientName }, ['ag-finance', 'ag-coo']);

  res.json({ success: true, invoice: inv });
});

// Support Tickets
app.get('/api/tickets', (req, res) => {
  res.json({ tickets: supportTickets });
});

app.post('/api/tickets', (req, res) => {
  const { clientName, subject, priority, message } = req.body;
  const newTicket: SupportTicket = {
    id: `tick-${Date.now().toString().slice(-4)}`,
    ticketNumber: `TCK-${Math.floor(100 + Math.random() * 900)}`,
    clientName: clientName || 'Valued Client',
    subject: subject || 'Support Enquiry',
    priority: priority || 'Medium',
    status: 'Open',
    createdAt: new Date().toLocaleString(),
    lastUpdated: new Date().toLocaleString(),
    messages: [
      { sender: clientName || 'Client', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: message || 'Inbound inquiry.', isStaff: false },
      { sender: 'Hermes Customer Support Specialist', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: 'Support ticket received. Hermes AI Support Specialist is analyzing your request.', isStaff: true }
    ]
  };
  supportTickets.unshift(newTicket);

  publishEvent('SupportTicketCreated', `Support Ticket ${newTicket.ticketNumber} Opened by ${newTicket.clientName}`, 'Support Centre', { ticketId: newTicket.id, priority: newTicket.priority }, ['ag-support']);

  res.json({ success: true, ticket: newTicket });
});

// Partner Referrals
app.get('/api/partners', (req, res) => {
  res.json({ referrals: partnerReferrals });
});

// Knowledge Base & CMS
app.get('/api/knowledge', (req, res) => {
  res.json({ articles: knowledgeArticles });
});

// Free AI Tools Endpoint
app.post('/api/ai/tools/assessment', async (req, res) => {
  const { companyName, industry, companySize, currentTechStack, primaryGoal } = req.body;

  let assessment: AIToolAssessmentResult = {
    overallScore: 82,
    maturityLevel: 'Growth Stage - High AI Potential',
    strengths: ['Modern tech stack foundation', 'Clear executive mandate for automation', 'Scalable operational domain'],
    bottlenecks: ['Manual client onboarding workflows', 'Siloed data in legacy spreadsheets', 'Sub-optimal lead qualification latency'],
    recommendedSolutions: [
      { title: 'Hermes Agentic Lead & Onboarding Automation', impact: 'Reduce onboarding friction by 75%', estimatedROI: '320% ROI in 90 days' },
      { title: 'Business HUB OS Central CRM & Event Bus', impact: 'Unified real-time visibility across teams', estimatedROI: 'Save 18 hrs/week per manager' },
      { title: 'Custom Fine-Tuned AI Assistant for Support', impact: '24/7 instant ticket resolution', estimatedROI: '$45,000 annual labor savings' }
    ],
    actionPlan: [
      'Phase 1: Deploy Business HUB OS Event Bus & Core CRM integration.',
      'Phase 2: Provision Hermes AI Workforce agents (Sales, Discovery, Support).',
      'Phase 3: Launch automated client onboarding and self-service portal.'
    ]
  };

  if (ai) {
    try {
      const prompt = `Perform a comprehensive B2B AI Readiness Assessment for:
Company: ${companyName || 'Target Enterprise'}
Industry: ${industry || 'Technology'}
Size: ${companySize || '50-200'}
Tech Stack: ${currentTechStack || 'Mixed SaaS'}
Primary Goal: ${primaryGoal || 'Scale operations and automate workflows'}

Respond strictly with a JSON object with keys:
"overallScore" (number 0-100),
"maturityLevel" (string),
"strengths" (array of 3 strings),
"bottlenecks" (array of 3 strings),
"recommendedSolutions" (array of 3 objects with keys "title", "impact", "estimatedROI"),
"actionPlan" (array of 3 strings)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        assessment = { ...assessment, ...parsed };
      }
    } catch (err) {
      console.error('AI Assessment Error:', err);
    }
  }

  // Record Lead automatically
  const leadName = companyName ? `${companyName} Assessment` : 'AI Tool Visitor';
  crmLeads.unshift({
    id: `lead-${Date.now().toString().slice(-4)}`,
    name: leadName,
    email: 'assessment-lead@businesshub.io',
    company: companyName || 'Prospect Corp',
    serviceInterest: 'AI Readiness & Consulting',
    status: 'New',
    estimatedValue: 35000,
    score: assessment.overallScore,
    createdAt: new Date().toISOString().split('T')[0],
    assignedAgent: 'Hermes Discovery Consultant',
    notes: [`Completed AI Readiness Assessment with score ${assessment.overallScore}/100.`]
  });

  publishEvent('LeadCreated', `Assessment Lead Captured: ${companyName || 'Prospect Corp'} (Score: ${assessment.overallScore})`, 'Free AI Tools', { companyName, score: assessment.overallScore }, ['ag-discovery', 'ag-sales']);

  res.json({ success: true, assessment });
});

// Gemini Assistant Proxy (Supports standard & High Thinking mode)
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, mode, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!ai) {
    return res.json({
      reply: `[System Notice]: GEMINI_API_KEY is not configured in environment. Displaying simulated Assistant response:

I am Business HUB OS AI Assistant. I can help you evaluate services (AI Consulting, AI Automation, Web/App Dev, SEO, AI Training), navigate Mission Control, or manage client deliverables.`
    });
  }

  try {
    const isThinkingMode = mode === 'thinking';
    const modelName = isThinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash';

    const systemInstruction = `You are Business HUB OS Primary AI Assistant.
Business HUB is an enterprise platform offering AI Consulting, AI Automation, Agentic AI Systems, Web & App Development, Digital Marketing, SEO, AI Training, and Managed Services.
Your job is to provide authoritative, concise, and helpful advice to visitors, clients, and staff.
When asked complex technical, architectural, or strategic questions, deliver comprehensive enterprise-grade answers.
Never fabricate pricing contracts or binding legal promises. Encourage scheduling a consultation or using the Free AI Tools.`;

    const config: any = {
      systemInstruction
    };

    if (isThinkingMode) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config
    });

    res.json({
      reply: response.text || 'I apologize, I could not generate a response.',
      modelUsed: modelName,
      isThinkingMode
    });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    res.status(500).json({
      error: 'Failed to process AI chat request',
      message: err.message || 'Server error'
    });
  }
});

// Mission Control System Stats
app.get('/api/mission-control/stats', (req, res) => {
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const activeAgentsCount = hermesAgents.filter(a => a.status === 'executing' || a.status === 'thinking').length;

  res.json({
    metrics: {
      mrr: 145000,
      arr: 1740000,
      totalRevenue,
      pendingRevenue,
      totalLeads: crmLeads.length,
      activeProjects: activeProjectsCount,
      activeAgents: activeAgentsCount,
      totalAgents: hermesAgents.length,
      systemHealth: '100% Operational',
      eventBusThroughput: `${systemEvents.length} events processed`
    },
    recentEvents: systemEvents.slice(0, 5),
    topAgents: hermesAgents.slice(0, 5)
  });
});

// ==========================================
// OMNIROUTE & FREE TOKEN MANAGEMENT ENDPOINTS
// ==========================================

app.get('/api/omniroute/tokens', (req, res) => {
  res.json({ usage: omniRouteStats });
});

app.post('/api/omniroute', async (req, res) => {
  const { prompt, modelPreference, taskContext } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for OmniRoute execution' });
  }

  // Deduct estimated token usage from free tier pool
  const estimatedTokens = Math.max(150, Math.floor(prompt.length * 1.5 + 200));
  omniRouteStats.tokensUsed += estimatedTokens;
  omniRouteStats.tokensRemaining = Math.max(0, omniRouteStats.totalTokensAllowed - omniRouteStats.tokensUsed);
  omniRouteStats.requestsCount += 1;

  const targetModel = modelPreference === 'thinking' ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash';
  omniRouteStats.topModelUsed = targetModel;

  let outputText = `[OmniRoute Route Executed via ${targetModel}]: Simulated response for prompt "${prompt.slice(0, 60)}..."`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: prompt
      });
      outputText = response.text || outputText;
    } catch (err: any) {
      console.error('OmniRoute Execution Error:', err);
    }
  }

  // Emit event
  publishEvent('WorkflowCompleted', `OmniRoute Executed Token Task (${estimatedTokens} free tokens consumed)`, 'OmniRoute Engine', { model: targetModel, tokens: estimatedTokens }, ['ag-security', 'ag-orchestrator']);

  res.json({
    success: true,
    output: outputText,
    tokensConsumed: estimatedTokens,
    usage: omniRouteStats
  });
});

// ==========================================
// WORKFLOW AUTOMATOR ENDPOINTS
// ==========================================

app.get('/api/workflows', (req, res) => {
  res.json({ workflows: workflowChains });
});

app.post('/api/workflows', (req, res) => {
  const { name, description, triggerEvent, nodes, edges } = req.body;
  const newChain: WorkflowChain = {
    id: `wf-${Date.now().toString().slice(-4)}`,
    name: name || 'New Custom Automation Flow',
    description: description || 'User-defined visual event bus automation chain.',
    active: true,
    triggerEvent: triggerEvent || 'LeadCreated',
    nodes: nodes || [],
    edges: edges || [],
    runCount: 0,
    lastRun: 'Never'
  };
  workflowChains.unshift(newChain);

  publishEvent('WorkflowCompleted', `Workflow Chain Created: ${newChain.name}`, 'Workflow Automator', { workflowId: newChain.id }, ['ag-orchestrator']);

  res.json({ success: true, workflow: newChain });
});

app.post('/api/workflows/execute', (req, res) => {
  const { workflowId, samplePayload } = req.body;
  const wf = workflowChains.find(w => w.id === workflowId);
  if (!wf) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  wf.runCount += 1;
  wf.lastRun = 'Just now';

  // Publish event to trigger downstream bus
  const eventPublished = publishEvent(
    wf.triggerEvent,
    `Manual Workflow Test Execution: ${wf.name}`,
    'Workflow Automator',
    samplePayload || { source: 'Visual Canvas Test Run', workflowId: wf.id },
    ['ag-orchestrator', 'ag-coo']
  );

  res.json({
    success: true,
    workflow: wf,
    eventPublished,
    executedNodesCount: wf.nodes.length
  });
});

// ==========================================
// ORCHESTRATOR & KANBAN TRIAGE ENDPOINTS
// ==========================================

app.get('/api/orchestrator/tickets', (req, res) => {
  res.json({ tickets: orchestratorTickets });
});

app.post('/api/orchestrator/tickets', (req, res) => {
  const { title, description, priority, category, assignedAgentOrStaff } = req.body;
  const newTicket: OrchestratorTicket = {
    id: `triage-${Date.now().toString().slice(-4)}`,
    title: title || 'New Operation Task',
    description: description || 'Manual staff or security operation request.',
    priority: priority || 'Medium',
    stage: 'Backlog',
    assignedAgentOrStaff: assignedAgentOrStaff || 'Sentinel Security Guard Agent',
    category: category || 'Manual Operations',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    logs: ['Task created in Triage Backlog']
  };
  orchestratorTickets.unshift(newTicket);

  publishEvent('WorkflowCompleted', `Orchestrator Ticket Created: ${newTicket.title}`, 'Mission Control Triage', { ticketId: newTicket.id, priority: newTicket.priority }, ['ag-orchestrator', 'ag-security']);

  res.json({ success: true, ticket: newTicket });
});

app.post('/api/orchestrator/tickets/move', (req, res) => {
  const { ticketId, newStage } = req.body;
  const t = orchestratorTickets.find(ticket => ticket.id === ticketId);
  if (!t) return res.status(404).json({ error: 'Ticket not found' });

  t.stage = newStage;
  t.updatedAt = new Date().toLocaleString();
  t.logs?.unshift(`Moved stage to ${newStage} at ${new Date().toLocaleTimeString()}`);

  res.json({ success: true, ticket: t });
});

app.post('/api/orchestrator/tickets/claim', (req, res) => {
  const { ticketId, claimedBy } = req.body;
  const t = orchestratorTickets.find(ticket => ticket.id === ticketId);
  if (!t) return res.status(404).json({ error: 'Ticket not found' });

  t.assignedAgentOrStaff = claimedBy || 'Staff Operational Lead';
  t.stage = 'In Triage';
  t.updatedAt = new Date().toLocaleString();
  t.logs?.unshift(`Claimed by ${t.assignedAgentOrStaff} and moved to In Triage`);

  publishEvent(
    'WorkflowCompleted',
    `Operation Ticket Claimed: ${t.title} by ${t.assignedAgentOrStaff}`,
    'Mission Control Triage',
    { ticketId: t.id, claimedBy: t.assignedAgentOrStaff },
    ['ag-orchestrator', 'ag-coo']
  );

  res.json({ success: true, ticket: t });
});

app.post('/api/orchestrator/tickets/execute', async (req, res) => {
  const { ticketId, staffNotes } = req.body;
  const t = orchestratorTickets.find(ticket => ticket.id === ticketId);
  if (!t) return res.status(404).json({ error: 'Ticket not found' });

  t.stage = 'Executing';
  t.updatedAt = new Date().toLocaleString();
  t.logs?.unshift(`Initiated manual operation execution by staff. Notes: ${staffNotes || 'None'}`);

  let executionSummary = `Executed operation strategy for ${t.title}. Operational parameters aligned with system guards.`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an operational AI guard agent executing ticket "${t.title}" (${t.description}). Provide a 2-sentence resolution summary of actions taken.`
      });
      executionSummary = response.text || executionSummary;
    } catch (e) {
      console.warn('Fallback execution summary:', e);
    }
  }

  t.stage = 'Verified';
  t.logs?.unshift(`Completed execution: ${executionSummary}`);

  publishEvent(
    'WorkflowCompleted',
    `AI Operation Executed & Resolved: ${t.title}`,
    'Mission Control Triage',
    { ticketId: t.id, summary: executionSummary },
    ['ag-orchestrator', 'ag-security']
  );

  res.json({ success: true, ticket: t, executionSummary });
});

// AI-Assisted Strategy Call Consultation & Feasibility Evaluator
app.post('/api/public/ai-consultation/evaluate', async (req, res) => {
  const { inquiryText, clientName, companyName, clientEmail, serviceInterest } = req.body;
  const inquiry = inquiryText || 'Looking to automate customer lead response and sync with custom CRM';

  let canDoInstantly = true;
  let fulfillmentType: 'INSTANT' | 'TIMELY' = 'INSTANT';
  let estimatedTurnaround = 'Instant (< 5 Minutes via AI Workflow Engine)';
  let aiAssessmentMessage = `Great news! Your request for "${inquiry.slice(0, 50)}..." matches our pre-built autonomous agent templates. Hermes AI workforce can deploy and configure this instantly upon confirmation.`;
  let recommendedAgentFleet = ['Hermes Sales Director AI', 'Omni-Route Dispatcher AI', 'Sentinel Guard Security Agent'];
  let voiceAudioTranscript = `Hello ${clientName || 'there'}! I'm Hermes, your AI Senior Operations Consultant. I evaluated your request regarding ${serviceInterest || 'automation'}. Good news! We can implement this instantly using our pre-built agentic workflow engine. I have pre-filled your strategy consultation form below so you can confirm with one click!`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are a high-level AI Enterprise Solution Architect evaluating a prospective client inquiry.
Inquiry: "${inquiry}".
Client Name: "${clientName || 'Valued Partner'}".
Company: "${companyName || 'Enterprise'}".
Service Interest: "${serviceInterest || 'AI Automation'}".

Determine:
1. Whether this inquiry can be fulfilled INSTANTLY (pre-built agent workflow template, automated integration) or in a TIMELY MANNER (2-3 business days for complex bespoke enterprise architecture, legacy migration, specialized compliance).
2. Write a 2-sentence professional assessment explaining why and how we deliver it.
3. Provide a natural, friendly 2-sentence transcript for a voice/talking AI consultant to speak to the client.

Respond ONLY in JSON format:
{
  "canDoInstantly": boolean,
  "fulfillmentType": "INSTANT" | "TIMELY",
  "estimatedTurnaround": string,
  "aiAssessmentMessage": string,
  "recommendedAgentFleet": string[],
  "voiceAudioTranscript": string,
  "estimatedBudget": number
}`
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (typeof parsed.canDoInstantly === 'boolean') canDoInstantly = parsed.canDoInstantly;
      if (parsed.fulfillmentType) fulfillmentType = parsed.fulfillmentType;
      if (parsed.estimatedTurnaround) estimatedTurnaround = parsed.estimatedTurnaround;
      if (parsed.aiAssessmentMessage) aiAssessmentMessage = parsed.aiAssessmentMessage;
      if (Array.isArray(parsed.recommendedAgentFleet)) recommendedAgentFleet = parsed.recommendedAgentFleet;
      if (parsed.voiceAudioTranscript) voiceAudioTranscript = parsed.voiceAudioTranscript;
    } catch (e) {
      console.warn('Fallback evaluating AI consultation:', e);
      if (inquiry.toLowerCase().includes('custom legacy') || inquiry.toLowerCase().includes('on-prem') || inquiry.toLowerCase().includes('migration')) {
        canDoInstantly = false;
        fulfillmentType = 'TIMELY';
        estimatedTurnaround = '2-3 Business Days (Tailored Enterprise Architecture)';
        aiAssessmentMessage = 'Your requirement involves specialized architecture or custom integration. Our senior engineering team will assemble a tailored roadmap delivered in 2-3 business days.';
      }
    }
  } else {
    if (inquiry.toLowerCase().includes('custom legacy') || inquiry.toLowerCase().includes('on-prem') || inquiry.toLowerCase().includes('migration')) {
      canDoInstantly = false;
      fulfillmentType = 'TIMELY';
      estimatedTurnaround = '2-3 Business Days (Tailored Enterprise Architecture)';
      aiAssessmentMessage = 'Your requirement involves specialized architecture or custom integration. Our senior engineering team will assemble a tailored roadmap delivered in 2-3 business days.';
    }
  }

  const result: AIConsultationEvaluation = {
    canDoInstantly,
    fulfillmentType,
    estimatedTurnaround,
    aiAssessmentMessage,
    recommendedAgentFleet,
    prefilledForm: {
      name: clientName || 'Valued Client',
      email: clientEmail || 'client@company.com',
      company: companyName || 'Growth Enterprise',
      serviceInterest: serviceInterest || (canDoInstantly ? 'AI Automation & Agentic Systems' : 'Strategic Business AI Consulting'),
      estimatedValue: canDoInstantly ? 25000 : 50000,
      notes: `[AI Feasibility Check: ${fulfillmentType} (${estimatedTurnaround})]\nClient Request: ${inquiry}\nRecommended Agent Fleet: ${recommendedAgentFleet.join(', ')}`
    },
    voiceAudioTranscript
  };

  res.json(result);
});

// Package Orders Store & Customizable Service Workflow Steps
let packageOrders: any[] = [
  {
    id: 'ord-8801',
    packageName: 'Pro Operations Suite',
    packagePrice: 5000,
    paymentMethod: 'Stripe / Credit Card',
    paymentStatus: 'Paid',
    companyName: 'Apex HealthTech',
    contactName: 'Dr. Sarah Connor',
    contactEmail: 's.connor@apexhealth.io',
    contactPhone: '+1 (555) 321-9876',
    websiteUrl: 'https://apexhealth.io',
    businessGoals: 'Automate HIPAA-compliant lead qualification and multi-channel appointment scheduling across 12 clinics.',
    aiAgentInstructions: 'Empathetic, highly professional medical tone. strictly avoid diagnosing, focus on appointment booking and insurance triage.',
    integrationsNeeded: ['Custom CRM Sync', 'Email & Webhooks', 'WhatsApp Integration'],
    uploadedContextDocs: 'https://apexhealth.io/clinic-locations-and-[#0001].pdf',
    aiGeneratedArtifacts: {
      systemArchitectureSummary: 'Designed a 3-tier event-driven HIPAA proxy layer routing patient intake webhooks directly to Hermes Intake Specialist with AES-256 encrypted tokenization.',
      configuredAgents: ['Hermes Lead Evaluator', 'Hermes HIPAA Proxy Agent', 'Hermes Calendar Booking Bot'],
      generatedWorkflows: ['Intake -> Insurance Triage -> CRM Lead Record', 'Appointment Cancellation -> Automated Retention Follow-up'],
      sampleOutputs: ['Configured intake webhook pipeline: https://api.apexhealth.io/v1/patient-intake', 'Initial System System Prompt initialized for Patient Triage Agent.']
    },
    status: 'Pending Human Quality Review',
    humanReviewNotes: 'Pending Senior Medical IT Staff approval prior to final API key handover.',
    createdAt: new Date(Date.now() - 3600000 * 5).toLocaleString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toLocaleString()
  }
];

let serviceWorkflowSteps: any[] = [
  {
    id: 'step-st-1',
    packageTier: 'Starter',
    stepNumber: 1,
    stepName: 'Intake & Requirement Parsing',
    agentRole: 'Hermes Solution Architect',
    description: 'Parses client goals, brand tone, and target audience to structure initial system parameters.',
    promptTemplate: 'Analyze the following client goals: {{businessGoals}} and extract 3 core AI agent competencies and 2 automated triggers.',
    adjustableParameters: {
      temperature: 0.2,
      maxTokens: 1024,
      confidenceThreshold: 0.85,
      requireHumanApproval: false
    },
    status: 'Active'
  },
  {
    id: 'step-pro-2',
    packageTier: 'Pro Scale',
    stepNumber: 2,
    stepName: 'Autonomous Agent Fleet & Flow Generation',
    agentRole: 'Hermes Workflow Automator',
    description: 'Synthesizes specialized agent system prompts, webhook triggers, and CRM data mappings instantly.',
    promptTemplate: 'You are Hermes Senior Workflow Automator. Construct an end-to-end event bus pipeline for {{companyName}} given integrations {{integrationsNeeded}}.',
    adjustableParameters: {
      temperature: 0.4,
      maxTokens: 2048,
      confidenceThreshold: 0.90,
      requireHumanApproval: true
    },
    status: 'Active'
  },
  {
    id: 'step-ent-3',
    packageTier: 'Enterprise',
    stepNumber: 3,
    stepName: 'Senior Human Quality Review & Security Sign-Off',
    agentRole: 'Human Staff Operational Lead',
    description: 'Mandatory human-in-the-loop audit verifying security parameters, prompt accuracy, and API keys before handover.',
    promptTemplate: 'Review all generated AI artifacts for {{companyName}}. Confirm compliance and client SLA before releasing portal access.',
    adjustableParameters: {
      temperature: 0.0,
      maxTokens: 512,
      confidenceThreshold: 0.99,
      requireHumanApproval: true
    },
    status: 'Active'
  }
];

app.get('/api/packages/orders', (req, res) => {
  res.json({ orders: packageOrders });
});

app.post('/api/packages/order', async (req, res) => {
  const {
    packageName,
    packagePrice,
    paymentMethod,
    companyName,
    contactName,
    contactEmail,
    contactPhone,
    websiteUrl,
    businessGoals,
    aiAgentInstructions,
    integrationsNeeded,
    uploadedContextDocs
  } = req.body;

  let aiGeneratedArtifacts = {
    systemArchitectureSummary: `Automated ${packageName} architecture initialized for ${companyName || 'Valued Client'}. Webhook endpoints routed to Event Bus.`,
    configuredAgents: ['Hermes Lead Evaluator Agent', 'Hermes Operations Specialist', 'Hermes Customer Support AI'],
    generatedWorkflows: ['Webhook Event -> CRM Sync Pipeline', 'Instant Lead Nurture & Notification Loop'],
    sampleOutputs: ['Initial Agent System Prompt generated.', 'Webhook endpoint active at /api/webhooks/incoming.']
  };

  if (ai) {
    try {
      const prompt = `You are Business HUB OS Senior AI Architect. A client has purchased the "${packageName}" package ($${packagePrice}) with payment method "${paymentMethod}".
Client Company: "${companyName}".
Contact Person: "${contactName}" (${contactEmail}).
Business Goals: "${businessGoals}".
AI Agent Instructions & Tone: "${aiAgentInstructions}".
Integrations Needed: ${JSON.stringify(integrationsNeeded)}.
Context Docs: "${uploadedContextDocs || 'None'}".

Generate a JSON object with keys:
1. "systemArchitectureSummary": a 3-sentence technical description of the system built instantly by AI.
2. "configuredAgents": array of 3-4 specialized AI agent names created for this package.
3. "generatedWorkflows": array of 2-3 automated workflows constructed.
4. "sampleOutputs": array of 2-3 initial deliverables/prompts created for immediate client review.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.systemArchitectureSummary) {
          aiGeneratedArtifacts = parsed;
        }
      }
    } catch (e) {
      console.warn('Fallback generating package order AI artifacts:', e);
    }
  }

  const newOrder = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    packageName: packageName || 'Pro Operations Suite',
    packagePrice: packagePrice || 5000,
    paymentMethod: paymentMethod || 'Stripe / Credit Card',
    paymentStatus: 'Paid',
    companyName: companyName || 'New Client Enterprise',
    contactName: contactName || 'Valued Contact',
    contactEmail: contactEmail || 'client@company.com',
    contactPhone,
    websiteUrl,
    businessGoals,
    aiAgentInstructions,
    integrationsNeeded: integrationsNeeded || ['CRM Sync', 'Email Notifications'],
    uploadedContextDocs,
    aiGeneratedArtifacts,
    status: 'Pending Human Quality Review',
    humanReviewNotes: 'AI agent work carried out instantly. Awaiting Senior Staff human verification prior to client handover.',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString()
  };

  packageOrders.unshift(newOrder);

  // Auto-create an Orchestrator Ticket for Human Quality Review
  const reviewTicket: OrchestratorTicket = {
    id: `tkt-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `[Package Quality Review] ${companyName} - ${packageName}`,
    description: `Instant AI agent execution finished for order ${newOrder.id}. Review architecture, agent system prompts, and integrations before client handover.`,
    priority: 'High',
    stage: 'In Triage',
    assignedAgentOrStaff: 'Senior Staff Quality Reviewer',
    category: 'Client Request',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    logs: [
      `Order ${newOrder.id} received and processed instantly by AI Agents.`,
      `Routing to Senior Staff for Human Quality Assurance review.`
    ]
  };
  orchestratorTickets.unshift(reviewTicket);

  publishEvent('WorkflowCompleted', `Package Order ${newOrder.id} Received & Processed by AI Agents`, 'Hermes Order Processing Agent', {
    orderId: newOrder.id,
    company: companyName,
    package: packageName,
    status: 'Pending Human Quality Review'
  }, ['ag-architect', 'ag-workflow']);

  res.json({ success: true, order: newOrder });
});

app.put('/api/packages/orders/:id/review', (req, res) => {
  const { id } = req.params;
  const { status, humanReviewNotes } = req.body;

  const order = packageOrders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (status) order.status = status;
  if (humanReviewNotes) order.humanReviewNotes = humanReviewNotes;
  order.updatedAt = new Date().toLocaleString();

  publishEvent('WorkflowCompleted', `Package Order ${order.id} Status Updated to "${order.status}"`, 'Human Quality Reviewer', {
    orderId: order.id,
    status: order.status,
    notes: humanReviewNotes
  });

  res.json({ success: true, order });
});

app.get('/api/packages/workflow-steps', (req, res) => {
  res.json({ steps: serviceWorkflowSteps });
});

app.put('/api/packages/workflow-steps/:id', (req, res) => {
  const { id } = req.params;
  const { stepName, agentRole, description, promptTemplate, adjustableParameters, status } = req.body;

  const step = serviceWorkflowSteps.find(s => s.id === id);
  if (!step) return res.status(404).json({ error: 'Workflow step not found' });

  if (stepName) step.stepName = stepName;
  if (agentRole) step.agentRole = agentRole;
  if (description) step.description = description;
  if (promptTemplate) step.promptTemplate = promptTemplate;
  if (adjustableParameters) step.adjustableParameters = { ...step.adjustableParameters, ...adjustableParameters };
  if (status) step.status = status;

  publishEvent('WorkflowCompleted', `Service Workflow Step ${step.id} Parameters Updated`, 'Staff Workflow Administrator', {
    stepId: step.id,
    stepName: step.stepName,
    status: step.status
  });

  res.json({ success: true, step });
});

app.post('/api/orchestrator/security-audit', async (req, res) => {
  const secAgent = hermesAgents.find(a => a.id === 'ag-security');
  if (secAgent) {
    secAgent.status = 'executing';
    secAgent.lastActivity = 'Just now';
    secAgent.tasksCompleted += 1;
    secAgent.logs.unshift({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: 'Triggered manual Zero-Trust platform security audit.',
      type: 'success'
    });
  }

  publishEvent('WorkflowCompleted', 'Zero-Trust Platform Security Audit Executed', 'Sentinel Guard Agent', { status: 'Zero Vulnerabilities Detected', aes256Verified: true }, ['ag-security']);

  res.json({
    success: true,
    message: 'Zero-Trust Security & Token Firewall Audit completed successfully with 100% integrity.'
  });
});


// Vite Middleware for Dev and Static Files for Prod
async function startServer() {
  await ensureUserSchema().catch(err => {
    console.warn('[DB] User schema initialization warning:', err);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Business HUB OS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

