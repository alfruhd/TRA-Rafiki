import { ChatMessage, Language, Receipt, TaxReturn, Trader } from '../types';
import { generateVerificationCode } from './blockchain';

export interface BotResponseResult {
  messages: ChatMessage[];
  updatedTrader?: Trader;
  newReceipt?: Partial<Receipt>;
  newTaxReturn?: TaxReturn;
  isEscalated?: boolean;
}

export function getInitialMessages(lang: Language, trader?: Trader | null): ChatMessage[] {
  const isSw = lang === 'sw';
  
  return [
    {
      id: 'init-1',
      sender: 'bot',
      text: isSw
        ? `Karibu TRA Rafiki! Chagua huduma:\n1) Sajili biashara\n2) Rekodi mauzo (Risiti)\n3) Kadiria kodi\n4) Ongea na afisa wa TRA`
        : `Karibu! Welcome to TRA Rafiki.\nChoose:\n1) Register\n2) Record sale\n3) Estimate my tax\n4) Talk to an agent`,
      timestamp: '9:38',
      options: [
        { label: isSw ? '1) Sajili biashara' : '1) Register', action: 'flow_register' },
        { label: isSw ? '2) Rekodi mauzo' : '2) Record sale', action: 'flow_sale' },
        { label: isSw ? '3) Kadiria kodi' : '3) Estimate tax', action: 'flow_tax' },
        { label: isSw ? '4) Ongea na afisa' : '4) Talk to an agent', action: 'flow_agent' },
      ],
    },
  ];
}

export function processUserInput(
  input: string,
  lang: Language,
  trader: Trader | null,
  allReceipts: Receipt[],
  currentReturn: TaxReturn
): BotResponseResult {
  const isSw = lang === 'sw';
  const clean = input.trim().toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. REGISTRATION
  if (clean.includes('register') || clean.includes('sajili') || clean === '1') {
    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw ? 'Aina ya biashara yako ni ipi?' : 'What is your business type?',
        timestamp: time,
        options: [
          { label: isSw ? 'Kibanda cha sokoni' : 'Market stall', action: 'reg_type', value: 'Market stall' },
          { label: 'Bodaboda / Bajaji', action: 'reg_type', value: 'Bodaboda' },
          { label: isSw ? 'Duka la reja reja' : 'Retail shop', action: 'reg_type', value: 'Retail shop' },
        ]
      }]
    };
  }

  // Handle business type picked -> Outputs Digital TIN Certificate Card!
  if (clean.includes('market stall') || clean.includes('kibanda') || clean.includes('bodaboda') || clean.includes('retail') || clean.includes('shop')) {
    const newTin = '123-456-789';
    const newTrader: Trader = {
      id: 'trader-' + Date.now(),
      name: 'Alfred D. Mashauri',
      businessName: 'Green Market Stall',
      businessType: 'Market Stall',
      location: 'Kariakoo, Dar es Salaam',
      phone: '+255 767 749 919',
      tin: newTin,
      registeredAt: new Date().toISOString(),
      channel: 'WhatsApp'
    };

    return {
      updatedTrader: newTrader,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `✓ Umesajiliwa! Hiki hapa cheti chako rasmi cha mlipakodi (TIN Card):`
            : `✓ Registered! Here is your official TRA Taxpayer Identification Card (TIN Card):`,
          timestamp: time,
          tinCard: {
            tin: newTin,
            name: newTrader.name,
            businessName: newTrader.businessName,
            location: newTrader.location,
            category: 'Micro & Informal Sector (Presumptive)',
            issuedAt: new Date().toLocaleDateString(),
            status: isSw ? 'HAI NA IMETHIBITISHWA' : 'ACTIVE & VERIFIED'
          },
          options: [
            { label: isSw ? 'Rekodi mauzo ya kwanza' : 'Record first sale', action: 'flow_sale' },
            { label: isSw ? 'Kadiria kodi' : 'Estimate tax', action: 'flow_tax' }
          ]
        }
      ]
    };
  }

  // 2. RECORD SALE / RECEIPT -> Outputs Digital Blockchain Receipt
  if (clean.includes('sale') || clean.includes('mauzo') || clean.includes('45,000') || clean === '2' || clean.includes('rice') || clean.includes('mchele')) {
    const code = 'TRA-8F3K-29QX';
    const amount = 45000;
    const todayTotal = 210000;

    const partialReceipt: Partial<Receipt> = {
      id: `tx-${Date.now()}`,
      verificationCode: code,
      traderTin: trader?.tin || '123-456-789',
      traderName: trader?.businessName || 'Green Market Stall',
      businessType: trader?.businessType || 'Market Stall',
      location: 'Kariakoo, Dar es Salaam',
      customerPhone: '+255 767 749 919',
      items: [
        { desc: isSw ? 'Mchele Daraja 1 (Gunia 5kg x3)' : 'Rice Grade 1 (5kg bag x3)', quantity: 3, unitPrice: 15000, total: 45000 }
      ],
      totalAmount: amount,
      vatAmount: 8100,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    return {
      newReceipt: partialReceipt,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `✓ Mauzo yamerekodiwa kwenye Blockchain! Risiti imetumwa kwa mteja:`
            : `✓ Recorded on TRA Blockchain! Digital receipt generated:`,
          timestamp: time,
          receipt: partialReceipt as Receipt,
          options: [
            { label: isSw ? 'Kadiria kodi ya mwezi' : 'Check tax due', action: 'flow_tax' },
            { label: isSw ? 'Rekodi mauzo mengine' : 'Record another sale', action: 'flow_sale' },
          ]
        }
      ]
    };
  }

  // 3. TAX ESTIMATION -> Outputs Official Presumptive Tax Assessment Slip
  if (clean.includes('estimate') || clean.includes('tax') || clean.includes('kodi') || clean.includes('file') || clean === '3' || clean.includes('return')) {
    return {
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `Mwisho wa mwezi: Marejesho yako yamejazwa kiotomatiki kutoka kwenye risiti zako za blockchain.`
            : `Month-end: your return is pre-filled automatically from your verified blockchain receipts.`,
          timestamp: time,
          assessmentSlip: {
            period: 'October 2026',
            turnover: 210000,
            bracket: isSw ? 'Kodi ya Makadirio (Mauzo chini ya TZS 4,000,000)' : 'Presumptive Schedule (Under TZS 4,000,000 / mo)',
            taxDue: 18000,
            deductions: 0,
            netPayable: 18000,
            status: isSw ? 'INASUBIRI MALIPO' : 'PAYMENT DUE'
          },
          paymentPrompt: {
            amount: 18000,
            period: 'October 2026'
          },
          options: [
            { label: isSw ? 'Ndio, lipa sasa' : 'Yes, pay now', action: 'pay_choose_method' },
            { label: isSw ? 'Baadaye' : 'Later', action: 'menu' },
          ]
        }
      ]
    };
  }

  // Payment method selection
  if (clean.includes('pay') || clean.includes('lipa') || clean.includes('yes') || clean.includes('ndio') || clean.includes('pay_choose_method')) {
    return {
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `Chagua mtandao wa malipo:\n1) M-Pesa (Vodacom)\n2) Mixx by Yas (Tigo/Yas)\n3) Airtel Money`
            : `Choose how to pay:\n1) M-Pesa (Vodacom)\n2) Mixx by Yas\n3) Airtel Money`,
          timestamp: time,
          options: [
            { label: '1) M-Pesa', action: 'trigger_stk', value: 'M-Pesa' },
            { label: '2) Mixx by Yas', action: 'trigger_stk', value: 'Mixx by Yas' },
            { label: '3) Airtel Money', action: 'trigger_stk', value: 'Airtel Money' },
          ]
        }
      ]
    };
  }

  // 4. TALK TO AGENT MENU
  if (clean.includes('agent') || clean.includes('afisa') || clean.includes('help') || clean.includes('msaada') || clean === '4') {
    return {
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `Karibu kwenye kituo cha huduma cha TRA. Chagua unachohitaji kufanya:`
            : `Welcome to the TRA Assistance Desk. Select what you would like to view or request:`,
          timestamp: time,
          options: [
            { label: isSw ? '📄 Taarifa za Akaunti & TIN Card' : '📄 Account & TIN details', action: 'faq_account' },
            { label: isSw ? '📊 Hesabu ya Kodi & Slip ya Makadirio' : '📊 Tax rates & calculations', action: 'faq_rates' },
            { label: isSw ? '🧾 Risiti ya Kidijitali & Uhakiki' : '🧾 Digital receipts & verification', action: 'faq_receipts' },
            { label: isSw ? '🏆 Cheti cha Mlipakodi (Tax Clearance)' : '🏆 Tax Clearance Certificate', action: 'faq_clearance' },
            { label: isSw ? '👤 Ongea na Afisa wa TRA Moja kwa Moja' : '👤 Connect to live officer', action: 'agent_live' },
          ]
        }
      ]
    };
  }

  // SIMULATION 1: Account & TIN Details -> OUTPUT: OFFICIAL DIGITAL TIN CARD
  if (clean.includes('faq_account') || clean.includes('account') || clean.includes('akaunti') || clean.includes('tin')) {
    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw
          ? `Huu hapa wasifu wako rasmi wa mlipakodi na kadi yako ya TIN kutoka Mamlaka ya Mapato Tanzania:`
          : `Here is your official taxpayer registration profile and digital TIN card from Tanzania Revenue Authority:`,
        timestamp: time,
        tinCard: {
          tin: trader?.tin || '123-456-789',
          name: trader?.name || 'Alfred Damas Mashauri',
          businessName: trader?.businessName || 'Green Market Stall',
          location: trader?.location || 'Kariakoo, Ilala - Dar es Salaam',
          category: 'Micro & Informal Sector (Presumptive)',
          issuedAt: '15 Oct 2026',
          status: isSw ? 'HAI NA IMETHIBITISHWA' : 'ACTIVE & VERIFIED'
        },
        options: [
          { label: isSw ? 'Kadiria kodi ya mwezi' : 'Check tax due', action: 'flow_tax' },
          { label: isSw ? 'Maswali mengine' : 'Other options', action: 'flow_agent' },
        ]
      }]
    };
  }

  // SIMULATION 2: Tax rates & calculations -> OUTPUT: OFFICIAL ASSESSMENT SLIP
  if (clean.includes('faq_rates') || clean.includes('rate') || clean.includes('viwango') || clean.includes('calculate')) {
    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw
          ? `Hii hapa ripoti ya makadirio ya kodi (Presumptive Tax Assessment Slip) kulingana na mauzo yako yaliyorekodiwa:`
          : `Here is your official monthly Presumptive Tax Assessment Slip calculated from your verified ledger receipts:`,
        timestamp: time,
        assessmentSlip: {
          period: 'October 2026',
          turnover: 210000,
          bracket: isSw ? 'Kodi ya Makadirio (Mauzo chini ya TZS 4,000,000)' : 'Presumptive Schedule (Under TZS 4,000,000 / mo)',
          taxDue: 18000,
          deductions: 0,
          netPayable: 18000,
          status: isSw ? 'INASUBIRI MALIPO' : 'PAYMENT DUE'
        },
        options: [
          { label: isSw ? 'Lipa kodi sasa (TZS 18,000)' : 'Pay tax now (TZS 18,000)', action: 'pay_choose_method' },
          { label: isSw ? 'Rudi menyu' : 'Main menu', action: 'menu' },
        ]
      }]
    };
  }

  // SIMULATION 3: Digital receipts & verification -> OUTPUT: OFFICIAL BLOCKCHAIN DIGITAL RECEIPT
  if (clean.includes('faq_receipts') || clean.includes('receipt') || clean.includes('risiti')) {
    const code = 'TRA-8F3K-29QX';
    const sampleReceipt: Receipt = {
      id: 'rcpt-preview-01',
      verificationCode: code,
      traderTin: trader?.tin || '123-456-789',
      traderName: trader?.businessName || 'Green Market Stall',
      businessType: trader?.businessType || 'Market Stall',
      location: 'Kariakoo, Dar es Salaam',
      customerPhone: '+255 767 749 919',
      items: [
        { desc: isSw ? 'Mchele Daraja 1 (5kg x3)' : 'Rice Grade 1 (5kg bag x3)', quantity: 3, unitPrice: 15000, total: 45000 }
      ],
      totalAmount: 45000,
      vatAmount: 8100,
      timestamp: '2026-10-31 09:38:12',
      blockNumber: 1,
      blockHash: 'a41fe39b08d4a67812903ceef120ab56cd4902187b41eef554a9c680218f4a12',
      prevBlockHash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'
    };

    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw
          ? `Huu hapa mfano wa Risiti Halisi ya Kidijitali ya Blockchain. Kila mauzo yanatoa stakabadhi kama hii papo hapo:`
          : `Here is a sample official TRA Blockchain Digital Receipt. Every transaction produces an anchored receipt like this:`,
        timestamp: time,
        receipt: sampleReceipt,
        options: [
          { label: isSw ? 'Rekodi mauzo mapya' : 'Record new sale', action: 'flow_sale' },
          { label: isSw ? 'Rudi menyu' : 'Main menu', action: 'menu' },
        ]
      }]
    };
  }

  // SIMULATION 4: Tax Clearance Certificate -> OUTPUT: OFFICIAL DIGITAL TAX CLEARANCE CERTIFICATE
  if (clean.includes('faq_clearance') || clean.includes('clearance') || clean.includes('cheti')) {
    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw
          ? `🏆 Hiki hapa Cheti chako Rasmi cha Mlipakodi (Tax Clearance Certificate) kinachothibitisha kufuata sheria za kodi:`
          : `🏆 Here is your official TRA Tax Clearance Certificate (TCC) confirming full compliance for the current period:`,
        timestamp: time,
        clearanceCert: {
          certNo: 'TCC-2026-94812-DAR',
          taxpayerName: trader?.name || 'Alfred Damas Mashauri',
          businessName: trader?.businessName || 'Green Market Stall',
          tin: trader?.tin || '123-456-789',
          period: '2026/2027 Financial Year',
          validUntil: '31 October 2027',
          status: isSw ? 'IMETHIBITISHWA NA TRA' : 'VALID & CLEARED'
        },
        options: [
          { label: isSw ? 'Lipa kodi ya mwezi' : 'Pay monthly tax', action: 'pay_choose_method' },
          { label: isSw ? 'Rudi menyu' : 'Main menu', action: 'menu' },
        ]
      }]
    };
  }

  // SIMULATION 5: Connect to live officer -> OUTPUT: OFFICIAL LIVE OFFICER DISPATCH TICKET
  if (clean.includes('agent_live') || clean.includes('live') || clean.includes('officer') || clean.includes('payment')) {
    return {
      isEscalated: true,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: isSw
            ? `Tiketi yako ya huduma imefunguliwa na kupelekwa kwa Afisa wa TRA:`
            : `Your support ticket has been dispatched to a TRA Compliance Officer:`,
          timestamp: time,
          officerTicket: {
            officerName: 'Afisa Joseph M.',
            officerRole: isSw ? 'Msimamizi wa Kodi - Sekta Isiyo Rasmi' : 'Senior Tax Compliance Officer',
            station: 'Kariakoo Regional Office, Dar es Salaam',
            ticketId: 'TRA-LIVE-8921',
            attachedHistory: 'TIN 123-456-789 • 3 Receipts • Presumptive Bracket'
          }
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: isSw
            ? 'Habari Ndg. Alfred! Mimi ni Afisa Joseph wa kitengo cha kodi cha TRA. Nimepokea rekodi zako za mauzo na TIN. Nikusaidie nini leo?'
            : 'Hello Alfred! I am Officer Joseph from the TRA Informal Sector desk. I have your full ledger history and TIN in front of me. How can I assist you today?',
          timestamp: time,
          options: [
            { label: isSw ? 'Nahitaji msaada wa stakabadhi' : 'Need receipt assistance', action: 'faq_receipts' },
            { label: isSw ? 'Ufafanuzi wa makadirio' : 'Clarify my tax calculation', action: 'faq_rates' },
            { label: isSw ? 'Rudi menyu kuu' : 'Back to main menu', action: 'menu' },
          ]
        }
      ]
    };
  }

  // Fallback
  return {
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: isSw
          ? `Chagua huduma:\n1) Sajili\n2) Rekodi mauzo\n3) Kadiria kodi\n4) Afisa wa TRA`
          : `Please choose:\n1) Register\n2) Record sale\n3) Estimate tax\n4) Talk to agent`,
        timestamp: time,
        options: [
          { label: isSw ? '1) Sajili' : '1) Register', action: 'flow_register' },
          { label: isSw ? '2) Rekodi mauzo' : '2) Record sale', action: 'flow_sale' },
          { label: isSw ? '3) Kadiria kodi' : '3) Estimate tax', action: 'flow_tax' },
          { label: isSw ? '4) Afisa' : '4) Agent', action: 'flow_agent' },
        ]
      }
    ]
  };
}
