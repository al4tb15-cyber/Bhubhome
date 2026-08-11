import React from 'react';
import { WorkspaceIntegrationStatus } from '../types';
import { 
  FileSpreadsheet, 
  HardDrive, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  UploadCloud, 
  Download, 
  ExternalLink, 
  ShieldAlert, 
  Zap,
  Check
} from 'lucide-react';

interface WorkspaceProps {
  status: WorkspaceIntegrationStatus;
  onRefresh: () => void;
}

export const WorkspaceIntegrationView: React.FC<WorkspaceProps> = ({ status, onRefresh }) => {
  const [isExportingSheets, setIsExportingSheets] = React.useState(false);
  const [sheetsMessage, setSheetsMessage] = React.useState<string | null>(null);

  const [isSyncingCal, setIsSyncingCal] = React.useState(false);
  const [calMessage, setCalMessage] = React.useState<string | null>(null);

  const [isBackupDrive, setIsBackupDrive] = React.useState(false);
  const [driveMessage, setDriveMessage] = React.useState<string | null>(null);

  const handleExportLeads = async () => {
    setIsExportingSheets(true);
    setSheetsMessage(null);
    try {
      const res = await fetch('/api/workspace/sheets/lead-export', { method: 'POST' });
      const data = await res.json();
      setSheetsMessage(`Exported ${data.exportedRows} CRM leads to Google Sheets spreadsheet "${data.spreadsheetTitle}"!`);
      onRefresh();
    } catch (err: any) {
      setSheetsMessage('Export failed. Please check OAuth credentials.');
    } finally {
      setIsExportingSheets(false);
    }
  };

  const handleSyncCalendar = async () => {
    setIsSyncingCal(true);
    setCalMessage(null);
    try {
      const res = await fetch('/api/workspace/calendar/sync-demo', { method: 'POST' });
      const data = await res.json();
      setCalMessage(`Scheduled demo meeting "${data.eventTitle}" on Google Calendar for ${data.startTime}!`);
      onRefresh();
    } catch (err: any) {
      setCalMessage('Calendar sync failed. Please check OAuth permissions.');
    } finally {
      setIsSyncingCal(false);
    }
  };

  const handleBackupDrive = async () => {
    setIsBackupDrive(true);
    setDriveMessage(null);
    try {
      const res = await fetch('/api/workspace/drive/backup-crm', { method: 'POST' });
      const data = await res.json();
      setDriveMessage(`Created automated backup "${data.fileName}" in Google Drive folder "${data.folderName}"!`);
      onRefresh();
    } catch (err: any) {
      setDriveMessage('Drive backup failed. Please check OAuth permissions.');
    } finally {
      setIsBackupDrive(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Native Google Workspace Sync Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Google Drive, Sheets & Calendar Integration
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Bi-directional automated sync between Business HUB OS CRM, Hermes AI Workforce, and your official Google Workspace ecosystem.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Workspace Sync</span>
          </button>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Google Sheets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>

              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>

            <h3 className="font-bold text-white text-base">Google Sheets Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically sync inbound CRM leads, sales deals, and invoice status into live Google Sheets for executive reporting.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500">Active Spreadsheets:</span>
              <p className="font-bold text-white mt-0.5">{status.syncedSheetsCount} Synced Sheets</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {sheetsMessage && (
              <p className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 font-medium">
                {sheetsMessage}
              </p>
            )}

            <button
              onClick={handleExportLeads}
              disabled={isExportingSheets}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2"
            >
              {isExportingSheets ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting Rows to Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Leads to Google Sheets</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Google Drive */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <HardDrive className="w-5 h-5" />
              </div>

              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Connected
              </span>
            </div>

            <h3 className="font-bold text-white text-base">Google Drive Backup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store client deliverables, contracts, proposals, and automated system database snapshots in structured Drive folders.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500">Vault File Count:</span>
              <p className="font-bold text-white mt-0.5">{status.driveFilesCount} Files Stored</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {driveMessage && (
              <p className="text-[11px] text-blue-400 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 font-medium">
                {driveMessage}
              </p>
            )}

            <button
              onClick={handleBackupDrive}
              disabled={isBackupDrive}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2"
            >
              {isBackupDrive ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Drive Backup...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Backup CRM State to Drive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: Google Calendar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>

              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Connected
              </span>
            </div>

            <h3 className="font-bold text-white text-base">Google Calendar Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hermes AI Scheduling Agent books discovery calls, technical reviews, and client onboarding sessions directly on Google Calendar.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500">Scheduled Events:</span>
              <p className="font-bold text-white mt-0.5">{status.calendarEventsCount} Upcoming Meetings</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {calMessage && (
              <p className="text-[11px] text-purple-400 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 font-medium">
                {calMessage}
              </p>
            )}

            <button
              onClick={handleSyncCalendar}
              disabled={isSyncingCal}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2"
            >
              {isSyncingCal ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing Calendar Event...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Discovery Demo Call</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
