export type Language = 'en' | 'sw';

export interface Trader {
  id: string;
  name: string;
  businessName: string;
  businessType: 'Market Stall' | 'Bodaboda' | 'Retail Duka' | 'Food Vendor' | 'Salon & Beauty' | 'Other';
  location: string;
  phone: string;
  tin: string;
  registeredAt: string;
  channel: 'WhatsApp' | 'USSD';
}

export interface SaleItem {
  desc: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {
  id: string;
  verificationCode: string;
  traderTin: string;
  traderName: string;
  businessType: string;
  location: string;
  customerPhone: string;
  items: SaleItem[];
  totalAmount: number;
  vatAmount: number;
  timestamp: string;
  blockNumber: number;
  blockHash: string;
  prevBlockHash: string;
  isTampered?: boolean;
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Receipt[];
  previousHash: string;
  hash: string;
  merkleRoot: string;
  nonce: number;
  validator: string;
}

export interface TaxReturn {
  period: string;
  totalSales: number;
  taxableTurnover: number;
  transactionCount: number;
  presumptiveRate: string;
  taxDue: number;
  isPaid: boolean;
  paymentMethod?: 'M-Pesa' | 'Mixx by Yas' | 'Airtel Money';
  paymentRef?: string;
  receiptCode?: string;
  paidAt?: string;
}

export interface TinCertificateData {
  tin: string;
  name: string;
  businessName: string;
  location: string;
  category: string;
  issuedAt: string;
  status: string;
}

export interface TaxAssessmentSlipData {
  period: string;
  turnover: number;
  bracket: string;
  taxDue: number;
  deductions: number;
  netPayable: number;
  status: string;
}

export interface TaxClearanceData {
  certNo: string;
  taxpayerName: string;
  businessName: string;
  tin: string;
  period: string;
  validUntil: string;
  status: string;
}

export interface OfficerTicketData {
  officerName: string;
  officerRole: string;
  station: string;
  ticketId: string;
  attachedHistory: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  receipt?: Receipt;
  taxReturn?: TaxReturn;
  paymentPrompt?: {
    amount: number;
    period: string;
  };
  tinCard?: TinCertificateData;
  assessmentSlip?: TaxAssessmentSlipData;
  clearanceCert?: TaxClearanceData;
  officerTicket?: OfficerTicketData;
  options?: {
    label: string;
    action: string;
    value?: string;
  }[];
  isEscalated?: boolean;
}

export interface EscalatedTicket {
  id: string;
  traderPhone: string;
  traderName: string;
  businessType: string;
  tin: string;
  issue: string;
  status: 'OPEN' | 'RESOLVED';
  timestamp: string;
  lastMessage: string;
  historySummary: string;
}
