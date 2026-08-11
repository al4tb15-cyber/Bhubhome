import React from 'react';
import { CRMLead, CRMCompany, CRMDeal, Invoice, SupportTicket } from '../types';
import { 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  DollarSign, 
  FileText, 
  HelpCircle, 
  Plus, 
  Search, 
  Send, 
  UserCheck, 
  Users,
  Check,
  Zap
} from 'lucide-react';

interface CRMViewProps {
  leads: CRMLead[];
  companies: CRMCompany[];
  deals: CRMDeal[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  onCreateLead: (leadData: Partial<CRMLead>) => Promise<any>;
  onCreateInvoice: (invData: Partial<Invoice>) => Promise<any>;
  onPayInvoice: (id: string) => Promise<any>;
}

export const CRMView: React.FC<CRMViewProps> = ({
  leads,
  companies,
  deals,
  invoices,
  tickets,
  onCreateLead,
  onCreateInvoice,
  onPayInvoice
}) => {
  const [activeTab, setActiveTab] = React.useState<'leads' | 'deals' | 'invoices' | 'companies' | 'tickets'>('leads');
  const [showAddLeadModal, setShowAddLeadModal] = React.useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = React.useState(false);

  // New Lead Form State
  const [leadName, setLeadName] = React.useState('');
  const [leadEmail, setLeadEmail] = React.useState('');
  const [leadCompany, setLeadCompany] = React.useState('');
  const [leadService, setLeadService] = React.useState('AI Automation & Agentic Systems');
  const [leadValue, setLeadValue] = React.useState('45000');

  // New Invoice Form State
  const [invClient, setInvClient] = React.useState('');
  const [invAmount, setInvAmount] = React.useState('25000');
  const [invDescription, setInvDescription] = React.useState('Enterprise AI Architecture & Agent Fleet Setup');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateLead({
      name: leadName,
      email: leadEmail,
      company: leadCompany,
      serviceInterest: leadService,
      estimatedValue: Number(leadValue)
    });
    setLeadName('');
    setLeadEmail('');
    setLeadCompany('');
    setShowAddLeadModal(false);
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateInvoice({
      clientName: invClient,
      amount: Number(invAmount),
      items: [{ description: invDescription, qty: 1, unitPrice: Number(invAmount) }]
    });
    setInvClient('');
    setInvAmount('25000');
    setShowAddInvoiceModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sky-500 font-mono mb-1">
            ENTERPRISE PIPELINE & BILLING
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white italic">
            CRM & Finance Engine
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="px-4 py-1.5 border border-white/20 text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1.5 font-mono"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all ${
            activeTab === 'leads'
              ? 'bg-white/10 text-white border-l-2 border-sky-500'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Leads ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all ${
            activeTab === 'deals'
              ? 'bg-white/10 text-white border-l-2 border-sky-500'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Pipeline ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all ${
            activeTab === 'invoices'
              ? 'bg-white/10 text-white border-l-2 border-sky-500'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all ${
            activeTab === 'companies'
              ? 'bg-white/10 text-white border-l-2 border-sky-500'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Accounts ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all ${
            activeTab === 'tickets'
              ? 'bg-white/10 text-white border-l-2 border-sky-500'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Tab 1: Leads */}
      {activeTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Prospects & AI Qualified Leads</h3>
            <span className="text-xs text-slate-400">Assigned Hermes AI Sales Agent</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Lead Name</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Service Interest</th>
                  <th className="px-6 py-3">Est. Value</th>
                  <th className="px-6 py-3">AI Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Assigned Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {lead.name}
                      <p className="text-[10px] text-slate-400 font-normal">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4">{lead.company}</td>
                    <td className="px-6 py-4 font-medium text-cyan-400">{lead.serviceInterest}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">${lead.estimatedValue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {lead.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{lead.assignedAgent || 'Hermes Sales Director'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Deals Pipeline */}
      {activeTab === 'deals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map(deal => (
            <div key={deal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  {deal.stage}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{deal.closeProbability}% Prob</span>
              </div>

              <h3 className="font-bold text-white text-sm">{deal.title}</h3>
              <p className="text-xs text-slate-400 font-medium">{deal.companyName}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Deal Value:</span>
                <span className="font-extrabold text-emerald-400 text-base">${deal.value.toLocaleString()}</span>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>Target: {deal.targetCloseDate}</span>
                <span>Manager: {deal.assignedManager}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Enterprise Invoices & Stripe Sync</h3>
            <span className="text-xs text-slate-400">Hermes Finance Controller Synced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Issue Date</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 font-semibold text-white">{inv.clientName}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400 text-sm">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.issueDate}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status !== 'Paid' ? (
                        <button
                          onClick={() => onPayInvoice(inv.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          Simulate Payment
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center justify-end">
                          <Check className="w-3.5 h-3.5 mr-1" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Companies */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map(comp => (
            <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {comp.tier}
                </span>
                <span className="text-xs font-semibold text-emerald-400">{comp.status}</span>
              </div>

              <h3 className="font-bold text-white text-sm">{comp.name}</h3>
              <p className="text-xs text-slate-400">{comp.industry}</p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Active Projects:</span>
                  <span className="text-slate-200 font-semibold">{comp.activeProjects}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Revenue:</span>
                  <span className="text-emerald-400 font-bold">${comp.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Tickets */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Client Technical Support Centre</h3>
            <span className="text-xs text-slate-400">Hermes Support Specialist Active</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {tickets.map(t => (
              <div key={t.id} className="p-6 space-y-3 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {t.ticketNumber}
                    </span>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    t.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-300'
                  }`}>
                    Priority: {t.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-400">Client: <strong className="text-slate-200">{t.clientName}</strong> • Created: {t.createdAt}</p>

                <div className="bg-slate-950 rounded-xl p-4 space-y-2 border border-slate-800">
                  {t.messages.map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg text-xs space-y-1 ${m.isStaff ? 'bg-slate-900 border border-slate-800 text-cyan-200' : 'bg-slate-900/60 text-slate-300'}`}>
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span className={m.isStaff ? 'text-cyan-400' : 'text-slate-200'}>{m.sender}</span>
                        <span className="text-slate-500">{m.timestamp}</span>
                      </div>
                      <p>{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <h2 className="text-lg font-bold text-white">Add New Qualified Lead</h2>
            
            <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="e.g. elena@company.com"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="e.g. Nova Logistics"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Service Interest</label>
                <select
                  value={leadService}
                  onChange={(e) => setLeadService(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                >
                  <option>AI Consulting</option>
                  <option>AI Automation & Agentic Systems</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>Digital Marketing & SEO</option>
                  <option>AI Training & Managed Services</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Est. Deal Value ($)</label>
                <input
                  type="number"
                  value={leadValue}
                  onChange={(e) => setLeadValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2 rounded-xl transition-all"
                >
                  Create & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <h2 className="text-lg font-bold text-white">Create New Invoice</h2>

            <form onSubmit={handleInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={invClient}
                  onChange={(e) => setInvClient(e.target.value)}
                  placeholder="e.g. Cyberdyne Next Systems"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={invDescription}
                  onChange={(e) => setInvDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl transition-all"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
