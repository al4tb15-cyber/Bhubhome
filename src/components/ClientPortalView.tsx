import React from 'react';
import { Project, Invoice, SupportTicket } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Download, 
  FileText, 
  FolderCheck, 
  HelpCircle, 
  Layers, 
  Plus, 
  Send, 
  Sparkles, 
  UploadCloud, 
  Zap 
} from 'lucide-react';

interface ClientPortalProps {
  projects: Project[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  onPayInvoice: (id: string) => Promise<any>;
  onSubmitTicket: (subject: string, message: string) => Promise<any>;
  onCreateInvoice: (invData: Partial<Invoice>) => Promise<any>;
}

export const ClientPortalView: React.FC<ClientPortalProps> = ({
  projects,
  invoices,
  tickets,
  onPayInvoice,
  onSubmitTicket,
  onCreateInvoice
}) => {
  const [activeTab, setActiveTab] = React.useState<'projects' | 'invoices' | 'documents' | 'support' | 'order'>('projects');
  
  // Support Form
  const [ticketSubject, setTicketSubject] = React.useState('');
  const [ticketMsg, setTicketMsg] = React.useState('');
  const [ticketSuccess, setTicketSuccess] = React.useState(false);

  // Order Form
  const [selectedService, setSelectedService] = React.useState('AI Agent Fleet Deployment');
  const [orderNotes, setOrderNotes] = React.useState('');
  const [orderSuccess, setOrderSuccess] = React.useState(false);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    await onSubmitTicket(ticketSubject, ticketMsg);
    setTicketSubject('');
    setTicketMsg('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicePriceMap: Record<string, number> = {
      'AI Agent Fleet Deployment': 45000,
      'Custom LLM Fine-Tuning & Integration': 35000,
      'Full-Stack Web & Mobile Operating System': 55000,
      'Managed AI Optimization & Monthly Retainer': 15000
    };
    const price = servicePriceMap[selectedService] || 30000;

    await onCreateInvoice({
      clientName: 'Client Portal User',
      amount: price,
      items: [{ description: `${selectedService} - ${orderNotes || 'Self-Service Order'}`, qty: 1, unitPrice: price }]
    });

    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Self-Service Client Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Client Portal & Project Command
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Track project milestones, access invoices, submit support tickets, download deliverable files, and order custom AI solutions.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('order')}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Order New AI Service</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'projects'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderCheck className="w-4 h-4" />
          <span>My Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'invoices'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Invoices & Billing ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'documents'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Deliverables Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'support'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support Desk ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('order')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'order'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Order Service</span>
        </button>
      </div>

      {/* Tab 1: My Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.map(proj => (
            <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {proj.status}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{proj.name}</h3>
                  <p className="text-xs text-slate-400">Client: {proj.clientName}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Completion Progress</span>
                  <p className="text-xl font-extrabold text-emerald-400">{proj.progress}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-slate-400 mb-1">Assigned Human Specialists</h4>
                  <ul className="space-y-1">
                    {proj.assignedStaff.map((staff, idx) => (
                      <li key={idx} className="flex items-center text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mr-2" /> {staff}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-slate-400 mb-1">Assigned Hermes AI Agents</h4>
                  <ul className="space-y-1">
                    {proj.assignedAgents.map((ag, idx) => (
                      <li key={idx} className="flex items-center text-slate-200">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 mr-2" /> {ag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Account Invoices & Statements</h3>
            <span className="text-xs text-slate-400">Instant Checkout Enabled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">{inv.items[0]?.description || 'Service Invoice'}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400 text-sm">${inv.amount.toLocaleString()}</td>
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
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          Pay Invoice Now
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Deliverables Vault */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Client Deliverables & Document Vault</h3>
            <button className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload File</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Business_HUB_OS_Architecture_Blueprint.pdf', size: '4.2 MB', date: '2026-08-05' },
              { name: 'Hermes_AI_Workforce_API_Credentials.json', size: '12 KB', date: '2026-08-06' },
              { name: 'Q3_AI_Readiness_Audit_Report.pdf', size: '2.8 MB', date: '2026-08-07' }
            ].map((file, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between text-xs hover:border-slate-700 transition-all">
                <div>
                  <h4 className="font-semibold text-slate-200 line-clamp-1">{file.name}</h4>
                  <p className="text-[10px] text-slate-500">{file.size} • Uploaded {file.date}</p>
                </div>
                <button className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Support Desk */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Submit Technical Support Ticket</h3>
            
            {ticketSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs">
                Ticket submitted successfully! Hermes Support Specialist is responding.
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject / Query Title</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question regarding custom LLM API rate limits"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Describe your issue or technical requirement..."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                Open Support Ticket
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Active Tickets</h3>
            {tickets.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-400">{t.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-white">{t.subject}</h4>
                <p className="text-slate-400 text-[11px]">Last message: {t.messages[t.messages.length - 1]?.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Order Service */}
      {activeTab === 'order' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Order Custom AI Service & Automation</h3>
            <p className="text-xs text-slate-400">Instant order creation triggers Hermes AI Workforce onboarding.</p>
          </div>

          {orderSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs">
              Order placed! Invoice generated and Hermes Solutions Architect notified.
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Service Package</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="AI Agent Fleet Deployment">AI Agent Fleet Deployment ($45,000)</option>
                <option value="Custom LLM Fine-Tuning & Integration">Custom LLM Fine-Tuning & Integration ($35,000)</option>
                <option value="Full-Stack Web & Mobile Operating System">Full-Stack Web & Mobile Operating System ($55,000)</option>
                <option value="Managed AI Optimization & Monthly Retainer">Managed AI Optimization & Retainer ($15,000/mo)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Custom Project Notes / Objectives</label>
              <textarea
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Specific requirements, legacy tech stack, or integration targets..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              Submit Order & Launch Onboarding
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
