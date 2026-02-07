
import React, { useState } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  departments: string[];
  setDepartments: React.Dispatch<React.SetStateAction<string[]>>;
}

const OrgStructure: React.FC<Props> = ({ navigateTo, departments, setDepartments }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  const handleAddDept = () => {
    if (!newDeptName.trim()) return;
    if (departments.includes(newDeptName.trim())) {
      alert('部门名称已存在');
      return;
    }
    setDepartments([...departments, newDeptName.trim()]);
    setNewDeptName('');
    setShowAddModal(false);
  };

  const handleDeleteDept = (name: string) => {
    if (window.confirm(`确定要删除“${name}”吗？这可能导致该部门员工权限异常。`)) {
      setDepartments(departments.filter(d => d !== name));
    }
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-32 font-sans no-scrollbar">
      {/* 顶部页头 */}
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateTo(PageType.SYSTEM_SETTINGS)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <div>
               <h2 className="text-white text-lg font-bold tracking-tight leading-none">组织结构管理</h2>
               <p className="text-white/30 text-[9px] font-black uppercase mt-1 tracking-widest italic">Departments & Hierarchy</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-black">add_business</span>
          </button>
        </div>
      </div>

      <main className="px-5 -mt-6 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">当前活跃部门清单 ({departments.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {departments.map((dept, idx) => (
              <div key={dept} className="p-5 flex items-center justify-between group animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined !text-xl filled-icon">corporate_fare</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">{dept}</h4>
                </div>
                <div className="flex items-center gap-2">
                   <button className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:text-primary transition-all">
                      <span className="material-symbols-outlined !text-base">edit</span>
                   </button>
                   <button 
                    onClick={() => handleDeleteDept(dept)}
                    className="size-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-400 active:bg-rose-500 active:text-white transition-all"
                   >
                      <span className="material-symbols-outlined !text-base">delete</span>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex gap-4">
           <div className="size-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 dark:shadow-none">
              <span className="material-symbols-outlined !text-xl">hub</span>
           </div>
           <p className="text-[11px] text-blue-600 dark:text-blue-300 font-bold leading-relaxed">
             组织结构是系统的底层基因。此处删除部门将导致“工作台权限分配”中该部门的配置失效，请谨慎操作。
           </p>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 animate-scaleIn shadow-2xl">
             <h3 className="text-lg font-black text-center mb-1 text-slate-800 dark:text-white">新增职能部门</h3>
             <p className="text-[10px] text-slate-400 text-center mb-8 font-bold">新部门创建后即可在权限分配中进行配置</p>
             
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">部门名称 *</label>
                  <input 
                    autoFocus
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="例如：技术部"
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowAddModal(false)} className="flex-1 h-12 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs">取消</button>
                   <button onClick={handleAddDept} className="flex-[2] h-12 bg-primary text-white font-black rounded-xl shadow-lg text-xs">确认新增</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgStructure;
