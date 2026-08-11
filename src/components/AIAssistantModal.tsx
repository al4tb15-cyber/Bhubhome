import React from 'react';
import { 
  Bot, 
  Brain, 
  Send, 
  Sparkles, 
  X, 
  Zap, 
  MessageSquare,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string; mode?: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am Business HUB OS AI Assistant. How can I help you explore our AI Consulting, Agentic Workflows, or Client Operating System today?'
    }
  ]);
  const [inputPrompt, setInputPrompt] = React.useState('');
  const [thinkingMode, setThinkingMode] = React.useState(false); // standard vs high thinking
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    if (!customText) setInputPrompt('');

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          mode: thinkingMode ? 'thinking' : 'standard'
        })
      });

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Request completed.',
          mode: data.isThinkingMode ? 'gemini-3.1-pro-preview (High Thinking)' : 'gemini-3.6-flash'
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to Gemini AI service. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How does the Event Bus protect client data?',
    'What services are included in AI Agent Fleet Deployment?',
    'Calculate ROI for 50 employees using AI Automation',
    'Explain the 18 Hermes AI Workforce roles'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-sm">Business HUB AI Assistant</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {thinkingMode ? 'High Thinking Active' : 'Flash Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Powered by Gemini AI Core</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Thinking Mode Toggle */}
            <button
              onClick={() => setThinkingMode(!thinkingMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                thinkingMode
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Brain className={`w-3.5 h-3.5 ${thinkingMode ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
              <span>High Thinking Mode</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>

              {msg.mode && (
                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  Model: {msg.mode}
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-cyan-400 text-xs p-3 bg-slate-950/80 rounded-xl border border-slate-800 max-w-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{thinkingMode ? 'Gemini High Thinking Reasoning...' : 'Generating AI Response...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-medium whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={thinkingMode ? "Ask complex architecture or ROI question (High Thinking)..." : "Ask anything about Business HUB OS..."}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold p-3 rounded-xl transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
