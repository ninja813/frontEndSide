import { useAccount, useChainId, useReadContract } from "wagmi";
import { LockableTokenAbi } from "../abi/LockableToken";
import { APP_CONFIG } from "../config";
import { formatUnits } from "viem";
import Card from "./Card";

export default function BalanceCard() {
  const chainId = useChainId();
  const { address } = useAccount();
  const tokenAddress = APP_CONFIG.TOKEN_ADDRESS as `0x${string}`;

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: LockableTokenAbi,
    functionName: "symbol",
    query: { enabled: !!address },
  });
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: LockableTokenAbi,
    functionName: "decimals",
    query: { enabled: !!address },
  });
  const { data: bal, refetch } = useReadContract({
    address: tokenAddress,
    abi: LockableTokenAbi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });
  const { data: lock } = useReadContract({
    address: tokenAddress,
    abi: LockableTokenAbi,
    functionName: "lockUntil",
    args: [address!],
    query: { enabled: !!address },
  });

  const isWrongChain = chainId && chainId !== 11155111 && chainId !== 80002; // Sepolia or Amoy
  const lockTs = lock ? Number(lock) : 0;

  return (
    <Card title="Your Token Balance">
      {!address ? (
        <p className="text-slate-300 text-red-500">Connect your wallet to view balances.</p>
      ) : isWrongChain ? (
        <p className="text-amber-300 ">Please switch to Sepolia or Polygon Amoy.</p>
      ) : (
        <div className="space-y-2">
          <div className="text-3xl font-bold font-bold text-gray-500">
            {bal !== undefined && decimals !== undefined ? (
              <>
                {Number(formatUnits(bal as bigint, decimals as number)).toLocaleString()} {symbol as string}
              </>
            ) : (
              <span className="text-slate-400 ">Loading…</span>
            )}
          </div>
          {lockTs > 0 && (
            <div className="text-sm text-slate-400">
              Locked until: {new Date(lockTs * 1000).toLocaleString()}
            </div>
          )}
          <button className="button bg-indigo-600" onClick={() => refetch()}>Refresh</button>
        </div>
      )}
    </Card>
  );
}
