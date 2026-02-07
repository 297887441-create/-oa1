
import React, { useMemo } from 'react';
import { PageType, OrderRecord } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
  commissionOrders: OrderRecord[];
}

const InstallerWorkbench: React.FC<Props> = ({ navigateTo, contracts, commissionOrders }) => {
  const currentMonth = '2023-11';
  const currentMonthProgress = 72;

  // 数据同步逻辑：从提成订单库中实时汇总本月提成
  const currentMonthCommissionTotal = useMemo(() => {
    return commissionOrders
      .filter(order => order.completeDate.startsWith(currentMonth))
      .reduce((sum, order) => sum + (order.commission || 0), 0);
  }, [commissionOrders]);

  // 从全局合同中筛选出正在进行中的安装任务
  const activeProjects = useMemo(() => {
    return contracts.filter(c => c.installStatus === 'active');
  }, [contracts]);

  return (
    <div className="animate-fadeIn bg-[#F9FBFF] dark:bg-[#0F1216] min-h-screen pb-32 font-sans selection:bg-primary/20">
      
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateTo(PageType.HOME)}
            className="group size-9 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined !text-xl text-slate-400 group-hover:text-primary transition-colors">arrow_back</span>
          </button>
          <div>
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Workbench</h1>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">我的安装工单</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="size-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 relative">
              <span className="material-symbols-outlined !text-lg">calendar_today</span>
           </div>
        </div>
      </header>

      <div className="px-6 py-4 space-y-6">
        
        <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-50 dark:border-slate-700 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">本月预估提成</p>
              <div className="flex items-baseline gap-1">
                <span className="text-slate-400 text-base font-medium">¥</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums animate-slideUp">
                  {currentMonthCommissionTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 pt-1.5">
                <span className="material-symbols-outlined !text-xs">trending_up</span>
                较上月增长 12%
              </p>
            </div>

            <div className="relative size-20">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50 dark:stroke-slate-700" strokeWidth="3"></circle>
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-primary" 
                  strokeWidth="3" 
                  strokeDasharray={`${currentMonthProgress}, 100`} 
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-slate-900 dark:text-white">{currentMonthProgress}%</span>
              </div>
            </div>
          </div>
        </section>

        <nav className="grid grid-cols-2 gap-3">
          {[
            { label: '工时明细', sub: '已录入 156h', icon: 'pace', color: 'text-blue-500', bg: 'bg-blue-50/50', route: PageType.WORK_HOUR_STATS },
            { label: '提成统计', sub: '查看已完工提成', icon: 'payments', color: 'text-orange-500', bg: 'bg-orange-50/50', route: PageType.COMMISSION_STATS },
            { label: '我的考勤', sub: '打卡状态监控', icon: 'calendar_month', color: 'text-indigo-500', bg: 'bg-indigo-50/50', route: PageType.ATTENDANCE_STATS },
            { label: '领料记录', sub: '辅材领用明细', icon: 'inventory_2', color: 'text-emerald-500', bg: 'bg-emerald-50/50', route: PageType.MATERIAL_LOGS },
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => item.route && navigateTo(item.route)}
              className="bg-white dark:bg-slate-800 p-4 rounded-[1.8rem] border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer group"
            >
              <div className={`size-10 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-[22px] font-light">{item.icon}</span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{item.label}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1.5">{item.sub}</p>
            </div>
          ))}
        </nav>

        <section className="space-y-4">
          <div className="flex items-end justify-between px-1">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">活跃中的任务</h2>
              <div className="h-1 w-6 bg-primary rounded-full mt-1"></div>
            </div>
            <button 
              onClick={() => navigateTo(PageType.PROJECT_LIST)}
              className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-primary transition-colors"
            >
              全部工单
            </button>
          </div>

          <div className="space-y-4">
            {activeProjects.length > 0 ? activeProjects.map((p) => (
              <div 
                key={p.id}
                className="group bg-white dark:bg-slate-800 rounded-[2.2rem] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-700 active:scale-[0.99] transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={p.thumbnail} className="size-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="project" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-white font-black uppercase tracking-wider">已开工 2.5h</span>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-1">Project Code: #{p.id.split('-').pop()}</p>
                    <h4 className="text-white text-lg font-black tracking-tight leading-tight">{p.title}</h4>
                  </div>
                </div>
                
                <div className="p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                      <span className="material-symbols-outlined !text-sm text-primary">location_on</span>
                      <span className="line-clamp-1">{p.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => navigateTo(PageType.PROJECT_REPORT)}
                      className="bg-primary text-white text-[11px] font-black px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 active:translate-y-0.5 transition-all"
                    >
                      现场报工
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center">
                <span className="material-symbols-outlined !text-4xl text-slate-200 mb-2">assignment_turned_in</span>
                <p className="text-slate-400 text-xs font-bold">暂无开工项目</p>
              </div>
            )}
          </div>
        </section>

      </div>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-40">
        <button 
          onClick={() => navigateTo(PageType.PROJECT_LIST)}
          className="pointer-events-auto flex items-center gap-2 px-8 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-[0_15px_30px_rgba(0,0,0,0.3)] active:scale-95 transition-all border-4 border-white dark:border-slate-800"
        >
          <span className="material-symbols-outlined !text-2xl font-light">list_alt</span>
          <span className="text-sm font-black tracking-[0.2em] uppercase">工单中心</span>
        </button>
      </div>
    </div>
  );
};

export default InstallerWorkbench;
