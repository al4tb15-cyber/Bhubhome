import React, { useState, useEffect } from 'react';
import { DailyBlogPost, AIConsultationEvaluation, PackageOrderRequest } from '../types';
import { PackageCheckoutModal } from './PackageCheckoutModal';
import { DeploymentGuideModal } from './DeploymentGuideModal';
import { 
  ArrowRight, 
  Bot, 
  Briefcase, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Code2, 
  Cpu, 
  Globe, 
  Layers, 
  MessageSquare, 
  Rocket, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  Zap,
  Star,
  Calendar,
  X,
  Coins,
  DollarSign,
  Users,
  Clock,
  Send,
  CheckCircle,
  Newspaper,
  BookOpen,
  Tag,
  Share2,
  Mic,
  Volume2,
  VolumeX,
  PhoneCall,
  BrainCircuit,
  MessageSquareCode,
  FileCheck
} from 'lucide-react';

interface PublicWebsiteProps {
  onSelectTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteProps> = ({
  onSelectTab,
  onOpenAIAssistant
}) => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  // Lead Booking Form State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadService, setLeadService] = useState('AI Automation & Agentic Systems');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // AI Strategy Call & Feasibility Evaluator State
  const [inquiryText, setInquiryText] = useState('');
  const [isEvaluatingFeasibility, setIsEvaluatingFeasibility] = useState(false);
  const [consultationEvaluation, setConsultationEvaluation] = useState<AIConsultationEvaluation | null>(null);

  // AI Talking Agent Modal State
  const [showTalkingAgentModal, setShowTalkingAgentModal] = useState(false);
  const [isTalkingAgentSpeaking, setIsTalkingAgentSpeaking] = useState(true);

  // Package Checkout & Deployment Guide State
  const [checkoutPackage, setCheckoutPackage] = useState<{
    name: string;
    tier: 'Starter' | 'Pro Scale' | 'Enterprise';
    price: number;
    description: string;
    features: string[];
  } | null>(null);
  const [showDeploymentGuideModal, setShowDeploymentGuideModal] = useState(false);

  const handleEvaluateFeasibility = async (promptOverride?: string) => {
    const targetInquiry = promptOverride || inquiryText || 'Looking to deploy an AI agent workforce for lead response and automated CRM sync';
    setIsEvaluatingFeasibility(true);
    try {
      const res = await fetch('/api/public/ai-consultation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryText: targetInquiry,
          clientName: leadName,
          companyName: leadCompany,
          clientEmail: leadEmail,
          serviceInterest: leadService
        })
      });
      if (res.ok) {
        const evalData: AIConsultationEvaluation = await res.json();
        setConsultationEvaluation(evalData);
        if (evalData.prefilledForm) {
          if (evalData.prefilledForm.serviceInterest) setLeadService(evalData.prefilledForm.serviceInterest);
          setLeadNotes(evalData.prefilledForm.notes);
        }
      }
    } catch (err) {
      console.error('Failed to evaluate consultation feasibility:', err);
    } finally {
      setIsEvaluatingFeasibility(false);
    }
  };

  const handleStartTalkingAgent = () => {
    setShowTalkingAgentModal(true);
    setIsTalkingAgentSpeaking(true);
    if (!consultationEvaluation) {
      handleEvaluateFeasibility();
    }
  };

  // Interactive ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(15);
  const [avgHourlyRate, setAvgHourlyRate] = useState<number>(45);
  const [manualHoursPerWeek, setManualHoursPerWeek] = useState<number>(12);

  // Daily AI-Curated SEO Posts State
  const [dailyPosts, setDailyPosts] = useState<DailyBlogPost[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<DailyBlogPost | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [customPostTopic, setCustomPostTopic] = useState('');

  useEffect(() => {
    fetchDailyPosts();
  }, []);

  const fetchDailyPosts = async () => {
    try {
      const res = await fetch('/api/public/daily-posts');
      if (res.ok) {
        const data = await res.json();
        if (data.posts) {
          setDailyPosts(data.posts);
        }
      }
    } catch (err) {
      console.error('Failed to fetch daily posts:', err);
    }
  };

  const handleGenerateFreshPost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingPost(true);
    try {
      const res = await fetch('/api/public/daily-posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customPostTopic || 'Autonomous Agent Workforces & Enterprise AI Scaling' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts) {
          setDailyPosts(data.posts);
        }
        setCustomPostTopic('');
      }
    } catch (err) {
      console.error('Failed to generate daily post:', err);
    } finally {
      setIsGeneratingPost(false);
    }
  };

  // Calculations
  const monthlyManualCost = teamSize * manualHoursPerWeek * 4 * avgHourlyRate;
  const estimatedSavingsPercent = 0.70; // 70% automation savings
  const monthlySavings = Math.round(monthlyManualCost * estimatedSavingsPercent);
  const annualSavings = monthlySavings * 12;

  const services = [
    {
      id: 'ai-automation',
      title: 'Automated Operations & AI Team',
      icon: Bot,
      badge: 'Most Popular',
      shortDesc: 'Deploy a 24/7 AI workforce to automatically handle sales inquiries, customer support, and invoice processing.',
      overview: 'Transform repetitive daily tasks into automated workflows. Our AI team works around the clock to qualify leads, send quotes, and respond to customers in seconds.',
      benefits: ['Save up to 70% in operational costs', 'Instant 24/7 response time for new leads', 'Zero administrative data entry errors'],
      features: ['24/7 AI Sales & Support Representatives', 'Automated Email & Quote Sequences', 'Real-Time Workflow Trigger Engine', 'Human Manager Review & Control'],
      pricing: 'From $2,500 / Month',
      faqs: [
        { q: 'Will AI replace our staff?', a: 'No, it empowers your team by eliminating tedious repetitive work so staff can focus on high-value client relationships.' }
      ]
    },
    {
      id: 'web-app-dev',
      title: 'Custom Web & Mobile Apps',
      icon: Code2,
      badge: 'High Impact',
      shortDesc: 'Modern, ultra-fast web platforms and mobile apps tailored specifically to your business goals.',
      overview: 'We design and build bespoke client portals, mobile applications, and internal staff tools that delight users and drive recurring revenue.',
      benefits: ['Lightning-fast page load speed', 'Full ownership of all custom code', 'Seamless mobile and desktop experience'],
      features: ['Custom Client & Partner Portals', 'iOS & Android Mobile Applications', 'Secure Customer Dashboards', 'Stripe & Payment Gateway Integration'],
      pricing: 'From $15,000 / Project',
      faqs: [
        { q: 'Who owns the final application code?', a: 'You own 100% of the code, intellectual property, and design assets.' }
      ]
    },
    {
      id: 'ai-consulting',
      title: 'Strategic Business AI Consulting',
      icon: Cpu,
      badge: 'Executive Level',
      shortDesc: 'Clear, step-by-step roadmaps to integrate AI safely into your company without technical headache.',
      overview: 'Unsure where AI fits into your business? We audit your current operations and provide a clear, practical implementation plan with guaranteed ROI.',
      benefits: ['Identify high-value automation opportunities', 'Avoid costly software mistakes', 'Guarantee data privacy and compliance'],
      features: ['Operational Bottleneck Audit', 'Custom AI Roadmap & Tool Selection', 'Executive & Staff Training Workshops', 'Security & Data Safeguard Review'],
      pricing: 'From $5,000 / Engagement',
      faqs: [
        { q: 'How long does an initial audit take?', a: 'Our discovery process takes just 1 to 2 weeks with clear, executive-ready deliverables.' }
      ]
    },
    {
      id: 'seo-growth',
      title: 'Search Engine Visibility & Lead Gen',
      icon: TrendingUp,
      badge: 'Revenue Growth',
      shortDesc: 'Get found on Google and modern AI search platforms like ChatGPT, Gemini, and Perplexity.',
      overview: 'Ensure your business ranks #1 on search engines and gets cited whenever potential clients search for solutions in your industry.',
      benefits: ['Consistent inbound sales inquiries', 'Top Google and AI Search rankings', 'Higher conversion rate from visitors'],
      features: ['High-Intent Keyword Strategy', 'Search Optimization for AI Search Tools', 'Thought Leadership Content Creation', 'Monthly Traffic & Lead Growth Reports'],
      pricing: 'From $3,000 / Month',
      faqs: [
        { q: 'What is AI Search Optimization?', a: 'We structure your website so new AI assistants recommend your business when clients ask for recommendations.' }
      ]
    }
  ];

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          company: leadCompany || 'Prospect Company',
          serviceInterest: leadService,
          estimatedValue: 25000,
          notes: leadNotes || 'Submitted via Public Website Consultation Booking modal'
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingSubmitted(true);
        setTimeout(() => {
          setBookingSubmitted(false);
          setShowBookingModal(false);
          setLeadName('');
          setLeadEmail('');
          setLeadCompany('');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to submit consultation request:', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 text-center space-y-8 bg-zinc-900/60 rounded-sm p-8 sm:p-14 border border-white/10 shadow-2xl overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SMART OPERATIONAL AUTOMATION FOR GROWING BUSINESSES</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-tight leading-tight max-w-5xl mx-auto italic">
          Automate Your Workflows & <span className="not-italic font-sans font-bold text-white">Scale Revenue</span> 24/7
        </h1>

        <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          We build custom web systems and autonomous AI teams that handle client onboarding, sales follow-ups, and support tasks so your staff can focus on strategy.
        </p>

        {/* AI Assisted Strategy Feasibility & Talking Agent Bar */}
        <div className="max-w-3xl mx-auto bg-[#050505]/90 border border-sky-500/30 rounded-lg p-5 text-left space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
              <BrainCircuit className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>AI-Assisted Feasibility & Strategy Call Builder</span>
            </div>
            <button
              onClick={handleStartTalkingAgent}
              className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded text-[11px] font-mono font-bold flex items-center space-x-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-300" />
              <span>Talk with AI Consultant</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="text-white/40 self-center">Try Example Inquiry:</span>
              {[
                'Instant E-Commerce Lead Follow-Up & CRM',
                'Automated Customer Support Ticket AI',
                'Custom Legacy SQL DB & AI Portal Migration'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInquiryText(chip);
                    handleEvaluateFeasibility(chip);
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-white/10 hover:border-sky-500/30 rounded transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inquiryText}
                onChange={e => setInquiryText(e.target.value)}
                placeholder="Describe what you want to automate or build (e.g., WhatsApp lead bot, CRM sync)..."
                className="w-full bg-zinc-900 border border-white/20 text-white text-xs rounded px-3 py-2.5 focus:outline-none focus:border-sky-400 font-sans"
              />

              <button
                onClick={() => handleEvaluateFeasibility()}
                disabled={isEvaluatingFeasibility}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs rounded transition-colors shrink-0 font-mono flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEvaluatingFeasibility ? 'Analyzing...' : 'Analyze Feasibility'}</span>
              </button>
            </div>
          </div>

          {/* Feasibility Result Evaluation Card */}
          {consultationEvaluation && (
            <div className="p-4 bg-zinc-900/90 border border-sky-500/40 rounded-sm space-y-3 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                    consultationEvaluation.canDoInstantly
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {consultationEvaluation.canDoInstantly ? '⚡ INSTANT FULFILLMENT READY' : '⏳ TIMELY CUSTOM ROADMAP'}
                  </span>
                  <span className="text-white/60 text-[11px]">&bull; {consultationEvaluation.estimatedTurnaround}</span>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[10px] rounded transition-colors"
                >
                  Book Pre-Filled Call &rarr;
                </button>
              </div>

              <p className="text-white/80 font-sans text-xs leading-relaxed">
                {consultationEvaluation.aiAssessmentMessage}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                <span className="text-white/40">Matched AI Agents:</span>
                {consultationEvaluation.recommendedAgentFleet.map((ag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-sky-500/10 text-sky-300 border border-sky-500/20 rounded">
                    {ag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-sm transition-all shadow-xl"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Book Strategy Call</span>
          </button>

          <button
            onClick={handleStartTalkingAgent}
            className="flex items-center space-x-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-sm transition-all font-mono"
          >
            <PhoneCall className="w-4 h-4 text-purple-300" />
            <span>Talk with AI Consultant</span>
          </button>

          <button
            onClick={() => onSelectTab('ai-tools')}
            className="flex items-center space-x-2 border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-sm transition-all font-mono"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Free AI Audit Tool</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-white/60 font-mono">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" /> 24/7 Automated Operations</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-sky-400 mr-2" /> Custom AI Workforce</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" /> Instant Client Portals</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Guaranteed 70% Time Savings</span>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">OUR SOLUTIONS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white italic">How We Grow Your Business</h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
            Select a service below to explore how we streamline operations and increase revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-zinc-900/60 border border-white/10 hover:border-sky-500/50 rounded-sm p-6 space-y-4 transition-all group cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-sm bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-white/5 text-sky-300 border border-white/10 uppercase">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors font-sans">
                  {service.title}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {service.shortDesc}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">{service.pricing}</span>
                  <span className="text-sky-400 flex items-center group-hover:translate-x-1 transition-transform">
                    View Details <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive ROI & Savings Calculator */}
      <section className="bg-zinc-900/80 border border-white/10 rounded-sm p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
            <Coins className="w-4 h-4" />
            <span>INTERACTIVE ROI CALCULATOR</span>
          </div>
          <h2 className="text-3xl font-serif font-light text-white italic">Calculate Your Operational Savings</h2>
          <p className="text-xs text-white/60 max-w-lg mx-auto font-sans">
            See how much your business can save every month by automating repetitive staff workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6 font-mono text-xs">
            <div>
              <div className="flex justify-between text-white/80 mb-2">
                <span>Team Size (Staff Members)</span>
                <span className="text-sky-400 font-bold">{teamSize} People</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-white/80 mb-2">
                <span>Average Hourly Rate ($/hr)</span>
                <span className="text-sky-400 font-bold">${avgHourlyRate} / hr</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={avgHourlyRate}
                onChange={e => setAvgHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-white/80 mb-2">
                <span>Repetitive Manual Work per Staff Member</span>
                <span className="text-sky-400 font-bold">{manualHoursPerWeek} hrs / week</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                value={manualHoursPerWeek}
                onChange={e => setManualHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>

          {/* Results Output Card */}
          <div className="lg:col-span-5 bg-[#050505] border border-emerald-500/30 p-6 rounded-sm space-y-4 text-center">
            <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest">
              PROJECTED AUTOMATION SAVINGS
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-serif text-emerald-400 font-light">
                ${monthlySavings.toLocaleString()}
              </div>
              <div className="text-xs text-white/60 mt-1 font-mono">Estimated Monthly Savings</div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-2xl font-serif text-white font-light">
                ${annualSavings.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/40 uppercase font-mono">12-Month Annual Return</div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs rounded-sm transition-colors mt-2"
            >
              Claim Your Automation Savings
            </button>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Packages */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">CLEAR & TRANSPARENT</span>
            <h2 className="text-3xl font-serif font-light text-white italic">Service Tiers</h2>
          </div>

          <button
            onClick={() => setShowDeploymentGuideModal(true)}
            className="px-4 py-2 bg-zinc-900 border border-sky-500/40 hover:border-sky-400 text-sky-300 font-mono text-xs font-bold uppercase rounded flex items-center space-x-2 self-start md:self-auto shadow-md transition-all"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Installation & Hosting Manual (cPanel / aaPanel / Local)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-sm space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase">Starter</span>
              <h3 className="text-2xl font-bold text-white mt-1">Growth Engine</h3>
              <p className="text-xs text-white/60 mt-2">Perfect for growing businesses looking to automate lead follow-ups and support.</p>
              <div className="text-3xl font-serif text-sky-400 font-light mt-4">$2,500 <span className="text-xs font-sans text-white/40">/ month</span></div>

              <ul className="mt-6 space-y-2 text-xs text-white/80 font-sans">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> 3 Specialized AI Agents</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Lead Capture & Follow-Up Flow</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Standard CRM Sync</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Email & Chat Support</li>
              </ul>
            </div>

            <button
              onClick={() => setCheckoutPackage({
                name: 'Growth Engine Starter',
                tier: 'Starter',
                price: 2500,
                description: '3 Specialized AI Agents, Lead Capture & Follow-Up Flow, Standard CRM Sync',
                features: ['3 Specialized AI Agents', 'Lead Capture & Follow-Up Flow', 'Standard CRM Sync', 'Instant AI Build & Staff QA']
              })}
              className="w-full py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold uppercase tracking-wider text-xs rounded-sm transition-colors mt-6 font-mono flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Select Starter ($2,500/mo)</span>
            </button>
          </div>

          {/* Scale (Featured) */}
          <div className="bg-zinc-900 border-2 border-sky-500 p-6 rounded-sm space-y-4 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3 right-4 bg-sky-500 text-black text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm">
              MOST RECOMMENDED
            </div>

            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">Pro Scale</span>
              <h3 className="text-2xl font-bold text-white mt-1">Complete Operations Suite</h3>
              <p className="text-xs text-white/60 mt-2">Full end-to-end automation suite with custom app development and dedicated support.</p>
              <div className="text-3xl font-serif text-sky-400 font-light mt-4">$5,000 <span className="text-xs font-sans text-white/40">/ month</span></div>

              <ul className="mt-6 space-y-2 text-xs text-white/90 font-sans">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Up to 10 AI Agents</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Custom Client & Staff Portal</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Event Bus Automated Workflows</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Unlimited Free Token Quotas</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Priority 24/7 SLA Manager</li>
              </ul>
            </div>

            <button
              onClick={() => setCheckoutPackage({
                name: 'Complete Operations Suite Pro',
                tier: 'Pro Scale',
                price: 5000,
                description: 'Up to 10 AI Agents, Custom Client & Staff Portal, Event Bus Automated Workflows',
                features: ['Up to 10 AI Agents', 'Custom Portals', 'Event Bus Workflows', '24/7 SLA Priority Manager']
              })}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs rounded-sm transition-colors mt-6 font-mono flex items-center justify-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started Now ($5,000/mo)</span>
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-sm space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase">Custom</span>
              <h3 className="text-2xl font-bold text-white mt-1">Enterprise Custom</h3>
              <p className="text-xs text-white/60 mt-2">Tailored for large organizations requiring dedicated security boundaries and bespoke LLMs.</p>
              <div className="text-3xl font-serif text-sky-400 font-light mt-4">$12,000 <span className="text-xs font-sans text-white/40">/ month</span></div>

              <ul className="mt-6 space-y-2 text-xs text-white/80 font-sans">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Unlimited Custom AI Agents</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> SOC2 & GDPR Security Auditing</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> Custom Vector DB Infrastructure</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-400 mr-2" /> On-Premise or Private Cloud</li>
              </ul>
            </div>

            <button
              onClick={() => setCheckoutPackage({
                name: 'Enterprise Custom Architecture',
                tier: 'Enterprise',
                price: 12000,
                description: 'Unlimited Custom AI Agents, SOC2 Auditing, Vector DB, On-Premise or Private Cloud Deployment',
                features: ['Unlimited Agents', 'SOC2 Security', 'Vector DB', 'Private Cloud / On-Premise']
              })}
              className="w-full py-2.5 border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors mt-6 font-mono flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Configure Enterprise Package</span>
            </button>
          </div>
        </div>
      </section>

      {/* Case Studies / Client Proof */}
      <section className="bg-zinc-900/40 border border-white/10 rounded-sm p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">REAL CLIENT OUTCOMES</span>
            <h2 className="text-2xl font-serif text-white font-light mt-1 italic">Trusted by Industry Leaders</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#050505] p-6 rounded-sm border border-white/10 space-y-3">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <h3 className="font-bold text-white text-base">Cyberdyne Next Systems</h3>
            <p className="text-xs text-white/70 italic leading-relaxed">
              "Deploying Business HUB OS reduced our client onboarding time from 3 weeks to 2 hours while automating 82% of customer support inquiries."
            </p>
            <p className="text-[11px] text-sky-400 font-mono">— Marcus Vance, Chief Technology Officer</p>
          </div>

          <div className="bg-[#050505] p-6 rounded-sm border border-white/10 space-y-3">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <h3 className="font-bold text-white text-base">FinTech Edge</h3>
            <p className="text-xs text-white/70 italic leading-relaxed">
              "The automated workflow engine allows our compliance team to process incoming verification requests instantly without manual errors."
            </p>
            <p className="text-[11px] text-sky-400 font-mono">— Elena Rostova, VP of Operations</p>
          </div>
        </div>
      </section>

      {/* Business & Tech News Articles Section */}
      <section className="bg-zinc-900/60 border border-sky-500/30 rounded-sm p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">
                AI INDUSTRY NEWS & BUSINESS HELP ARTICLES
              </span>
            </div>
            <h2 className="text-3xl font-serif text-white font-light mt-1 italic">
              Business & Tech News — Help Articles & Insights
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-2xl font-sans">
              Curated guides, technology updates, and enterprise automation playbooks authored by our Business HUB AI Agent.
            </p>
          </div>

          <div className="bg-[#050505] px-3 py-2 rounded border border-white/10 text-xs font-mono text-sky-400 flex items-center space-x-2 self-start lg:self-auto">
            <Bot className="w-4 h-4 text-sky-400" />
            <span>Author: Business HUB AI Agent</span>
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyPosts.map(post => (
            <div
              key={post.id}
              className="bg-[#050505] border border-white/10 hover:border-sky-500/40 p-6 rounded-sm space-y-4 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase">
                    {post.category}
                  </span>
                  <span className="text-white/40 flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTimeMinutes} min read</span>
                </div>

                <h3 className="font-bold text-white text-base font-sans group-hover:text-sky-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                {/* SEO Keywords */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.seoKeywords?.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <div>
                  <span className="text-sky-400 font-bold block">Business HUB AI Agent</span>
                  <span className="text-white/40">{post.publishedAt}</span>
                </div>

                <button
                  onClick={() => setSelectedBlogPost(post)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-sky-500 hover:text-black text-white rounded-sm border border-white/10 transition-colors flex items-center space-x-1 font-bold"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Full Article Reader */}
      {selectedBlogPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 rounded-sm max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedBlogPost(null)}
              className="absolute top-6 right-6 p-2 rounded-sm bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase font-bold">
                  {selectedBlogPost.category}
                </span>
                <span className="text-white/40">{selectedBlogPost.publishedAt}</span>
                <span className="text-white/40">• {selectedBlogPost.readTimeMinutes} min read</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light italic leading-tight">
                {selectedBlogPost.title}
              </h2>

              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Bot className="w-4 h-4" />
                <span>Authored by Business HUB AI Agent</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line font-sans space-y-4">
              {selectedBlogPost.content}
            </div>

            {/* Article Footer & Keywords */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="flex flex-wrap gap-2">
                <span className="text-white/40 mr-1 flex items-center"><Tag className="w-3.5 h-3.5 mr-1" /> Keywords:</span>
                {selectedBlogPost.seoKeywords?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-sky-300 border border-white/10">
                    {kw}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedBlogPost(null)}
                className="px-4 py-2 bg-sky-500 text-black font-bold uppercase tracking-wider text-xs rounded-sm transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Service Details */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 rounded-sm bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">{selectedService.badge}</span>
              <h2 className="text-3xl font-serif text-white font-light italic">{selectedService.title}</h2>
              <p className="text-sm text-white/70">{selectedService.overview}</p>
            </div>

            {/* Benefits & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#050505] p-4 rounded-sm border border-white/10 space-y-2">
                <h4 className="font-bold text-emerald-400 font-mono">Core Business Benefits</h4>
                <ul className="space-y-1.5 text-white/80">
                  {selectedService.benefits?.map((b: string, i: number) => (
                    <li key={i} className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" /> {b}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#050505] p-4 rounded-sm border border-white/10 space-y-2">
                <h4 className="font-bold text-sky-400 font-mono">What Is Included</h4>
                <ul className="space-y-1.5 text-white/80">
                  {selectedService.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-center"><Check className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#050505] p-4 rounded-sm border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-mono">Pricing</span>
                <p className="text-lg font-bold text-emerald-400 font-mono">{selectedService.pricing}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedService(null);
                  setShowBookingModal(true);
                }}
                className="bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-sm transition-all font-mono"
              >
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Book Strategy Consultation */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 p-6 sm:p-8 rounded-sm max-w-md w-full space-y-4 relative font-sans">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-3 font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Consultation Request Received!</h3>
                <p className="text-xs text-white/60">
                  Our team has received your request and logged it into our CRM. An AI specialist will email you within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsultation} className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-sky-400">FREE 30-MINUTE SESSION</div>
                  <h3 className="text-xl font-serif text-white italic">Schedule Strategy Call</h3>
                  <p className="text-xs text-white/60">Fill out your details below to lock in a consultation slot with our senior team.</p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={e => setLeadCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Primary Interest</label>
                  <select
                    value={leadService}
                    onChange={e => setLeadService(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="AI Automation & Agentic Systems">AI Automation & Operations</option>
                    <option value="Custom Web & Mobile Apps">Custom Web or Mobile Application</option>
                    <option value="Strategic Business AI Consulting">Business AI Consulting</option>
                    <option value="Search Engine Visibility & Lead Gen">SEO & Organic Lead Generation</option>
                  </select>
                </div>

                {consultationEvaluation && (
                  <div className="bg-[#050505] border border-sky-500/30 p-3 rounded text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-sky-400 font-bold">AI Scope Assessment</span>
                      <span className={consultationEvaluation.canDoInstantly ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {consultationEvaluation.fulfillmentType}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70">{consultationEvaluation.aiAssessmentMessage}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">AI-Assisted Scope & Notes</label>
                  <textarea
                    rows={3}
                    value={leadNotes}
                    onChange={e => setLeadNotes(e.target.value)}
                    placeholder="Provide additional project context or requirements..."
                    className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-xs rounded-sm transition-colors mt-2 font-mono flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5 fill-black" />
                  <span>{isSubmittingLead ? 'Submitting...' : 'Confirm Strategy Session'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: AI Talking Agent Voice Consultant */}
      {showTalkingAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-950 border border-purple-500/40 p-6 sm:p-8 rounded-lg max-w-lg w-full space-y-6 relative shadow-2xl font-sans">
            <button
              onClick={() => setShowTalkingAgentModal(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono rounded-full">
                <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Hermes Voice AI Senior Consultant</span>
              </div>
              <h3 className="text-2xl font-serif text-white italic">AI Strategy Voice Assistant</h3>
              <p className="text-xs text-white/60 font-sans">
                Real-time spoken AI feasibility evaluation & 1-click strategy consultation booking.
              </p>
            </div>

            {/* Audio Waveform Equalizer Animation */}
            <div className="bg-[#050505] border border-purple-500/20 p-6 rounded-lg text-center space-y-4">
              <div className="flex items-center justify-center space-x-1.5 h-12">
                {[40, 70, 30, 90, 50, 100, 60, 80, 40, 75, 95, 50, 85].map((h, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 bg-gradient-to-t from-purple-600 to-sky-400 rounded-full transition-all duration-300 ${
                      isTalkingAgentSpeaking ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{ height: isTalkingAgentSpeaking ? `${h}%` : '20%' }}
                  />
                ))}
              </div>

              {/* AI Transcript Box */}
              <div className="bg-zinc-900/80 p-4 rounded border border-white/10 text-left space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
                  <span className="flex items-center"><Volume2 className="w-3 h-3 mr-1" /> VOICE RESPONSE</span>
                  <button
                    onClick={() => setIsTalkingAgentSpeaking(!isTalkingAgentSpeaking)}
                    className="text-white/40 hover:text-white"
                  >
                    {isTalkingAgentSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-white/90 font-sans leading-relaxed italic">
                  "{consultationEvaluation?.voiceAudioTranscript || 'Hello! I am Hermes, your AI Senior Solution Consultant. Tell me what operational challenge you want to solve, and I will evaluate whether we can deliver it instantly or via a tailored timeline.'}"
                </p>
              </div>

              {consultationEvaluation && (
                <div className="flex items-center justify-between text-left text-xs bg-purple-950/30 p-3 rounded border border-purple-500/30 font-mono">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block font-bold">Feasibility Check</span>
                    <span className="text-white font-bold">{consultationEvaluation.fulfillmentType} ({consultationEvaluation.estimatedTurnaround})</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowTalkingAgentModal(false);
                  setShowBookingModal(true);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider text-xs rounded transition-colors font-mono flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm & Lock Strategy Session</span>
              </button>

              <button
                onClick={() => setShowTalkingAgentModal(false)}
                className="px-4 py-3 border border-white/20 hover:bg-white/5 text-white/70 hover:text-white text-xs font-mono rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Package Checkout & AI Execution Modal */}
      <PackageCheckoutModal
        isOpen={!!checkoutPackage}
        onClose={() => setCheckoutPackage(null)}
        selectedPackage={checkoutPackage}
      />

      {/* Deployment & Hosting Operations Guide Modal */}
      <DeploymentGuideModal
        isOpen={showDeploymentGuideModal}
        onClose={() => setShowDeploymentGuideModal(false)}
      />
    </div>
  );
};
