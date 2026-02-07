
import React from 'react';
import { PageType, ApprovalTemplate } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: any, status?: any, data?: any) => void;
  templates: ApprovalTemplate[];
}

const ApprovalSettings: React.FC<Props> = ({ navigateTo, templates }) => {
  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 font-sans">
      <div className="bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo(PageType.ADMIN_WORKBENCH)} className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-lg font-black tracking-tight">管理配置</h2>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <section>
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 ml-2">主页显示控制</h3>
          <div 
            onClick={() => navigateTo(PageType.INTERFACE_SETTINGS)}
            className="bg-gradient-to-br from-primary to-blue-600 p-5 rounded-[2rem] shadow-xl shadow-primary/20 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <span className="material-symbols-outlined !text-2xl filled-icon">dashboard_customize</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-black text-white">工作台权限分配</h4>
              <p className="text-[10px] text-white/60 font-bold mt-0.5">设置不同部门在首页的功能可见性</p>
            </div>
            <span className="material-symbols-outlined text-white/50 group-hover:translate-x-1 transition-all">arrow_forward</span>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 ml-2">审批流程模板</h3>
          <div className="space-y-3">
            {templates.map((t) => (
              <div 
                key={t.id} 
                onClick={() => navigateTo(PageType.WORKFLOW_EDITOR, null, null, t.id)}
                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className={`size-12 rounded-2xl ${t.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="material-symbols-outlined !text-2xl filled-icon">{t.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-black text-slate-800 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">流程节点已就绪</p>
                </div>
                <span className="material-symbols-outlined text-slate-200 group-hover:translate-x-1 transition-all">chevron_right</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApprovalSettings;
