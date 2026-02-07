
import React, { useState } from 'react';
import { PageType, WorkbenchMapping, WorkbenchModule } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  mapping: WorkbenchMapping;
  setMapping: (mapping: WorkbenchMapping) => void;
  departments: string[];
}

const InterfaceSettings: React.FC<Props> = ({ navigateTo, mapping, setMapping, departments }) => {
  const [selectedDept, setSelectedDept] = useState<string>(departments[0] || '行政部');

  const availableModules: WorkbenchModule[] = [
    { id: 'admin', label: '管理台', icon: 'admin_panel_settings', color: 'bg-indigo-600', route: PageType.ADMIN_WORKBENCH, desc: '数据指挥中心' },
    { id: 'approval', label: '审批中心', icon: 'verified_user', color: 'bg-blue-500', route: PageType.APPROVAL_CENTER, desc: '流程处理入口' },
    { id: 'install', label: '安装台', icon: 'engineering', color: 'bg-orange-500', route: PageType.INSTALLER_WORKBENCH, desc: '工单执行模块' },
    { id: 'sales', label: '业务台', icon: 'badge', color: 'bg-emerald-500', route: PageType.SALES_WORKBENCH, desc: '客户公海与商机' },
    { id: 'hr', label: '人事台', icon: 'groups', color: 'bg-purple-600', route: PageType.HR_WORKBENCH, desc: '行政人事与薪酬' },
  ];

  const toggleModule = (moduleId: string) => {
    const currentList = mapping[selectedDept] || [];
    const newList = currentList.includes(moduleId)
      ? currentList.filter(id => id !== moduleId)
      : [...currentList, moduleId];
    
    setMapping({
      ...mapping,
      [selectedDept]: newList
    });
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 font-sans">
      <div className="bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo(PageType.SYSTEM_SETTINGS)} className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-lg font-black tracking-tight">主页工作台分配</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Interface Authorization</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-8">
        {/* 部门选择器轴 */}
        <section>
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 ml-2">1. 选择职能部门</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {departments.map((deptName) => (
              <div 
                key={deptName} 
                onClick={() => setSelectedDept(deptName)}
                className={`flex flex-col items-center gap-2 p-4 min-w-[100px] rounded-3xl border transition-all cursor-pointer ${
                  selectedDept === deptName ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <span className={`material-symbols-outlined !text-2xl ${selectedDept === deptName ? 'text-white' : 'text-slate-300'}`}>groups</span>
                <span className={`text-[10px] font-black ${selectedDept === deptName ? 'text-white' : 'text-slate-500'}`}>{deptName}</span>
              </div>
            ))}
            {departments.length === 0 && (
              <div className="p-4 text-slate-300 text-xs italic">暂未设置部门</div>
            )}
          </div>
        </section>

        {/* 模块分配区 */}
        <section className="space-y-4">
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 ml-2">2. 分配功能模块</h3>
          <div className="grid grid-cols-1 gap-3">
            {availableModules.map((mod) => {
              const isChecked = (mapping[selectedDept] || []).includes(mod.id);
              return (
                <div 
                  key={mod.id} 
                  onClick={() => toggleModule(mod.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked ? 'border-primary bg-primary/5' : 'border-slate-50 bg-white opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl ${mod.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                      <span className="material-symbols-outlined !text-xl filled-icon">{mod.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-white">{mod.label}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{mod.desc}</p>
                    </div>
                  </div>
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isChecked ? 'bg-primary border-primary text-white' : 'border-slate-200 bg-white'
                  }`}>
                    {isChecked && <span className="material-symbols-outlined !text-[14px] font-black">check</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100">
           <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-[11px] text-primary font-bold leading-relaxed">配置说明：该设置将直接影响该部门下所有成员的首页功能入口。您可以随时通过此矩阵添加新的第三方工作台插件。</p>
           </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 safe-area-bottom pb-8">
        <button 
          onClick={() => navigateTo(PageType.SUCCESS_FEEDBACK)}
          className="w-full bg-[#0f172a] text-white font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all"
        >
          保存权限变更
        </button>
      </div>
    </div>
  );
};

export default InterfaceSettings;
