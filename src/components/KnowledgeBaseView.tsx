import React from 'react';
import { KnowledgeArticle } from '../types';
import { 
  FileText, 
  Search, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  X,
  Sparkles
} from 'lucide-react';

interface KnowledgeProps {
  articles: KnowledgeArticle[];
}

export const KnowledgeBaseView: React.FC<KnowledgeProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeArticle, setActiveArticle] = React.useState<KnowledgeArticle | null>(null);

  const categories = ['All', 'AI Consulting', 'Automation', 'Development', 'SEO', 'Case Study'];

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Knowledge Base & Thought Leadership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Documentation & Whitepapers
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Technical blueprints, case studies, and enterprise AI guides authored by Hermes AI Workforce specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(art => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 cursor-pointer transition-all shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                {art.category}
              </span>

              <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{art.author}</span>
              <span className="flex items-center text-cyan-400 font-semibold">
                Read Guide <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{activeArticle.category}</span>
            <h2 className="text-2xl font-black text-white">{activeArticle.title}</h2>
            
            <div className="flex items-center space-x-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span>Authored by <strong className="text-slate-200">{activeArticle.author}</strong></span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
              <span>•</span>
              <span>{activeArticle.publishedAt}</span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
              {activeArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
