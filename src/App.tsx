import { ConnectButton } from "@rainbow-me/rainbowkit";
import BalanceCard from "./components/BalanceCard";
import TransferForm from "./components/TransferForm";
import LockForm from "./components/LockForm";
import { APP_CONFIG } from "./config";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600" />
            <div>
              <h1 className="text-lg font-semibold">Token Lock DApp</h1>
              <p className="text-xs text-slate-400">Contract: <span className="font-mono">{APP_CONFIG.TOKEN_ADDRESS}</span></p>
            </div>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 grid md:grid-cols-2 gap-4">
        <BalanceCard />
        <LockForm />
        <TransferForm />
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">How it works</h3>
          <ol className="list-decimal list-inside text-slate-300 space-y-1">
            <li>Connect your wallet on Sepolia or Polygon Amoy.</li>
            <li>Minted tokens (from your deployment) appear as your balance.</li>
            <li>Send tokens using the form. If locked, transfers revert.</li>
            <li>Set a future unlock date/time to lock your tokens.</li>
          </ol>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl p-4 text-center text-slate-500">
        Built with React, wagmi, RainbowKit & viem.
      </footer>
    </div>
  );
}