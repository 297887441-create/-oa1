
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
}

const AdminWorkbench: React.FC<Props> = ({ navigateTo, contracts }) => {
  const [filterStaff, setFilterStaff] = useState('全员');
  const [filterDate, setFilterDate] = useState('本月');

  const resources = {
    staffActive: 12,
    urgentApprovals: 5,
    inventoryLow: 3
  };

  const stats = useMemo(() => {
    const isFiltered = filterStaff !== '全员';
    const multiplier = isFiltered ? 0.4 : 1;
    const totalRevenue = contracts.reduce((sum, c) => sum + c.amount, 0) * multiplier;
    const paidRevenue = contracts.reduce((sum, c) => sum + c.paid, 0) * multiplier;
    
    return [
      { label: '商机总额', value: `¥${(totalRevenue * 1.5 / 10000).toFixed(1)}w`, icon: 'hub', color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { label: '回款总计', value: `¥${(paidRevenue / 10000).toFixed(1)}w`, icon: 'payments', color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: '转化效能', value: `${isFiltered ? '42' : '38.5'}%`, icon: 'query_stats', color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: '待收余款', value: `¥${((totalRevenue - paidRevenue) / 10000).toFixed(1)}w`, icon: 'account_balance_wallet', color: 'text-orange-500', bg: 'bg-orange-50' },
    ];
  }, [contracts, filterStaff]);

  return (
    <div className="animate-fadeIn bg-[#f4f7f9] dark:bg-background-dark min-h-screen pb-32 font-sans selection:bg-primary/20">
      <div className="bg-[#0f172a] pt-12 pb-20 px-6 relative overflow-hidden transition-all duration-500 shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo(PageType.HOME)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all">
              <span className="material-symbols-outlined !text-xl font-bold">arrow_back</span>
            </button>
            <div>
              <h2 className="text-white text-lg font-black tracking-tight leading-none">行政指挥中心</h2>
              <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] mt-1.5 font-bold italic">Executive Command Center</p>
            </div>
          </div>
          <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
            <span className="material-symbols-outlined !text-xl font-light">tune</span>
          </button>
        </div>

        <div className="relative z-10 flex gap-2 overflow-x-auto no-scrollbar pb-1">
           <select 
             value={filterStaff}
             onChange={(e) => setFilterStaff(e.target.value)}
             className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-[11px] font-black text-white outline-none focus:bg-primary transition-all appearance-none pr-8 relative"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
           >
             <option className="text-slate-900">全员</option>
             <option className="text-slate-900">张经理</option>
             <option className="text-slate-900">王组长</option>
           </select>
           
           <select 
             value={filterDate}
             onChange={(e) => setFilterDate(e.target.value)}
             className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-[11px] font-black text-white outline-none focus:bg-primary transition-all appearance-none pr-8 relative"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
           >
             <option className="text-slate-900">本月</option>
             <option className="text-slate-900">本季</option>
             <option className="text-slate-900">全年</option>
           </select>
        </div>
      </div>

      <main className="px-5 -mt-8 relative z-20 space-y-6">
        {/* PC 端快捷切换卡片 */}
        <section 
          onClick={() => navigateTo(PageType.ADMIN_PC_WORKBENCH)}
          className="bg-gradient-to-r from-primary to-indigo-600 p-6 rounded-[2.5rem] shadow-xl shadow-primary/20 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <span className="material-symbols-outlined !text-2xl">desktop_windows</span>
            </div>
            <div>
              <h4 className="text-white font-black text-sm">进入 PC 管理后台</h4>
              <p className="text-white/60 text-[10px] font-bold mt-1">支持全屏大表单与深度报表</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/50 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
        </section>

        <section className="grid grid-cols-2 gap-3">
           {stats.map((s, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-[1.8rem] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-800 transition-all active:scale-95 group">
                <div className={`size-8 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform`}>
                   <span className="material-symbols-outlined !text-xl filled-icon">{s.icon}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-lg font-black text-slate-800 dark:text-white tabular-nums">{s.value}</p>
             </div>
           ))}
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-around">
            <div className="text-center">
               <p className="text-2xl font-black text-primary leading-none mb-1">{resources.staffActive}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">外勤在岗</p>
            </div>
            <div className="w-px h-8 bg-slate-50 dark:bg-slate-800"></div>
            <div className="text-center">
               <p className="text-2xl font-black text-rose-500 leading-none mb-1">{resources.urgentApprovals}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">加急待办</p>
            </div>
            <div className="w-px h-8 bg-slate-50 dark:bg-slate-800"></div>
            <div className="text-center">
               <p className="text-2xl font-black text-orange-400 leading-none mb-1">{resources.inventoryLow}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">库存预警</p>
            </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
           {[
             { label: '审批设置', icon: 'settings_suggest', color: 'from-blue-600 to-indigo-700', sub: '工作流引擎配置', route: PageType.APPROVAL_SETTINGS },
             { label: '回款管理', icon: 'account_balance_wallet', color: 'from-amber-500 to-orange-600', sub: '应收/已收实时监控', route: PageType.PAYMENT_MANAGEMENT },
             { label: '企业付款', icon: 'account_balance', color: 'from-emerald-500 to-teal-700', sub: '预支/报销一键发放', route: PageType.CORPORATE_PAYMENT },
             { label: '系统设置', icon: 'admin_panel_settings', color: 'from-blue-400 to-cyan-600', sub: '核心经营配置', route: PageType.SYSTEM_SETTINGS },
           ].map((m, i) => (
             <div 
               key={i} 
               onClick={() => m.route && navigateTo(m.route)}
               className="bg-white dark:bg-slate-900 p-5 rounded-[2.2rem] shadow-sm border border-slate-50 dark:border-slate-800 active:scale-95 transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${m.color} opacity-5 rounded-bl-[2rem]`}></div>
                <div className={`size-10 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                   <span className="material-symbols-outlined !text-xl">{m.icon}</span>
                </div>
                <h4 className="text-[14px] font-black text-slate-800 dark:text-white mb-1">{m.label}</h4>
                <p className="text-[9px] text-slate-400 font-bold leading-tight">{m.sub}</p>
             </div>
           ))}
        </section>
      </main>

      <button className="fixed bottom-28 right-6 size-12 rounded-full bg-[#0f172a] text-white shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800 active:scale-90 transition-all z-50">
        <span className="material-symbols-outlined !text-2xl font-light">broadcast_on_home</span>
      </button>
    </div>
  );
};

export default AdminWorkbench;
