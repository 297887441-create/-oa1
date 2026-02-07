
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo?: (page: PageType) => void;
}

const MessageCenter: React.FC<Props> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'notice'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allMessages = [
    { 
      id: 1,
      title: '报销审批通过通知', 
      time: '10:30', 
      msg: '您发起的“10月喷绘材料采购费”报销已通过审批', 
      type: 'notice', 
      status: 'approved', 
      icon: 'description', 
      color: 'blue' 
    },
    { 
      id: 2,
      title: '待办：报销申请审批', 
      time: '09:15', 
      msg: '王某某 提交的“户外广告位租赁费”待您审批', 
      type: 'todo', 
      status: 'pending', 
      icon: 'assignment_late', 
      color: 'orange' 
    },
    { 
      id: 3,
      title: '回款到账通知', 
      time: '昨天', 
      msg: '“大族广场楼顶字亮化工程”尾款 ¥45,000.00 已汇入', 
      type: 'notice', 
      status: 'success', 
      icon: 'payments', 
      color: 'emerald' 
    },
    { 
      id: 4,
      title: '制作工单驳回提醒', 
      time: '昨天', 
      msg: '您的“商场标识导向牌”制作申请因“附件规格不明”被驳回', 
      type: 'notice', 
      status: 'rejected', 
      icon: 'cancel', 
      color: 'red' 
    },
  ];

  const filteredMessages = useMemo(() => {
    return allMessages.filter(m => {
      const matchTab = activeTab === 'all' || m.type === activeTab;
      const matchSearch = m.title.includes(searchQuery) || m.msg.includes(searchQuery);
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="animate-fadeIn bg-slate-50 dark:bg-background-dark min-h-screen pb-24 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {navigateTo && (
              <button 
                onClick={() => navigateTo(PageType.HOME)}
                className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined !text-xl">chevron_left</span>
              </button>
            )}
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">消息中心</h1>
          </div>
          <button className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
            <span className="material-symbols-outlined !text-xl font-bold">add_circle</span>
          </button>
        </div>
        
        <div className="px-6 py-3">
          <div className="relative flex items-center h-12 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-4 border border-transparent focus-within:border-primary/20 transition-all shadow-inner">
            <span className="material-symbols-outlined text-slate-400 !text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm flex-1 ml-2 placeholder:text-slate-400 font-medium" 
              placeholder="搜索联系人、关键词..." 
            />
          </div>
        </div>

        <div className="px-6 pb-3">
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl flex gap-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'todo', label: '待办' },
              { id: 'notice', label: '通知' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                    : 'text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 mt-4 space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white dark:bg-slate-900 p-4 rounded-3xl border border-white dark:border-slate-800 shadow-sm active:scale-[0.98] active:bg-slate-50 transition-all flex gap-4 cursor-pointer"
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
                item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                item.color === 'orange' ? 'bg-orange-50 text-orange-600' : 
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                'bg-red-50 text-red-600'
              }`}>
                <span className="material-symbols-outlined !text-2xl filled-icon">{item.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-[14px] text-slate-900 dark:text-white truncate pr-2 tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-slate-300 font-bold whitespace-nowrap">{item.time}</span>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-3">
                  {item.msg}
                </p>
                
                <div className="flex items-center">
                  {item.status === 'approved' && (
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">已通过</span>
                  )}
                  {item.status === 'pending' && (
                    <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">待处理</span>
                  )}
                  {item.status === 'success' && (
                    <span className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">收款成功</span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">已驳回</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="size-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner mb-4">
              <span className="material-symbols-outlined text-slate-200 !text-4xl">inbox</span>
            </div>
            <p className="text-slate-400 text-sm font-bold tracking-tight">暂无相关消息</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageCenter;
