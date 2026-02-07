
import React, { useState } from 'react';
import { PageType, ApprovalTemplate, WorkflowNode } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  template: ApprovalTemplate;
}

const WorkflowEditor: React.FC<Props> = ({ navigateTo, template }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(template.nodes);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const insertNode = (index: number) => {
    const newNode: WorkflowNode = {
      id: `n-${Date.now()}`,
      type: 'approver',
      mode: 'single',
      title: '新审批节点',
      assignees: [{ name: '待设置', avatar: '' }]
    };
    const updated = [...nodes];
    updated.splice(index + 1, 0, newNode);
    setNodes(updated);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (editingNodeId === id) setEditingNodeId(null);
  };

  const updateNodeMode = (id: string, mode: WorkflowNode['mode']) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, mode } : n));
  };

  const updateNodeType = (id: string, type: WorkflowNode['type']) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, type } : n));
  };

  const editingNode = nodes.find(n => n.id === editingNodeId);

  return (
    <div className="animate-fadeIn bg-[#F9FBFF] dark:bg-background-dark min-h-screen pb-40 font-sans selection:bg-primary/20">
      
      {/* 沉浸式顶部栏 */}
      <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateTo(PageType.APPROVAL_SETTINGS)} 
            className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90"
          >
            <span className="material-symbols-outlined !text-xl">close</span>
          </button>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">{template.name}</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Visual Workflow Engine</p>
          </div>
        </div>
        <button 
          onClick={() => navigateTo(PageType.SUCCESS_FEEDBACK)} 
          className="bg-primary text-white text-[11px] font-black px-6 py-2.5 rounded-xl shadow-xl shadow-primary/25 active:scale-95"
        >
          保存并同步
        </button>
      </header>

      {/* 画布区域 */}
      <div className="p-10 flex flex-col items-center">
        
        {/* 发起人节点 - 静态 */}
        <div className="flex flex-col items-center group">
          <div className="size-16 rounded-[1.8rem] bg-[#0F172A] text-white flex items-center justify-center shadow-2xl relative">
             <span className="material-symbols-outlined !text-2xl filled-icon">person_edit</span>
             <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="material-symbols-outlined !text-[10px] font-black text-white">check</span>
             </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiator</p>
            <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 mt-1">全员可发起</h4>
          </div>
        </div>

        {/* 动态节点路径 */}
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            {/* 连接线 + 插入按钮 */}
            <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 my-2 relative group">
               <button 
                 onClick={() => insertNode(idx - 1)}
                 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-lg text-primary opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all flex items-center justify-center"
               >
                 <span className="material-symbols-outlined !text-lg">add</span>
               </button>
            </div>

            {/* 节点卡片 */}
            <div 
              onClick={() => setEditingNodeId(node.id)}
              className={`w-full max-w-[280px] bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border transition-all cursor-pointer relative animate-slideUp ${
                editingNodeId === node.id 
                ? 'border-primary ring-4 ring-primary/5 shadow-2xl scale-105' 
                : 'border-slate-100 shadow-xl shadow-slate-200/40 hover:border-slate-200'
              }`}
            >
               {/* 删除按钮 */}
               <button 
                 onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                 className="absolute -right-2 -top-2 size-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
               >
                 <span className="material-symbols-outlined !text-lg">remove</span>
               </button>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className={`size-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    node.type === 'cc' ? 'bg-orange-400' : 
                    node.mode === 'joint' ? 'bg-teal-500' : 'bg-indigo-500'
                  }`}>
                    <span className="material-symbols-outlined !text-[22px] filled-icon">
                      {node.type === 'cc' ? 'alternate_email' : node.mode === 'joint' ? 'groups' : 'verified'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white leading-none">{node.title}</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
                      {node.type === 'cc' ? '抄送人员' : 
                       node.mode === 'joint' ? '会签 (需全员同意)' : 
                       node.mode === 'sequential' ? '签字 (依次审批)' : '普通审批'}
                    </p>
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 pt-1">
                  {node.assignees.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 transition-all">
                       <div className="size-5 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          {a.avatar && <img src={a.avatar} className="size-full object-cover" />}
                       </div>
                       <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{a.name}</span>
                    </div>
                  ))}
                  <button className="size-8 rounded-full border-2 border-dashed border-slate-200 text-slate-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined !text-base">add</span>
                  </button>
               </div>
            </div>
          </React.Fragment>
        ))}

        {/* 尾端插入 */}
        <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 my-2 relative group">
           <button 
             onClick={() => insertNode(nodes.length - 1)}
             className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-lg text-primary opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all flex items-center justify-center"
           >
             <span className="material-symbols-outlined !text-lg">add</span>
           </button>
        </div>
        
        {/* 结束节点 */}
        <div className="flex flex-col items-center">
          <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl border-4 border-white">
             <span className="material-symbols-outlined !text-2xl font-black">check_circle</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">End Flow</p>
        </div>
      </div>

      {/* 底部配置抽屉 (仅在选中节点时出现) */}
      {editingNode && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[3rem] p-8 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black tracking-tight">节点设置: {editingNode.title}</h3>
               <button onClick={() => setEditingNodeId(null)} className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="space-y-8">
               {/* 节点大类切换 */}
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">节点功能分类</p>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => updateNodeType(editingNode.id, 'approver')}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          editingNode.type === 'approver' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'
                        }`}
                     >
                        <span className="material-symbols-outlined">verified</span>
                        <span className="text-sm font-black uppercase">审批环节</span>
                     </button>
                     <button 
                        onClick={() => updateNodeType(editingNode.id, 'cc')}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          editingNode.type === 'cc' ? 'border-orange-500 bg-orange-500/5 text-orange-500' : 'border-slate-100 text-slate-400'
                        }`}
                     >
                        <span className="material-symbols-outlined">alternate_email</span>
                        <span className="text-sm font-black uppercase">抄送环节</span>
                     </button>
                  </div>
               </div>

               {/* 审批细项切换 (仅审批节点) */}
               {editingNode.type === 'approver' && (
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">审批逻辑策略</p>
                    <div className="space-y-3">
                       {[
                         { id: 'single', label: '普通审批', sub: '由指定人员中的任意一名通过即可', icon: 'person' },
                         { id: 'joint', label: '会签通过', sub: '需指定的所有人员全部点击通过', icon: 'groups' },
                         { id: 'sequential', label: '签字确认', sub: '按指定人员顺序依次完成审批', icon: 'draw' },
                       ].map(mode => (
                         <div 
                           key={mode.id}
                           onClick={() => updateNodeMode(editingNode.id, mode.id as any)}
                           className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                             editingNode.mode === mode.id ? 'border-primary bg-primary/5' : 'border-slate-50'
                           }`}
                         >
                            <div className="flex items-center gap-4">
                               <span className={`material-symbols-outlined !text-2xl ${editingNode.mode === mode.id ? 'text-primary' : 'text-slate-300'}`}>{mode.icon}</span>
                               <div>
                                  <h4 className={`text-sm font-black ${editingNode.mode === mode.id ? 'text-primary' : 'text-slate-700'}`}>{mode.label}</h4>
                                  <p className="text-[10px] text-slate-400 font-bold mt-1">{mode.sub}</p>
                               </div>
                            </div>
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                              editingNode.mode === mode.id ? 'border-primary bg-primary' : 'border-slate-200'
                            }`}>
                               {editingNode.mode === mode.id && <span className="material-symbols-outlined !text-[12px] text-white font-black">check</span>}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               <button 
                 onClick={() => setEditingNodeId(null)}
                 className="w-full h-16 bg-[#0F172A] text-white font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
               >
                 确认修改配置
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowEditor;
