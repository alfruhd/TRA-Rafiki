import React, { useState } from 'react';
import { 
  FileCheck, Download, Search, MessageSquare, Check, ArrowRight
} from 'lucide-react';
import { Language, Receipt, Trader, EscalatedTicket } from '../types';
import { translations } from '../utils/i18n';

interface AdminDashboardProps {
  receipts: Receipt[];
  trader: Trader | null;
  onVerifyReceipt: (code: string) => void;
  onSendOfficerReply?: (text: string) => void;
  escalatedTicket?: EscalatedTicket | null;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  receipts,
  trader,
  onVerifyReceipt,
  onSendOfficerReply,
  escalatedTicket,
  lang,
}) => {
  const [officerReply, setOfficerReply] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const t = translations[lang];

  const filteredReceipts = receipts.filter(r => 
    r.verificationCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.traderName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.traderTin.includes(searchFilter)
  );

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerReply.trim()) return;
    if (onSendOfficerReply) {
      onSendOfficerReply(officerReply);
    }
    setOfficerReply('');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Official Government Site Header Band */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-black text-amber-400 px-4 py-1.5 text-[10px] font-mono tracking-wider uppercase flex items-center justify-between">
          <span>{t.dashGovHeader}</span>
          <span className="hidden sm:inline font-bold">PORTAL REF: TRA-GOV-2026-TZ</span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
              <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  Tanzania Revenue Authority
                </span>
                <span className="text-[10px] bg-amber-400 text-black font-bold px-2 py-0.2 rounded font-mono">
                  OFFICIAL PORTAL
                </span>
              </div>
              <h1 className="text-lg font-bold text-black tracking-tight mt-0.5">
                {t.dashTitle}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {t.dashSubtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => alert('Exporting official TRA report (CSV format)...')}
              className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 rounded-lg text-xs font-bold text-amber-400 flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.dashExportBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-zinc-500 block">{t.dashKpiTraders}</span>
          <span className="text-xl font-extrabold text-black block mt-1">18,492</span>
          <span className="text-[10px] text-zinc-600 font-medium mt-0.5 block">{t.dashKpiTradersSub}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-zinc-500 block">{t.dashKpiTurnover}</span>
          <span className="text-xl font-extrabold text-black block mt-1">TZS 332.8M</span>
          <span className="text-[10px] text-zinc-600 font-medium mt-0.5 block">{t.dashKpiTurnoverSub}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-zinc-500 block">{t.dashKpiReceipts}</span>
          <span className="text-xl font-extrabold text-black block mt-1">{receipts.length + 4210}</span>
          <span className="text-[10px] text-zinc-600 font-medium mt-0.5 block">{t.dashKpiReceiptsSub}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-zinc-500 block">{t.dashKpiTime}</span>
          <span className="text-xl font-extrabold text-black block mt-1">{t.dashKpiTimeVal}</span>
          <span className="text-[10px] text-zinc-600 font-medium mt-0.5 block">{t.dashKpiTimeSub}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): Recent Receipts Table & Sector Progress */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-black flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-black" />
                <span>{t.dashTableTitle}</span>
              </h2>
              <p className="text-xs text-zinc-500">
                {t.dashTableSubtitle}
              </p>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search TIN, business..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          {/* Simple Minimal Table */}
          <div className="overflow-x-auto border border-zinc-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">{t.bcColCode}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.bcColBusiness}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.bcColAmount}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{t.bcColAudit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredReceipts.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-black">
                      {r.verificationCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-black">{r.traderName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">TIN: {r.traderTin}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-black">
                      TZS {r.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onVerifyReceipt(r.verificationCode)}
                        className="px-2.5 py-1 bg-black hover:bg-zinc-800 text-amber-400 text-[10px] font-bold rounded cursor-pointer transition-colors"
                      >
                        {t.bcBtnVerify}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sector Breakdown */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <h3 className="font-bold text-xs text-black">
              Collections by Business Sector
            </h3>
            
            <div className="space-y-1.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-700">Market Stalls (Kariakoo, Mwenge, Buguruni)</span>
                  <span className="font-bold text-black font-mono">42% (TZS 139.8M)</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-black h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-700">Bodaboda & Commercial Transport</span>
                  <span className="font-bold text-black font-mono">28% (TZS 93.2M)</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-700">Retail Shops & Dukas</span>
                  <span className="font-bold text-black font-mono">18% (TZS 59.9M)</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-zinc-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Taxpayer Support Desk */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
              <h3 className="font-bold text-sm text-black flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-black" />
                <span>{t.dashSupportTitle}</span>
              </h3>
              <span className="text-[10px] bg-amber-400 text-black font-bold px-2 py-0.5 rounded-full font-mono">
                {t.dashSupportActive}
              </span>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span className="font-semibold text-black">{trader?.businessName || 'Green Market Stall'}</span>
                <span className="font-mono">2 min ago</span>
              </div>
              <p className="font-medium text-black leading-relaxed">
                {t.dashSupportQuery}
              </p>
              <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-200">
                {t.dashSupportHistory}
              </div>
            </div>
          </div>

          {/* Quick Officer Reply Form */}
          <form onSubmit={handleReplySubmit} className="mt-4 space-y-2.5 pt-3 border-t border-zinc-100">
            <label className="block text-[11px] font-bold text-black">
              Official Tax Officer Reply:
            </label>
            <textarea
              rows={3}
              value={officerReply}
              onChange={(e) => setOfficerReply(e.target.value)}
              placeholder={t.dashReplyPlaceholder}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-medium"
            />
            <button
              type="submit"
              disabled={!officerReply.trim()}
              className="w-full py-2 bg-black hover:bg-zinc-800 disabled:opacity-40 text-amber-400 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
            >
              {t.dashSendReplyBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
