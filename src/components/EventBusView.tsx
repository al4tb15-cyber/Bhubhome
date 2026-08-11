import React from 'react';
import { SystemEvent } from '../types';
import { 
  Radio, 
  Plus, 
  Send, 
  Shield, 
  Key, 
  Terminal, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Cpu, 
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface EventBusProps {
  events: SystemEvent[];
  onPublishEvent: (type: string, title: string, source: string, payload: any) => Promise<any>;
}

export const EventBusView: React.FC<EventBusProps> = ({ events, onPublishEvent }) => {
  const [eventType, setEventType] = React.useState('LeadCreated');
  const [eventTitle, setEventTitle] = React.useState('Manual Test Event Triggered');
  const [eventSource, setEventSource] = React.useState('API Gateway');
  const [eventPayload, setEventPayload] = React.useState('{\n  "clientId": "test-99",\n  "amount": 25000\n}');
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('bhub_live_8f3a99e210b471');
  const [copiedKey, setCopiedKey] = React.useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(eventPayload);
      } catch (err) {
        parsedPayload = { raw: eventPayload };
      }
      await onPublishEvent(eventType, eventTitle, eventSource, parsedPayload);
      setEventTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Decoupled Event-Driven Microservices Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Internal Event Bus & API Gateway
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              All Hermes AI Agents communicate exclusively by publishing and listening to typed events, guaranteeing loose coupling, auditability, and microservice compliance.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total System Events</p>
              <p className="text-lg font-bold text-purple-400">{events.length} Processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Manual Event Publisher + Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Manual Publisher Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Publish System Event</h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
            </span>
          </div>

          <form onSubmit={handlePublish} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="LeadCreated">LeadCreated</option>
                <option value="ClientRegistered">ClientRegistered</option>
                <option value="OrderPlaced">OrderPlaced</option>
                <option value="InvoicePaid">InvoicePaid</option>
                <option value="ProjectStarted">ProjectStarted</option>
                <option value="TaskCompleted">TaskCompleted</option>
                <option value="SupportTicketCreated">SupportTicketCreated</option>
                <option value="WorkflowCompleted">WorkflowCompleted</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Event Title / Summary</label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Lead Created: Acme Logistics"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Source Module</label>
              <input
                type="text"
                value={eventSource}
                onChange={(e) => setEventSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payload (JSON)</label>
              <textarea
                rows={4}
                value={eventPayload}
                onChange={(e) => setEventPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-[11px] rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/20"
            >
              {isPublishing ? 'Publishing Event...' : 'Publish to Event Bus'}
            </button>
          </form>

          {/* API Key Box */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs">REST API Gateway Bearer Token</h4>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-300 text-[11px]">{apiKey}</span>
              <button onClick={handleCopyKey} className="text-slate-400 hover:text-white">
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Event Stream Log Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Real-Time Event Stream Log</h3>
            <span className="text-xs text-slate-400 font-mono">POST /api/events/publish</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {events.map((evt) => (
              <div key={evt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    {evt.type}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-500" />
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <h4 className="font-bold text-white">{evt.title}</h4>
                <p className="text-[11px] text-slate-400">Source: <strong className="text-slate-200">{evt.sourceModule}</strong></p>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                  {JSON.stringify(evt.payload)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
