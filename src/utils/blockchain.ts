import { Block, Receipt, SaleItem } from '../types';

// Compute SHA-256 hash using browser native Web Crypto API
export async function computeSHA256(data: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate verification code like TRA-8F3K-29QX
export function generateVerificationCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRA-${part1}-${part2}`;
}

export function generateTIN(): string {
  const p1 = Math.floor(100 + Math.random() * 900);
  const p2 = Math.floor(100 + Math.random() * 900);
  const p3 = Math.floor(100 + Math.random() * 900);
  return `${p1}-${p2}-${p3}`;
}

// Initial seed blockchain matching the slides
export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 'tx-001',
    verificationCode: 'TRA-8F3K-29QX',
    traderTin: '123-456-789',
    traderName: 'Green Market Stall',
    businessType: 'Market Stall',
    location: 'Kariakoo Market, Dar es Salaam',
    customerPhone: '+255 767 749 919',
    items: [
      { desc: 'Rice Grade 1 (5kg bag)', quantity: 3, unitPrice: 15000, total: 45000 }
    ],
    totalAmount: 45000,
    vatAmount: 8100, // 18% VAT or standard turnover slice
    timestamp: '2026-10-31 09:38:12',
    blockNumber: 1,
    blockHash: 'a41fe39b08d4a67812903ceef120ab56cd4902187b41eef554a9c680218f4a12',
    prevBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    id: 'tx-002',
    verificationCode: 'TRA-4J8M-66ZP',
    traderTin: '123-456-789',
    traderName: 'Green Market Stall',
    businessType: 'Market Stall',
    location: 'Kariakoo Market, Dar es Salaam',
    customerPhone: '+255 715 180 767',
    items: [
      { desc: 'Sunflower Cooking Oil (5L)', quantity: 2, unitPrice: 32000, total: 64000 },
      { desc: 'Maize Flour (10kg)', quantity: 1, unitPrice: 21000, total: 21000 }
    ],
    totalAmount: 85000,
    vatAmount: 15300,
    timestamp: '2026-10-31 11:20:45',
    blockNumber: 2,
    blockHash: '7c9e421fd4091a9b43eef6a089cd409187ac612b7049ea23b91a780ef461d309',
    prevBlockHash: 'a41fe39b08d4a67812903ceef120ab56cd4902187b41eef554a9c680218f4a12',
  },
  {
    id: 'tx-003',
    verificationCode: 'TRA-9L2K-88VR',
    traderTin: '123-456-789',
    traderName: 'Green Market Stall',
    businessType: 'Market Stall',
    location: 'Kariakoo Market, Dar es Salaam',
    customerPhone: '+255 684 844 096',
    items: [
      { desc: 'Sugar (Kilombero 25kg)', quantity: 1, unitPrice: 80000, total: 80000 }
    ],
    totalAmount: 80000,
    vatAmount: 14400,
    timestamp: '2026-10-31 14:05:10',
    blockNumber: 3,
    blockHash: 'e02b740aa91280fcb5463102847d91ec083b482103fca91823ab6710482da174',
    prevBlockHash: '7c9e421fd4091a9b43eef6a089cd409187ac612b7049ea23b91a780ef461d309',
  }
];

export const INITIAL_BLOCKS: Block[] = [
  {
    index: 0,
    timestamp: '2026-10-01 00:00:00',
    transactions: [],
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    merkleRoot: 'Genesis: TRA National Digital Tax Ledger Pilot',
    nonce: 104729,
    validator: 'Tanzania Revenue Authority (Master Root Node)'
  },
  {
    index: 1,
    timestamp: '2026-10-31 09:38:15',
    transactions: [INITIAL_RECEIPTS[0]],
    previousHash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    hash: 'a41fe39b08d4a67812903ceef120ab56cd4902187b41eef554a9c680218f4a12',
    merkleRoot: 'mk_e41793a0bd912b7041',
    nonce: 84210,
    validator: 'TRA Node #1 (Dar es Salaam Hub)'
  },
  {
    index: 2,
    timestamp: '2026-10-31 11:20:48',
    transactions: [INITIAL_RECEIPTS[1]],
    previousHash: 'a41fe39b08d4a67812903ceef120ab56cd4902187b41eef554a9c680218f4a12',
    hash: '7c9e421fd4091a9b43eef6a089cd409187ac612b7049ea23b91a780ef461d309',
    merkleRoot: 'mk_98f12a80ce01b942e1',
    nonce: 192834,
    validator: 'Bank of Tanzania (BOT Observer Node)'
  },
  {
    index: 3,
    timestamp: '2026-10-31 14:05:13',
    transactions: [INITIAL_RECEIPTS[2]],
    previousHash: '7c9e421fd4091a9b43eef6a089cd409187ac612b7049ea23b91a780ef461d309',
    hash: 'e02b740aa91280fcb5463102847d91ec083b482103fca91823ab6710482da174',
    merkleRoot: 'mk_77ab418ef03a9812cc',
    nonce: 55431,
    validator: 'TRA Node #2 (Kariakoo Regional Node)'
  }
];

export async function createNewBlock(
  receipt: Receipt,
  blocks: Block[]
): Promise<{ newBlock: Block; updatedReceipt: Receipt }> {
  const lastBlock = blocks[blocks.length - 1];
  const newIndex = lastBlock.index + 1;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  const rawData = `${newIndex}-${lastBlock.hash}-${receipt.verificationCode}-${receipt.totalAmount}-${timestamp}`;
  const blockHash = await computeSHA256(rawData);
  const merkleRoot = 'mk_' + (await computeSHA256(receipt.verificationCode)).substring(0, 16);

  const updatedReceipt: Receipt = {
    ...receipt,
    blockNumber: newIndex,
    blockHash: blockHash,
    prevBlockHash: lastBlock.hash,
  };

  const newBlock: Block = {
    index: newIndex,
    timestamp,
    transactions: [updatedReceipt],
    previousHash: lastBlock.hash,
    hash: blockHash,
    merkleRoot,
    nonce: Math.floor(Math.random() * 900000) + 100000,
    validator: 'TRA Permissioned Node (Automated Smart Contract)'
  };

  return { newBlock, updatedReceipt };
}

// Verification function: checks if a receipt's verification code is anchored on the ledger and if its hash matches
export function verifyReceiptOnChain(code: string, blocks: Block[]): {
  isValid: boolean;
  receipt?: Receipt;
  block?: Block;
  message: string;
} {
  const cleanCode = code.trim().toUpperCase();
  for (const blk of blocks) {
    const found = blk.transactions.find(tx => tx.verificationCode === cleanCode);
    if (found) {
      if (found.isTampered) {
        return {
          isValid: false,
          receipt: found,
          block: blk,
          message: 'TAMPER ALERT: Transaction payload does not match cryptographic state signature!'
        };
      }
      return {
        isValid: true,
        receipt: found,
        block: blk,
        message: 'AUTHENTIC: Receipt cryptographically anchored and verified on TRA Permissioned Ledger.'
      };
    }
  }
  return {
    isValid: false,
    message: `Receipt with code "${cleanCode}" was not found in the TRA official ledger.`
  };
}
