'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  BarChart3, 
  PlusCircle, 
  History as HistoryIcon,
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  FileEdit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stats Helpers (Mock calculation)
const calculateWinRate = (trades: any[]) => {
  if (trades.length === 0) return "0";
  const wins = trades.filter(t => Number(t.pnl) > 0).length;
  return ((wins / trades.length) * 100).toFixed(1);
};

const calculateTotalPnL = (trades: any[]) => {
  return trades.reduce((sum, t) => sum + Number(t.pnl), 0);
};

const calculateROI = (trades: any[]) => {
  if (trades.length === 0) return "0";
  // Assuming a baseline of $10,000 for relative ROI if not stored
  const totalPnL = calculateTotalPnL(trades);
  return ((totalPnL / 10000) * 100).toFixed(1);
};

const calculateSharpeRatio = (trades: any[]) => {
  if (trades.length < 5) return "1.24"; // Baseline for small datasets
  const pnls = trades.map(t => Number(t.pnl));
  const avg = pnls.reduce((a, b) => a + b, 0) / pnls.length;
  const std = Math.sqrt(pnls.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / pnls.length);
  return std === 0 ? "0.00" : (avg / std).toFixed(2);
};

// UI Components
const StatCard = ({ title, value, icon: Icon, trend, sub }: any) => (
  <div className="glass-card p-6 rounded-2xl flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 text-sm font-medium">{title}</span>
      <div className="p-2 bg-zinc-800/50 rounded-lg">
        <Icon size={18} className="text-zinc-400" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold stat-value">{value}</h3>
      {trend && (
        <span className={cn(
          "text-xs font-semibold flex items-center",
          trend > 0 ? "text-primary" : "text-danger"
        )}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-xs text-zinc-600">{sub}</p>
  </div>
);

const CONFLUENCES = [
  'Market Structure Shift',
  'RSI Divergence',
  'Higher Timeframe Bias',
  'EMA Crossover',
  'Volume Spike',
  'Value Area Entry (POC/VAH/VAL)',
  'FVG / Order Block Tap',
  'Fibonacci Retracement (0.618/0.786)',
  'Liquidity Sweep'
];

export default function SmartJournal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [trades, setTrades] = useState<any[]>([]); 

  // Form State
  const [entryForm, setEntryForm] = useState({
    pair: '',
    pnl: '',
    confluences: [] as string[],
    note: ''
  });

  const toggleConfluence = (item: string) => {
    setEntryForm(prev => ({
      ...prev,
      confluences: prev.confluences.includes(item) 
        ? prev.confluences.filter(c => c !== item)
        : [...prev.confluences, item]
    }));
  };

  const handleLogTrade = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate logging to contract
    const newTrade = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      ...entryForm
    };
    setTrades([newTrade, ...trades]);
    setEntryForm({ pair: '', pnl: '', confluences: [], note: '' });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-800 p-6 flex flex-col gap-8 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">SmartJournal</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'journal', label: 'Trade Journal', icon: FileEdit },
            { id: 'history', label: 'History', icon: HistoryIcon },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-primary/5 text-primary" 
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <item.icon size={18} className={cn(activeTab === item.id ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setWalletConnected(!walletConnected)}
            className={cn(
              "w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all",
              walletConnected ? "bg-zinc-800 border border-zinc-700" : "bg-primary text-black hover:bg-primary/90"
            )}
          >
            <Wallet size={18} />
            {walletConnected ? "0x7fd...82a9" : "Connect Wallet"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome, Alpha Trader</h2>
              <p className="text-zinc-500 text-sm">Trading summary for current month sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs font-semibold text-zinc-400">
                Market: <span className="text-blue-400">Neutral</span>
              </span>
              <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs font-semibold text-zinc-400">
                Vol: <span className="text-primary">High</span>
              </span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    title="Net PnL" 
                    value={`$${calculateTotalPnL(trades).toLocaleString()}`} 
                    icon={TrendingUp} 
                    trend={12.4}
                    sub="Cumulative PnL across all trades"
                  />
                  <StatCard 
                    title="Win Rate" 
                    value={`${calculateWinRate(trades)}%`} 
                    icon={Target} 
                    sub="Total percentage of profitable trades"
                  />
                  <StatCard 
                    title="Sharpe Ratio" 
                    value={calculateSharpeRatio(trades)} 
                    icon={BarChart3} 
                    sub="Risk-adjusted return ratio"
                  />
                  <StatCard 
                    title="Total ROI" 
                    value={`+${calculateROI(trades)}%`} 
                    icon={TrendingUp} 
                    trend={4.2}
                    sub="Return on 10k baseline"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Trade Entry Form */}
                  <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                      <PlusCircle size={20} className="text-primary" />
                      <h3 className="font-semibold text-lg">Log New Entry</h3>
                    </div>
                    
                    <form onSubmit={handleLogTrade} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Asset Pair</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. BTC/USDT" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all"
                            value={entryForm.pair}
                            onChange={(e) => setEntryForm({...entryForm, pair: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Expected / Realized PnL</label>
                          <input 
                            required
                            type="number" 
                            placeholder="Amount in USD" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all"
                            value={entryForm.pnl}
                            onChange={(e) => setEntryForm({...entryForm, pnl: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 block">Confluences Checklist</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {CONFLUENCES.map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/40 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={entryForm.confluences.includes(item)}
                                onChange={() => toggleConfluence(item)}
                              />
                                <span className="text-[12px] font-medium text-zinc-300">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Journal Reflection</label>
                        <textarea 
                          rows={4}
                          placeholder="Reasoning behind entry / Emotional state / Lessons learned..." 
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none"
                          value={entryForm.note}
                          onChange={(e) => setEntryForm({...entryForm, note: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 active:scale-[0.98]"
                      >
                        Commit Trade Entry to Smart Journal
                      </button>
                    </form>
                  </div>

                  {/* Activity/Resources area */}
                  <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl space-y-4 border-l-4 border-l-primary">
                      <h4 className="font-bold text-sm">Quote of the Day</h4>
                      <p className="text-sm text-zinc-400 italic">"Trading is not about being right, it's about making money when you're right and limiting losses when you're wrong."</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl space-y-4">
                      <h4 className="font-bold text-sm">Recent Performance</h4>
                      <div className="space-y-4">
                        {trades.slice(0, 3).map((trade, i) => (
                          <div key={trade.id} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{trade.pair}</span>
                              <span className="text-[10px] text-zinc-500 uppercase">{trade.date}</span>
                            </div>
                            <span className={cn(
                              "text-sm font-bold",
                              Number(trade.pnl) >= 0 ? "text-primary" : "text-danger"
                            )}>
                              {Number(trade.pnl) >= 0 ? '+' : ''}${trade.pnl}
                            </span>
                          </div>
                        ))}
                        {trades.length === 0 && (
                          <div className="py-4 text-center text-zinc-500 text-xs italic">
                            No trades logged yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-800/30">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Pair</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">PnL</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Confluences</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Reflection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 text-sm text-zinc-400">{trade.date}</td>
                        <td className="px-6 py-4 text-sm font-bold">{trade.pair}</td>
                        <td className={cn(
                          "px-6 py-4 text-sm font-bold",
                          Number(trade.pnl) >= 0 ? "text-primary" : "text-danger"
                        )}>
                          {Number(trade.pnl) >= 0 ? '+' : ''}${trade.pnl}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {trade.confluences.map((c: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-400 border border-zinc-700 uppercase leading-none">
                                {c.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate">{trade.note}</td>
                      </tr>
                    ))}
                    {trades.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">No trades in chain account</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
