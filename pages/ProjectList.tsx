
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
}

type ProjectStatus = 'pending' | 'active' | 'completed';

const ProjectList: React.FC<Props> = ({ navigateTo, contracts }) => {
  const [activeTab, setActiveTab] = useState<ProjectStatus>('active');

  const filteredProjects = useMemo(() => {
    return contracts.filter(c => c.installStatus === activeTab);
  }, [contracts, activeTab]);

  const tabs: { key: ProjectStatus; label: string }[] = [
    { key: 'pending', label: '待开工' },
    { key: 'active', label: '开工中' },
    { key: 'completed', label: '已完工' }
  ];

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'pending': return <span className="bg-orange-50 text-orange-500 text-[10px] px-1.5 py-0.5 rounded font-bold border border-orange-100">待开工</span>;
      case 'active': return <span className="bg-blue-50 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold border border-primary/10">开工中</span>;
      case 'completed': return <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-100">已完工</span>;
    }
  };

  return (
    <div className="animate-fadeIn bg-[#f6f7f8] dark:bg-background-dark min-h-screen pb-10 font-sans">
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
        <div 
          onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
          className="flex size-10 shrink-0 items-center justify-start cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">chevron_left</span>
        </div>
        <h2 className="text-[#0d141b] dark:text-white text-lg font-black leading-tight tracking-tight flex-1 text-center">全部工单项目</h2>
        <div className="size-10 flex items-center justify-end">
          <span className="material-symbols-outlined text-slate-400">filter_list</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 sticky top-[57px] z-20 border-b border-slate-50 dark:border-slate-800 shadow-sm flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const count = contracts.filter(c => c.installStatus === tab.key).length;
          return (
            <div 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center py-4 px-2 transition-all cursor-pointer relative ${
                activeTab === tab.key ? 'text-primary' : 'text-slate-400 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold tracking-tight ${activeTab === tab.key ? 'text-primary' : 'text-slate-500'}`}>
                  {tab.label}
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {count}
                </span>
              </div>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-full animate-scaleIn"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p, idx) => (
            <div 
              key={p.id} 
              className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-slideUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div 
                onClick={() => navigateTo(PageType.PROJECT_DETAIL)}
                className="p-5 cursor-pointer active:bg-slate-50 dark:active:bg-slate-700/50 transition-colors"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(p.installStatus)}
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">#{p.id.split('-').pop()}</span>
                    </div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] text-slate-400 font-bold">客户：</span>
                       <span className="text-[10px] text-slate-600 dark:text-slate-300 font-black">{p.customer}</span>
                    </div>
                    <div className="flex items-start gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-relaxed">
                      <span className="material-symbols-outlined !text-[16px] mt-0.5 text-slate-300">location_on</span>
                      <span className="line-clamp-2">{p.address}</span>
                    </div>
                  </div>
                  <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 shadow-inner border border-slate-50 dark:border-slate-700">
                    <img src={p.thumbnail} className="w-full h-full object-cover" alt="Project" />
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 flex gap-3">
                {activeTab !== 'completed' && (
                  <button 
                    onClick={() => navigateTo(PageType.PROJECT_REPORT)}
                    className="flex-[1.5] h-10 bg-primary text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined !text-lg">add_task</span> {activeTab === 'pending' ? '接单开工' : '立即报工'}
                  </button>
                )}
                <button 
                  onClick={() => navigateTo(PageType.PROJECT_DETAIL)}
                  className={`flex-1 h-10 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black border border-slate-100 dark:border-slate-600 active:bg-slate-100 transition-all ${activeTab === 'completed' ? 'flex-[3]' : ''}`}
                >
                  查看详情
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300">
            <div className="size-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined !text-4xl text-slate-200">assignment</span>
            </div>
            <p className="text-sm font-bold tracking-wider">暂无{tabs.find(t => t.key === activeTab)?.label}的项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
