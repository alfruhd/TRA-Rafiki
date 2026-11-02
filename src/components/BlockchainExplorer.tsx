import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Search, Copy, Check, FileText
} from 'lucide-react';
import { Block, Language, Receipt } from '../types';
import { verifyReceiptOnChain } from '../utils/blockchain';
import { translations } from '../utils/i18n';

interface BlockchainExplorerProps {
  blocks: Block[];
  receipts: Receipt[];
  selectedCode?: string;
  onCodeSelect?: (code: string) => void;
  lang: Language;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({
  blocks,
  receipts,
  selectedCode = 'TRA-8F3K-29QX',
  onCodeSelect,
  lang,
}) => {
  const [searchCode, setSearchCode] = useState(selectedCode);
  const [tamperSimulated, setTamperSimulated] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const t = translations[lang];
  const activeCode = searchCode.trim().toUpperCase();
  const currentVerification = verifyReceiptOnChain(activeCode, blocks);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const filteredReceipts = receipts.filter(r => 
    r.verificationCode.toLowerCase().includes(searchCode.toLowerCase()) ||
    r.traderName.toLowerCase().includes(searchCode.toLowerCase()) ||
    r.traderTin.includes(searchCode)
  );

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Official Government Header */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-black text-amber-400 px-4 py-1.5 text-[10px] font-mono tracking-wider uppercase flex items-center justify-between">
          <span>{t.bcGovHeader}</span>
          <span className="hidden sm:inline font-bold">OFFICIAL PUBLIC REGISTRY</span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
              <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  {t.bcLedgerBadge}
                </span>
              </div>
              <h1 className="text-lg font-bold text-black tracking-tight mt-0.5">
                {t.bcTitle}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {t.bcSubtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setTamperSimulated(!tamperSimulated)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                tamperSimulated
                  ? 'bg-black text-amber-400 border border-black'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300'
              }`}
            >
              {tamperSimulated ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.bcResetOriginal}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-600" />
                  <span>{t.bcSimulateTamper}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-700">{t.bcLedgerStatus}</span>
            <span className={`font-bold ${tamperSimulated ? 'text-black bg-amber-300 px-1.5 py-0.5 rounded' : 'text-emerald-700'}`}>
              {tamperSimulated ? t.bcStatusTampered : t.bcStatusHealthy}
            </span>
          </div>
          <div className="text-zinc-500 text-[11px]">
            {t.bcConsensusText} • <span className="font-bold text-black">{receipts.length} {t.bcRecordedCount}</span>
          </div>
        </div>
      </div>

      {/* Verification Card (Result of search or selection) */}
      {activeCode && (
        <div>
          {tamperSimulated ? (
            <div className="bg-amber-50 border-2 border-black rounded-xl p-4 text-xs space-y-2">
              <div className="font-bold flex items-center space-x-2 text-black text-sm">
                <ShieldAlert className="w-4 h-4 text-black" />
                <span>{t.bcFraudAlertTitle}</span>
              </div>
              <p className="text-zinc-800 font-medium">
                {t.bcFraudDesc}
              </p>
              <div className="text-[11px] bg-white p-2.5 rounded border border-amber-300 text-zinc-700 font-mono">
                {t.bcFraudHashNote}
              </div>
            </div>
          ) : currentVerification.isValid ? (
            <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-black text-sm">{t.bcAuthenticTitle}</span>
                </div>
                <span className="text-[10px] bg-black text-amber-400 font-bold px-2 py-0.5 rounded">
                  {t.bcAnchoredBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-3.5 rounded-lg border border-zinc-200 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] font-semibold uppercase">{t.bcColCode}</span>
                  <div className="flex items-center space-x-1 font-mono font-bold text-black text-xs mt-0.5">
                    <span>{currentVerification.receipt?.verificationCode}</span>
                    <button 
                      onClick={() => handleCopy(currentVerification.receipt?.verificationCode || '')}
                      className="cursor-pointer hover:text-amber-600"
                    >
                      {copiedCode === currentVerification.receipt?.verificationCode ? (
                        <Check className="w-3 h-3 text-black" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px] font-semibold uppercase">{t.bcCardBusiness}</span>
                  <span className="font-bold text-black mt-0.5 block">{currentVerification.receipt?.traderName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">TIN: {currentVerification.receipt?.traderTin}</span>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px] font-semibold uppercase">{t.bcColItems}</span>
                  <span className="font-medium text-black mt-0.5 block">{currentVerification.receipt?.items.map(i => i.desc).join(', ')}</span>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px] font-semibold uppercase">{t.bcCardAmount}</span>
                  <span className="font-extrabold text-black text-sm mt-0.5 block">
                    TZS {currentVerification.receipt?.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-zinc-500">{t.bcCardVatNote}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-600 text-center">
              Receipt code <strong>{activeCode}</strong> {t.bcNotFound}
            </div>
          )}
        </div>
      )}

      {/* Structured Receipts Table */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-black">
              {t.bcAllReceiptsTitle}
            </h2>
            <p className="text-xs text-zinc-500">
              {receipts.length} {t.bcRecordedCount} recorded on the official registry.
            </p>
          </div>

          {/* Simple Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                if (onCodeSelect) onCodeSelect(e.target.value);
              }}
              placeholder={t.bcSearchPlaceholder}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-medium"
            />
          </div>
        </div>

        {/* Minimal Table */}
        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">{t.bcColCode}</th>
                <th className="py-2.5 px-3 font-semibold">{t.bcColBusiness}</th>
                <th className="py-2.5 px-3 font-semibold">{t.bcColItems}</th>
                <th className="py-2.5 px-3 font-semibold">{t.bcColAmount}</th>
                <th className="py-2.5 px-3 font-semibold">{t.bcColStatus}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.bcColAudit}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredReceipts.map((r, idx) => {
                const isTamperedRow = tamperSimulated && idx === 0;

                return (
                  <tr 
                    key={r.id} 
                    className={`hover:bg-zinc-50 transition-colors ${
                      isTamperedRow ? 'bg-amber-50/70' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-black">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleCopy(r.verificationCode)}
                          className="hover:text-amber-600 cursor-pointer"
                          title="Copy code"
                        >
                          {copiedCode === r.verificationCode ? (
                            <Check className="w-3 h-3 text-black" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-400" />
                          )}
                        </button>
                        <span>{r.verificationCode}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-black">{r.traderName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">TIN: {r.traderTin}</div>
                    </td>

                    <td className="py-2.5 px-3 text-zinc-700">
                      {r.items.map(i => i.desc).join(', ')}
                    </td>

                    <td className="py-2.5 px-3 font-bold text-black">
                      {isTamperedRow ? (
                        <div>
                          <span className="line-through text-zinc-400 mr-1.5">TZS 45,000</span>
                          <span className="text-black bg-amber-300 px-1 rounded font-extrabold">TZS 5,000</span>
                        </div>
                      ) : (
                        `TZS ${r.totalAmount.toLocaleString()}`
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      {isTamperedRow ? (
                        <span className="bg-black text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">
                          {t.bcStatusTamperedBadge}
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          {t.bcStatusAnchored}
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSearchCode(r.verificationCode);
                          if (onCodeSelect) onCodeSelect(r.verificationCode);
                        }}
                        className="px-2.5 py-1 bg-black hover:bg-zinc-800 text-amber-400 font-bold rounded text-[10px] cursor-pointer transition-colors"
                      >
                        {t.bcBtnVerify}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
