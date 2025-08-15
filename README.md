# Token Lock DApp — Frontend

A minimal React + TypeScript frontend to interact with an ERC‑20 token that has a `lockTokens(uint256 untilTimestamp)` function and a `lockUntil(address)` public getter.

## Prerequisites
- Node.js 18+
- A deployed LockableToken contract on **Sepolia** or **Polygon Amoy** (Mumbai successor).
- Optionally an Alchemy key and a WalletConnect project id.

## Setup

```bash
# create the project (if not already)
# npm create vite@latest token-lock-dapp -- --template react-ts

# install deps
npm i

# copy env and fill
cp .env.example .env
# set VITE_ALCHEMY_API_KEY and VITE_WALLETCONNECT_PROJECT_ID (optional)

# configure the deployed token address
# edit src/config.ts -> TOKEN_ADDRESS

# run
npm run dev
```

## What’s inside
- **Wallet connect** via RainbowKit/wagmi
- **Balance** (reads `symbol`, `decimals`, `balanceOf`, `lockUntil`)
- **Send tokens** (calls `transfer`)
- **Lock tokens** (calls `lockTokens` with a future timestamp)

If you deploy to another chain, add it in `src/lib/wagmi.ts` and set the address in `src/config.ts`.
