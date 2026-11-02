import React from 'react';
import { 
  LayoutDashboard, Layers, Smartphone, PhoneCall, 
  Volume2, VolumeX, Globe, RotateCcw 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

export type ActiveTab = 'admin' | 'blockchain' | 'whatsapp' | 'ussd';

interface PitchBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lang: Language;
  onLanguageToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onResetDemo: () => void;
}

export const PitchBar: React.FC<PitchBarProps> = ({
  activeTab,
  onTabChange,
  lang,
  onLanguageToggle,
  soundEnabled,
  onSoundToggle,
  onResetDemo,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Brand Title (Plain text, no box) */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/tra-logo.png" alt="TRA" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base md:text-lg text-black tracking-tight">
              {t.brandTitle}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {t.brandSubtitle}
            </span>
            <span className="text-xs text-zinc-400 hidden sm:inline">
              {t.brandOrg}
            </span>
          </div>
        </div>

        {/* Center: Navigation starting with TRA Dashboard, Blockchain Receipts, WhatsApp, USSD */}
        <nav className="hidden md:flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => onTabChange('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-black text-amber-400 shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.navDashboard}</span>
          </button>

          <button
            onClick={() => onTabChange('blockchain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'blockchain'
                ? 'bg-black text-amber-400 shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.navBlockchain}</span>
          </button>

          <button
            onClick={() => onTabChange('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-black text-amber-400 shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.navWhatsApp}</span>
          </button>

          <button
            onClick={() => onTabChange('ussd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'ussd'
                ? 'bg-black text-amber-400 shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.navUssd}</span>
          </button>
        </nav>

        {/* Right: Controls (Translate, Mute, Reset) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLanguageToggle}
            className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-amber-400 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
            title="Translate Page / Badilisha Lugha"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{lang === 'en' ? 'SW (Kiswahili)' : 'EN (English)'}</span>
          </button>

          <button
            onClick={onSoundToggle}
            className="p-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 cursor-pointer transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-black" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          <button
            onClick={onResetDemo}
            className="p-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-600 hover:text-black cursor-pointer transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-zinc-100 bg-zinc-50">
        {[
          { id: 'admin', label: t.navDashboard },
          { id: 'blockchain', label: t.navBlockchain },
          { id: 'whatsapp', label: t.navWhatsApp },
          { id: 'ussd', label: t.navUssd },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as ActiveTab)}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === item.id
                ? 'bg-black text-amber-400'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
