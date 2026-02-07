
import React, { useState, useMemo } from 'react';
import { PageType, OrderRecord } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  orders: OrderRecord[];
}

const CommissionStats: React.FC<Props> = ({ navigateTo, orders }) => {
  const [selectedMonth, setSelectedMonth] = useState('2023-11');

  // 核心筛选：筛选出所选月份已完工的订单
  const filteredOrders = useMemo(() => {
    return orders.filter(order => order.completeDate.startsWith(selectedMonth));
  }, [orders, selectedMonth]);

  // 汇总统计：仅汇总“已结算”金额
  const summary = useMemo(() => {
    const totalConfirmed = filteredOrders.reduce((sum, o) => sum + (o.commission || 0), 0);
    const pendingCount = filteredOrders.filter(o => o.commission === null).length;
    const settledCount = filteredOrders.filter(o => o.commission !== null).length;
    return { totalConfirmed, pendingCount, settledCount };
  }, [filteredOrders]);

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-20 font-sans selection:bg-primary/20 no-scrollbar">
      
      {/* 紧凑型深色页头 */}
      <div className="bg-[#101922] pt-10 pb-16 px-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
        
        {/* 第一行：返回 + 标题 + 月份选择 */}
        <div className="relative z-10 flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">提成明细看板</h2>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer">
              <span className="text-white text-xs font-bold tabular-nums">{selectedMonth.replace('-', '年')}月</span>
              <span className="material-symbols-outlined text-white/40 !text-base">calendar_month</span>
            </div>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* 第二行：总提成汇总 */}
        <div className="relative z-10 flex flex-col items-center">
           <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-4">
             Estimated Monthly Commission / 月度总提成
           </p>
           <div className="flex items-baseline gap-1.5 mb-8">
             <span className="text-white/40 text-2xl font-medium">¥</span>
             <span className="text-6xl font-black text-white tracking-tighter tabular-nums animate-slideUp">
               {summary.totalConfirmed.toLocaleString()}
             </span>
           </div>
           
           {/* 状态药丸 */}
           <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 text-emerald-400 text-[11px] px-4 py-1.5 rounded-full font-black flex items-center gap-1.5 border border-emerald-500/20">
                <span className="material-symbols-outlined !text-[16px] filled-icon">check_circle</span>
                已结算 {summary.settledCount} 项
              </div>
              {summary.pendingCount > 0 && (
                <div className="bg-orange-500/10 text-orange-400 text-[11px] px-4 py-1.5 rounded-full font-black flex items-center gap-1.5 border border-orange-500/20">
                  <span className="material-symbols-outlined !text-[16px]">history</span>
                  {summary.pendingCount} 项待确认
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 列表区域 */}
      <div className="px-5 -mt-6 relative z-20 space-y-5">
        {/* 列表小标题 */}
        <div className="flex items-center justify-between px-2 mb-2">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-5 bg-primary rounded-full"></div>
             <span className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">已完工订单明细</span>
           </div>
           <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.1em]">Finished Orders</span>
        </div>

        {/* 订单卡片流 */}
        <div className="space-y-4 pb-12">
          {filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
            <div 
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 dark:shadow-none animate-slideUp relative overflow-hidden group border border-white dark:border-slate-800"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
               <div className={`absolute top-0 left-0 w-1.5 h-full ${order.commission === null ? 'bg-orange-400' : 'bg-primary'}`}></div>
               
               <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-primary transition-colors">
                      {order.projectName}
                    </h4>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">单号 #{order.id}</span>
                       <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">完工于 {order.completeDate}</span>
                    </div>
                  </div>
                  <div className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider shadow-sm border ${
                    order.status === 'confirmed' 
                      ? 'bg-blue-50 text-primary border-primary/10' 
                      : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {order.status === 'confirmed' ? '已核算' : '待处理'}
                  </div>
               </div>

               <div className="flex items-center justify-between py-5 border-y border-slate-50 dark:border-slate-800/50 mb-4">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">报工总工时</span>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{order.totalWorkHours}</span>
                        <span className="text-[12px] text-slate-300 font-bold">h</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">提成单价 (参考)</span>
                     <div className="flex items-baseline justify-end gap-1">
                        <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">
                          ¥{order.commission ? (order.commission / order.totalWorkHours).toFixed(1) : '--'}
                        </span>
                        <span className="text-[12px] text-slate-300 font-bold">/h</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-300 font-bold italic">
                     <span className="material-symbols-outlined !text-lg">wysiwyg</span>
                     <span>由管理员后台复核确认</span>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5 tracking-widest">实得提成金额</p>
                     {order.commission !== null ? (
                       <p className="text-3xl font-black text-primary tabular-nums group-hover:scale-105 transition-transform tracking-tighter">
                         ¥{order.commission.toLocaleString()}
                       </p>
                     ) : (
                       <div className="flex items-center gap-1.5 justify-end text-orange-500 font-black text-lg">
                          <span className="material-symbols-outlined !text-xl animate-spin">sync</span>
                          <span className="tracking-tight">待分配提成</span>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )) : (
            <div className="py-24 flex flex-col items-center justify-center text-slate-300 animate-fadeIn">
               <div className="size-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner mb-6">
                 <span className="material-symbols-outlined !text-5xl opacity-40">inventory_2</span>
               </div>
               <p className="text-sm font-black tracking-widest uppercase opacity-60">该月份暂无完工订单</p>
               <p className="text-[10px] text-slate-400 mt-2">只有“已完工”的订单才会出现在统计中</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionStats;
