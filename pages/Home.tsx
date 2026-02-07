
import React, { useState, useEffect, useMemo } from 'react';
import { PageType, Department, WorkbenchMapping, WorkbenchModule, Announcement } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  currentDept: Department;
  workbenchMapping: WorkbenchMapping;
  announcements: Announcement[];
}

const Home: React.FC<Props> = ({ navigateTo, currentDept, workbenchMapping, announcements }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNoticeIdx(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const allModules: WorkbenchModule[] = [
    { id: 'admin', label: '管理台', icon: 'admin_panel_settings', color: 'indigo', route: PageType.ADMIN_WORKBENCH, desc: '指挥中心' },
    { id: 'approval', label: '审批中心', icon: 'verified_user', color: 'blue', route: PageType.APPROVAL_CENTER, desc: '流程处理' },
    { id: 'install', label: '安装台', icon: 'engineering', color: 'orange', route: PageType.INSTALLER_WORKBENCH, desc: '工单执行' },
    { id: 'sales', label: '业务台', icon: 'badge', color: 'emerald', route: PageType.SALES_WORKBENCH, desc: '客户跟进' },
    { id: 'hr', label: '人事台', icon: 'groups', color: 'purple', route: PageType.HR_WORKBENCH, desc: '行政人力' },
  ];

  const visibleApps = useMemo(() => {
    const allowedIds = workbenchMapping[currentDept] || [];
    return allModules.filter(app => {
      const isAllowed = allowedIds.includes(app.id);
      const matchSearch = app.label.includes(searchQuery);
      return isAllowed && matchSearch;
    });
  }, [currentDept, workbenchMapping, searchQuery]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早安';
    if (hour < 18) return '午安';
    return '晚安';
  };

  const currentNotice = announcements[activeNoticeIdx] || announcements[0];

  return (
    <div className="animate-fadeIn bg-[#f8fafc] min-h-screen pb-24 font-sans no-scrollbar">
      <div className={`bg-[#0f172a] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] pt-12 pb-24 px-6 relative overflow-hidden transition-all duration-500 ${isSearchOpen ? 'pb-16' : 'pb-24'}`}>
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          {!isSearchOpen ? (
            <div className="flex items-center justify-between mb-8 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-0.5 shadow-xl">
                  <img src="https://picsum.photos/100?random=100" className="w-full h-full object-cover rounded-[14px]" alt="Avatar" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold tracking-tight">{getTimeGreeting()}，张伟</h2>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-0.5">
                    {currentDept === Department.ADMIN ? '系统管理员' : currentDept === Department.SALES ? '销售专员' : '安装技师'}
                  </p>
                </div>
              </div>
              <button className="size-11 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all">
                <span className="material-symbols-outlined font-light">add_circle</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-8 animate-slideInRight">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 !text-xl">search</span>
                <input 
                  autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索功能或公告..." className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-3 pl-10 pr-4 text-white text-sm outline-none"
                />
              </div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-white text-sm font-bold">取消</button>
            </div>
          )}

          {!isSearchOpen && currentNotice && (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${currentNotice.tagBg}`}>{currentNotice.tag}</span>
                    <span className="text-white/40 text-[10px] font-bold">#{currentNotice.dept}</span>
                  </div>
                  <h3 className="text-white text-lg font-bold leading-tight h-14 line-clamp-2">{currentNotice.title}</h3>
                </div>
                <span className="material-symbols-outlined !text-4xl text-white opacity-20">campaign</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-white/40 text-[11px]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-sm">schedule</span>{currentNotice.time}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-sm">visibility</span>{currentNotice.views}</span>
                </div>
                <button className="text-primary text-[11px] font-black">查看全文</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className={`px-6 space-y-10 ${isSearchOpen ? 'mt-8' : 'mt-12'}`}>
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">常用功能</h3>
            {currentDept === Department.ADMIN && (
               <button onClick={() => navigateTo(PageType.INTERFACE_SETTINGS)} className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                 <span className="material-symbols-outlined !text-sm">tune</span>
                 配置主页
               </button>
            )}
          </div>
          <div className={`grid gap-4 ${visibleApps.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {visibleApps.length > 0 ? visibleApps.map((app) => (
              <div key={app.id} onClick={() => app.route && navigateTo(app.route)} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className={`size-16 rounded-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300 ${
                  app.color === 'blue' ? 'bg-blue-500 text-white' : 
                  app.color === 'orange' ? 'bg-orange-500 text-white' : 
                  app.color === 'emerald' ? 'bg-emerald-500 text-white' : 
                  app.color === 'purple' ? 'bg-purple-600 text-white' :
                  'bg-indigo-600 text-white'
                }`}>
                  <span className="material-symbols-outlined !text-2xl filled-icon">{app.icon}</span>
                </div>
                <div className="text-center">
                  <p className="text-slate-800 text-[11px] font-bold">{app.label}</p>
                  <p className="text-slate-300 text-[8px] font-medium mt-0.5">{app.desc}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-10 text-center text-slate-300 text-sm">暂无权限可见模块</div>
            )}
          </div>
        </section>

        <section className="pb-10">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">我的待办</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-50 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                <div className="flex gap-4">
                  <div className="size-12 rounded-2xl flex items-center justify-center bg-blue-50 text-primary">
                    <span className="material-symbols-outlined !text-2xl filled-icon">verified_user</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate pr-2">费用报销申请待审批</h4>
                      <span className="text-[10px] text-slate-400 font-medium">10:30</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3">财务部 - 王晓明</p>
                    <div className="flex items-center justify-between">
                       <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-400">普通待办</span>
                       <span className="material-symbols-outlined !text-lg text-slate-200">arrow_forward</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
