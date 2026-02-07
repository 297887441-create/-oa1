
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract, EnhancedOpportunity, GlobalCustomer } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  customerId: string | null;
  contracts: GlobalContract[];
  opportunities: EnhancedOpportunity[];
  customers: GlobalCustomer[];
}

const CustomerDetail: React.FC<Props> = ({ navigateTo, customerId, contracts, opportunities, customers }) => {
  const [activeTab, setActiveTab] = useState<'opps' | 'contracts' | 'remittance'>('contracts');

  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === customerId) || customers[0];
  }, [customerId, customers]);

  // 数据联动：筛选该客户下的合同
  const customerContracts = useMemo(() => {
    return contracts.filter(c => c.customer === currentCustomer.name || c.customer.includes(currentCustomer.name));
  }, [contracts, currentCustomer]);

  // 财务统计数据汇总
  const contractStats = useMemo(() => {
    const total = customerContracts.reduce((sum, c) => sum + c.amount, 0);
    const paid = customerContracts.reduce((sum, c) => sum + c.paid, 0);
    const pending = total - paid;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { total, paid, pending, rate };
  }, [customerContracts]);

  // 数据联动：筛选该客户下的商机
  const customerOpps = useMemo(() => {
    return opportunities.filter(o => o.customer === currentCustomer.name || o.customer.includes(currentCustomer.name));
  }, [opportunities, currentCustomer]);

  const tabs = [
    { id: 'opps', label: '关联商机', icon: 'hub' },
    { id: 'contracts', label: '在研合同', icon: 'description' },
    { id: 'remittance', label: '回款流水', icon: 'payments' }
  ];

  const getInstallStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待开工';
      case 'active': return '开工中';
      case 'completed': return '已完工';
      default: return '未知';
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-24 font-sans animate-fadeIn">
      {/* 沉浸式页头 */}
      <div className="bg-[#0f172a] pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <button 
          onClick={() => navigateTo(PageType.CUSTOMER_MANAGEMENT)}
          className="absolute top-4 left-4 size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="relative z-10 flex items-start gap-4">
          <div className="size-16 rounded-[1.5rem] bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
            {currentCustomer.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-black text-white leading-tight tracking-tight">{currentCustomer.name}</h2>
              <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase">{currentCustomer.type}</span>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined !text-[14px]">location_on</span>
              {currentCustomer.address || '暂无详细地址'}
            </p>
          </div>
        </div>
      </div>

      {/* 核心指标快照 */}
      <div className="px-5 -mt-12 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex justify-between items-center">
           <div className="text-center">
             <p className="text-[9px] text-slate-400 font-black uppercase mb-1">历史成交</p>
             <p className="text-xl font-black text-slate-900 dark:text-white">¥{currentCustomer.total}w</p>
           </div>
           <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
           <div className="text-center">
             <p className="text-[9px] text-slate-400 font-black uppercase mb-1">在研项目</p>
             <p className="text-xl font-black text-slate-900 dark:text-white">{customerContracts.length} 个</p>
           </div>
           <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
           <div className="text-center">
             <p className="text-[9px] text-slate-400 font-black uppercase mb-1">内部跟进</p>
             <p className="text-sm font-black text-primary">{currentCustomer.owner || '未分配'}</p>
           </div>
        </div>
      </div>

      {/* 分段 Tab 切换 */}
      <div className="px-5 mt-8">
        <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl flex gap-1.5 border border-slate-200/50">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                 activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-primary shadow-lg' : 'text-slate-400'
               }`}
             >
               <span className="material-symbols-outlined !text-lg">{tab.icon}</span>
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {activeTab === 'opps' && (
          customerOpps.length > 0 ? customerOpps.map(opp => (
            <div key={opp.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 shadow-sm animate-slideUp">
               <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">{opp.name}</h4>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-500">{opp.stageLabel}</span>
               </div>
               <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">预期金额</p>
                    <p className="text-base font-black text-slate-900 dark:text-white">¥{opp.amount.toLocaleString()}</p>
                  </div>
               </div>
            </div>
          )) : <div className="py-20 text-center text-slate-300">暂无关联商机</div>
        )}

        {activeTab === 'contracts' && (
          customerContracts.length > 0 ? customerContracts.map(c => (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-slideUp">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-black text-base text-slate-900 dark:text-white leading-snug truncate mb-1">{c.title}</h4>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider bg-blue-50 text-primary">
                    {getInstallStatusLabel(c.installStatus)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] text-slate-400 font-bold">回款进度</span>
                   <span className="text-[11px] font-black text-primary">{Math.round((c.paid / c.amount) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(c.paid / c.amount) * 100}%` }}></div>
                </div>
              </div>
            </div>
          )) : <div className="py-20 text-center text-slate-300">暂无关联合同</div>
        )}

        {activeTab === 'remittance' && (
          <div className="py-20 text-center text-slate-300">暂无历史回款记录</div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
