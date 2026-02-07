
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract, GlobalCustomer, EnhancedOpportunity } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
  customers: GlobalCustomer[];
  opportunities: EnhancedOpportunity[];
}

const AdminPCWorkbench: React.FC<Props> = ({ navigateTo, contracts, customers, opportunities }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const stats = useMemo(() => {
    const totalContractValue = contracts.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = contracts.reduce((sum, c) => sum + c.paid, 0);
    const activeOpps = opportunities.filter(o => o.status === 'active').length;
    const recoveryRate = totalContractValue > 0 ? (totalPaid / totalContractValue * 100).toFixed(1) : '0';

    return {
      revenue: (totalContractValue / 10000).toFixed(1),
      paid: (totalPaid / 10000).toFixed(1),
      opps: activeOpps,
      rate: recoveryRate,
      customers: customers.length,
      contracts: contracts.length
    };
  }, [contracts, opportunities, customers]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* 侧边栏 */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white !text-2xl">rocket</span>
          </div>
          <div>
            <h1 className="text-white font-black tracking-tight text-lg">SignPlus</h1>
            <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Enterprise OS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', label: '控制面板', icon: 'grid_view' },
            { id: 'contracts', label: '合同台账', icon: 'description' },
            { id: 'customers', label: '客户管理', icon: 'group' },
            { id: 'approvals', label: '流程审批', icon: 'verified_user' },
            { id: 'finance', label: '财务结算', icon: 'payments' },
            { id: 'settings', label: '系统设置', icon: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeMenu === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined !text-xl font-light">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigateTo(PageType.HOME)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined !text-xl font-light">mobile_friendly</span>
            切回手机端
          </button>
        </div>
      </aside>

      {/* 主体内容区 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部工具栏 */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
            <span>首页</span>
            <span className="material-symbols-outlined !text-sm">chevron_right</span>
            <span className="text-slate-900 dark:text-white">数据指挥中心</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 !text-xl">search</span>
              <input 
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-10 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="搜索全局数据..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="https://picsum.photos/100?random=1" className="size-9 rounded-xl object-cover" alt="" />
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none">管理员 张伟</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 核心内容流 */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/50">
          {/* 指标卡片网格 */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard label="年度合同总额" value={`¥${stats.revenue}w`} unit="+12.5%" icon="bar_chart" color="text-indigo-600" bg="bg-indigo-50" />
            <StatCard label="累计回款金额" value={`¥${stats.paid}w`} unit={`回款率 ${stats.rate}%`} icon="account_balance_wallet" color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="活跃商机数" value={stats.opps} unit="个" icon="rocket_launch" color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="客户总量" value={stats.customers} unit="家" icon="group" color="text-orange-600" bg="bg-orange-50" />
          </div>

          {/* 图表与动态预留区 */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 dark:text-white">回款趋势分析</h3>
                <div className="flex gap-2">
                   <button className="px-4 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-all">Monthly</button>
                   <button className="px-4 py-1.5 rounded-lg bg-primary text-[10px] font-black uppercase text-white shadow-lg shadow-primary/20">Yearly</button>
                </div>
              </div>
              {/* 模拟简易柱状图 */}
              <div className="h-64 flex items-end justify-between px-4 gap-4">
                 {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) => (
                   <div key={i} className="flex-1 group relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">¥{h}k</div>
                      <div className="bg-primary/10 group-hover:bg-primary transition-all rounded-t-lg w-full" style={{ height: `${h}%` }}></div>
                      <p className="text-[10px] text-slate-400 font-bold mt-4 text-center">{i+1}月</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <h3 className="font-black text-slate-900 dark:text-white mb-6">进行中的项目状态</h3>
              <div className="space-y-6 flex-1">
                <ProgressItem label="安装执行中" value={contracts.filter(c => c.installStatus === 'active').length} total={contracts.length} color="bg-blue-500" />
                <ProgressItem label="待回款合同" value={contracts.filter(c => c.paid < c.amount).length} total={contracts.length} color="bg-orange-500" />
                <ProgressItem label="优质大客户" value={customers.filter(c => c.type === 'TOP').length} total={customers.length} color="bg-emerald-500" />
              </div>
              <button className="w-full h-12 mt-6 rounded-2xl bg-slate-50 text-slate-400 font-black text-xs hover:bg-slate-100 transition-all">查看详细业务报告</button>
            </div>
          </div>

          {/* 大数据表格 */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                   <h3 className="font-black text-slate-900 dark:text-white">全量合同管理台</h3>
                   <p className="text-xs text-slate-400 mt-1 font-medium">实时同步所有在研与已归档项目合同数据</p>
                </div>
                <div className="flex gap-4">
                   <button className="h-10 px-4 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined !text-lg">file_download</span> 导出报表
                   </button>
                   <button className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                      + 录入新合同
                   </button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">合同名称</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">客户单位</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">总额</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">已收</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">执行进度</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {contracts.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                           <td className="px-8 py-5">
                              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{c.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">#{c.id}</p>
                           </td>
                           <td className="px-6 py-5 text-sm font-bold text-slate-500">{c.customer}</td>
                           <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-right">¥{c.amount.toLocaleString()}</td>
                           <td className="px-6 py-5 text-sm font-black text-emerald-500 text-right">¥{c.paid.toLocaleString()}</td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[100px]">
                                    <div className="h-full bg-primary" style={{ width: `${(c.paid / c.amount) * 100}%` }}></div>
                                 </div>
                                 <span className="text-[10px] font-black text-slate-400">{Math.round((c.paid / c.amount) * 100)}%</span>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center justify-center gap-2">
                                 <button className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                    <span className="material-symbols-outlined !text-lg">visibility</span>
                                 </button>
                                 <button className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                    <span className="material-symbols-outlined !text-lg">edit</span>
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, unit, icon, color, bg }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:scale-105 group">
    <div className={`size-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
       <span className="material-symbols-outlined !text-2xl filled-icon">{icon}</span>
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{value}</span>
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tight">{unit}</span>
    </div>
  </div>
);

const ProgressItem = ({ label, value, total, color }: any) => {
  const percentage = total > 0 ? (value / total * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900 dark:text-white">{value} / {total}</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default AdminPCWorkbench;
