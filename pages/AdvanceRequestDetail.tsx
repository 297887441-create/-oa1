
import React, { useState } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected') => void;
  mode?: 'approver' | 'initiator';
  status?: 'pending' | 'approved' | 'rejected';
  id?: string;
  onAction?: (id: string, action: 'approved' | 'rejected') => Promise<void> | void;
}

const AdvanceRequestDetail: React.FC<Props> = ({ navigateTo, mode = 'approver', status = 'pending', id, onAction }) => {
  const [loadingAction, setLoadingAction] = useState<'approved' | 'rejected' | null>(null);
  
  const isInitiator = mode === 'initiator';
  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const handleActionClick = async (action: 'approved' | 'rejected') => {
    if (!id || !onAction) return;
    setLoadingAction(action);
    // 模拟处理时间，给用户“反应”
    await new Promise(r => setTimeout(r, 800));
    await onAction(id, action);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  const themeClass = isApproved ? 'from-emerald-500 to-teal-600' : isRejected ? 'from-red-500 to-rose-600' : 'from-primary to-blue-700';

  return (
    <div className="animate-slideIn bg-[#f2f3f5] min-h-screen pb-24 font-sans">
      <div className={`pt-12 pb-20 px-6 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br ${themeClass}`}>
        <button 
          onClick={() => navigateTo(PageType.APPROVAL_CENTER)}
          className="absolute top-4 left-4 size-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">{isApproved ? '审批已通过' : isRejected ? '审批已驳回' : '审批中'}</h2>
            <p className="text-white/70 text-sm mt-1">{isApproved ? '此项申请已完成最终审核' : isRejected ? '已被驳回' : '等待财务经理审批...'}</p>
          </div>
          <span className="material-symbols-outlined !text-6xl text-white/20">payments</span>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-20 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-full bg-slate-100 overflow-hidden">
              <img src="https://picsum.photos/100?random=3" className="w-full h-full object-cover" alt="User" />
            </div>
            <div><h3 className="text-lg font-bold text-slate-900">{isInitiator ? '我自己' : '孙明'}</h3><p className="text-xs text-slate-400">销售部 · 2023-11-20 16:45</p></div>
          </div>
          <div className="space-y-4">
            <DetailRow label="预支金额" value="¥ 5,000.00" valueClass="text-primary font-bold text-lg" />
            <DetailRow label="关联项目" value="万达广场广告牌更换项目" />
            <div className="pt-2 border-t border-slate-50">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">预支用途</p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">万达广场项目出差差旅费预支。</p>
            </div>
          </div>
        </div>
      </div>

      {isPending && !isInitiator && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <button 
            disabled={!!loadingAction}
            onClick={() => handleActionClick('rejected')}
            className={`flex-1 py-3.5 font-bold bg-slate-50 border border-slate-200 rounded-xl transition-all ${loadingAction === 'rejected' ? 'opacity-50' : 'active:scale-95'}`}
          >
            {loadingAction === 'rejected' ? '驳回中...' : '驳回'}
          </button>
          <button 
            disabled={!!loadingAction}
            onClick={() => handleActionClick('approved')}
            className={`flex-[2] py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${loadingAction === 'approved' ? 'opacity-80' : 'active:scale-95'}`}
          >
            {loadingAction === 'approved' ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : '同意'}
          </button>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value, valueClass }: any) => (
  <div className="flex items-center justify-between"><span className="text-sm text-slate-400">{label}</span><span className={`text-sm text-slate-800 ${valueClass}`}>{value}</span></div>
);

export default AdvanceRequestDetail;
