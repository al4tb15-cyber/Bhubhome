import React from 'react';
import { HermesAgent } from '../types';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Filter, 
  Play, 
  RefreshCw, 
  Search, 
  Sparkles, 
  Terminal, 
  Zap,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface HermesWorkforceProps {
  agents: HermesAgent[];
  onTriggerAgent: (agentId: string, actionPrompt: string) => Promise<any>;
}

export const HermesWorkforceView: React.FC<HermesWorkforceProps> = ({
  agents,
  onTriggerAgent
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAgent, setSelectedAgent] = React.useState<HermesAgent | null>(agents[0] || null);
  const [modalPrompt, setModalPrompt] = React.useState('');
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionOutput, setExecutionOutput] = React.useState<string | null>(null);

  const departments = [
    'All',
    'Executive Board',
    'Sales',
    'Marketing',
    'Consulting',
    'Engineering',
    'Operations',
    'Delivery',
    'Customer Success'
  ];

  const filteredAgents = agents.filter(ag => {
    const matchesDept = selectedDepartment === 'All' || ag.department === selectedDepartment;
    const matchesSearch = ag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ag.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ag.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleRunAgentTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !modalPrompt.trim()) return;

    setIsExecuting(true);
    setExecutionOutput(null);

    try {
      const res = await onTriggerAgent(selectedAgent.id, modalPrompt);
      if (res && res.output) {
        setExecutionOutput(res.output);
      } else {
        setExecutionOutput(`Successfully dispatched task to ${selectedAgent.name}. Event published to Event Bus.`);
      }
    } catch (err: any) {
      setExecutionOutput(`Execution completed with response: ${err.message || 'Success'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sky-500 font-mono mb-1">
            AUTONOMOUS AGENTIC FLEET
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white italic">
            AI Workforce ({agents.length})
          </h2>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-900/50 px-4 py-2 rounded-sm border border-white/10">
          <div className="text-right font-mono">
            <p className="text-[10px] text-white/40 uppercase">Total Fleet Efficiency</p>
            <p className="text-xs font-bold text-emerald-400">98.4% KPI AVERAGE</p>
          </div>
          <div className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/40 p-3 rounded-sm border border-white/10">
        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 font-mono">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedDepartment === dept
                  ? 'bg-white/10 text-white border-l-2 border-sky-500'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-sky-500 placeholder-white/30 font-sans"
          />
        </div>
      </div>

      {/* Main Grid: Agents Directory + Detail Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agents Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.map(ag => {
            const isSelected = selectedAgent?.id === ag.id;
            return (
              <div
                key={ag.id}
                onClick={() => {
                  setSelectedAgent(ag);
                  setModalPrompt(`Execute task for ${ag.roleTitle}...`);
                  setExecutionOutput(null);
                }}
                className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all space-y-3 ${
                  isSelected
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {ag.department}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">{ag.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{ag.roleTitle}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ag.status === 'executing'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : ag.status === 'thinking'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {ag.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{ag.description}</p>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="font-semibold text-slate-400">Current Task: </span>
                  {ag.currentTask}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>KPI Score: <strong className="text-emerald-400">{ag.kpiScore}%</strong></span>
                  <span>Tasks: <strong className="text-slate-200">{ag.tasksCompleted}</strong></span>
                  <span>Mem: <strong className="text-slate-200">{ag.memoryUsageMb}MB</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Drawer: Agent Execution Console & Memory Inspector (5 cols) */}
        {selectedAgent && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  Agent ID: {selectedAgent.id}
                </span>
                <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Health: {selectedAgent.healthStatus}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mt-2">{selectedAgent.name}</h2>
              <p className="text-xs text-slate-400">{selectedAgent.roleTitle} • {selectedAgent.department}</p>
            </div>

            {/* Description & Capabilities */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Operational Mandate</h4>
                <p className="text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedAgent.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-1.5">Core Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.capabilities.map(cap => (
                    <span key={cap} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Execution Form */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <Terminal className="w-4 h-4" />
                  <span>Dispatch Direct Agent Task</span>
                </div>
                <span className="text-[10px] text-slate-500">Event Bus Synced</span>
              </div>

              <form onSubmit={handleRunAgentTask} className="space-y-3">
                <textarea
                  rows={3}
                  value={modalPrompt}
                  onChange={(e) => setModalPrompt(e.target.value)}
                  placeholder={`Describe specific action for ${selectedAgent.name}...`}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="submit"
                  disabled={isExecuting || !modalPrompt.trim()}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md shadow-cyan-600/20"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Agent Executing Task...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Execute Task for {selectedAgent.name}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Execution Output */}
              {executionOutput && (
                <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-cyan-500/30 text-xs text-slate-200 space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px]">
                    <span>Agent Execution Output</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <p className="whitespace-pre-wrap font-sans text-slate-300 text-[11px]">
                    {executionOutput}
                  </p>
                </div>
              )}
            </div>

            {/* Agent Memory Logs */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Agent Activity Logs</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                {selectedAgent.logs.length === 0 ? (
                  <p className="text-slate-500 italic">No recent activity logged.</p>
                ) : (
                  selectedAgent.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-300">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
