
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

interface MaterialLog {
  id: string;
  name: string;
  specs: string;
  quantity: string;
  pickupDate: string;
  project: string;
  status: 'received' | 'returned' | 'consumed';
}

const MaterialLogs: React.FC<Props> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const logs: MaterialLog[] = [
    { id: 'M2301', name: '发光模组 (白光)', specs: '12V 1.5W 20灯/串', quantity: '50 串', pickupDate: '2023-11-20', project: '万达广场门头发光字', status: 'consumed' },
    { id: 'M2302', name: '3M背胶喷绘', specs: '高清亮面 1200DPI', quantity: '12.5 平方', pickupDate: '2023-11-18', project: '星巴克外墙亮化', status: 'consumed' },
    { id: 'T2303', name: '大红冠电动螺丝刀', specs: '18V 旗舰版', quantity: '1 套', pickupDate: '2023-11-15', project: '备用工具', status: 'returned' },
    { id: 'M2304', name: '防水电源 (明纬)', specs: 'LRS-350-12', quantity: '2 个', pickupDate: '2023-11-10', project: '静安大悦城5F', status: 'received' },
    { id: 'M2305', name: '不锈钢膨胀螺栓', specs: 'M10 * 100', quantity: '100 个', pickupDate: '2023-11-10', project: '静安大悦城5F', status: 'consumed' },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(l => l.name.includes(searchQuery) || l.project.includes(searchQuery));
  }, [searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received': return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black border border-blue-100">持有中</span>;
      case 'returned': return <span className="bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[9px] font-black border border-slate-100">已归还</span>;
      case 'consumed': return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black border border-emerald-100">已消耗</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-24 font-sans no-scrollbar">
      
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">领料明细流水</h2>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 rounded-2xl flex items-center px-4 h-12 border border-white/10 focus-within:bg-white/20 transition-all">
            <span className="material-symbols-outlined text-white/40 !text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-white text-sm flex-1 ml-3 placeholder:text-white/20 font-bold" 
              placeholder="搜物料名称、搜项目项目..." 
            />
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {filteredLogs.map((log, idx) => (
          <div 
            key={log.id}
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm animate-slideUp"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
             <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4 min-w-0">
                   <h4 className="text-[15px] font-black text-slate-900 dark:text-white truncate mb-1">{log.name}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.specs}</p>
                </div>
                {getStatusBadge(log.status)}
             </div>

             <div className="flex items-center justify-between py-4 border-y border-slate-50 dark:border-slate-800/50 mb-4">
                <div>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">领用数量</p>
                   <p className="text-sm font-black text-slate-800 dark:text-white tabular-nums">{log.quantity}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">领用日期</p>
                   <p className="text-sm font-black text-slate-600 dark:text-slate-400 tabular-nums">{log.pickupDate}</p>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                   <span className="material-symbols-outlined !text-sm text-primary">corporate_fare</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate flex-1">项目：{log.project}</p>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">#{log.id}</p>
             </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center animate-fadeIn">
             <div className="size-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined !text-4xl text-slate-200">inventory_2</span>
             </div>
             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">暂无相关领用记录</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MaterialLogs;
