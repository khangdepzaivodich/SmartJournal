import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contract';

export async function getProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new BrowserProvider((window as any).ethereum);
    return provider;
  }
  return null;
}

export async function getContract(provider: BrowserProvider) {
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function fetchUserTrades(address: string) {
  const provider = await getProvider();
  if (!provider) return [];
  
  const contract = await getContract(provider);
  const trades = [];
  let i = 0;
  
  try {
    while (true) {
      const trade = await contract.userTrades(address, i);
      const confluences = await contract.getConfluences(address, i);
      trades.push({
        id: i,
        date: new Date(Number(trade.date) * 1000).toLocaleDateString(),
        pair: trade.pair,
        pnl: trade.pnl.toString(),
        confluences: confluences,
        note: trade.note
      });
      i++;
    }
  } catch (e) {
    // End of trades
  }
  return trades;
}

export async function logTradeOnChain(pair: string, pnl: number, confluences: string[], note: string) {
  const provider = await getProvider();
  if (!provider) throw new Error("No provider found");
  
  const contract = await getContract(provider);
  const tx = await contract.logTrade(pair, pnl, confluences, note);
  await tx.wait();
  return tx.hash;
}
