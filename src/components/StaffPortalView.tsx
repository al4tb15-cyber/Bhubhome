import React, { useState, useEffect } from 'react';
import { Project, StaffPayrollRecord, DailyBlogPost } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Zap,
  DollarSign,
  CreditCard,
  FileText,
  Send,
  Building,
  Briefcase,
  Newspaper,
  Bot
} from 'lucide-react';

interface StaffPortalProps {
  projects: Project[];
}

export const StaffPortalView: React.FC<StaffPortalProps> = ({ projects }) => {
  const [selectedProj, setSelectedProj] = React.useState<Project | null>(projects[0] || null);
  const [loggedHours, setLoggedHours] = React.useState('4.5');
  const [logNotes, setLogNotes] = React.useState('');
  const [logsList, setLogsList] = React.useState([
    { id: 'log-1', staff: 'Alex Rivers', hours: 4.5, notes: 'Implemented Event Bus webhook listeners in Express backend.', date: '2026-08-08' },
    { id: 'log-2', staff: 'Samantha Wu', hours: 3.0, notes: 'Automated E2E penetration testing suite for API Gateway.', date: '2026-08-07' }
  ]);

  // Payroll State
  const [payrollRecords, setPayrollRecords] = useState<StaffPayrollRecord[]>([]);
  const [isDispersing, setIsDispersing] = useState(false);
  const [dispersalSuccess, setDispersalSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sprints' | 'payroll' | 'news-publisher'>('sprints');

  // Business & Tech News Publisher State (Backend Staff Only)
  const [articleTopic, setArticleTopic] = useState('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [publishedArticles, setPublishedArticles] = useState<DailyBlogPost[]>([]);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPayrollRecords();
    fetchPublishedArticles();
  }, []);

  const fetchPublishedArticles = async () => {
    try {
      const res = await fetch('/api/public/daily-posts');
      if (res.ok) {
        const data = await res.json();
        if (data.posts) setPublishedArticles(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetTopic = articleTopic.trim() || '2026 Guide to Enterprise AI Agent Fleets & Process Automation';
    setIsGeneratingArticle(true);
    setPublishSuccessMessage(null);
    try {
      const res = await fetch('/api/public/daily-posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts) setPublishedArticles(data.posts);
        setArticleTopic('');
        setPublishSuccessMessage(`Successfully synthesized & published article: "${data.post?.title || targetTopic}" authored by Business HUB AI Agent!`);
      }
    } catch (err) {
      console.error('Failed to publish article:', err);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  const fetchPayrollRecords = async () => {
    try {
      const res = await fetch('/api/staff/payroll');
      if (res.ok) {
        const data = await res.json();
        if (data.payrollRecords) {
          setPayrollRecords(data.payrollRecords);
        }
      }
    } catch (err) {
      console.error('Failed to fetch staff payroll:', err);
    }
  };

  const handleDispersePayroll = async () => {
    setIsDispersing(true);
    setDispersalSuccess(null);
    try {
      const res = await fetch('/api/staff/payroll/disperse', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.payrollRecords) {
          setPayrollRecords(data.payrollRecords);
          setDispersalSuccess(`Monthly payroll executed! Total $${data.payrollRecords.reduce((acc: number, r: StaffPayrollRecord) => acc + r.monthlyNetPay, 0).toLocaleString()} dispersed via ACH Direct Deposit.`);
        }
      }
    } catch (err) {
      console.error('Payroll dispersal failed:', err);
    } finally {
      setIsDispersing(false);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes) return;
    setLogsList([
      { id: `log-${Date.now()}`, staff: 'Alex Rivers', hours: Number(loggedHours), notes: logNotes, date: new Date().toISOString().split('T')[0] },
      ...logsList
    ]);
    setLogNotes('');
  };

  const totalMonthlyPayout = payrollRecords.reduce((acc, r) => acc + r.monthlyNetPay, 0);
  const totalTaxWithheld = payrollRecords.reduce((acc, r) => acc + r.taxWithheldMonthly, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Staff Delivery Workspace & Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Staff Portal & Payroll Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Manage sprint deliverables, log delivery hours, review salary allocations, and process staff payroll distributions.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto font-mono text-xs flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('sprints')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'sprints' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Sprint Deliverables</span>
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'payroll' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Staff Payroll ({payrollRecords.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('news-publisher')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'news-publisher' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>News & Article Publisher</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'sprints' ? (
        /* Main Grid: Projects Sprint Board + Time Logger */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sprint Projects List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-white text-sm">Active Delivery Engagements</h3>

            {projects.map(proj => {
              const isSelected = selectedProj?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProj(proj)}
                  className={`bg-slate-900 border rounded-2xl p-5 cursor-pointer transition-all space-y-3 ${
                    isSelected ? 'border-cyan-500 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {proj.status}
                      </span>
                      <h4 className="font-bold text-white text-base mt-1">{proj.name}</h4>
                      <p className="text-xs text-slate-400">{proj.clientName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Progress</span>
                      <p className="text-lg font-bold text-emerald-400">{proj.progress}%</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full" style={{ width: `${proj.progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Tasks Completed: <strong className="text-slate-200">{proj.tasksCompleted} / {proj.tasksTotal}</strong></span>
                    <span>Target Date: <strong className="text-slate-200">{proj.dueDate}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Logger & AI Agent Collab (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Log Delivery Hours</h3>

              <form onSubmit={handleAddLog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hours Spent</label>
                  <input
                    type="number"
                    step="0.5"
                    value={loggedHours}
                    onChange={(e) => setLoggedHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Work Description</label>
                  <textarea
                    rows={3}
                    required
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Describe sprint tasks completed or AI Agent prompt fine-tuning..."
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all"
                >
                  Log Hours
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Recent Sprint Time Logs</h3>
              <div className="space-y-2 text-xs">
                {logsList.map(log => (
                  <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-semibold">
                      <span>{log.staff}</span>
                      <span className="text-cyan-400">{log.hours} hrs • {log.date}</span>
                    </div>
                    <p className="text-slate-300">{log.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'payroll' ? (
        /* Staff Payroll Workspace */
        <div className="space-y-6">
          {dispersalSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{dispersalSuccess}</span>
            </div>
          )}

          {/* Payroll KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Monthly Net Payroll</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">${totalMonthlyPayout.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">ACH Direct Deposit Ready</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Tax Withholding</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">${totalTaxWithheld.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Federal & State Tax Reserve</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Active Staff Headcount</div>
              <div className="text-2xl font-bold text-white font-mono">{payrollRecords.length} Staff</div>
              <div className="text-[10px] text-slate-500">100% Verified Bank Accounts</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 flex flex-col justify-between">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Payroll Execution</div>
              <button
                onClick={handleDispersePayroll}
                disabled={isDispersing}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl transition-all font-mono flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispersing ? 'Processing...' : 'Run & Disperse Payroll'}</span>
              </button>
            </div>
          </div>

          {/* Staff Payroll Roster Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Staff Salary & Dispersal Register</h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Pay Period: Aug 1 - Aug 31, 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">Staff Name</th>
                    <th className="py-3 px-3">Role & Dept</th>
                    <th className="py-3 px-3">Base Salary</th>
                    <th className="py-3 px-3">Monthly Net</th>
                    <th className="py-3 px-3">Tax Reserve</th>
                    <th className="py-3 px-3">Bonus</th>
                    <th className="py-3 px-3">Direct Deposit</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Paystub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {payrollRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{rec.staffName}</td>
                      <td className="py-3 px-3 text-slate-400">
                        <div>{rec.roleTitle}</div>
                        <div className="text-[10px] text-slate-500">{rec.department}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">${rec.baseSalaryYearly.toLocaleString()}/yr</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">${rec.monthlyNetPay.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">${rec.taxWithheldMonthly.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-amber-400">+${rec.bonusAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-slate-400 flex items-center space-x-1 mt-2">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>•••• {rec.bankAccountLast4}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          rec.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => alert(`Paystub generated for ${rec.staffName} (${rec.payPeriod}). Total Dispersed: $${rec.monthlyNetPay.toLocaleString()}`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-[10px] transition-colors"
                        >
                          View Stub
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Business & Tech News Article Publisher View (Admin & Staff Only) */
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span>BACKEND PUBLISHING SUITE &bull; AUTHOR: Business HUB AI Agent</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Business & Tech News — Staff & Admin Article Generator
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Public visitors view these published articles on the corporate website. Only authorized staff and admins can synthesize and publish new help articles here in the backend.
                </p>
              </div>

              <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-sky-400 flex items-center space-x-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span>Default Author: Business HUB AI Agent</span>
              </div>
            </div>

            {publishSuccessMessage && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono">
                ✓ {publishSuccessMessage}
              </div>
            )}

            {/* Article Creation Form */}
            <form onSubmit={handlePublishArticle} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Article Topic or Keyword Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={articleTopic}
                    onChange={(e) => setArticleTopic(e.target.value)}
                    placeholder="e.g. Scaling B2B Lead Conversion with Autonomous AI Agents, SOC2 Compliance Frameworks..."
                    className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-500 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingArticle}
                    className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-black font-mono text-xs font-bold uppercase rounded-xl transition-colors flex items-center space-x-2 shrink-0 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingArticle ? 'Synthesizing...' : 'Synthesize & Publish'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Generates an SEO-optimized business help article with author metadata set to "Business HUB AI Agent".
                </p>
              </div>
            </form>
          </div>

          {/* Published Articles List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-sky-400" />
                <span>Live Public Articles ({publishedArticles.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Status: Live on Website</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedArticles.map((art) => (
                <div key={art.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase">
                        {art.category}
                      </span>
                      <span className="text-slate-500">{art.publishedAt}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-2">{art.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{art.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-sky-400 font-bold">{art.authorAgent || 'Business HUB AI Agent'}</span>
                    <span className="text-emerald-400 text-[10px] font-bold uppercase">✓ Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
