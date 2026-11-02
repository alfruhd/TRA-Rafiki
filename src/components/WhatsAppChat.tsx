import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Phone, Video, MoreVertical, Paperclip, Mic, CheckCheck, 
  ShieldCheck, ChevronRight, Lock, Check, FileText, Award, 
  UserCheck, CreditCard, Sparkles, Building, QrCode, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, Language, Receipt, Trader } from '../types';
import { translations } from '../utils/i18n';
import { sounds } from '../utils/sound';

interface WhatsAppChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  trader: Trader | null;
  lang: Language;
  onSelectAction: (action: string, value?: string) => void;
  onVerifyReceipt: (code: string) => void;
  isTyping: boolean;
  onCompletePayment: (method: 'M-Pesa' | 'Mixx by Yas' | 'Airtel Money') => void;
  showSplash: boolean;
  onDismissSplash: () => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  messages,
  onSendMessage,
  trader,
  lang,
  onSelectAction,
  onVerifyReceipt,
  isTyping,
  onCompletePayment,
  showSplash,
  onDismissSplash,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStkPush, setShowStkPush] = useState(false);
  const [stkMethod, setStkMethod] = useState<'M-Pesa' | 'Mixx by Yas' | 'Airtel Money'>('M-Pesa');
  const [stkPin, setStkPin] = useState('');
  const [stkProcessing, setStkProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const isSw = lang === 'sw';

  useEffect(() => {
    if (!showSplash) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showSplash]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleOptionClick = (action: string, value?: string) => {
    if (action === 'trigger_stk') {
      setStkMethod((value as any) || 'M-Pesa');
      setShowStkPush(true);
      setStkPin('');
      return;
    }
    onSelectAction(action, value);
  };

  const handleStkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stkPin.length < 4) return;
    setStkProcessing(true);

    setTimeout(() => {
      setStkProcessing(false);
      setShowStkPush(false);
      sounds.playPaymentSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      onCompletePayment(stkMethod);
    }, 900);
  };

  return (
    <div className="relative w-[348px] h-[640px] shrink-0 select-none">
      {/* Realistic iPhone Titanium Outer Frame */}
      <div className="relative w-full h-full rounded-[50px] p-2.5 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl border-[3px] border-zinc-500/50 flex flex-col">
        
        {/* Hardware Buttons - Left Side */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-7 bg-zinc-600 rounded-l-sm"></div>
        <div className="absolute -left-[5px] top-36 w-[3px] h-12 bg-zinc-600 rounded-l-sm"></div>
        <div className="absolute -left-[5px] top-52 w-[3px] h-12 bg-zinc-600 rounded-l-sm"></div>

        {/* Hardware Buttons - Right Side */}
        <div className="absolute -right-[5px] top-32 w-[3px] h-16 bg-zinc-600 rounded-r-sm"></div>

        {/* Inner Glass Bezel */}
        <div className="relative flex-1 bg-black rounded-[42px] overflow-hidden flex flex-col border border-zinc-900">
          
          {/* Dynamic Island Pill Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2 border border-zinc-800/40 shadow-sm pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950/80"></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
          </div>

          {/* SPLASH SCREEN (Default View - matching Slide 2) */}
          {showSplash ? (
            <div 
              className="absolute inset-0 bg-[#121212] z-40 flex flex-col justify-between p-6 transition-opacity duration-300"
            >
              {/* Splash Status Bar */}
              <div className="h-7 text-white px-2 pt-1 flex items-center justify-between text-[11px] font-medium opacity-80">
                <span>9:41</span>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span>📶 5G</span>
                  <span>100% 🔋</span>
                </div>
              </div>

              {/* Splash Brand Center (Exact match to Slide 2) */}
              <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
                <div className="w-24 h-24 bg-white/5 rounded-3xl p-3 border border-zinc-800 shadow-xl flex items-center justify-center">
                  <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    TRA Rafiki
                  </h1>
                  <p className="text-sm font-semibold text-amber-400 mt-1">
                    {isSw ? 'Kodi imerahisishwa' : 'Tax made simple'}
                  </p>
                </div>

                {/* Enter Button */}
                <button
                  onClick={onDismissSplash}
                  className="mt-4 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>{isSw ? 'Anza TRA Rafiki' : 'Enter TRA Rafiki'}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>

              {/* Splash Footer */}
              <div className="text-center pb-4 space-y-2">
                <p className="text-[11px] text-zinc-400 font-medium">
                  Tanzania Revenue Authority
                </p>
                <p className="text-[9px] text-zinc-600">
                  {isSw ? 'Bofya kitufe au chagua hatua ya kushoto kuanza' : 'Click button or select a step on the left to start'}
                </p>
              </div>
            </div>
          ) : null}

          {/* WHATSAPP INTERFACE */}
          <div className="relative flex-1 flex flex-col bg-[#efeae2] overflow-hidden">
            {/* Status Bar */}
            <div className="h-8 bg-[#008069] text-white px-5 pt-1.5 flex items-center justify-between text-[11px] font-medium z-30 shrink-0">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5 text-[10px]">
                <span>5G</span>
                <span>100% 🔋</span>
              </div>
            </div>

            {/* WhatsApp App Header (Authentic WhatsApp Theme) */}
            <div className="bg-[#008069] text-white px-3 py-2 flex items-center justify-between shadow-xs z-30 shrink-0">
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => onDismissSplash()}
                  className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                  title="TRA Rafiki"
                >
                  <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-xs text-white">TRA Rafiki</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>
                  </div>
                  <p className="text-[10px] text-emerald-100 leading-none">
                    {t.waOnline}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 text-white">
                <Video className="w-3.5 h-3.5 cursor-pointer opacity-90 hover:opacity-100" />
                <Phone className="w-3.5 h-3.5 cursor-pointer opacity-90 hover:opacity-100" />
                <MoreVertical className="w-3.5 h-3.5 cursor-pointer opacity-90 hover:opacity-100" />
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 whatsapp-light-bg text-[#111b21] text-xs">
              {/* Subtle Security Notice */}
              <div className="flex justify-center my-0.5">
                <div className="bg-[#ffeecd] text-[#54656f] text-[9px] px-2.5 py-0.5 rounded-md border border-[#ffd279]/30 shadow-2xs flex items-center space-x-1 font-medium">
                  <Lock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                  <span>{t.waVerifiedPill}</span>
                </div>
              </div>

              {/* Messages List */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isAgent = msg.sender === 'agent';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
                  >
                    {isAgent && (
                      <span className="text-[10px] font-bold text-[#008069] mb-0.5 ml-1">
                        {t.waOfficerLabel}
                      </span>
                    )}

                    <div
                      className={`relative max-w-[88%] rounded-xl p-2.5 shadow-2xs ${
                        isUser
                          ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                          : isAgent
                          ? 'bg-[#ffffff] border border-amber-300 text-[#111b21] rounded-tl-none'
                          : 'bg-[#ffffff] text-[#111b21] rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line text-[11.5px] leading-relaxed font-normal">
                        {msg.text}
                      </div>

                      {/* DOCUMENT OUTPUT 1: DIGITAL TIN CARD */}
                      {msg.tinCard && (
                        <div className="mt-2.5 p-2.5 bg-gradient-to-br from-zinc-900 to-black rounded-xl text-white space-y-2 shadow-md border border-amber-400/40">
                          <div className="flex items-center justify-between border-b border-zinc-700/80 pb-1.5">
                            <div className="flex items-center space-x-1.5">
                              <img src="/tra-logo.png" alt="TRA" className="w-4 h-4 object-contain" />
                              <span className="font-bold text-[10px] text-amber-400 tracking-wider">
                                TRA TIN CERTIFICATE
                              </span>
                            </div>
                            <span className="text-[8.5px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                              {msg.tinCard.status}
                            </span>
                          </div>

                          <div className="space-y-1 text-[10px]">
                            <div>
                              <span className="text-zinc-400 block text-[9px]">Taxpayer Identification Number (TIN):</span>
                              <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                                {msg.tinCard.tin}
                              </span>
                            </div>
                            <div className="flex justify-between pt-0.5">
                              <div>
                                <span className="text-zinc-400 block text-[8.5px]">Taxpayer:</span>
                                <span className="font-semibold text-white">{msg.tinCard.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-zinc-400 block text-[8.5px]">Business:</span>
                                <span className="font-semibold text-amber-300">{msg.tinCard.businessName}</span>
                              </div>
                            </div>
                            <div className="text-[9px] text-zinc-300 pt-0.5 border-t border-zinc-800">
                              <span>Station: {msg.tinCard.location}</span>
                            </div>
                          </div>

                          <div className="pt-1 border-t border-dashed border-zinc-700 flex items-center justify-between text-[9px] text-zinc-400">
                            <span>Issued: {msg.tinCard.issuedAt}</span>
                            <span className="font-mono text-amber-400/90">✓ Official Digital Seal</span>
                          </div>
                        </div>
                      )}

                      {/* DOCUMENT OUTPUT 2: TAX ASSESSMENT SLIP */}
                      {msg.assessmentSlip && (
                        <div className="mt-2.5 p-2.5 bg-zinc-50 rounded-xl border-2 border-zinc-300 text-zinc-900 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                            <div className="flex items-center space-x-1 text-black font-bold text-[10px]">
                              <FileText className="w-3.5 h-3.5 text-amber-600" />
                              <span>TAX ASSESSMENT SLIP</span>
                            </div>
                            <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              {msg.assessmentSlip.status}
                            </span>
                          </div>

                          <div className="text-[10px] space-y-1 text-zinc-700">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Period:</span>
                              <span className="font-bold text-black">{msg.assessmentSlip.period}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Recorded Turnover:</span>
                              <span className="font-semibold text-black">TZS {msg.assessmentSlip.turnover.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[9px]">
                              <span className="text-zinc-500">Bracket:</span>
                              <span className="text-right text-zinc-800 font-medium">{msg.assessmentSlip.bracket}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-1 border-t border-zinc-200 text-black text-xs">
                              <span>Presumptive Tax Due:</span>
                              <span className="text-emerald-700">TZS {msg.assessmentSlip.netPayable.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="text-[9px] text-zinc-500 text-center pt-0.5 italic">
                            Calculated directly from verified digital receipts.
                          </div>
                        </div>
                      )}

                      {/* DOCUMENT OUTPUT 3: DIGITAL BLOCKCHAIN RECEIPT */}
                      {msg.receipt && (
                        <div className="mt-2.5 p-2 bg-[#f0f2f5] rounded-xl border border-slate-300 space-y-1 text-[#111b21] shadow-2xs">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                            <span className="font-bold text-[10px] tracking-wide text-slate-800 flex items-center space-x-1">
                              <img src="/tra-logo.png" className="w-3 h-3 object-contain" alt="" />
                              <span>{t.waReceiptTitle}</span>
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              {t.waReceiptBadge}
                            </span>
                          </div>
                          <div className="text-[10px] space-y-0.5 text-slate-700">
                            <div className="font-bold text-black">{msg.receipt.traderName}</div>
                            <div>Rice x3: <span className="font-semibold text-black">TZS 45,000</span></div>
                            <div className="pt-1 border-t border-slate-200 flex justify-between items-center text-[10px]">
                              <span className="text-slate-500">{t.waCode}</span>
                              <span className="font-mono font-bold text-black bg-white px-1.5 py-0.2 rounded border border-slate-300">
                                {msg.receipt.verificationCode}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => onVerifyReceipt(msg.receipt!.verificationCode)}
                            className="w-full mt-1.5 py-1 px-2 bg-[#008069] hover:bg-[#006a57] text-white font-bold rounded text-[10px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{t.waVerifyBtn}</span>
                          </button>
                        </div>
                      )}

                      {/* DOCUMENT OUTPUT 4: TAX CLEARANCE CERTIFICATE */}
                      {msg.clearanceCert && (
                        <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl border-2 border-amber-300 text-zinc-900 space-y-2 shadow-sm">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                            <div className="flex items-center space-x-1.5">
                              <Award className="w-4 h-4 text-amber-700" />
                              <span className="font-bold text-[10px] text-amber-900">
                                TAX CLEARANCE CERTIFICATE
                              </span>
                            </div>
                            <span className="text-[8.5px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              {msg.clearanceCert.status}
                            </span>
                          </div>

                          <div className="text-[10px] space-y-1">
                            <div>
                              <span className="text-zinc-500 block text-[9px]">Certificate Serial No:</span>
                              <span className="font-mono font-bold text-black">{msg.clearanceCert.certNo}</span>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <span className="text-zinc-500 block text-[8.5px]">Taxpayer:</span>
                                <span className="font-bold text-black">{msg.clearanceCert.taxpayerName}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-zinc-500 block text-[8.5px]">TIN:</span>
                                <span className="font-mono font-bold text-black">{msg.clearanceCert.tin}</span>
                              </div>
                            </div>
                            <div className="text-[9px] text-zinc-600 pt-0.5 border-t border-amber-200">
                              <span>Valid Until: <strong>{msg.clearanceCert.validUntil}</strong></span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-1.5 rounded border border-amber-200 text-[8.5px] text-amber-900 text-center font-medium">
                            ✓ Legally approved for banking, commercial licenses & tenders.
                          </div>
                        </div>
                      )}

                      {/* DOCUMENT OUTPUT 5: LIVE OFFICER HANDOVER TICKET */}
                      {msg.officerTicket && (
                        <div className="mt-2.5 p-2 bg-zinc-900 text-white rounded-xl border border-zinc-700 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[10px]">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>TRA SUPPORT DISPATCH</span>
                            </div>
                            <span className="text-[8.5px] bg-emerald-950 text-emerald-400 font-mono px-1.5 py-0.2 rounded border border-emerald-800">
                              CONNECTED
                            </span>
                          </div>

                          <div className="text-[10px] space-y-0.5">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Assigned Officer:</span>
                              <span className="font-bold text-white">{msg.officerTicket.officerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Station Desk:</span>
                              <span className="text-right text-zinc-300">{msg.officerTicket.station}</span>
                            </div>
                            <div className="flex justify-between pt-0.5 border-t border-zinc-800">
                              <span className="text-zinc-400">Ticket ID:</span>
                              <span className="font-mono text-amber-400">{msg.officerTicket.ticketId}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timestamp & Blue Ticks */}
                      <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-[#667781]">
                        <span>{msg.timestamp}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-[#53bdeb] inline" />}
                      </div>
                    </div>

                    {/* Quick Action Options */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="mt-1 space-y-1 max-w-[88%] w-full">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.action, opt.value)}
                            className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 text-[#008069] font-medium px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between shadow-2xs cursor-pointer transition-colors"
                          >
                            <span className="truncate">{opt.label}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="bg-white text-slate-400 text-xs px-2.5 py-1 rounded-lg rounded-tl-none w-16 shadow-2xs flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp Input Bar */}
            <div className="bg-[#f0f2f5] p-2 flex items-center space-x-1.5 border-t border-slate-200 z-30 shrink-0">
              <form onSubmit={handleSend} className="flex-1 flex items-center bg-white rounded-full px-3 py-1.5 border border-slate-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.waTypePlaceholder}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </form>
              {inputText.trim() ? (
                <button
                  onClick={() => handleSend()}
                  className="w-7 h-7 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#008f6f] cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3 ml-0.5" />
                </button>
              ) : (
                <button className="w-7 h-7 rounded-full bg-[#00a884] text-white flex items-center justify-center cursor-pointer">
                  <Mic className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Mobile Money Prompt Modal */}
            {showStkPush && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3">
                <div className="w-full max-w-[270px] bg-white rounded-2xl p-3.5 shadow-2xl border border-slate-200 text-slate-900">
                  <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {stkMethod} {t.waStkCheckout}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1 mb-2.5 text-slate-700">
                    <p>
                      {t.waStkPayTo}
                    </p>
                    <p className="text-[10px] text-slate-500">TIN: 123-456-789</p>
                  </div>

                  <form onSubmit={handleStkSubmit} className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-1">
                        {t.waStkPinLabel}
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        autoFocus
                        value={stkPin}
                        onChange={(e) => setStkPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1 px-3 text-center text-base tracking-widest font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {stkProcessing ? (
                      <div className="py-1 text-center text-xs text-emerald-700 font-medium">
                        {t.waStkProcessing}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowStkPush(false)}
                          className="py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          {t.waStkCancel}
                        </button>
                        <button
                          type="submit"
                          disabled={stkPin.length < 4}
                          className="py-1 rounded-lg bg-[#008069] hover:bg-[#006a57] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                        >
                          {t.waStkConfirm}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-900 rounded-full z-40"></div>
        </div>
      </div>
    </div>
  );
};
