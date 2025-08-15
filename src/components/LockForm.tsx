import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { LockableTokenAbi } from "../abi/LockableToken";
import { APP_CONFIG } from "../config";
import Card from "./Card";

export default function LockForm() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokenAddress = APP_CONFIG.TOKEN_ADDRESS as `0x${string}`;

  const [dateTime, setDateTime] = useState<string>(""); // local datetime string
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error: writeErr } = useWriteContract();
  const { isSuccess, isLoading: waiting } = useWaitForTransactionReceipt({ hash });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!address) return setError("Connect your wallet first.");
    if (chainId !== 11155111 && chainId !== 80002) return setError("Switch to Sepolia or Polygon Amoy.");
    if (!dateTime) return setError("Choose an unlock date/time.");

    const ts = Math.floor(new Date(dateTime).getTime() / 1000);
    if (isNaN(ts) || ts <= Math.floor(Date.now() / 1000)) {
      return setError("Unlock time must be in the future.");
    }

    try {
      writeContract({
        address: tokenAddress,
        abi: LockableTokenAbi,
        functionName: "lockTokens",
        args: [BigInt(ts)],
      });
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Failed to lock tokens.");
    }
  }

  return (
    <Card title="Lock Tokens">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Unlock date/time</label>
          <input
            type="datetime-local"
            className="input"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {writeErr && <div className="text-red-400 text-sm">{(writeErr as any)?.shortMessage || writeErr.message}</div>}
        {hash && <div className="text-slate-300 text-sm break-all">Tx: {hash}</div>}
        {waiting && <div className="text-slate-300 text-sm">Submitting…</div>}
        {isSuccess && <div className="text-emerald-400 text-sm">Lock set ✅</div>}
        <button type="submit" className="button bg-indigo-600" disabled={isPending || waiting}>
          {isPending || waiting ? "Locking…" : "Lock My Tokens"}
        </button>
      </form>
    </Card>
  );
}
