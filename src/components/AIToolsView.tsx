import React from 'react';
import { AIToolAssessmentResult } from '../types';
import { 
  Sparkles, 
  BarChart2, 
  Search, 
  Calculator, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  Zap
} from 'lucide-react';

interface AIToolsViewProps {
  onRunAssessment: (data: any) => Promise<AIToolAssessmentResult>;
  onSelectTab: (tab: string) => void;
}

export const AIToolsView: React.FC<AIToolsViewProps> = ({
  onRunAssessment,
  onSelectTab
}) => {
  const [activeTool, setActiveTool] = React.useState<'readiness' | 'seo' | 'roi' | 'proposal'>('readiness');

  // Readiness Form State
  const [companyName, setCompanyName] = React.useState('');
  const [industry, setIndustry] = React.useState('Technology & Logistics');
  const [companySize, setCompanySize] = React.useState('20-100 employees');
  const [techStack, setTechStack] = React.useState('React, Node.js, PostgreSQL, Google Workspace');
  const [primaryGoal, setPrimaryGoal] = React.useState('Automate customer onboarding and support');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [assessmentResult, setAssessmentResult] = React.useState<AIToolAssessmentResult | null>(null);

  // SEO Tool State
  const [websiteUrl, setWebsiteUrl] = React.useState('https://acmelogistics.com');
  const [seoResult, setSeoResult] = React.useState<any>(null);

  // ROI Calculator State
  const [teamSize, setTeamSize] = React.useState(15);
  const [avgSalary, setAvgSalary] = React.useState(85000);
  const [manualPercent, setManualPercent] = React.useState(35);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await onRunAssessment({
        companyName,
        industry,
        companySize,
        currentTechStack: techStack,
        primaryGoal
      });
      setAssessmentResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoResult({
      url: websiteUrl,
      overallScore: 78,
      speedIndex: '1.2s (Fast)',
      seoHealth: 'Good (3 Warnings)',
      aiReadiness: 'Sub-Optimal Schema Markup',
      recommendations: [
        'Inject JSON-LD Schema for AI Agent indexing.',
        'Optimize mobile viewport layout and LCP fonts.',
        'Add structured FAQ markup for LLM discovery.'
      ]
    });
  };

  // ROI Math
  const annualTeamCost = teamSize * avgSalary;
  const wastedCost = annualTeamCost * (manualPercent / 100);
  const estimatedSavings = wastedCost * 0.70; // 70% automation factor

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive Lead Generation & AI Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Free AI Enterprise Tools
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Diagnostic scanners and calculators designed to evaluate company AI readiness, calculate automation ROI, and generate custom proposals.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTool('readiness')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTool === 'readiness'
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white">AI Readiness Assessment</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400">Complete technical AI maturity audit & roadmap.</p>
        </button>

        <button
          onClick={() => setActiveTool('seo')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTool === 'seo'
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white">Website & SEO Audit</span>
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400">Scan domain performance & AI LLM indexing schema.</p>
        </button>

        <button
          onClick={() => setActiveTool('roi')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTool === 'roi'
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white">AI Automation ROI Calculator</span>
            <Calculator className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400">Calculate annual labor savings & efficiency gains.</p>
        </button>

        <button
          onClick={() => setActiveTool('proposal')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTool === 'proposal'
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white">Proposal Builder</span>
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400">Generate custom Business HUB OS proposal specs.</p>
        </button>
      </div>

      {/* Tool 1: AI Readiness Assessment */}
      {activeTool === 'readiness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-white text-base">Business AI Readiness Assessment</h3>
            <p className="text-xs text-slate-400">
              Provide your company profile below to trigger an instant diagnostic analysis by Hermes Discovery Consultant.
            </p>

            <form onSubmit={handleAssessmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Logistics Corp"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Size</label>
                  <input
                    type="text"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Operational Objective</label>
                <textarea
                  rows={2}
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Hermes Discovery Consultant Auditing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Readiness Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 space-y-4">
            {assessmentResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">AI Maturity Score</h4>
                    <p className="text-xs text-slate-400">{assessmentResult.maturityLevel}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-cyan-400">{assessmentResult.overallScore}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <h5 className="font-semibold text-emerald-400 mb-1 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Key Architectural Strengths
                    </h5>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                      {assessmentResult.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-amber-400 mb-1 flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Primary Operational Bottlenecks
                    </h5>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                      {assessmentResult.bottlenecks?.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-cyan-400 mb-1">Recommended Solution Packages</h5>
                    <div className="space-y-2">
                      {assessmentResult.recommendedSolutions?.map((sol, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span>{sol.title}</span>
                            <span className="text-emerald-400">{sol.estimatedROI}</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{sol.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab('crm')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl border border-slate-700 text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Book Consultation with Hermes Discovery Architect</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3 h-full flex flex-col items-center justify-center">
                <Cpu className="w-12 h-12 text-slate-700 animate-pulse" />
                <h4 className="font-bold text-slate-300 text-sm">Awaiting Company Input</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Fill in the form on the left to trigger real-time AI technical evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 2: SEO & Website Audit */}
      {activeTool === 'seo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-white text-base">Website & AI LLM Indexing Audit</h3>

          <form onSubmit={handleSeoSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourcompany.com"
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
            >
              Scan Domain
            </button>
          </form>

          {seoResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-mono text-cyan-400 font-bold">{seoResult.url}</span>
                <span className="text-emerald-400 font-bold text-base">Score: {seoResult.overallScore}/100</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-slate-300">
                <div>
                  <span className="text-slate-500">Speed Index:</span>
                  <p className="font-bold text-slate-100">{seoResult.speedIndex}</p>
                </div>
                <div>
                  <span className="text-slate-500">SEO Health:</span>
                  <p className="font-bold text-slate-100">{seoResult.seoHealth}</p>
                </div>
                <div>
                  <span className="text-slate-500">AI Schema Status:</span>
                  <p className="font-bold text-amber-400">{seoResult.aiReadiness}</p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white mb-2">Recommendations for AI LLM Search Indexing:</h5>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {seoResult.recommendations.map((r: string, idx: number) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 3: AI Automation ROI Calculator */}
      {activeTool === 'roi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="font-bold text-white text-base">AI Process Automation ROI Calculator</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Team Size (Employees)</label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Avg Annual Salary ($)</label>
              <input
                type="number"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Manual Repetitive Task Time (%)</label>
              <input
                type="number"
                value={manualPercent}
                onChange={(e) => setManualPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-xs text-slate-400">Total Annual Payroll</span>
              <p className="text-2xl font-bold text-white mt-1">${annualTeamCost.toLocaleString()}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400">Manual Overhead Expense</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">${wastedCost.toLocaleString()}</p>
            </div>

            <div>
              <span className="text-xs text-emerald-400 font-bold">Estimated 12-Mo AI Savings</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">${estimatedSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: Proposal Builder */}
      {activeTool === 'proposal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-white text-base">Instant Proposal Builder</h3>
          <p className="text-slate-400">Generate an executive proposal brief powered by Business HUB OS Solution Architect.</p>
          
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-cyan-300">
            <h4 className="font-sans font-bold text-white text-sm">PROPOSAL BRIEF: Business HUB OS Enterprise Deployment</h4>
            <p className="font-sans text-slate-300">Scope: Custom Event Bus, Hermes AI Workforce (18 Agents), Native CRM Integration, and Client Self-Service Portal.</p>
            <p className="font-sans text-emerald-400 font-bold">Estimated Timeline: 4 Weeks • Investment: $45,000</p>
          </div>
        </div>
      )}
    </div>
  );
};
