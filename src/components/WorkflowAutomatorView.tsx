import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  Plus, 
  Play, 
  Zap, 
  CheckCircle2, 
  Trash2, 
  Layers, 
  Radio, 
  Settings, 
  Bot, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Coins,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { WorkflowChain, WorkflowNode, EventType, HermesAgent, OmniRouteUsage } from '../types';
import { ServiceWorkflowAdjuster } from './ServiceWorkflowAdjuster';

interface WorkflowAutomatorViewProps {
  agents: HermesAgent[];
  onEventEmitted?: () => void;
}

export const WorkflowAutomatorView: React.FC<WorkflowAutomatorViewProps> = ({
  agents,
  onEventEmitted
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'adjuster'>('canvas');
  const [workflows, setWorkflows] = useState<WorkflowChain[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [omniUsage, setOmniUsage] = useState<OmniRouteUsage | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [showNewNodeModal, setShowNewNodeModal] = useState<boolean>(false);
  const [showNewFlowModal, setShowNewFlowModal] = useState<boolean>(false);

  // New Node Form State
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeType, setNewNodeType] = useState<'trigger' | 'action'>('action');
  const [newNodeActionType, setNewNodeActionType] = useState<'NotifyStaff' | 'DispatchAgent' | 'CreateInvoice' | 'SendEmail' | 'UpdateCRM'>('NotifyStaff');
  const [selectedAgentForNode, setSelectedAgentForNode] = useState(agents[0]?.id || 'ag-sales');

  // New Flow Form State
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowDesc, setNewFlowDesc] = useState('');
  const [newFlowTrigger, setNewFlowTrigger] = useState<EventType>('LeadCreated');

  useEffect(() => {
    fetchWorkflows();
    fetchOmniTokens();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      const data = await res.json();
      if (data.workflows) {
        setWorkflows(data.workflows);
        if (data.workflows.length > 0 && !selectedWorkflowId) {
          setSelectedWorkflowId(data.workflows[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    }
  };

  const fetchOmniTokens = async () => {
    try {
      const res = await fetch('/api/omniroute/tokens');
      const data = await res.json();
      if (data.usage) {
        setOmniUsage(data.usage);
      }
    } catch (err) {
      console.error('Failed to fetch OmniRoute tokens:', err);
    }
  };

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleExecuteWorkflow = async (wfId: string) => {
    setIsExecuting(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: wfId })
      });
      const data = await res.json();
      if (data.success) {
        setTestOutput(`Successfully executed "${data.workflow.name}". ${data.executedNodesCount} visual nodes processed. Event published to bus: ${data.eventPublished.title}`);
        fetchWorkflows();
        fetchOmniTokens();
        if (onEventEmitted) onEventEmitted();
      }
    } catch (err) {
      setTestOutput('Execution failed. Please check event bus connection.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddNode = () => {
    if (!selectedWorkflow || !newNodeTitle.trim()) return;

    const newNode: WorkflowNode = {
      id: `n-${Date.now().toString().slice(-4)}`,
      type: newNodeType,
      title: newNodeTitle,
      actionType: newNodeType === 'action' ? newNodeActionType : undefined,
      agentId: newNodeActionType === 'DispatchAgent' ? selectedAgentForNode : undefined,
      config: {},
      x: 380 + (selectedWorkflow.nodes.length * 40),
      y: 120 + ((selectedWorkflow.nodes.length % 2) * 60)
    };

    const updatedWorkflows = workflows.map(w => {
      if (w.id === selectedWorkflow.id) {
        const lastNode = w.nodes[w.nodes.length - 1];
        const newEdge = lastNode ? {
          id: `e-${Date.now().toString().slice(-4)}`,
          source: lastNode.id,
          target: newNode.id,
          label: 'Next Action'
        } : null;

        return {
          ...w,
          nodes: [...w.nodes, newNode],
          edges: newEdge ? [...w.edges, newEdge] : w.edges
        };
      }
      return w;
    });

    setWorkflows(updatedWorkflows);
    setNewNodeTitle('');
    setShowNewNodeModal(false);
  };

  const handleCreateNewFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowName.trim()) return;

    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFlowName,
          description: newFlowDesc || 'Automated visual event bus flow',
          triggerEvent: newFlowTrigger,
          nodes: [
            { id: 'n-start', type: 'trigger', title: `Trigger: ${newFlowTrigger}`, eventType: newFlowTrigger, config: {}, x: 100, y: 120 },
            { id: 'n-end', type: 'action', title: 'Action: Notify Staff via Event Bus', actionType: 'NotifyStaff', config: {}, x: 420, y: 120 }
          ],
          edges: [
            { id: 'e-start', source: 'n-start', target: 'n-end', label: 'On Event' }
          ]
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchWorkflows();
        setSelectedWorkflowId(data.workflow.id);
        setNewFlowName('');
        setNewFlowDesc('');
        setShowNewFlowModal(false);
      }
    } catch (err) {
      console.error('Failed to create flow:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header & Token Bar */}
      <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sky-500 font-mono mb-1">
            EVENT BUS AUTOMATION ENGINE
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white italic">
            Workflow Automator
          </h2>
        </div>

        {/* Free OmniRoute Token Quota Badge */}
        {omniUsage && (
          <div className="bg-zinc-900/60 border border-white/10 px-4 py-2.5 rounded-sm flex items-center space-x-4 font-mono">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-sm">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="text-white/40 uppercase text-[10px] flex items-center gap-1">
                <span>Free OmniTokens Pool</span>
                <span className="text-emerald-400 text-[9px] font-bold">100% FREE</span>
              </div>
              <div className="text-white font-bold">
                {omniUsage.tokensRemaining.toLocaleString()} <span className="text-white/40 text-[10px] font-normal">/ {(omniUsage.totalTokensAllowed / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mode Sub-Tab Switcher */}
      <div className="flex space-x-2 border-b border-white/10 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('canvas')}
          className={`px-4 py-2 rounded-md font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'canvas' 
              ? 'bg-sky-500 text-black shadow' 
              : 'bg-zinc-900 text-white/60 hover:text-white border border-white/10'
          }`}
        >
          <GitMerge className="w-4 h-4" />
          <span>Interactive Visual Event Chains</span>
        </button>

        <button
          onClick={() => setActiveSubTab('adjuster')}
          className={`px-4 py-2 rounded-md font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'adjuster' 
              ? 'bg-sky-500 text-black shadow' 
              : 'bg-zinc-900 text-white/60 hover:text-white border border-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Service Package Workflow Step Adjuster</span>
        </button>
      </div>

      {/* Mode Content */}
      {activeSubTab === 'adjuster' ? (
        <ServiceWorkflowAdjuster />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Automation Chains List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <GitMerge className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Active Flows</h3>
            </div>
            <button
              onClick={() => setShowNewFlowModal(true)}
              className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>New Flow</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {workflows.map(wf => {
              const isSelected = selectedWorkflow?.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-sky-500/60 shadow-lg'
                      : 'bg-zinc-900/30 border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      ON {wf.triggerEvent}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={wf.active}
                        onChange={() => handleToggleWorkflow(wf.id)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans">{wf.name}</h4>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{wf.description}</p>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Nodes: {wf.nodes.length}</span>
                    <span>Runs: {wf.runCount}</span>
                    <span>Last: {wf.lastRun || 'Never'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Canvas: Visual Drag-and-Drop / Interactive Flow Graph */}
        <div className="lg:col-span-8 bg-zinc-900/30 border border-white/10 rounded-sm p-6 space-y-6">
          {selectedWorkflow ? (
            <>
              {/* Canvas Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-base font-bold text-white font-sans">{selectedWorkflow.name}</h3>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 font-sans">{selectedWorkflow.description}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowNewNodeModal(true)}
                    className="px-3 py-1.5 border border-white/20 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Node</span>
                  </button>

                  <button
                    onClick={() => handleExecuteWorkflow(selectedWorkflow.id)}
                    disabled={isExecuting}
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1.5"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-black" />
                    )}
                    <span>{isExecuting ? 'Executing...' : 'Test Run Flow'}</span>
                  </button>
                </div>
              </div>

              {/* Live Test Run Output Notification */}
              {testOutput && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-xs text-emerald-300 font-mono space-y-1 animate-fadeIn">
                  <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[10px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Event Bus Workflow Trigger Result</span>
                  </div>
                  <p className="text-white/80">{testOutput}</p>
                </div>
              )}

              {/* Visual Node Diagram Area */}
              <div className="relative min-h-[380px] bg-[#050505] border border-white/10 rounded-sm p-6 overflow-x-auto flex items-center justify-start space-x-6">
                {/* Visual Grid Backdrop */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Render Nodes sequentially with animated connector arrows */}
                {selectedWorkflow.nodes.map((node, index) => {
                  const isTrigger = node.type === 'trigger';
                  const isLast = index === selectedWorkflow.nodes.length - 1;

                  return (
                    <React.Fragment key={node.id}>
                      {/* Node Card */}
                      <div className={`relative z-10 w-64 p-4 rounded-sm border text-xs shadow-2xl transition-all ${
                        isTrigger
                          ? 'bg-sky-950/40 border-sky-500/60 text-white'
                          : 'bg-zinc-900 border-white/15 text-white'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isTrigger ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {isTrigger ? 'EVENT TRIGGER' : 'ACTION NODE'}
                          </span>
                          <span className="text-[10px] font-mono text-white/30">{node.id}</span>
                        </div>

                        <h5 className="font-bold text-sm mb-1 text-white font-sans">{node.title}</h5>

                        {node.actionType === 'DispatchAgent' && node.agentId && (
                          <div className="mt-2 text-[10px] font-mono bg-white/5 p-2 rounded border border-white/5 flex items-center space-x-2 text-sky-300">
                            <Bot className="w-3.5 h-3.5 text-sky-400" />
                            <span>Agent: {agents.find(a => a.id === node.agentId)?.name || node.agentId}</span>
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-mono">
                          <span>STATUS: READY</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                      </div>

                      {/* Connector Arrow */}
                      {!isLast && (
                        <div className="flex flex-col items-center justify-center text-sky-400 font-mono text-[10px] px-2 space-y-1 z-10">
                          <span className="text-white/40 text-[9px] uppercase">EVENT BUS</span>
                          <ArrowRight className="w-5 h-5 text-sky-400 animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Workflow Metadata Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                  <div className="text-white/40 text-[10px] uppercase">TRIGGER SOURCE</div>
                  <div className="text-white font-bold mt-1">{selectedWorkflow.triggerEvent}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                  <div className="text-white/40 text-[10px] uppercase">TOTAL EXECUTIONS</div>
                  <div className="text-sky-400 font-bold mt-1">{selectedWorkflow.runCount} Runs</div>
                </div>
                <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                  <div className="text-white/40 text-[10px] uppercase">ROUTING ENGINE</div>
                  <div className="text-emerald-400 font-bold mt-1">OmniRoute Free Gateway</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-white/40">
              <GitMerge className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p>Select or create a workflow to view its automation graph.</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modal: Add Node */}
      {showNewNodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 p-6 rounded-sm max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-serif italic">Add Node to Automation Chain</h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Node Title</label>
              <input
                type="text"
                value={newNodeTitle}
                onChange={e => setNewNodeTitle(e.target.value)}
                placeholder="e.g. Notify Staff via Slack"
                className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Action Type</label>
              <select
                value={newNodeActionType}
                onChange={e => setNewNodeActionType(e.target.value as any)}
                className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="NotifyStaff">Notify Staff (Internal Alert)</option>
                <option value="DispatchAgent">Dispatch AI Agent Task</option>
                <option value="CreateInvoice">Auto-Generate Invoices</option>
                <option value="SendEmail">Send Client Email</option>
                <option value="UpdateCRM">Update CRM Deal Stage</option>
              </select>
            </div>

            {newNodeActionType === 'DispatchAgent' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Select AI Agent</label>
                <select
                  value={selectedAgentForNode}
                  onChange={e => setSelectedAgentForNode(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
                >
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>{ag.name} ({ag.roleTitle})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowNewNodeModal(false)}
                className="px-4 py-1.5 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                className="px-4 py-1.5 bg-sky-500 text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-sky-400"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Flow */}
      {showNewFlowModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewFlow} className="bg-zinc-900 border border-white/20 p-6 rounded-sm max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-serif italic">Create Event Bus Automation Chain</h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Flow Name</label>
              <input
                type="text"
                required
                value={newFlowName}
                onChange={e => setNewFlowName(e.target.value)}
                placeholder="e.g. VIP Client Onboarding Flow"
                className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Description</label>
              <textarea
                value={newFlowDesc}
                onChange={e => setNewFlowDesc(e.target.value)}
                placeholder="Brief description of the automated workflow chain..."
                className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 h-20"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-mono">Trigger Event</label>
              <select
                value={newFlowTrigger}
                onChange={e => setNewFlowTrigger(e.target.value as EventType)}
                className="w-full bg-[#050505] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="LeadCreated">LeadCreated (New Sales Prospect)</option>
                <option value="InvoicePaid">InvoicePaid (Payment Received)</option>
                <option value="OrderPlaced">OrderPlaced (New Client Order)</option>
                <option value="SupportTicketCreated">SupportTicketCreated (Inbound Enquiry)</option>
                <option value="ProjectStarted">ProjectStarted (New Delivery Milestone)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowNewFlowModal(false)}
                className="px-4 py-1.5 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-500 text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-sky-400"
              >
                Create Flow
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
