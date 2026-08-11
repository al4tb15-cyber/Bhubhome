import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Globe, 
  FileText, 
  Bot, 
  ArrowRight, 
  Lock, 
  Clock, 
  Cpu, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { PackageOrderRequest } from '../types';

interface PackageCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: {
    name: string;
    tier: 'Starter' | 'Pro Scale' | 'Enterprise';
    price: number;
    description: string;
    features: string[];
  } | null;
  onOrderCompleted?: (order: PackageOrderRequest) => void;
}

export const PackageCheckoutModal: React.FC<PackageCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<'details' | 'executing' | 'completed'>('details');

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<'Stripe / Credit Card' | 'Corporate Invoice / ACH' | 'Crypto / Web3' | 'PayPal'>('Stripe / Credit Card');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessGoals, setBusinessGoals] = useState('');
  const [aiAgentInstructions, setAiAgentInstructions] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([
    'CRM Sync', 
    'Email & Webhooks'
  ]);
  const [contextDocs, setContextDocs] = useState('');

  // Processing & Execution Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PackageOrderRequest | null>(null);

  if (!isOpen || !selectedPackage) return null;

  const toggleIntegration = (item: string) => {
    setSelectedIntegrations(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactEmail.trim() || !businessGoals.trim()) {
      alert('Please fill in Company Name, Contact Email, and Business Goals so our AI Agents can build your system.');
      return;
    }

    setIsSubmitting(true);
    setStep('executing');

    try {
      const payload = {
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        paymentMethod,
        companyName,
        contactName: contactName || 'Valued Partner',
        contactEmail,
        contactPhone,
        websiteUrl,
        businessGoals,
        aiAgentInstructions: aiAgentInstructions || 'Professional, authoritative, high-efficiency business tone.',
        integrationsNeeded: selectedIntegrations,
        uploadedContextDocs: contextDocs
      };

      const res = await fetch('/api/packages/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setCompletedOrder(data.order);
          if (onOrderCompleted) onOrderCompleted(data.order);
        }
      }
    } catch (err) {
      console.error('Failed to submit package order:', err);
    } finally {
      setIsSubmitting(false);
      setStep('completed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-white my-8">
        
        {/* Header Strip */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-500 rounded flex items-center justify-center text-black font-bold font-mono">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant AI Agent Fleet Setup</span>
              </div>
              <h2 className="text-xl font-serif italic text-white">
                {selectedPackage.name} <span className="text-sky-400 not-italic font-sans text-sm font-bold">(${selectedPackage.price.toLocaleString()}/mo)</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">

          {/* STEP 1: FORM & INFORMATION COLLECTION */}
          {step === 'details' && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Package Summary Box */}
              <div className="bg-zinc-900/50 border border-sky-500/30 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">Tier: {selectedPackage.tier}</span>
                  <h4 className="text-base font-bold text-white">{selectedPackage.name}</h4>
                  <p className="text-xs text-white/70">{selectedPackage.description}</p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xl font-serif text-sky-400 font-light">${selectedPackage.price.toLocaleString()} <span className="text-xs font-sans text-white/50">/ month</span></div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-end space-x-1 mt-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Instant AI Build & Human QA Gate</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-white/80 uppercase">
                  1. Payment Gateway & Billing Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'Stripe / Credit Card', label: 'Stripe Card', icon: CreditCard },
                    { id: 'Corporate Invoice / ACH', label: 'ACH / Invoice', icon: Building2 },
                    { id: 'Crypto / Web3', label: 'Crypto / USDC', icon: Cpu },
                    { id: 'PayPal', label: 'PayPal', icon: Lock }
                  ].map(pm => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-lg border text-left flex items-center space-x-2 transition-all text-xs font-mono ${
                          isSelected 
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold' 
                            : 'bg-zinc-900/40 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Information Collection Section */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>2. Client & Project Information for AI Agents</span>
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Our AI Agents will immediately read this data to build your system architecture, prompt templates, and integration workflows.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">Company / Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Global Logistics"
                      className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="sarah@acme.com"
                      className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">Primary Website / App URL</label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="https://acme.com"
                      className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* Detailed Business Goals */}
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Business Goals & Operational Processes to Automate *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={businessGoals}
                    onChange={e => setBusinessGoals(e.target.value)}
                    placeholder="Describe what you want our AI Agents to handle (e.g. automate client lead triage, qualify inbound prospects, book calendar appointments, sync data with HubSpot/Salesforce)..."
                    className="w-full bg-zinc-950 border border-white/20 text-white text-xs p-3 rounded focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* AI Agent Guidelines */}
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    AI Agent Tone & Custom Rules (Optional)
                  </label>
                  <input
                    type="text"
                    value={aiAgentInstructions}
                    onChange={e => setAiAgentInstructions(e.target.value)}
                    placeholder="e.g. Highly professional tone, never give legal advice, focus on booking qualified strategy calls."
                    className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Integration Checkboxes */}
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-2">
                    Integrations Required
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'CRM Sync', 
                      'Email & Webhooks', 
                      'WhatsApp Integration', 
                      'Slack / Teams Bot', 
                      'Custom REST API', 
                      'Vector Database Search'
                    ].map(intg => {
                      const active = selectedIntegrations.includes(intg);
                      return (
                        <button
                          key={intg}
                          type="button"
                          onClick={() => toggleIntegration(intg)}
                          className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 border transition-colors ${
                            active 
                              ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold' 
                              : 'bg-zinc-950 border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${active ? 'opacity-100' : 'opacity-20'}`} />
                          <span>{intg}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Knowledge Base Context */}
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Knowledge Base Link or Context Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={contextDocs}
                    onChange={e => setContextDocs(e.target.value)}
                    placeholder="e.g. Paste link to company FAQ, product documentation, or onboarding manual..."
                    className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Workflow Notice */}
              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs font-mono space-y-1">
                <div className="flex items-center space-x-2 text-sky-300 font-bold">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Instant AI Execution & Human Review Assurance</span>
                </div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Upon payment confirmation, our Hermes AI Agents instantly process your goals and generate the solution architecture, agent prompts, and workflows. Before handing over to your client portal, our Senior Human Staff will review and refine the deliverables.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div className="text-xs font-mono text-white/50">
                  Total Due Now: <span className="text-sky-400 font-bold">${selectedPackage.price.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pay & Trigger Instant AI Execution</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: INSTANT AI AGENT EXECUTION LOADING STATE */}
          {step === 'executing' && (
            <div className="py-16 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-sky-500/20 border border-sky-500 rounded-full flex items-center justify-center mx-auto relative animate-pulse">
                <Bot className="w-8 h-8 text-sky-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-white">
                  Hermes AI Agents Building System...
                </h3>
                <p className="text-xs font-mono text-sky-400">
                  Synthesizing architecture, agent system prompts, and CRM event triggers for {companyName || 'your enterprise'}.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-lg border border-white/10 text-left font-mono text-[11px] space-y-2 text-white/60">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment Confirmed via {paymentMethod}</span>
                </div>
                <div className="flex items-center space-x-2 text-sky-400 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hermes Architect Specialist parsing goals...</span>
                </div>
                <div className="flex items-center space-x-2 text-white/40">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Generating agent prompt templates...</span>
                </div>
                <div className="flex items-center space-x-2 text-white/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Routing artifacts to Human QA Review gate...</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COMPLETED AI EXECUTION & HUMAN REVIEW NOTIFICATION */}
          {step === 'completed' && completedOrder && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/40 p-6 rounded-lg space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Instant AI Execution Completed & Routed to Human Review</span>
                </div>

                <h3 className="text-xl font-serif italic text-white">
                  Package Order #{completedOrder.id} Active
                </h3>

                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  All AI Agent work has been carried out instantly! Your system architecture, agent system prompts, and automated workflows have been synthesized. They are now placed in our <strong className="text-sky-400 font-mono">Senior Human Staff Review Pipeline</strong>.
                </p>
              </div>

              {/* Instant Artifacts Generated by AI */}
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-lg space-y-4">
                <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span>AI Generated System Artifacts</span>
                </h4>

                {completedOrder.aiGeneratedArtifacts && (
                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <span className="font-mono text-white/50 text-[10px] uppercase font-bold block mb-1">Architecture Summary</span>
                      <p className="text-white/90 bg-zinc-950 p-3 rounded border border-white/10">
                        {completedOrder.aiGeneratedArtifacts.systemArchitectureSummary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-mono text-white/50 text-[10px] uppercase font-bold block mb-1">Configured AI Agents</span>
                        <ul className="space-y-1 font-mono text-[11px]">
                          {completedOrder.aiGeneratedArtifacts.configuredAgents.map((ag, i) => (
                            <li key={i} className="flex items-center space-x-1.5 text-sky-300">
                              <Bot className="w-3.5 h-3.5 text-sky-400" />
                              <span>{ag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-mono text-white/50 text-[10px] uppercase font-bold block mb-1">Automated Workflows</span>
                        <ul className="space-y-1 font-mono text-[11px]">
                          {completedOrder.aiGeneratedArtifacts.generatedWorkflows.map((wf, i) => (
                            <li key={i} className="flex items-center space-x-1.5 text-emerald-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{wf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Workflow Status Box */}
              <div className="bg-zinc-950 border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase">Current Workflow Stage</span>
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Status: Pending Human Quality Review</span>
                  </div>
                </div>

                <div className="text-xs text-white/60 text-right">
                  Our staff will complete QA & hand over credentials within 1-2 hours.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
