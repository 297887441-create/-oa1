
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  leadsCount: number;
  oppsCount: number;
  oppsTotal: number;
}

type DateRange = 'month' | 'last_month' | 'year';

const SalesWorkbench: React.FC<Props> = ({ navigateTo, leadsCount, oppsCount, oppsTotal }) => {
  const [dateRange, setDateRange] = useState<DateRange>('month');

  const displayStats = useMemo(() => {
    const multipliers: Record<DateRange, number> = {
      month: 1,
      last_month: 0.85,
      year: 11.2
    };
    const m = multipliers[dateRange];

    return {
      performance: (12.8 * m).toFixed(1),
      opps: Math.floor(oppsCount * (dateRange === 'year' ? 8 : 1)),
      leads: Math.floor(leadsCount * (dateRange === 'year' ? 12 : 1.5)),
      paid: (8.5 * m).toFixed(1),
      pending: (4.3 * m).toFixed(1),
      trend: dateRange === 'last_month' ? -5 : 12
    };
  }, [dateRange, leadsCount, oppsCount]);

  // 模拟提醒数据
  const reminders = [
    { 
      type: 'remittance', 
      title: '回款到期：静安大悦城项目', 
      desc: '尾款 ¥24,000.00 预计今日到账，请核实', 
      deadline: '今日截止', 
      status: 'urgent', 
      icon: 'payments', 
      color: 'text-blue-600 bg-blue-50' 
    },
    { 
      type: 'opportunity', 
      title: '商机推进：星巴克旗舰店', 
      desc: '报价单已发送 3 天，请致电确认方案细节', 
      deadline: '已逾期 1天', 
      status: 'overdue', 
      icon: 'rocket_launch', 
      color: 'text-purple-600 bg-purple-50' 
    },
    { 
      type: 'lead', 
      title: '线索跟进：恒隆广场 4F 装修线索', 
      desc: '昨日扫街发现新店装修，需联系店长', 
      deadline: '今日跟进', 
      status: 'today', 
      icon: 'explore', 
      color: 'text-orange-600 bg-orange-50' 
    }
  ];

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 font-sans selection:bg-primary/20 relative">
      {/* 沉浸式高级页头 */}
      <div className="bg-[#0f172a] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] pt-10 pb-20 px-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo(PageType.HOME)} className="size-9 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/5 active:scale-90 transition-all">
              <span className="material-symbols-outlined !text-xl font-bold">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">销售洞察</h2>
          </div>
          <button className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 relative">
            <span className="material-symbols-outlined !text-xl">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* 紧凑的时间筛选 */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl p-0.5 rounded-xl border border-white/10 flex gap-0.5">
            {[
              { id: 'month', label: '本月' },
              { id: 'last_month', label: '上月' },
              { id: 'year', label: '本年' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as DateRange)}
                className={`px-5 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  dateRange === tab.id ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 统计指标网格 */}
      <div className="px-5 -mt-10 relative z-20">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">本月业绩</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">¥{displayStats.performance}</span>
              <span className="text-[10px] text-slate-400 font-bold">w</span>
            </div>
            <div className={`mt-1 flex items-center gap-0.5 text-[8px] font-black ${displayStats.trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <span className="material-symbols-outlined !text-[10px]">{displayStats.trend > 0 ? 'arrow_upward' : 'arrow_downward'}</span>
              {Math.abs(displayStats.trend)}%
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">跟进商机</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{displayStats.opps}</span>
              <span className="text-[10px] text-slate-400 font-bold">个</span>
            </div>
            <div className="mt-1 text-[8px] text-blue-500 font-black flex items-center gap-0.5">
              <span className="material-symbols-outlined !text-[10px] filled-icon">bolt</span>
              活跃中
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">线索总数</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{displayStats.leads}</span>
              <span className="text-[10px] text-slate-400 font-bold">条</span>
            </div>
            <div className="mt-1 text-[8px] text-slate-300 font-black">待转化</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center text-emerald-500">
            <span className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-60">已收回款</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black tabular-nums text-emerald-600">¥{displayStats.paid}</span>
              <span className="text-[10px] opacity-40 font-bold">w</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center text-orange-400">
            <span className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-60">待收尾款</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black tabular-nums text-orange-500">¥{displayStats.pending}</span>
              <span className="text-[10px] opacity-40 font-bold">w</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1.5">综合回款率</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black tabular-nums text-indigo-600">68</span>
              <span className="text-[10px] text-indigo-400 font-bold">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 优化后的“登记回款”精致条 (更小更美观) */}
      <div className="px-5 mt-6">
        <div 
          onClick={() => navigateTo(PageType.REMITTANCE_FORM)}
          className="bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-600/20 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <span className="material-symbols-outlined !text-xl filled-icon">add_card</span>
             </div>
             <div>
                <h4 className="text-slate-900 dark:text-white text-sm font-black tracking-tight">登记合同回款</h4>
                <p className="text-slate-400 text-[10px] font-bold">实时同步合同账目</p>
             </div>
          </div>
          <span className="material-symbols-outlined text-indigo-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
        </div>
      </div>

      {/* 核心功能导航 */}
      <div className="px-5 mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/30 border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '线索池', icon: 'ads_click', color: 'bg-orange-50 text-orange-500', route: PageType.LEAD_MANAGEMENT },
              { label: '商机', icon: 'hub', color: 'bg-indigo-50 text-indigo-500', route: PageType.OPPORTUNITY_MANAGEMENT },
              { label: '合同', icon: 'description', color: 'bg-blue-50 text-blue-500', route: PageType.CONTRACT_MANAGEMENT },
              { label: '客户', icon: 'group', color: 'bg-emerald-50 text-emerald-500', route: PageType.CUSTOMER_MANAGEMENT },
            ].map((item) => (
              <div key={item.label} onClick={() => item.route && navigateTo(item.route)} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 shadow-sm ${item.color}`}>
                  <span className="material-symbols-outlined !text-xl filled-icon">{item.icon}</span>
                </div>
                <p className="text-[10px] font-black text-slate-700 dark:text-slate-400 tracking-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 跟进提醒中心 */}
      <div className="px-5 mt-10">
        <div className="flex items-center justify-between mb-5 px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-900 dark:text-white text-base font-black tracking-tight">跟进提醒</h3>
            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md shadow-red-200">3</span>
          </div>
          <button className="text-primary text-[10px] font-black uppercase tracking-widest">查看全部</button>
        </div>
        <div className="space-y-4">
          {reminders.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white dark:bg-slate-900 p-5 rounded-[2.2rem] border shadow-sm flex gap-4 items-start relative overflow-hidden transition-all active:scale-[0.98] ${
                item.status === 'overdue' ? 'border-red-50 dark:border-red-900/20' : 'border-slate-50 dark:border-slate-800'
              }`}
            >
               {item.status === 'overdue' && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>}
               {item.status === 'urgent' && <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>}
               {item.status === 'today' && <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>}

               <div className={`size-11 rounded-2xl flex items-center justify-center ${item.color} shrink-0 shadow-sm`}>
                  <span className="material-symbols-outlined !text-xl filled-icon">{item.icon}</span>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate pr-2 tracking-tight">{item.title}</p>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap shadow-sm ${
                      item.status === 'overdue' ? 'bg-red-500 text-white' : 
                      item.status === 'urgent' ? 'bg-blue-600 text-white' : 
                      'bg-orange-500 text-white'
                    }`}>
                      {item.deadline}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2">
                     <button className="flex-1 text-[10px] font-black text-white bg-primary px-3 py-2 rounded-xl active:bg-blue-700 transition-colors uppercase tracking-widest shadow-lg shadow-primary/10">
                        立即处理
                     </button>
                     <button className="flex-1 text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl active:bg-slate-100 transition-colors uppercase tracking-widest">
                        延后
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 优化后的 FAB 按钮：更紧凑、阴影更细腻 */}
      <button 
        onClick={() => navigateTo(PageType.REMITTANCE_FORM)}
        className="fixed bottom-28 right-6 size-12 rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 flex items-center justify-center border-2 border-white dark:border-slate-800 active:scale-90 transition-all z-50"
      >
        <span className="material-symbols-outlined !text-2xl font-light">payments</span>
        <div className="absolute -top-0.5 -right-0.5 size-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black">2</div>
      </button>
    </div>
  );
};

export default SalesWorkbench;
