
import React, { useState } from 'react';
import { PageType, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected') => void;
  list: ApprovalItem[];
}

const ApprovalMyInitiated: React.FC<Props> = ({ navigateTo, list }) => {
  const [activeTab, setActiveTab] = useState<'running' | 'completed'>('running');

  const runningItems = list.filter(i => i.status === 'pending');
  const completedItems = list.filter(i => i.status !== 'pending');

  const currentList = activeTab === 'running' ? runningItems : completedItems;

  return (
    <div className="animate-fadeIn bg-[#f8f9fb] min-h-screen pb-32">
      <div className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigateTo(PageType.APPROVAL_CENTER)} className="size-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <span className="material-symbols-outlined !text-xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 text-lg font-bold ml-3 flex-1">我发起的</h2>
        </div>
        <div className="flex px-4 border-t border-slate-50">
          {[
            { id: 'running', label: '审批中', count: runningItems.length },
            { id: 'completed', label: '已处理' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-3.5 text-[13px] font-bold transition-all relative flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-t-full"></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {currentList.length > 0 ? currentList.map((item) => (
          <div key={item.id} onClick={() => navigateTo(item.route, 'initiator', item.status as any)} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`size-9 rounded-xl flex items-center justify-center ${item.status === 'pending' ? 'bg-blue-50 text-primary' : item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  <span className="material-symbols-outlined !text-xl filled-icon">{item.icon}</span>
                </div>
                <h3 className="font-bold text-[14px] text-slate-900">{item.type}</h3>
              </div>
              <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${item.status === 'pending' ? 'bg-blue-50 text-primary' : item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {item.status === 'pending' ? '审批中' : item.status === 'approved' ? '已通过' : '已驳回'}
              </div>
            </div>
            <p className="text-[12px] text-slate-600 font-medium mb-2">{item.detail}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] text-slate-400 font-medium">金额:</span>
              <span className="text-lg font-bold text-slate-900">{item.amount}</span>
            </div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-30">
             <span className="material-symbols-outlined !text-5xl mb-2">inbox</span>
             <p className="text-sm font-bold">暂无数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalMyInitiated;
