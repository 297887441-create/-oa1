
import React from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

const SystemSettings: React.FC<Props> = ({ navigateTo }) => {
  const configCategories = [
    {
      id: 'org',
      label: '组织结构设置',
      sub: '部门架构调整、新增与删除',
      icon: 'corporate_fare',
      color: 'bg-blue-500',
      route: PageType.ORG_STRUCTURE
    },
    {
      id: 'permission',
      label: '工作台权限分配',
      sub: '自定义不同角色的功能入口',
      icon: 'dashboard_customize',
      color: 'bg-indigo-600',
      route: PageType.INTERFACE_SETTINGS
    },
    {
      id: 'approval',
      label: '审批流程设置',
      sub: '定义报销、假勤等多级审批流',
      icon: 'settings_suggest',
      color: 'bg-emerald-500',
      route: PageType.APPROVAL_SETTINGS
    },
    {
      id: 'salary',
      label: '员工薪资构成设置',
      sub: '底薪、各类补贴及提成算法',
      icon: 'payments',
      color: 'bg-amber-500',
      // Placeholder logic: show alert for now as it's a deep config
      action: () => alert('高级薪资核算模组正在升级中，目前仅支持默认方案。')
    }
  ];

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-32 font-sans no-scrollbar">
      {/* 顶部页头 */}
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={() => navigateTo(PageType.ADMIN_WORKBENCH)}
            className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90"
          >
            <span className="material-symbols-outlined !text-xl">arrow_back</span>
          </button>
          <div>
             <h2 className="text-white text-lg font-bold tracking-tight leading-none">系统核心设置</h2>
             <p className="text-white/30 text-[9px] font-black uppercase mt-1 tracking-widest italic">Core Enterprise Configuration</p>
          </div>
        </div>
      </div>

      <main className="px-5 -mt-6 relative z-20">
        <div className="space-y-4">
          {configCategories.map((cat, idx) => (
            <div 
              key={cat.id}
              onClick={() => cat.route ? navigateTo(cat.route) : cat.action?.()}
              className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none active:scale-[0.98] transition-all cursor-pointer flex items-center gap-5 group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
               <div className={`size-14 rounded-[1.5rem] ${cat.color} flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:rotate-6 transition-transform`}>
                  <span className="material-symbols-outlined !text-3xl filled-icon">{cat.icon}</span>
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">{cat.label}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-snug">{cat.sub}</p>
               </div>
               <span className="material-symbols-outlined text-slate-200 group-hover:translate-x-1 transition-all">chevron_right</span>
            </div>
          ))}
        </div>

        {/* 底部安全警告 */}
        <div className="mt-10 p-6 bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 flex gap-4">
           <div className="size-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-200 dark:shadow-none">
              <span className="material-symbols-outlined !text-xl">shield</span>
           </div>
           <div className="space-y-1">
              <p className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">安全提示</p>
              <p className="text-[11px] text-rose-500 dark:text-rose-300 font-bold leading-relaxed">
                此处设置涉及企业底层逻辑，变更将影响全员工作流。操作前请务必确认业务影响范围。
              </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;
