import { useState } from "react";
import { useAccount, useWriteContract, useChainId, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { LockableTokenAbi } from "../abi/LockableToken";
import { APP_CONFIG } from "../config";
import { isAddress, parseUnits } from "viem";
import Card from "./Card";

export default function TransferForm() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokenAddress = APP_CONFIG.TOKEN_ADDRESS as `0x${string}`;
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Read decimals dynamically for accurate parsing
  const { data: decimalsData } = useReadContract({
    address: tokenAddress,
    abi: LockableTokenAbi,
    functionName: "decimals",
  });
  const decimals = Number(decimalsData ?? 18);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!address) return setError("Connect your wallet first.");
    if (chainId !== 11155111 && chainId !== 80002) return setError("Switch to Sepolia or Polygon Amoy.");
    if (!isAddress(to)) return setError("Recipient address is invalid.");
    if (!amount || Number(amount) <= 0) return setError("Enter a positive amount.");

    try {
      const parsed = parseUnits(amount, decimals);
      writeContract({
        address: tokenAddress,
        abi: LockableTokenAbi,
        functionName: "transfer",
        args: [to as `0x${string}`, parsed],
      });
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Failed to send.");
    }
  }

  return (
    <Card title="Send Tokens">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Recipient</label>
          <input className="input" placeholder="0x…" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label className="label">Amount</label>
          <input className="input" placeholder="e.g. 100" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="text-xs text-slate-400">Token decimals detected: {decimals}</div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {writeError && <div className="text-red-400 text-sm">{(writeError as any)?.shortMessage || writeError.message}</div>}
        {hash && (
          <div className="text-slate-300 text-sm break-all">Tx: {hash}</div>
        )}
        {waiting && <div className="text-slate-300 text-sm">Waiting for confirmation…</div>}
        {isSuccess && <div className="text-emerald-400 text-sm">Transfer confirmed ✅</div>}
        <button type="submit" className="button bg-indigo-600" disabled={isPending || waiting}>
          {isPending || waiting ? "Sending…" : "Send"}
        </button>
      </form>
    </Card>
  );
}
