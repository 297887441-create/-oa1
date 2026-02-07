
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
}

const PaymentManagement: React.FC<Props> = ({ navigateTo, contracts }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'overdue' | 'received'>('all');

  // 计算看板指标
  const stats = useMemo(() => {
    const totalAmount = contracts.reduce((s, c) => s + c.amount, 0);
    const paidAmount = contracts.reduce((s, c) => s + c.paid, 0);
    const overdueItems = contracts.filter(c => {
      if (!c.dueDate) return false;
      return new Date(c.dueDate) < new Date() && c.paid < c.amount;
    });
    const overdueAmount = overdueItems.reduce((s, c) => s + (c.amount - c.paid), 0);
    const rate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : '0';

    return { totalAmount, paidAmount, overdueAmount, overdueCount: overdueItems.length, rate };
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    switch (activeTab) {
      case 'pending': return contracts.filter(c => c.paid < c.amount && (!c.dueDate || new Date(c.dueDate) >= new Date()));
      case 'overdue': return contracts.filter(c => c.paid < c.amount && c.dueDate && new Date(c.dueDate) < new Date());
      case 'received': return contracts.filter(c => c.paid >= c.amount);
      default: return contracts;
    }
  }, [contracts, activeTab]);

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 font-sans">
      {/* 沉浸式页头看板 */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] pt-12 pb-24 px-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <button 
          onClick={() => navigateTo(PageType.ADMIN_WORKBENCH)}
          className="absolute top-4 left-4 size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="relative z-10 pt-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-amber-500 !text-xl filled-icon">account_balance</span>
            <h2 className="text-white text-lg font-black tracking-tight leading-none">回款分析看板</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">应收总额 (CNY)</p>
              <p className="text-3xl font-black text-white tabular-nums tracking-tighter">¥{(stats.totalAmount / 10000).toFixed(2)}w</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest">实收达成率</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-2xl font-black text-emerald-400">{stats.rate}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between px-1">
             <div className="flex flex-col">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">逾期预警金额</span>
                <span className="text-sm font-bold text-rose-500">¥{(stats.overdueAmount / 1000).toFixed(1)}k</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">实收净流入</span>
                <span className="text-sm font-bold text-emerald-500">¥{(stats.paidAmount / 1000).toFixed(1)}k</span>
             </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        {/* 延期快速通知栏 */}
        {stats.overdueCount > 0 && (
          <div className="bg-rose-500 p-4 rounded-3xl shadow-xl shadow-rose-500/20 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white !text-xl">warning</span>
              <p className="text-white text-[11px] font-black tracking-tight">检测到 {stats.overdueCount} 笔合同已发生回款延期！</p>
            </div>
            <button onClick={() => setActiveTab('overdue')} className="bg-white/20 text-white text-[10px] font-black px-3 py-1.5 rounded-lg backdrop-blur-md">立即处理</button>
          </div>
        )}

        {/* 列表分类选择 */}
        <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl flex gap-1 shadow-sm border border-slate-100 dark:border-slate-800">
           {[
             { id: 'all', label: '全部' },
             { id: 'pending', label: '待收' },
             { id: 'overdue', label: '逾期' },
             { id: 'received', label: '已收' }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${
                 activeTab === t.id ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-400'
               }`}
             >
               {t.label}
             </button>
           ))}
        </div>

        {/* 回款明细列表 */}
        <div className="space-y-4">
          {filteredContracts.map((c, idx) => {
            const isOverdue = c.dueDate && new Date(c.dueDate) < new Date() && c.paid < c.amount;
            const remaining = c.amount - c.paid;
            
            return (
              <div 
                key={c.id} 
                className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                       <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{c.title}</h4>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{c.customer}</p>
                    </div>
                    <div className={`shrink-0 px-2 py-0.5 rounded-md text-[8px] font-black border ${
                      isOverdue ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                      c.paid >= c.amount ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                      'bg-blue-50 text-primary border-blue-100'
                    }`}>
                      {isOverdue ? '已逾期' : c.paid >= c.amount ? '全额到账' : '正常推进'}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                       <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">待收余款</p>
                       <p className={`text-sm font-black ${isOverdue ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                         ¥{remaining.toLocaleString()}
                       </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                       <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">最后期限</p>
                       <p className="text-sm font-black text-slate-600 dark:text-slate-300">
                         {c.dueDate || '未设置'}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                       <img src={`https://picsum.photos/100?random=${idx}`} className="size-6 rounded-full border-2 border-white ring-1 ring-slate-100" alt="owner" />
                       <span className="text-[10px] font-bold text-slate-400 pl-4">跟进人：{c.owner}</span>
                    </div>
                    <div className="flex gap-2">
                       <button className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 active:bg-primary active:text-white transition-all">
                          <span className="material-symbols-outlined !text-base">phone_in_talk</span>
                       </button>
                       {isOverdue && (
                         <button className="h-8 px-3 rounded-lg bg-rose-500 text-white text-[10px] font-black shadow-lg shadow-rose-200">
                           强制催收
                         </button>
                       )}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
