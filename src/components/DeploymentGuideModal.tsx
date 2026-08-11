import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Server, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  Copy, 
  Check, 
  Folder, 
  Settings, 
  Layers, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'cpanel' | 'aapanel'>('local');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-white my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-500 rounded flex items-center justify-center text-black font-bold font-mono">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Deployment & Hosting Operations Guide</span>
              </div>
              <h2 className="text-xl font-serif italic text-white">
                Installation & Server Hosting Manual
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

        {/* Tab Selection */}
        <div className="bg-zinc-900 border-b border-white/10 px-6 py-3 flex space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-2 rounded-md font-bold transition-colors flex items-center space-x-2 ${
              activeTab === 'local' ? 'bg-sky-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Local Installation & Testing</span>
          </button>

          <button
            onClick={() => setActiveTab('cpanel')}
            className={`px-4 py-2 rounded-md font-bold transition-colors flex items-center space-x-2 ${
              activeTab === 'cpanel' ? 'bg-sky-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>2. cPanel Hosting Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('aapanel')}
            className={`px-4 py-2 rounded-md font-bold transition-colors flex items-center space-x-2 ${
              activeTab === 'aapanel' ? 'bg-sky-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. aaPanel Hosting Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-xs leading-relaxed">

          {/* LOCAL INSTALLATION */}
          {activeTab === 'local' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/10 space-y-2">
                <h3 className="font-bold text-white text-sm font-mono flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>Local Development & Testing Setup</span>
                </h3>
                <p className="text-white/70">
                  Business HUB OS is built with Node.js, Express, and Vite React. Follow these steps to run and test locally on your workstation.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                  <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">1</span>
                  <span>Prerequisites & Repository Extraction</span>
                </h4>
                <p className="text-white/60">
                  Ensure Node.js (v18+ or v20+) is installed on your computer. Extract your exported project files to a local directory.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                  <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">2</span>
                  <span>Install Project Dependencies</span>
                </h4>
                <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 flex items-center justify-between">
                  <code>npm install</code>
                  <button onClick={() => copyToClipboard('npm install', 'cmd1')} className="text-white/40 hover:text-white">
                    {copiedCode === 'cmd1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                  <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">3</span>
                  <span>Environment Variables Setup (.env)</span>
                </h4>
                <p className="text-white/60">
                  Create a <code className="text-sky-400 font-mono">.env</code> file in the project root directory and add your keys:
                </p>
                <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 relative">
                  <pre className="text-[11px] font-mono">
{`PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here`}
                  </pre>
                  <button onClick={() => copyToClipboard(`PORT=3000\nNODE_ENV=development\nGEMINI_API_KEY=your_gemini_api_key_here`, 'cmd2')} className="absolute top-3 right-3 text-white/40 hover:text-white">
                    {copiedCode === 'cmd2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                  <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">4</span>
                  <span>Run Local Development Server</span>
                </h4>
                <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 flex items-center justify-between">
                  <code>npm run dev</code>
                  <button onClick={() => copyToClipboard('npm run dev', 'cmd3')} className="text-white/40 hover:text-white">
                    {copiedCode === 'cmd3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-white/50 text-[11px]">
                  Open <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="text-sky-400 underline">http://localhost:3000</a> in your browser to test the full application.
                </p>
              </div>

              {/* Step 5 */}
              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                  <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">5</span>
                  <span>Test Local Production Build</span>
                </h4>
                <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 flex items-center justify-between">
                  <code>npm run build && npm start</code>
                  <button onClick={() => copyToClipboard('npm run build && npm start', 'cmd4')} className="text-white/40 hover:text-white">
                    {copiedCode === 'cmd4' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CPANEL HOSTING */}
          {activeTab === 'cpanel' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/10 space-y-2">
                <h3 className="font-bold text-white text-sm font-mono flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-sky-400" />
                  <span>cPanel Web Hosting Deployment Guide</span>
                </h3>
                <p className="text-white/70">
                  Deploying on cPanel requires using cPanel's native <strong>Setup Node.js App</strong> manager (powered by Phusion Passenger or CloudLinux LVE).
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">1</span>
                    <span>Upload Project Files to cPanel</span>
                  </h4>
                  <p className="text-white/60">
                    Use cPanel <strong>File Manager</strong> or FTP to upload the project files into a folder outside public_html (e.g. <code className="text-sky-400 font-mono">/home/username/business-hub</code>) or inside your domain root directory.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">2</span>
                    <span>Create Node.js Application in cPanel</span>
                  </h4>
                  <ol className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>Log into cPanel and search for <strong>"Setup Node.js App"</strong>.</li>
                    <li>Click <strong>Create Application</strong>.</li>
                    <li>Select Node.js version: <strong>18.x or 20.x</strong>.</li>
                    <li>Application mode: <strong>Production</strong>.</li>
                    <li>Application root: <code className="text-sky-400 font-mono">business-hub</code>.</li>
                    <li>Application URL: Choose your domain or subdomain (e.g. <code className="text-sky-400 font-mono">app.yourdomain.com</code>).</li>
                    <li>Application startup file: <code className="text-sky-400 font-mono">dist/server.cjs</code>.</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">3</span>
                    <span>Add Environment Variables in cPanel</span>
                  </h4>
                  <p className="text-white/60">
                    Under the Node.js App interface in cPanel, scroll down to <strong>Environment Variables</strong> and add:
                  </p>
                  <ul className="list-disc list-inside text-sky-300 font-mono text-[11px] pl-2 space-y-0.5">
                    <li><code>NODE_ENV = production</code></li>
                    <li><code>GEMINI_API_KEY = your_gemini_api_key</code></li>
                    <li><code>PORT = 3000</code></li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">4</span>
                    <span>Run npm Install & Production Build</span>
                  </h4>
                  <p className="text-white/60">
                    Copy the virtual environment command shown at the top of your cPanel Node.js App page (e.g., <code className="text-sky-400 font-mono">source /home/user/nodevenv/business-hub/18/bin/activate</code>). Open cPanel <strong>Terminal</strong>, run that activate command, and execute:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 relative">
                    <pre className="text-[11px] font-mono">
{`npm install
npm run build`}
                    </pre>
                    <button onClick={() => copyToClipboard(`npm install\nnpm run build`, 'cmd5')} className="absolute top-3 right-3 text-white/40 hover:text-white">
                      {copiedCode === 'cmd5' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">5</span>
                    <span>Restart Application</span>
                  </h4>
                  <p className="text-white/60">
                    Click the <strong>Restart Application</strong> button in cPanel. Your application is now live on your domain!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AAPANEL HOSTING */}
          {activeTab === 'aapanel' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/10 space-y-2">
                <h3 className="font-bold text-white text-sm font-mono flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>aaPanel Control Panel Hosting Guide</span>
                </h3>
                <p className="text-white/70">
                  aaPanel offers native PM2 daemon management and Nginx reverse proxy integration for Node.js applications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">1</span>
                    <span>Install Node.js Version Manager & PM2 in aaPanel</span>
                  </h4>
                  <p className="text-white/60">
                    Go to aaPanel <strong>App Store</strong> &rarr; Install <strong>Node.js Version Manager</strong>. Inside the tool, install Node.js 18.x or 20.x, and set it as the CLI version.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">2</span>
                    <span>Upload & Build Project</span>
                  </h4>
                  <p className="text-white/60">
                    Upload your project to <code className="text-sky-400 font-mono">/www/wwwroot/business-hub</code> using aaPanel File Manager or SSH terminal:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded border border-white/10 font-mono text-sky-300 relative">
                    <pre className="text-[11px] font-mono">
{`cd /www/wwwroot/business-hub
npm install
npm run build`}
                    </pre>
                    <button onClick={() => copyToClipboard(`cd /www/wwwroot/business-hub\nnpm install\nnpm run build`, 'cmd6')} className="absolute top-3 right-3 text-white/40 hover:text-white">
                      {copiedCode === 'cmd6' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">3</span>
                    <span>Configure Node Project in aaPanel Website Manager</span>
                  </h4>
                  <ol className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>Go to aaPanel <strong>Website</strong> &rarr; <strong>Node project</strong> tab &rarr; Click <strong>Add Node project</strong>.</li>
                    <li>Project path: <code className="text-sky-400 font-mono">/www/wwwroot/business-hub</code>.</li>
                    <li>Project name: <code className="text-sky-400 font-mono">Business-HUB-OS</code>.</li>
                    <li>Run command: <code className="text-sky-400 font-mono">npm start</code> or <code className="text-sky-400 font-mono">node dist/server.cjs</code>.</li>
                    <li>Port: <code className="text-sky-400 font-mono">3000</code>.</li>
                    <li>Domain name: Enter your domain name (e.g. <code className="text-sky-400 font-mono">hub.yourdomain.com</code>).</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-mono text-xs flex items-center space-x-2">
                    <span className="w-5 h-5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center text-[10px]">4</span>
                    <span>Setup Environment Variables & Free Let's Encrypt SSL</span>
                  </h4>
                  <p className="text-white/60">
                    In aaPanel Node project settings, add <code className="text-sky-400 font-mono">GEMINI_API_KEY</code> under Environment Variables. Go to the <strong>SSL</strong> tab and click <strong>Apply for Let's Encrypt SSL</strong> to enable HTTPS automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-900/80 flex items-center justify-between text-xs font-mono">
          <span className="text-white/50">Built for high availability Node.js / Cloud Run / cPanel / aaPanel runtime environments.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase rounded transition-colors"
          >
            Close Manual
          </button>
        </div>

      </div>
    </div>
  );
};
