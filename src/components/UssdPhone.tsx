import React, { useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { sounds } from '../utils/sound';
import { Language, Receipt, Trader } from '../types';
import { translations } from '../utils/i18n';

interface UssdPhoneProps {
  trader: Trader | null;
  onRecordSaleUssd: (amount: number, desc: string) => void;
  onRegisterTraderUssd: (name: string, type: string) => void;
  onPayTaxUssd: () => void;
  allReceipts: Receipt[];
  lang: Language;
}

export const UssdPhone: React.FC<UssdPhoneProps> = ({
  trader,
  onRecordSaleUssd,
  onRegisterTraderUssd,
  onPayTaxUssd,
  allReceipts,
  lang,
}) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<'MAIN' | 'REGISTER' | 'SALE' | 'TAX' | 'AGENT' | 'SUCCESS'>('MAIN');
  const [screenText, setScreenText] = useState('');
  const [inputBuffer, setInputBuffer] = useState('');

  const t = translations[lang];
  const isSw = lang === 'sw';
  const totalSales = allReceipts.reduce((acc, r) => acc + r.totalAmount, 0) || 210000;

  const handleKeyPress = (char: string) => {
    sounds.playKeypadClick();
    if (inputBuffer.length < 12) {
      setInputBuffer(prev => prev + char);
    }
  };

  const handleClear = () => {
    sounds.playKeypadClick();
    if (inputBuffer.length > 0) {
      setInputBuffer(prev => prev.slice(0, -1));
    } else if (sessionActive && currentStep !== 'MAIN') {
      setCurrentStep('MAIN');
    }
  };

  const handleCall = () => {
    sounds.playKeypadClick();
    setSessionActive(true);
    setCurrentStep('MAIN');
    setInputBuffer('');
  };

  const handleEnd = () => {
    sounds.playKeypadClick();
    setSessionActive(false);
    setCurrentStep('MAIN');
    setInputBuffer('');
  };

  const handleSend = () => {
    sounds.playKeypadClick();
    const val = inputBuffer.trim();
    setInputBuffer('');

    if (!sessionActive) {
      if (val === '*152*00#' || val === '' || val === '1') {
        handleCall();
      }
      return;
    }

    if (currentStep === 'MAIN') {
      if (val === '1') {
        setCurrentStep('REGISTER');
      } else if (val === '2') {
        setCurrentStep('SALE');
      } else if (val === '3') {
        setCurrentStep('TAX');
      } else if (val === '4') {
        setCurrentStep('AGENT');
      }
    } else if (currentStep === 'REGISTER') {
      onRegisterTraderUssd('Juma Bakari', 'Market Stall');
      setCurrentStep('SUCCESS');
      setScreenText(isSw ? "Umesajiliwa! TIN: 123-456-789" : "Registered! TIN: 123-456-789");
    } else if (currentStep === 'SALE') {
      const amt = parseInt(val) || 45000;
      onRecordSaleUssd(amt, isSw ? 'Mchele x3' : 'Rice x3');
      setCurrentStep('SUCCESS');
      setScreenText(isSw ? `Mauzo TZS ${amt.toLocaleString()} yamerekodiwa!` : `Sale TZS ${amt.toLocaleString()} recorded!`);
    } else if (currentStep === 'TAX') {
      if (val === '1') {
        onPayTaxUssd();
        setCurrentStep('SUCCESS');
        setScreenText(t.ussdDonePaid);
      } else {
        setCurrentStep('MAIN');
      }
    } else {
      setCurrentStep('MAIN');
    }
  };

  return (
    <div className="relative mx-auto w-[310px] select-none">
      {/* Realistic Nokia Chassis - Exactly matching user image */}
      <div className="w-full bg-gradient-to-b from-[#24262a] via-[#1e2023] to-[#17181a] rounded-[48px] p-4 shadow-2xl border-4 border-[#33363c] flex flex-col items-center">
        
        {/* Top Speaker Grille with Centered Slit */}
        <div className="flex items-center space-x-1.5 mb-2.5 mt-1">
          <div className="w-1.5 h-1 bg-zinc-600 rounded-full"></div>
          <div className="w-9 h-1.5 bg-zinc-700 rounded-full border border-zinc-600"></div>
          <div className="w-1.5 h-1 bg-zinc-600 rounded-full"></div>
        </div>

        {/* Nokia Branding */}
        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
          NOKIA
        </div>

        {/* Screen Bezel Frame */}
        <div className="w-full bg-[#18191b] p-2.5 rounded-2xl border-2 border-zinc-700/80 shadow-inner">
          {/* Authentic Nokia 1110 Monochrome Amber/Green LCD Screen */}
          <div className="w-full h-44 bg-[#9db874] rounded-lg p-2.5 shadow-inner border border-[#6b824a] font-mono text-[#18210f] flex flex-col justify-between overflow-hidden">
            
            {/* Status Line */}
            <div className="flex items-center justify-between border-b border-[#7d9758] pb-0.5 text-[10px] font-bold">
              <span>📶 TRA NET</span>
              <span>12:30</span>
              <span>🔋 [||||]</span>
            </div>

            {/* Main LCD Dynamic Display */}
            <div className="flex-1 py-1.5 text-[11.5px] font-bold leading-tight tracking-tight flex flex-col justify-center">
              {!sessionActive ? (
                <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                  <span className="text-xs tracking-wider">TRA RAFIKI</span>
                  <span className="text-[10.5px]">Dial *152*00#</span>
                  <button
                    onClick={handleCall}
                    className="mt-1 px-4 py-1 bg-[#243314] text-[#9db874] rounded text-[11px] font-bold cursor-pointer hover:bg-[#1a250e] active:scale-95 transition-transform"
                  >
                    DIAL
                  </button>
                </div>
              ) : currentStep === 'MAIN' ? (
                <div className="space-y-0.5 text-left w-full pl-1">
                  <div className="underline text-center mb-0.5">TRA RAFIKI (USSD)</div>
                  <div>1. {isSw ? 'Sajili biashara' : 'Register'}</div>
                  <div>2. {isSw ? 'Rekodi mauzo' : 'Record sale'}</div>
                  <div>3. {isSw ? 'Kadiria kodi' : 'Estimate tax'}</div>
                  <div>4. {isSw ? 'Afisa wa TRA' : 'Talk to agent'}</div>
                </div>
              ) : currentStep === 'REGISTER' ? (
                <div className="space-y-0.5 text-left w-full pl-1">
                  <div className="font-bold underline">1. {isSw ? 'USAJILI' : 'REGISTER'}</div>
                  <div className="text-[10px]">{isSw ? 'Weka jina la biashara:' : 'Enter business name:'}</div>
                  <div className="text-[9px] text-[#2d3d1a] pt-1">{isSw ? 'Kisha bonyeza SELECT' : 'Then press SELECT'}</div>
                </div>
              ) : currentStep === 'SALE' ? (
                <div className="space-y-0.5 text-left w-full pl-1">
                  <div className="font-bold underline">2. {isSw ? 'REKODI MAUZO' : 'RECORD SALE'}</div>
                  <div className="text-[10px]">{isSw ? 'Kiasi (mfano 45000):' : 'Amount (e.g. 45000):'}</div>
                  <div className="text-[9px] text-[#2d3d1a] pt-1">{isSw ? 'Risiti itatumwa kwa SMS' : 'SMS receipt sent'}</div>
                </div>
              ) : currentStep === 'TAX' ? (
                <div className="space-y-0.5 text-left w-full pl-1">
                  <div className="font-bold underline">3. {isSw ? 'KADIRIO LA KODI' : 'TAX ESTIMATE'}</div>
                  <div>{isSw ? 'Mauzo:' : 'Sales:'} TZS {totalSales.toLocaleString()}</div>
                  <div>{isSw ? 'Kodi:' : 'Tax:'} TZS 18,000</div>
                  <div className="pt-0.5">1. {isSw ? 'Lipa sasa (M-Pesa)' : 'Pay now (M-Pesa)'}</div>
                </div>
              ) : currentStep === 'AGENT' ? (
                <div className="space-y-0.5 text-left w-full pl-1">
                  <div className="font-bold underline">4. {isSw ? 'AFISA WA TRA' : 'TRA AGENT'}</div>
                  <div className="text-[10px]">{isSw ? 'Tunakuunganisha... Utapigiwa ndani ya dk 2.' : 'Connecting... Agent calls back in 2 min.'}</div>
                </div>
              ) : (
                <div className="space-y-0.5 text-center pt-1">
                  <div className="font-bold text-xs">{t.ussdSuccess}</div>
                  <div className="text-[10.5px]">{screenText}</div>
                </div>
              )}
            </div>

            {/* Bottom LCD Line */}
            <div className="border-t border-[#7d9758] pt-0.5 flex items-center justify-between text-[11px] font-bold">
              <span>[{inputBuffer || '_'}]</span>
              <div className="flex space-x-2 text-[10px]">
                <span className="cursor-pointer underline" onClick={handleSend}>{t.ussdSelect}</span>
                <span className="cursor-pointer underline" onClick={handleClear}>{t.ussdClear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nokia 1110 Iconic Soft Keys & Directional Navi-Key */}
        <div className="w-full mt-3 px-1">
          {/* Top Control Row */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <button
              onClick={handleSend}
              className="h-8 bg-[#2d2f32] hover:bg-[#383b40] active:scale-95 text-[#e5e7eb] rounded-xl text-[11px] font-bold shadow border-t border-zinc-600 flex items-center justify-center cursor-pointer transition-transform"
            >
              {t.ussdSelect}
            </button>

            {/* Central 4-Way Navi-Key Button with Center Dimple */}
            <div 
              onClick={handleSend}
              className="h-10 bg-gradient-to-b from-[#3a3d42] to-[#25272a] rounded-xl border border-zinc-600 shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-700 shadow-inner"></div>
            </div>

            <button
              onClick={handleClear}
              className="h-8 bg-[#2d2f32] hover:bg-[#383b40] active:scale-95 text-[#e5e7eb] rounded-xl text-[11px] font-bold shadow border-t border-zinc-600 flex items-center justify-center cursor-pointer transition-transform"
            >
              {t.ussdClear}
            </button>
          </div>

          {/* Call & End Row */}
          <div className="grid grid-cols-2 gap-3 mb-2 px-1">
            <button
              onClick={handleCall}
              className="h-9 bg-[#1b7e3a] hover:bg-[#239243] active:scale-95 text-white rounded-xl shadow-md border-t border-emerald-400 flex items-center justify-center cursor-pointer transition-transform"
              title="Call / Start USSD"
            >
              <Phone className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleEnd}
              className="h-9 bg-[#b82828] hover:bg-[#cc3232] active:scale-95 text-white rounded-xl shadow-md border-t border-rose-400 flex items-center justify-center cursor-pointer transition-transform"
              title="End / Power"
            >
              <PhoneOff className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Nokia 1110 Rubber Numeric Keypad */}
        <div className="w-full mt-1 grid grid-cols-3 gap-2 px-1 pb-1">
          {[
            { num: '1', letters: '._@' },
            { num: '2', letters: 'abc' },
            { num: '3', letters: 'def' },
            { num: '4', letters: 'ghi' },
            { num: '5', letters: 'jkl' },
            { num: '6', letters: 'mno' },
            { num: '7', letters: 'pqrs' },
            { num: '8', letters: 'tuv' },
            { num: '9', letters: 'wxyz' },
            { num: '*', letters: '+' },
            { num: '0', letters: ' ' },
            { num: '#', letters: '⇧' },
          ].map(({ num, letters }) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-10 bg-[#292b2e] hover:bg-[#34373b] active:scale-95 rounded-xl border-t border-zinc-600 shadow-md flex flex-col items-center justify-center text-white cursor-pointer transition-all"
            >
              <span className="font-extrabold text-sm leading-none">{num}</span>
              <span className="text-[8px] text-zinc-400 uppercase tracking-tighter mt-0.5">{letters}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
