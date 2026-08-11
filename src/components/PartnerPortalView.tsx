import React from 'react';
import { PartnerReferral } from '../types';
import { 
  Users, 
  DollarSign, 
  Link, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  TrendingUp, 
  Award 
} from 'lucide-react';

interface PartnerPortalProps {
  referrals: PartnerReferral[];
}

export const PartnerPortalView: React.FC<PartnerPortalProps> = ({ referrals }) => {
  const [copied, setCopied] = React.useState(false);
  const partnerLink = "https://businesshub.io/ref?partner=vanguard-agency-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(partnerLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const totalCommissionPaid = referrals
    .filter(r => r.status === 'Paid')
    .reduce((acc, r) => acc + r.commission, 0);

  const totalCommissionPending = referrals
    .filter(r => r.status === 'Approved' || r.status === 'Pending')
    .reduce((acc, r) => acc + r.commission, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Partner & Affiliate Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Partner Referral & Revenue Share
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Earn 10% recurring revenue share on all referred AI Consulting, Web & Mobile Development, and AI Operating System engagements.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total Commissions Earned</p>
              <p className="text-lg font-bold text-teal-400">${(totalCommissionPaid + totalCommissionPending).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-white text-sm">Your Unique Partner Tracking Link</h3>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono w-full flex items-center justify-between">
            <span className="truncate">{partnerLink}</span>
            <Link className="w-4 h-4 text-slate-500 ml-2 flex-shrink-0" />
          </div>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>Copy Referral Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Active Referred Accounts & Commissions</h3>
          <span className="text-xs text-slate-400">10% Recurring Commission Tier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Partner Name</th>
                <th className="px-6 py-3">Client Account</th>
                <th className="px-6 py-3">Service Package</th>
                <th className="px-6 py-3">Deal Value</th>
                <th className="px-6 py-3">Your Commission</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {referrals.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{ref.partnerName}</td>
                  <td className="px-6 py-4">{ref.clientName}</td>
                  <td className="px-6 py-4 font-medium text-cyan-400">{ref.service}</td>
                  <td className="px-6 py-4 font-bold text-slate-200">${ref.dealValue.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-teal-400">${ref.commission.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      ref.status === 'Paid'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{ref.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marketing Collateral */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Partner Marketing Collateral & Decks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { title: 'Enterprise AI Consulting Pitch Deck.pptx', size: '14.5 MB' },
            { title: 'Agentic Automation ROI Calculator Template.xlsx', size: '1.2 MB' },
            { title: 'Business HUB OS Brand Assets & Banners.zip', size: '48.0 MB' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-200">{item.title}</h4>
                <p className="text-[10px] text-slate-500">{item.size}</p>
              </div>
              <button className="flex items-center justify-center space-x-1.5 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg font-semibold border border-slate-700">
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Download Asset</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
