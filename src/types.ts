export type UserRole = 
  | 'ceo' 
  | 'admin' 
  | 'manager' 
  | 'staff' 
  | 'partner' 
  | 'client' 
  | 'lead' 
  | 'visitor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  title?: string;
  mfaEnabled: boolean;
  lastActive: string;
}

export type AgentStatus = 'idle' | 'executing' | 'thinking' | 'paused' | 'error';

export interface HermesAgent {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  status: AgentStatus;
  currentTask?: string;
  kpiScore: number; // e.g. 98.4
  memoryUsageMb: number;
  tasksCompleted: number;
  healthStatus: 'optimal' | 'degraded' | 'offline';
  lastActivity: string;
  description: string;
  capabilities: string[];
  logs: { timestamp: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }[];
}

export type EventType = 
  | 'LeadCreated'
  | 'ClientRegistered'
  | 'OrderPlaced'
  | 'InvoicePaid'
  | 'ProjectStarted'
  | 'TaskCompleted'
  | 'SupportTicketCreated'
  | 'ContentPublished'
  | 'WorkflowCompleted'
  | 'AgentStatusChanged';

export interface SystemEvent {
  id: string;
  type: EventType;
  title: string;
  sourceModule: string;
  payload: Record<string, any>;
  timestamp: string;
  status: 'published' | 'processed' | 'failed';
  processedByAgents?: string[];
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Closed';
  estimatedValue: number;
  score: number;
  createdAt: string;
  assignedAgent?: string;
  notes?: string[];
}

export interface CRMCompany {
  id: string;
  name: string;
  industry: string;
  tier: 'Enterprise' | 'Growth' | 'Startup' | 'SMB';
  contactsCount: number;
  activeProjects: number;
  totalSpent: number;
  status: 'Active' | 'Churned' | 'Onboarding';
}

export interface CRMDeal {
  id: string;
  companyName: string;
  title: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeProbability: number;
  targetCloseDate: string;
  assignedManager: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  items: { description: string; qty: number; unitPrice: number }[];
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
  progress: number; // 0 - 100
  dueDate: string;
  assignedStaff: string[];
  assignedAgents: string[];
  tasksTotal: number;
  tasksCompleted: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  lastUpdated: string;
  messages: { sender: string; timestamp: string; content: string; isStaff: boolean }[];
}

export interface PartnerReferral {
  id: string;
  partnerName: string;
  clientName: string;
  service: string;
  dealValue: number;
  commission: number;
  status: 'Pending' | 'Approved' | 'Paid';
  date: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'AI Consulting' | 'Automation' | 'Development' | 'SEO' | 'Case Study' | 'SaaS Guides';
  summary: string;
  content: string;
  author: string;
  readTime: string;
  publishedAt: string;
}

export interface AIToolAssessmentInput {
  companyName: string;
  industry: string;
  companySize: string;
  currentTechStack: string;
  primaryGoal: string;
}

export interface AIToolAssessmentResult {
  overallScore: number;
  maturityLevel: string;
  strengths: string[];
  bottlenecks: string[];
  recommendedSolutions: { title: string; impact: string; estimatedROI: string }[];
  actionPlan: string[];
}

export interface WorkspaceIntegrationStatus {
  driveConnected: boolean;
  sheetsConnected: boolean;
  calendarConnected: boolean;
  driveFilesCount: number;
  syncedSheetsCount: number;
  calendarEventsCount: number;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  eventType?: EventType;
  actionType?: 'NotifyStaff' | 'DispatchAgent' | 'CreateInvoice' | 'SendEmail' | 'UpdateCRM' | 'WebhookPost';
  agentId?: string;
  config: Record<string, any>;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowChain {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggerEvent: EventType;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun?: string;
  runCount: number;
}

export type TriageStage = 'Backlog' | 'In Triage' | 'Executing' | 'Verified';

export interface OrchestratorTicket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  stage: TriageStage;
  assignedAgentOrStaff: string;
  category: 'Platform Security' | 'System Health' | 'Manual Operations' | 'Client Request';
  createdAt: string;
  updatedAt: string;
  logs?: string[];
}

export interface OmniRouteUsage {
  totalTokensAllowed: number;
  tokensUsed: number;
  tokensRemaining: number;
  tierName: string;
  requestsCount: number;
  topModelUsed: string;
}

export interface SystemHealthMetrics {
  cpuUsagePercent: number;
  cpuCores: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  dbPoolActive: number;
  dbPoolIdle: number;
  dbPoolMax: number;
  dbLatencyMs: number;
  uptimeSeconds: number;
  clusterStatus: 'optimal' | 'degraded' | 'critical';
  requestsPerSec: number;
  activeWebsockets: number;
  nodeVersion: string;
}

export interface StaffPayrollRecord {
  id: string;
  staffName: string;
  roleTitle: string;
  department: string;
  baseSalaryYearly: number;
  monthlyNetPay: number;
  taxWithheldMonthly: number;
  bonusAmount: number;
  payPeriod: string;
  payDate: string;
  status: 'Paid' | 'Processing' | 'Scheduled';
  bankAccountLast4: string;
}

export interface DailyBlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorAgent: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: 'AI Operations' | 'Automation Trends' | 'Business Growth' | 'Case Study';
  seoKeywords: string[];
  viewsCount: number;
}

export interface AIConsultationEvaluation {
  canDoInstantly: boolean;
  fulfillmentType: 'INSTANT' | 'TIMELY';
  estimatedTurnaround: string;
  aiAssessmentMessage: string;
  recommendedAgentFleet: string[];
  prefilledForm: {
    name: string;
    email: string;
    company: string;
    serviceInterest: string;
    estimatedValue: number;
    notes: string;
  };
  voiceAudioTranscript: string;
}

export interface ServiceTierPackage {
  id: string;
  name: string;
  tier: 'Starter' | 'Pro Scale' | 'Enterprise';
  monthlyPrice: number;
  description: string;
  features: string[];
  agentCount: number;
  deliveryTime: string;
  isPopular?: boolean;
}

export interface PackageOrderRequest {
  id: string;
  packageName: string;
  packagePrice: number;
  paymentMethod: 'Stripe / Credit Card' | 'Corporate Invoice / ACH' | 'Crypto / Web3' | 'PayPal';
  paymentStatus: 'Paid' | 'Processing' | 'Invoiced';
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  businessGoals: string;
  aiAgentInstructions: string;
  integrationsNeeded: string[];
  uploadedContextDocs?: string;
  aiGeneratedArtifacts?: {
    systemArchitectureSummary: string;
    configuredAgents: string[];
    generatedWorkflows: string[];
    sampleOutputs: string[];
  };
  status: 'Instant AI Execution' | 'Pending Human Quality Review' | 'Human Approved & Delivered';
  humanReviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWorkflowStep {
  id: string;
  packageTier: 'Starter' | 'Pro Scale' | 'Enterprise';
  stepNumber: number;
  stepName: string;
  agentRole: string;
  description: string;
  promptTemplate: string;
  adjustableParameters: {
    temperature: number;
    maxTokens: number;
    confidenceThreshold: number;
    requireHumanApproval: boolean;
  };
  status: 'Active' | 'Paused' | 'Modified';
}


