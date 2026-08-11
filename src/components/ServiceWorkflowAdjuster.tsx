import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Bot, 
  Settings, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  SlidersHorizontal,
  Edit3,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ServiceWorkflowStep } from '../types';

export const ServiceWorkflowAdjuster: React.FC = () => {
  const [steps, setSteps] = useState<ServiceWorkflowStep[]>([]);
  const [selectedTier, setSelectedTier] = useState<'All' | 'Starter' | 'Pro Scale' | 'Enterprise'>('All');
  const [editingStep, setEditingStep] = useState<ServiceWorkflowStep | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchWorkflowSteps();
  }, []);

  const fetchWorkflowSteps = async () => {
    try {
      const res = await fetch('/api/packages/workflow-steps');
      if (res.ok) {
        const data = await res.json();
        if (data.steps) setSteps(data.steps);
      }
    } catch (err) {
      console.error('Failed to fetch workflow steps:', err);
    }
  };

  const handleUpdateStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/packages/workflow-steps/${editingStep.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStep)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.step) {
          setSteps(prev => prev.map(s => s.id === data.step.id ? data.step : s));
          setSaveMessage(`Successfully adjusted parameters for "${data.step.stepName}"!`);
          setTimeout(() => setSaveMessage(null), 3500);
        }
      }
    } catch (err) {
      console.error('Failed to update step:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSteps = selectedTier === 'All' 
    ? steps 
    : steps.filter(s => s.packageTier === selectedTier);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 space-y-6 text-white font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>BACKEND SERVICE PIPELINE ADJUSTER &bull; ADMIN CONTROL</span>
          </div>
          <h2 className="text-xl font-serif italic text-white mt-1">
            Service Tier Workflow & Parameter Configurator
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Modify agent prompt templates, execution temperatures, confidence thresholds, and human review requirements for each service package step.
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/10 font-mono text-xs self-start md:self-auto">
          {(['All', 'Starter', 'Pro Scale', 'Enterprise'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                selectedTier === tier 
                  ? 'bg-sky-500 text-black shadow' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: Steps List & Interactive Adjuster Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Configurable Service Steps ({filteredSteps.length})</span>
          </h3>

          <div className="space-y-3">
            {filteredSteps.map(step => {
              const isSelected = editingStep?.id === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setEditingStep(step)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected 
                      ? 'bg-sky-500/10 border-sky-500 shadow-lg' 
                      : 'bg-zinc-900/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold uppercase">
                      Tier: {step.packageTier}
                    </span>
                    <span className="text-white/40">Step {step.stepNumber}</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{step.stepName}</h4>
                      <p className="text-xs text-white/60 line-clamp-2 mt-0.5">{step.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-sky-400 translate-x-1' : 'text-white/30'}`} />
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span className="flex items-center space-x-1 text-sky-400">
                      <Bot className="w-3 h-3" />
                      <span>{step.agentRole}</span>
                    </span>
                    <span>Temp: {step.adjustableParameters.temperature}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Adjuster Form (Right 7 Cols) */}
        <div className="lg:col-span-7">
          {editingStep ? (
            <form onSubmit={handleUpdateStep} className="bg-zinc-900 border border-white/10 p-6 rounded-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-white text-sm font-mono">
                    Adjust Step #{editingStep.stepNumber}: {editingStep.stepName}
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold uppercase">
                  {editingStep.packageTier} Package
                </span>
              </div>

              {/* Step Title & Agent Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Step Name</label>
                  <input
                    type="text"
                    value={editingStep.stepName}
                    onChange={e => setEditingStep({ ...editingStep, stepName: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-sky-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Assigned Agent Role</label>
                  <input
                    type="text"
                    value={editingStep.agentRole}
                    onChange={e => setEditingStep({ ...editingStep, agentRole: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-sky-400 font-sans"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">Step Description</label>
                <input
                  type="text"
                  value={editingStep.description}
                  onChange={e => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/20 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-sky-400 font-sans"
                />
              </div>

              {/* Editable Prompt Template */}
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">
                  AI Agent System Prompt Template (Supports variables like &#123;&#123;businessGoals&#125;&#125;, &#123;&#123;companyName&#125;&#125;)
                </label>
                <textarea
                  rows={4}
                  value={editingStep.promptTemplate}
                  onChange={e => setEditingStep({ ...editingStep, promptTemplate: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/20 text-sky-300 text-xs p-3 rounded font-mono focus:outline-none focus:border-sky-400 leading-relaxed"
                />
              </div>

              {/* Parameter Sliders */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                  <span>Execution Parameters & Quality Control</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white/70">LLM Temperature (Creativity)</span>
                      <span className="text-sky-400 font-bold">{editingStep.adjustableParameters.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={editingStep.adjustableParameters.temperature}
                      onChange={e => setEditingStep({
                        ...editingStep,
                        adjustableParameters: {
                          ...editingStep.adjustableParameters,
                          temperature: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white/70">Confidence Threshold</span>
                      <span className="text-emerald-400 font-bold">{Math.round(editingStep.adjustableParameters.confidenceThreshold * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.50"
                      max="0.99"
                      step="0.01"
                      value={editingStep.adjustableParameters.confidenceThreshold}
                      onChange={e => setEditingStep({
                        ...editingStep,
                        adjustableParameters: {
                          ...editingStep.adjustableParameters,
                          confidenceThreshold: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Human Approval Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingStep.adjustableParameters.requireHumanApproval}
                      onChange={e => setEditingStep({
                        ...editingStep,
                        adjustableParameters: {
                          ...editingStep.adjustableParameters,
                          requireHumanApproval: e.target.checked
                        }
                      })}
                      className="w-4 h-4 rounded border-white/20 bg-zinc-950 text-sky-500 focus:ring-sky-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold text-white">Require Senior Human Staff Review & Approval</span>
                      <p className="text-[11px] text-white/50">
                        When enabled, instant AI deliverables produced by this step are held for staff quality assurance prior to client handover.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Step Parameters'}</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="bg-zinc-900/40 border border-white/10 p-12 rounded-xl text-center text-white/40 font-mono space-y-3">
              <Settings className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-xs">Select any service step on the left to edit its prompt template and parameters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
