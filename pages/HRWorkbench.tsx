import React from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

const HRWorkbench: React.FC<Props> = ({ navigateTo }) => {
  const stats = [
    { label: '在职人数', value: '42' },
    { label: '今日出勤', value: '95.2%' },
    { label: '待处理单', value: '3' },
    { label: '月度成本', value: '42.8w' },
  ];

  const hrActions = [
    { 
      id: 'notice', 
      label: '公告管理', 
      icon: 'campaign', 
      color: 'bg-purple-50 text-purple-600', 
      sub: '发布与维护全员公告', 
      route: PageType.HR_ANNOUNCEMENT_MANAGEMENT 
    },
    { 
      id: 'staff', 
      label: '员工入离职', 
      icon: 'person_add', 
      color: 'bg-blue-50 text-blue-600', 
      sub: '新人入职与离职交接', 
      route: PageType.HR_STAFF_MANAGEMENT 
    },
    { 
      id: 'reward', 
      label: '奖惩录入', 
      icon: 'military_tech', 
      color: 'bg-amber-50 text-amber-600', 
      sub: '全员绩效与违规记录', 
      route: PageType.HR_RP_MANAGEMENT 
    },
    { 
      id: 'salary', 
      label: '工资统计', 
      icon: 'account_balance_wallet', 
      color: 'bg-emerald-50 text-emerald-600', 
      sub: '月度薪酬发放概况', 
      route: PageType.SALARY_SLIP 
    },
  ];

  return (
    <div className="animate-fadeIn bg-[#f6f8fa] dark:bg-slate-950 min-h-screen pb-32 font-sans selection:bg-primary/20 no-scrollbar">
      
      {/* 顶部沉浸式紫色背景区域 */}
      <div className="bg-[#7c4dff] pt-12 pb-24 px-5 relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        
        {/* 返回按钮 */}
        <div className="relative z-10 flex items-center mb-8">
          <button 
            onClick={() => navigateTo(PageType.HOME)}
            className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined !text-xl font-bold">arrow_back</span>
          </button>
        </div>

        {/* 核心指标 4 连发 */}
        <div className="relative z-10 grid grid-cols-4 gap-2 mb-4">
           {stats.map((s, idx) => (
             <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center transition-all hover:bg-white/20">
                <p className="text-[20px] font-black text-white tabular-nums leading-none mb-2">{s.value}</p>
                <p className="text-[9px] text-white/60 font-bold uppercase tracking-tight">{s.label}</p>
             </div>
           ))}
        </div>
      </div>

      {/* 功能入口大卡片区域 */}
      <main className="px-5 -mt-14 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(124,77,255,0.12)] border border-slate-100 dark:border-slate-800">
           <div className="grid grid-cols-2 gap-4">
              {hrActions.map(action => (
                <div 
                  key={action.id}
                  onClick={() => action.route && navigateTo(action.route)}
                  className="p-5 rounded-[2rem] bg-[#f8faff] dark:bg-slate-800/50 border border-slate-50 dark:border-slate-800 active:scale-95 active:bg-blue-50 transition-all cursor-pointer group"
                >
                   <div className={`size-12 rounded-2xl ${action.color} flex items-center justify-center mb-5 shadow-sm group-hover:rotate-6 transition-transform`}>
                      <span className="material-symbols-outlined !text-2xl filled-icon">{action.icon}</span>
                   </div>
                   <h4 className="text-[15px] font-black text-slate-800 dark:text-white mb-1.5">{action.label}</h4>
                   <p className="text-[10px] text-slate-400 font-bold leading-tight">{action.sub}</p>
                </div>
              ))}
           </div>
        </div>

        {/* 图表展示区 */}
        <section className="mt-8 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-baseline gap-2">
                 <h3 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tight">出勤率分析 / ATTENDANCE</h3>
              </div>
              <div className="flex gap-1.5">
                 <div className="size-2 rounded-full bg-[#7c4dff]"></div>
                 <div className="size-2 rounded-full bg-slate-200"></div>
              </div>
           </div>
           
           {/* 模拟图表条 */}
           <div className="h-28 flex items-end justify-between px-4 gap-2.5">
              {[55, 80, 95, 65, 88, 82, 92].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-50 dark:bg-slate-800 rounded-t-xl relative overflow-hidden group">
                   <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#7c4dff] to-[#9d7aff] rounded-t-xl transition-all duration-1000" 
                    style={{ height: `${h}%` }}
                   ></div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 px-1 text-[9px] text-slate-300 font-black uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </section>

        {/* 底部装饰或占位 */}
        <div className="h-10"></div>
      </main>
    </div>
  );
};

export default HRWorkbench;