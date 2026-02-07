
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 移动端抽屉开关

  // PC 端专用数据统计
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
    <div className="flex h-screen bg-[#f1f5f9] font-sans overflow-hidden animate-fadeIn relative">
      
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 侧边导航栏 - 响应式设计 */}
      <aside className={`
        fixed lg:relative z-[70] h-full w-64 bg-[#0f172a] flex flex-col shrink-0 shadow-2xl transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white !text-xl filled-icon">rocket</span>
            </div>
            <div>
              <h1 className="text-white font-black tracking-tight text-lg leading-none">SignPlus</h1>
              <p className="text-slate-500 text-[8px] uppercase font-black tracking-[0.3em] mt-1.5">PC-Backend</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', label: '管理主控台', icon: 'admin_panel_settings' },
            { id: 'install', label: '安装员工作台', icon: 'engineering' },
            { id: 'sales', label: '业务员工作台', icon: 'badge' },
            { id: 'approval', label: '审批工作台', icon: 'verified_user' },
            { id: 'hr', label: '人事管理台', icon: 'groups' },
            { id: 'settings', label: '全局系统配置', icon: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                activeMenu === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined !text-xl ${activeMenu === item.id ? 'filled-icon' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={() => navigateTo(PageType.ADMIN_WORKBENCH)}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-xs font-black border border-white/5"
          >
            <span className="material-symbols-outlined !text-lg">mobile_friendly</span>
            切回手机端
          </button>
        </div>
      </aside>

      {/* 内容主容器 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f8faff]">
        {/* 顶部宽屏工具栏 */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-4 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden size-10 flex items-center justify-center text-slate-500 active:bg-slate-100 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:flex items-center gap-4 text-slate-400 text-xs font-black uppercase tracking-widest">
              <span>Enterprise</span>
              <span className="material-symbols-outlined !text-sm">chevron_right</span>
              <span className="text-slate-900">Admin Dashboard v2.5</span>
            </div>
            <div className="md:hidden font-black text-slate-900 text-sm">管理中心</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:relative lg:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 !text-xl">search</span>
              <input 
                className="bg-slate-100 border-none rounded-2xl h-11 pl-11 pr-4 w-72 text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all"
                placeholder="搜索全局数据..."
              />
            </div>
            <div className="flex items-center gap-3 lg:gap-5">
              <button className="size-10 lg:size-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all relative">
                <span className="material-symbols-outlined !text-2xl">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none">管理员 张伟</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">Super Admin</p>
                </div>
                <img src="https://picsum.photos/100?random=1" className="size-9 lg:size-10 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:scale-105 transition-all" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar">
          
          {/* 数据指标网格 - 响应式列数 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8">
            <PCStatCard label="年度预估总营收" value={`¥${stats.revenue}w`} trend="+12.8%" icon="analytics" color="text-indigo-600" bg="bg-indigo-50" />
            <PCStatCard label="实收回款总额" value={`¥${stats.paid}w`} trend={`率 ${stats.rate}%`} icon="account_balance_wallet" color="text-emerald-600" bg="bg-emerald-50" />
            <PCStatCard label="活跃执行商机" value={stats.opps} trend="实时" icon="rocket_launch" color="text-blue-600" bg="bg-blue-50" />
            <PCStatCard label="签约客户总量" value={stats.customers} trend="全行业" icon="group" color="text-orange-600" bg="bg-orange-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* 趋势图表区 (响应式) */}
            <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                   <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">回款现金流分析</h3>
                   <p className="text-xs text-slate-400 font-bold mt-1">Financial Analytics</p>
                </div>
                <div className="flex p-1 bg-slate-50 rounded-2xl gap-1 self-start sm:self-center">
                   <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-all">Monthly</button>
                   <button className="px-6 py-2 rounded-xl bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/20">Yearly</button>
                </div>
              </div>
              
              <div className="h-48 lg:h-64 flex items-end justify-between px-2 gap-2 lg:gap-4 overflow-x-auto no-scrollbar">
                 {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) => (
                   <div key={i} className="flex-1 min-w-[12px] group relative flex flex-col items-center">
                      <div className="bg-primary/5 group-hover:bg-primary transition-all rounded-t-xl w-full" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[9px] text-slate-300 font-black uppercase">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>

            {/* 状态监控环 */}
            <div className="bg-[#0f172a] p-8 lg:p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col relative overflow-hidden">
              <h3 className="text-lg lg:text-xl font-black mb-8 relative z-10">业务执行看板</h3>
              <div className="space-y-6 flex-1 relative z-10">
                <PCProgressItem label="安装执行中" value={contracts.filter(c => c.installStatus === 'active').length} total={contracts.length} color="bg-blue-500" />
                <PCProgressItem label="待回款合同" value={contracts.filter(c => c.paid < c.amount).length} total={contracts.length} color="bg-orange-500" />
                <PCProgressItem label="VIP 高级客户" value={customers.filter(c => c.type === 'TOP').length} total={customers.length} color="bg-emerald-500" />
              </div>
              <button className="w-full h-12 mt-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs transition-all border border-white/5">
                下载年度报告
              </button>
            </div>
          </div>

          {/* 全量大数据表格 - 增加横向滚动支持 */}
          <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-white overflow-hidden mb-10">
             <div className="p-6 lg:p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                   <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">合同全量管理台账</h3>
                   <p className="text-sm text-slate-400 mt-1 font-bold">实时同步移动端所有报工与流水</p>
                </div>
                <div className="flex gap-4">
                   <button className="h-11 px-6 rounded-2xl bg-slate-50 text-[10px] font-black text-slate-500 hover:text-primary transition-all flex items-center gap-2 border border-slate-100">
                      <span className="material-symbols-outlined !text-lg">file_download</span> 导出 XLSX
                   </button>
                   <button className="h-11 px-8 rounded-2xl bg-primary text-white text-[10px] font-black shadow-xl shadow-primary/25 active:scale-95 transition-all">
                      新增合同档案
                   </button>
                </div>
             </div>

             <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-[1000px] w-full px-6 pb-6">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
                          <th className="px-6 py-4">合同项目名称</th>
                          <th className="px-6 py-4">客户单位</th>
                          <th className="px-6 py-4 text-right">总额</th>
                          <th className="px-6 py-4 text-right">已收</th>
                          <th className="px-6 py-4">回款进度</th>
                          <th className="px-6 py-4 text-center">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(c => (
                          <tr key={c.id} className="group hover:scale-[1.005] transition-all">
                            <td className="px-6 py-5 bg-slate-50/50 rounded-l-2xl">
                                <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{c.title}</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-widest uppercase">ID: {c.id}</p>
                            </td>
                            <td className="px-6 py-5 bg-slate-50/50">
                                <span className="text-xs font-bold text-slate-500">{c.customer}</span>
                            </td>
                            <td className="px-6 py-5 bg-slate-50/50 text-right">
                                <span className="text-xs font-black text-slate-900">¥{c.amount.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-5 bg-slate-50/50 text-right">
                                <span className="text-xs font-black text-emerald-500">¥{c.paid.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-5 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden min-w-[80px]">
                                      <div className="h-full bg-primary" style={{ width: `${(c.paid / c.amount) * 100}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400">{Math.round((c.paid / c.amount) * 100)}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 bg-slate-50/50 rounded-r-2xl text-center">
                                <button className="size-8 rounded-lg bg-white text-slate-400 hover:text-primary shadow-sm border border-slate-100 transition-all flex items-center justify-center mx-auto">
                                  <span className="material-symbols-outlined !text-xl">visibility</span>
                                </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const PCStatCard = ({ label, value, trend, icon, color, bg }: any) => (
  <div className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-lg border border-white transition-all hover:translate-y-[-4px] group">
    <div className={`size-12 lg:size-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 shadow-sm group-hover:rotate-6 transition-transform`}>
       <span className="material-symbols-outlined !text-2xl lg:!text-3xl filled-icon">{icon}</span>
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-xl lg:text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{value}</span>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg hidden sm:block">{trend}</span>
    </div>
  </div>
);

const PCProgressItem = ({ label, value, total, color }: any) => {
  const percentage = total > 0 ? (value / total * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white opacity-60 tabular-nums">{value} / {total}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default AdminPCWorkbench;
