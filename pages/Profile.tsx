
import React from 'react';
/**
 * Fix for Error: Cannot find name 'PageType'.
 */
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

const Profile: React.FC<Props> = ({ navigateTo }) => {
  const menuGroups = [
    {
      title: '人力自助',
      items: [
        { label: '电子工资单', icon: 'account_balance_wallet', color: 'bg-emerald-50 text-emerald-600', route: PageType.SALARY_SLIP, extra: '待确认' },
        { label: '我的考勤', icon: 'fact_check', color: 'bg-orange-50 text-orange-600', route: PageType.ATTENDANCE_STATS },
        { label: '奖惩明细', icon: 'workspace_premium', color: 'bg-amber-50 text-amber-600', route: PageType.MY_REWARDS_PUNISHMENTS },
      ]
    },
    {
      title: '系统管理',
      items: [
        { label: '设置', icon: 'settings', color: 'bg-slate-50 text-slate-600' },
        { label: '切换角色', icon: 'cached', color: 'bg-blue-50 text-blue-600' },
      ]
    }
  ];

  return (
    <div className="animate-fadeIn bg-[#f8fafc] min-h-screen pb-32 font-sans">
      <div className="bg-[#0f172a] pt-16 pb-24 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="size-20 rounded-[2rem] bg-white p-1 shadow-2xl">
            <img src="https://picsum.photos/200?random=me" className="w-full h-full object-cover rounded-[1.8rem]" alt="Avatar" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-black tracking-tight">张伟</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">系统管理员 · 业务部</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20 space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{group.title}</h3>
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
              {group.items.map((item, iIdx) => (
                <div 
                  key={iIdx} 
                  onClick={() => item.route && navigateTo(item.route)}
                  className="flex items-center justify-between px-6 py-5 active:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <span className="material-symbols-outlined !text-xl filled-icon">{item.icon}</span>
                    </div>
                    <span className="text-sm font-black text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.extra && <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{item.extra}</span>}
                    <span className="material-symbols-outlined text-slate-200">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={() => navigateTo(PageType.LOGIN)}
          className="w-full h-14 rounded-2xl bg-white text-rose-500 font-black text-sm border border-rose-100 shadow-sm active:bg-rose-50 transition-all mt-8"
        >
          退出当前登录
        </button>
      </div>
    </div>
  );
};

export default Profile;
