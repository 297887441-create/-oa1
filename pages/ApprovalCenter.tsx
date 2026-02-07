
import React, { useState, useEffect, useMemo } from 'react';
import { PageType, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected', id?: string) => void;
  todoCount: number;
  requestCount: number;
  pendingList: ApprovalItem[];
}

const ApprovalCenter: React.FC<Props> = ({ navigateTo, todoCount, requestCount, pendingList }) => {
  const [stats, setStats] = useState({ avgTime: 0, approvalRate: 0, completedCount: 0 });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allAppEntries = [
    { id: 'advance', icon: 'payments', label: '预支申请', color: 'blue', route: PageType.ADVANCE_REQUEST },
    { id: 'leave', icon: 'calendar_month', label: '请假申请', color: 'indigo', route: PageType.LEAVE_REQUEST },
    { id: 'expense', icon: 'receipt_long', label: '报销申请', color: 'orange', route: PageType.EXPENSE_REIMBURSEMENT },
    { id: 'contract', icon: 'history_edu', label: '合同审批', color: 'cyan', route: PageType.CONTRACT_MANAGEMENT },
    { id: 'quote', icon: 'request_quote', label: '报价单', color: 'emerald' },
    { id: 'inventory', icon: 'inventory_2', label: '领料申请', color: 'purple' },
    { id: 'completion', icon: 'assignment_turned_in', label: '完工验收', color: 'rose' },
    { id: 'more', icon: 'more_horiz', label: '更多', color: 'slate' },
  ];

  const filteredApps = useMemo(() => {
    if (!searchQuery) return allAppEntries;
    return allAppEntries.filter(app => app.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredTimeline = useMemo(() => {
    if (!searchQuery) return pendingList;
    const q = searchQuery.toLowerCase();
    return pendingList.filter(item => 
      item.user.toLowerCase().includes(q) || 
      item.type.toLowerCase().includes(q) || 
      item.detail.toLowerCase().includes(q)
    );
  }, [searchQuery, pendingList]);

  useEffect(() => {
    const duration = 1200;
    const totalFrames = 60;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setStats({
        avgTime: parseFloat((easeOut * 1.2).toFixed(1)),
        approvalRate: parseFloat((easeOut * 98.5).toFixed(1)),
        completedCount: Math.floor(easeOut * 156)
      });
      if (frame === totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fadeIn bg-[#f8fafc] min-h-screen pb-24 font-sans no-scrollbar">
      <div className={`bg-[#0f172a] pt-12 pb-28 px-6 relative overflow-hidden transition-all duration-500 ${isSearchOpen ? 'pb-20' : 'pb-28'}`}>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          {!isSearchOpen ? (
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => navigateTo(PageType.HOME)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all">
                  <span className="material-symbols-outlined !text-xl font-light">arrow_back_ios_new</span>
                </button>
                <div>
                  <h2 className="text-white text-xl font-bold tracking-tight">审批工作台</h2>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-0.5">Approval Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsSearchOpen(true)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                <span className="material-symbols-outlined !text-xl">search</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 !text-xl">search</span>
                <input 
                  autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索申请、姓名..." className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-white text-sm font-bold">取消</button>
            </div>
          )}

          {!isSearchOpen && (
            <div className="flex gap-4">
              <div onClick={() => navigateTo(PageType.APPROVAL_TO_ME)} className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl active:scale-95 transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-6">
                  <div className="size-11 rounded-xl bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-white !text-2xl">pending_actions</span></div>
                  <div className="text-right"><p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">To-do</p><span className="text-white text-xs font-bold">待我处理</span></div>
                </div>
                <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white tracking-tighter">{todoCount.toString().padStart(2, '0')}</span><span className="text-white/30 text-xs font-medium ml-1">项任务</span></div>
              </div>
              <div onClick={() => navigateTo(PageType.APPROVAL_MY_INITIATED)} className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl active:scale-95 transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-6">
                  <div className="size-11 rounded-xl bg-emerald-500 flex items-center justify-center"><span className="material-symbols-outlined text-white !text-2xl">send</span></div>
                  <div className="text-right"><p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Requests</p><span className="text-white text-xs font-bold">我发起的</span></div>
                </div>
                <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white tracking-tighter">{requestCount.toString().padStart(2, '0')}</span><span className="text-white/30 text-xs font-medium ml-1">份申请</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isSearchOpen && (
        <div className="px-6 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-between">
            <div className="text-center group"><p className="text-[10px] text-slate-400 font-bold uppercase mb-2">平均耗时</p><p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.avgTime}h</p></div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="text-center group"><p className="text-[10px] text-slate-400 font-bold uppercase mb-2">审批通过率</p><p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.approvalRate}%</p></div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="text-center group"><p className="text-[10px] text-slate-400 font-bold uppercase mb-2">累计完成</p><p className="text-2xl font-bold text-primary tracking-tight">{stats.completedCount}</p></div>
          </div>
        </div>
      )}

      <div className={`px-6 relative z-20 space-y-10 ${isSearchOpen ? 'mt-8' : 'mt-10'}`}>
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">发起申请</h3>
          </div>
          <div className="grid grid-cols-4 gap-y-8">
            {filteredApps.map(app => (
              <AppEntry key={app.id} onClick={() => app.route && navigateTo(app.route)} icon={app.icon} label={app.label} color={app.color} />
            ))}
          </div>
        </section>

        <section className="pb-10">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">审批动态</h3>
          </div>
          <div className="space-y-4">
            {filteredTimeline.length > 0 ? filteredTimeline.map(item => (
              <TimelineItem key={item.id} user={item.user} type={item.type} desc={item.detail} status={item.status} icon={item.icon} onClick={() => navigateTo(item.route, 'approver', item.status, item.id)} />
            )) : <p className="text-center text-slate-300 py-10 text-sm">暂无待处理审批</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const AppEntry = ({ icon, label, color, onClick }: any) => {
  const colors: Record<string, string> = { blue: 'bg-blue-500', indigo: 'bg-indigo-500', orange: 'bg-orange-500', cyan: 'bg-cyan-500', emerald: 'bg-emerald-500', purple: 'bg-purple-500', rose: 'bg-rose-500', slate: 'bg-slate-400' };
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-3 cursor-pointer group active:scale-95 transition-all">
      <div className={`size-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${colors[color] || 'bg-slate-500'}`}><span className="material-symbols-outlined !text-2xl filled-icon">{icon}</span></div>
      <span className="text-center text-[11px] font-bold text-slate-600">{label}</span>
    </div>
  );
};

const TimelineItem = ({ user, type, desc, status, icon, onClick }: any) => (
  <div onClick={onClick} className="group bg-white rounded-3xl p-5 border border-slate-50 shadow-sm active:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer">
    <div className="flex gap-4">
      <div className="size-12 shrink-0 rounded-2xl flex items-center justify-center bg-blue-500 text-white shadow-md"><span className="material-symbols-outlined !text-xl filled-icon">{icon}</span></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1.5"><h4 className="text-sm font-bold text-slate-900">{user} 的 {type}</h4><span className="text-[10px] text-slate-400 font-medium">刚刚</span></div>
        <p className="text-xs text-slate-500 truncate mb-3">{desc}</p>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-primary"><span className="size-1.5 rounded-full bg-primary animate-pulse"></span>等待审批</div>
          <span className="material-symbols-outlined !text-lg text-slate-300 group-hover:text-primary transition-all">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
);

export default ApprovalCenter;
