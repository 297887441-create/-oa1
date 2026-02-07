
import React, { useState } from 'react';
import { PageType, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected') => void;
  pendingList: ApprovalItem[];
  finishedList: ApprovalItem[];
  onAction: (id: string, action: 'approved' | 'rejected') => void;
}

const ApprovalToMe: React.FC<Props> = ({ navigateTo, pendingList, finishedList, onAction }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'finished'>('pending');

  return (
    <div className="animate-fadeIn bg-[#f6f7f8] min-h-screen">
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center px-4 py-3 border-b border-slate-50">
          <button onClick={() => navigateTo(PageType.APPROVAL_CENTER)} className="material-symbols-outlined text-slate-400 active:text-primary transition-colors">chevron_left</button>
          <h2 className="text-[#191f25] text-lg font-bold tracking-tight ml-2">待我审批</h2>
        </div>
        
        <div className="flex px-4">
          {[
            { id: 'pending', label: '待处理', count: pendingList.length },
            { id: 'finished', label: '已处理' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-bold transition-all relative flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'pending' ? (
          pendingList.length > 0 ? (
            pendingList.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigateTo(item.route, 'approver', 'pending')}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:shadow-md active:scale-[0.99] transition-all duration-300 cursor-pointer animate-slideUp"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                      <img src={`https://picsum.photos/100?random=${item.id}`} className="w-full h-full object-cover" alt={item.user} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] text-slate-900">{item.user}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">{item.dept} · {item.date}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${item.color}`}>
                    {item.type}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 mb-5 border border-slate-50/50">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-slate-400 text-[12px] shrink-0 font-medium">摘要：</span>
                    <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{item.detail}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-[12px] text-slate-400 font-medium">金额/时长：</span>
                    <span className="text-base font-bold text-primary">{item.amount}</span>
                  </div>
                </div>

                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onAction(item.id, 'rejected')}
                    className="flex-1 py-2.5 text-[13px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl active:bg-slate-100 transition-colors"
                  >
                    驳回
                  </button>
                  <button 
                    onClick={() => onAction(item.id, 'approved')}
                    className="flex-1 py-2.5 text-[13px] font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 active:opacity-90 transition-opacity"
                  >
                    同意
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center animate-fadeIn">
               <span className="material-symbols-outlined !text-6xl text-slate-200 mb-4">task_alt</span>
               <p className="text-slate-400 font-bold">全部处理完了，太棒了！</p>
            </div>
          )
        ) : (
          finishedList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigateTo(item.route, 'approver', item.status as any)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors cursor-pointer animate-slideUp"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                    <img src={`https://picsum.photos/100?random=${item.id}`} className="w-full h-full object-cover" alt={item.user} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-sm text-slate-900">{item.user} 的{item.type}</h3>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                         {item.status === 'approved' ? '已同意' : '已驳回'}
                       </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.date} · 流程已结束</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalToMe;
