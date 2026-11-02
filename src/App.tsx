import React, { useState } from 'react';
import { PitchBar, ActiveTab } from './components/PitchBar';
import { JourneySteps } from './components/JourneySteps';
import { WhatsAppChat } from './components/WhatsAppChat';
import { UssdPhone } from './components/UssdPhone';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { AdminDashboard } from './components/AdminDashboard';
import { Block, ChatMessage, EscalatedTicket, Language, Receipt, TaxReturn, Trader } from './types';
import { createNewBlock, INITIAL_BLOCKS, INITIAL_RECEIPTS } from './utils/blockchain';
import { getInitialMessages, processUserInput } from './utils/conversation';
import { translations } from './utils/i18n';
import { sounds } from './utils/sound';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('whatsapp');
  const [lang, setLang] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const t = translations[lang];

  // Trader state
  const [trader, setTrader] = useState<Trader | null>({
    id: 'trader-init',
    name: 'Alfred D. Mashauri',
    businessName: 'Green Market Stall',
    businessType: 'Market Stall',
    location: 'Kariakoo, Dar es Salaam',
    phone: '+255 767 749 919',
    tin: '123-456-789',
    registeredAt: '2026-10-15 08:30:00',
    channel: 'WhatsApp',
  });

  const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages('en', trader));
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVerificationCode, setSelectedVerificationCode] = useState('TRA-8F3K-29QX');

  const [currentTaxReturn, setCurrentTaxReturn] = useState<TaxReturn>({
    period: 'October 2026',
    totalSales: 210000,
    taxableTurnover: 210000,
    transactionCount: 3,
    presumptiveRate: '3.5%',
    taxDue: 18000,
    isPaid: false,
  });

  const [escalatedTicket, setEscalatedTicket] = useState<EscalatedTicket | null>({
    id: 'ESC-2026-901',
    traderPhone: '+255 767 749 919',
    traderName: 'Alfred D. Mashauri',
    businessType: 'Market Stall',
    tin: '123-456-789',
    issue: 'Payment clarification',
    status: 'OPEN',
    timestamp: '2026-10-31 09:38',
    lastMessage: 'I need help with a payment: Can I get my official tax clearance certificate after M-Pesa?',
    historySummary: '3 receipts recorded. Turnover TZS 210,000.',
  });

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const handleLanguageToggle = () => {
    const nextLang = lang === 'en' ? 'sw' : 'en';
    setLang(nextLang);
    setMessages(getInitialMessages(nextLang, trader));
  };

  const handleSendMessage = async (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(async () => {
      const result = processUserInput(text, lang, trader, receipts, currentTaxReturn);
      setIsTyping(false);

      if (result.updatedTrader) {
        setTrader(result.updatedTrader);
      }

      if (result.newReceipt) {
        const { newBlock, updatedReceipt } = await createNewBlock(result.newReceipt as Receipt, blocks);
        setBlocks(prev => [...prev, newBlock]);
        setReceipts(prev => [updatedReceipt, ...prev]);
        setSelectedVerificationCode(updatedReceipt.verificationCode);
      }

      setMessages(prev => [...prev, ...result.messages]);
      sounds.playMessageTone();
    }, 400);
  };

  const handleSelectAction = (action: string, value?: string) => {
    if (action === 'flow_register') {
      setCurrentStep(1);
      setShowSplash(false);
      handleSendMessage(lang === 'sw' ? 'Sajili biashara' : 'Register');
    } else if (action === 'flow_sale') {
      setCurrentStep(2);
      setShowSplash(false);
      handleSendMessage(lang === 'sw' ? 'Mauzo: TZS 45,000' : 'Sale: TZS 45,000');
    } else if (action === 'flow_tax') {
      setCurrentStep(3);
      setShowSplash(false);
      handleSendMessage(lang === 'sw' ? 'Kadiria kodi yangu' : 'Estimate my tax');
    } else if (action === 'flow_agent') {
      setCurrentStep(5);
      setShowSplash(false);
      handleSendMessage(lang === 'sw' ? 'Nahitaji msaada wa afisa' : 'Talk to an agent');
    } else if (action === 'pay_choose_method') {
      handleSendMessage(lang === 'sw' ? 'Ndio, lipa' : 'Yes, pay');
    } else if (action === 'reg_type' && value) {
      handleSendMessage(value);
    } else if (action === 'menu') {
      setMessages(getInitialMessages(lang, trader));
    } else {
      handleSendMessage(value || action);
    }
  };

  const handleCompletePayment = async (method: 'M-Pesa' | 'Mixx by Yas' | 'Airtel Money') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setCurrentTaxReturn(prev => ({
      ...prev,
      isPaid: true,
      paymentMethod: method,
      paidAt: new Date().toISOString(),
    }));

    const confirmMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: lang === 'sw' 
        ? `✓ Imelipwa kupitia ${method}. Risiti na cheti vimetumwa.` 
        : `✓ Paid via ${method}. Receipt and Tax Clearance Certificate issued.`,
      timestamp: time,
      options: [
        { label: lang === 'sw' ? 'Rudi menyu' : 'Main menu', action: 'menu' },
      ]
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  const handleRecordSaleUssd = async (amount: number, desc: string) => {
    const partial: Partial<Receipt> = {
      id: `tx-ussd-${Date.now()}`,
      verificationCode: 'TRA-8F3K-29QX',
      traderTin: trader?.tin || '123-456-789',
      traderName: trader?.businessName || 'Green Market Stall',
      businessType: trader?.businessType || 'Market Stall',
      location: 'Kariakoo',
      customerPhone: '+255 767 749 919',
      items: [{ desc, quantity: 1, unitPrice: amount, total: amount }],
      totalAmount: amount,
      vatAmount: Math.round(amount * 0.18),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    const { newBlock, updatedReceipt } = await createNewBlock(partial as Receipt, blocks);
    setBlocks(prev => [...prev, newBlock]);
    setReceipts(prev => [updatedReceipt, ...prev]);
    setSelectedVerificationCode(updatedReceipt.verificationCode);
  };

  const handleRegisterTraderUssd = (name: string, type: string) => {
    const newTrader: Trader = {
      id: 'trader-ussd',
      name: name,
      businessName: `${name} Stall`,
      businessType: 'Market Stall',
      location: 'Kariakoo',
      phone: '+255 684 844 096',
      tin: '123-456-789',
      registeredAt: new Date().toISOString(),
      channel: 'USSD'
    };
    setTrader(newTrader);
  };

  const handlePayTaxUssd = () => {
    sounds.playPaymentSuccess();
    setCurrentTaxReturn(prev => ({
      ...prev,
      isPaid: true,
      paymentMethod: 'M-Pesa',
      paidAt: new Date().toISOString(),
    }));
  };

  const handleSendOfficerReply = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const officerMsg: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text: text,
      timestamp: time,
    };
    setMessages(prev => [...prev, officerMsg]);
    sounds.playMessageTone();
    if (escalatedTicket) {
      setEscalatedTicket({ ...escalatedTicket, status: 'RESOLVED' });
    }
  };

  // Step trigger: Keeps phone stationary and navigates smoothly
  const handleSelectStep = (step: number) => {
    setCurrentStep(step);
    if (step === 1) {
      setShowSplash(false);
      if (activeTab !== 'whatsapp') setActiveTab('whatsapp');
      handleSendMessage(lang === 'sw' ? 'Sajili' : 'Register');
    } else if (step === 2) {
      setShowSplash(false);
      if (activeTab !== 'whatsapp') setActiveTab('whatsapp');
      handleSendMessage(lang === 'sw' ? 'Mauzo: TZS 45,000' : 'Sale: TZS 45,000');
    } else if (step === 3) {
      setShowSplash(false);
      if (activeTab !== 'whatsapp') setActiveTab('whatsapp');
      handleSendMessage(lang === 'sw' ? 'Kadiria kodi' : 'Estimate my tax');
    } else if (step === 4) {
      setActiveTab('blockchain');
      setSelectedVerificationCode('TRA-8F3K-29QX');
    } else if (step === 5) {
      setShowSplash(false);
      if (activeTab !== 'whatsapp') setActiveTab('whatsapp');
      handleSendMessage(lang === 'sw' ? 'Nahitaji msaada wa afisa' : 'Talk to an agent');
    } else if (step === 6) {
      setActiveTab('ussd');
    }
  };

  const handleResetDemo = () => {
    setCurrentStep(null);
    setShowSplash(true);
    setActiveTab('whatsapp');
    setBlocks(INITIAL_BLOCKS);
    setReceipts(INITIAL_RECEIPTS);
    setMessages(getInitialMessages(lang, trader));
    setSelectedVerificationCode('TRA-8F3K-29QX');
    setCurrentTaxReturn({
      period: 'October 2026',
      totalSales: 210000,
      taxableTurnover: 210000,
      transactionCount: 3,
      presumptiveRate: '3.5%',
      taxDue: 18000,
      isPaid: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col font-sans selection:bg-amber-300 selection:text-black">
      {/* Top Header */}
      <PitchBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        onResetDemo={handleResetDemo}
      />

      {/* Main Workspace: Vertical Steps on Left, Active View on Right */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* LEFT SIDE: Vertical Interactive Demonstration Flow */}
          <div className="w-full lg:w-80 shrink-0">
            <JourneySteps
              currentStep={currentStep}
              onSelectStep={handleSelectStep}
              lang={lang}
            />
          </div>

          {/* RIGHT SIDE: Main Interactive Area */}
          <div className="flex-1 w-full flex justify-center items-start min-h-[640px]">
            {/* 1. WHATSAPP VIEW (Realistic iPhone Mockup with Splash Screen, Fixed in Place) */}
            {activeTab === 'whatsapp' && (
              <div className="flex flex-col items-center w-full">
                <WhatsAppChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  trader={trader}
                  lang={lang}
                  onSelectAction={handleSelectAction}
                  onVerifyReceipt={(code) => {
                    setSelectedVerificationCode(code);
                    setActiveTab('blockchain');
                  }}
                  isTyping={isTyping}
                  onCompletePayment={handleCompletePayment}
                  showSplash={showSplash}
                  onDismissSplash={() => setShowSplash(false)}
                />
              </div>
            )}

            {/* 2. USSD BASIC PHONE VIEW */}
            {activeTab === 'ussd' && (
              <div className="flex flex-col items-center w-full py-2">
                <div className="text-center mb-3">
                  <h2 className="text-base font-bold text-black">{t.ussdTitle}</h2>
                  <p className="text-xs text-zinc-500">{t.ussdSubtitle}</p>
                </div>
                <UssdPhone
                  trader={trader}
                  onRecordSaleUssd={handleRecordSaleUssd}
                  onRegisterTraderUssd={handleRegisterTraderUssd}
                  onPayTaxUssd={handlePayTaxUssd}
                  allReceipts={receipts}
                  lang={lang}
                />
              </div>
            )}

            {/* 3. BLOCKCHAIN EXPLORER (Structured Table) */}
            {activeTab === 'blockchain' && (
              <div className="w-full">
                <BlockchainExplorer
                  blocks={blocks}
                  receipts={receipts}
                  selectedCode={selectedVerificationCode}
                  onCodeSelect={(c) => setSelectedVerificationCode(c)}
                  lang={lang}
                />
              </div>
            )}

            {/* 4. TRA DASHBOARD */}
            {activeTab === 'admin' && (
              <div className="w-full">
                <AdminDashboard
                  receipts={receipts}
                  trader={trader}
                  onVerifyReceipt={(code) => {
                    setSelectedVerificationCode(code);
                    setActiveTab('blockchain');
                  }}
                  onSendOfficerReply={handleSendOfficerReply}
                  escalatedTicket={escalatedTicket}
                  lang={lang}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Clean Minimalist Footer (Translated) */}
      <footer className="border-t border-zinc-200 bg-white py-3.5 px-4 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-black rounded p-0.5 flex items-center justify-center">
              <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-black">{t.footerOrg}</span>
          </div>
          <div className="text-zinc-600 font-medium">
            {t.footerNotice}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
