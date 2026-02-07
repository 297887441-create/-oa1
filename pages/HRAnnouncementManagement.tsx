
import React, { useState } from 'react';
import { PageType, Announcement } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  announcements: Announcement[];
  onPublishNotice: (notice: Announcement) => void;
  onDeleteNotice: (id: string | number) => void;
}

const HRAnnouncementManagement: React.FC<Props> = ({ navigateTo, announcements, onPublishNotice, onDeleteNotice }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', tag: '重要' });

  const handlePublish = () => {
    if (!noticeForm.title) return;
    
    const newNotice: Announcement = {
      id: Date.now(),
      tag: noticeForm.tag,
      tagBg: noticeForm.tag === '重要' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary',
      title: noticeForm.title,
      dept: '行政部',
      time: '刚刚',
      views: 0,
      content: noticeForm.content
    };

    onPublishNotice(newNotice);
    setShowAddModal(false);
    setNoticeForm({ title: '', content: '', tag: '重要' });
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-32 font-sans">
      
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.HR_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">企业公告管理中心</h2>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-black">add</span>
          </button>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined !text-xl filled-icon">campaign</span>
                 </div>
                 <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none mb-1">Active Notices</p>
                    <p className="text-xl font-black text-white tabular-nums leading-none">{announcements.length}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mb-1">Last Sync</p>
                 <p className="text-[10px] text-white/60 font-bold">1 min ago</p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {announcements.map((notice, idx) => (
          <div 
            key={notice.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-white dark:border-slate-800 shadow-sm animate-slideUp group relative overflow-hidden"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${notice.tagBg}`}>
                      {notice.tag}
                   </span>
                   <span className="text-[10px] text-slate-300 font-bold">#{notice.dept}</span>
                </div>
                <button 
                  onClick={() => onDeleteNotice(notice.id)}
                  className="size-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center active:bg-rose-100 opacity-0 group-hover:opacity-100 transition-all"
                >
                   <span className="material-symbols-outlined !text-lg">delete</span>
                </button>
             </div>
             
             <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug mb-3 pr-6">
                {notice.title}
             </h4>

             <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-3">
                   <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-sm">schedule</span>{notice.time}</span>
                   <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-sm">visibility</span>{notice.views}</span>
                </div>
                <span className="text-primary font-black uppercase tracking-widest">查看详情</span>
             </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">发布新公告</h3>
                <button onClick={() => setShowAddModal(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">公告标题 *</label>
                   <input 
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="请输入通知标题" 
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">发布标签</label>
                   <div className="flex gap-2">
                      {['重要', '通知', '放假', '活动'].map(d => (
                        <button 
                          key={d} 
                          onClick={() => setNoticeForm({ ...noticeForm, tag: d })}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${noticeForm.tag === d ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                        >
                          {d}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">详细内容 *</label>
                   <textarea 
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border-none text-sm font-medium focus:ring-2 focus:ring-purple-500/20 min-h-[150px] resize-none" placeholder="输入详细公告内容，全员可见..." 
                   />
                </div>
                <div className="pt-4">
                   <button 
                    onClick={handlePublish}
                    className="w-full h-14 bg-[#4f46e5] text-white font-black rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     <span className="material-symbols-outlined">send</span>
                     立即发布公告
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRAnnouncementManagement;
