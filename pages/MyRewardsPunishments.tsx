
import React, { useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

interface RPRecord {
  id: string;
  type: 'reward' | 'punishment';
  title: string;
  amount: string;
  date: string;
  reason: string;
  dept: string;
  icon: string;
}

const MyRewardsPunishments: React.FC<Props> = ({ navigateTo }) => {
  const records: RPRecord[] = [
    {
      id: 'rp-1',
      type: 'reward',
      title: '2023年Q3季度 销售冠军奖金',
      amount: '+ ¥ 2,000.00',
      date: '2023-10-15',
      reason: '季度销售总额突破 500w，客户满意度 100%',
      dept: '业务部',
      icon: 'military_tech'
    },
    {
      id: 'rp-2',
      type: 'punishment',
      title: '考勤迟到处罚',
      amount: '- ¥ 50.00',
      date: '2023-09-22',
      reason: '全勤考勤中单次迟到超过 30 分钟',
      dept: '行政部',
      icon: 'timer_off'
    },
    {
      id: 'rp-3',
      type: 'reward',
      title: '优质服务 特别贡献奖',
      amount: '+ ¥ 500.00',
      date: '2023-08-10',
      reason: '获得万达集团客户官方感谢信一封',
      dept: '客服部',
      icon: 'verified'
    }
  ];

  const stats = useMemo(() => {
    const rewards = records.filter(r => r.type === 'reward');
    const totalReward = rewards.reduce((sum, r) => {
      const val = parseFloat(r.amount.replace(/[^-?\d.]/g, '')) || 0;
      return sum + val;
    }, 0);
    return { totalReward, count: records.length };
  }, [records]);

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 font-sans">
      <div className="bg-[#0f172a] pt-12 pb-24 px-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <button 
          onClick={() => navigateTo(PageType.MINE)}
          className="absolute top-4 left-4 size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="relative z-10 pt-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-amber-500 !text-xl filled-icon">workspace_premium</span>
            <h2 className="text-white text-lg font-black tracking-tight">我的奖惩明细</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">年度奖金累计 (CNY)</p>
              <p className="text-3xl font-black text-emerald-400 tabular-nums tracking-tighter">¥{stats.totalReward.toLocaleString()}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">记录总数</p>
              <p className="text-3xl font-black text-white">{stats.count}<span className="text-xs font-bold ml-1 opacity-40">项</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-4">
        {records.map((record, idx) => (
          <div 
            key={record.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-white dark:border-slate-800 shadow-sm animate-slideUp"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
             <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                   <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                     record.type === 'reward' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                      <span className="material-symbols-outlined !text-xl filled-icon">{record.icon}</span>
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{record.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{record.dept} · {record.date}</p>
                   </div>
                </div>
                <span className={`text-base font-black tabular-nums ${
                  record.type === 'reward' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                   {record.amount}
                </span>
             </div>

             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">缘由说明</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                  “ {record.reason} ”
                </p>
             </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="py-20 text-center">
             <span className="material-symbols-outlined !text-6xl text-slate-100 mb-4">military_tech</span>
             <p className="text-slate-300 font-bold">暂无奖惩记录</p>
          </div>
        )}
      </div>
      
      <div className="mt-10 px-6 pb-20">
         <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100/50">
            <p className="text-[10px] text-blue-500 font-bold leading-relaxed">
              备注：以上记录由各职能部门（行政、财务、业务）根据企业管理制度签发，如有异议请在线下咨询对应部门经理。
            </p>
         </div>
      </div>
    </div>
  );
};

export default MyRewardsPunishments;
