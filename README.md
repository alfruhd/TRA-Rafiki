# TRA Rafiki — Interactive Prototype & Demonstration

**AI-Powered Tax Assistant with Blockchain-Verified Digital Receipts**  
*Tax compliance in a chat. Trust on a ledger.*

> **TRA Innovation Awards Programme Submission**  
> **Authors:** Alfred Damas Mashauri, Joshua Aikangai Riwa, Frank Andrew Marwa  
> **Status:** Fully functional interactive demonstration prototype

---

## 🚀 Quick Start

To launch and explore the live prototype locally:

```bash
# 1. Enter the project directory
cd "/Users/alfruhd/Downloads/TRA Rafiki"

# 2. Start the interactive development server
npm run dev
```

Then open your browser at **`http://localhost:3000`** (or the URL shown in your terminal).

---

## 🌟 What This Prototype Demonstrates

This prototype brings all 4 core components from the TRA Rafiki proposal to life in an interactive, pitch-ready software experience:

### 1. 📱 Smartphone WhatsApp Conversational AI
- **Official TRA Verified Chatbot**: Realistic WhatsApp interface with verified badge and official TRA branding.
- **Trader Onboarding**: Instant registration for informal traders (Market Stall, Bodaboda, Retail Duka, Food Vendor) generating an immediate TRA TIN (`123-456-789`).
- **Instant Digital Receipts**: Traders record sales via simple text or guided prompts (e.g., `Sale: TZS 45,000 Rice x3`). The assistant computes VAT and outputs a cryptographically signed receipt with a unique code (`TRA-8F3K-29QX`).
- **In-Chat Mobile Money Tax Payment**: Automated month-end calculation with **one-tap M-Pesa, Mixx by Yas, or Airtel Money STK Push simulation** (complete with PIN prompt and payment clearance certificate).
- **Human Escalation**: Seamless handoff to a TRA Support Officer with full transaction history attached.
- **Dual Language**: Instant switch between **English** and **Kiswahili** (*"Karibu TRA Rafiki - Kodi Rahisi"*).

### 2. 📞 Feature Phone USSD Simulator (`*152*00#`)
- **Complete Financial Inclusion**: An interactive retro feature phone with numeric keypad and monochrome LCD screen.
- **Shared Ledger**: Any sale recorded or business registered over USSD is cryptographically anchored to the **exact same blockchain** as WhatsApp, proving the principle: *"One service, every phone — one ledger"*.

### 3. ⛓️ Permissioned Blockchain Ledger & Fraud Verifier
- **Live SHA-256 Hash Chaining**: Watch new blocks get minted in real time as transactions occur.
- **Instant Receipt Verification**: Enter or click any receipt verification code to view cryptographic validation, timestamp, and authenticity status.
- **Interactive Tamper Simulation**: Click **"Simulate Fraud / Tampering Attempt"** to modify a receipt value. The ledger immediately flags a critical audit failure (`Hash Mismatch at Block #1`), showing how blockchain stops receipt evasion and falsification.

### 4. 🏛️ TRA Officer Command & Audit Center
- **Executive KPIs**: Real-time metrics for informal traders formalized, turnover captured, compliance time reduction (from 4.5 hours down to 1.8 minutes), and zero receipt fraud.
- **Informal Sector Breakdown**: Revenue distribution across Market Stalls, Bodaboda, Retail Dukas, and Food Vendors.
- **Live Dispute Queue**: TRA officers can view escalated tickets with context and send replies straight into the taxpayer's WhatsApp.

---

## 🎤 Presenter 6-Step Script (Live Pitch Guide)

Use the **"Demo Flows"** buttons at the top of the prototype to deliver a flawless demonstration:

| Step | Flow Button | What Happens | Key Talking Point for Judges |
|------|-------------|--------------|------------------------------|
| **1** | `1. Register` | AI guides trader to choose business type and issues TIN `123-456-789`. | *"Informal traders join the tax net in 60 seconds without visiting a TRA office."* |
| **2** | `2. Record Sale` | AI records TZS 45,000 sale and mints receipt `TRA-8F3K-29QX`. | *"Replaces paper receipts with an instant, digital record sent to the customer."* |
| **3** | `3. Pay Tax` | AI prompts month-end estimate (TZS 18,000) and launches M-Pesa STK push. | *"Traders pay presumptive tax in-chat without leaving their stall or switching apps."* |
| **4** | `4. Verify` | Ledger explorer verifies code `TRA-8F3K-29QX` with SHA-256 proof. | *"Anyone — buyer, auditor, or TRA — can confirm receipt authenticity anytime."* |
| **5** | `5. USSD` | Switches to basic phone to show menu navigation on non-smartphones. | *"Works on any phone — no smartphone, app download, or internet data bundle required."* |
| **6** | `6. Agent` | Demonstrates human escalation queue with pre-attached audit history. | *"Hard disputes go straight to human officers with zero repeated information."* |

---

## 🛠️ Tech Stack

- **Frontend & Simulator:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Cryptography Engine:** Native Browser Web Crypto API (SHA-256 hashing, Merkle proofs)
- **Audio Synthesizer:** Native Web Audio API (tactile chat and payment chimes)
- **Visuals & Identity:** Official Tanzania Revenue Authority emblems, colors, and responsive mobile mockups

---

## 👥 Innovation Authors
- **Alfred Damas Mashauri** (0767 749 919 • alfredido6@gmail.com)
- **Joshua Aikangai Riwa** (0684 844 096 • homer.joshua.22@gmail.com)
- **Frank Andrew Marwa** (0715 180 767 • drey6music@yahoo.com)
