
import React, { useState } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected') => void;
  mode?: 'approver' | 'initiator';
  status?: 'pending' | 'approved' | 'rejected';
  id?: string;
  onAction?: (id: string, action: 'approved' | 'rejected') => void;
}

const ExpenseReimbursementDetail: React.FC<Props> = ({ navigateTo, mode = 'approver', status = 'pending', id, onAction }) => {
  const [loadingAction, setLoadingAction] = useState<'approved' | 'rejected' | null>(null);

  const isInitiator = mode === 'initiator';
  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const handleActionClick = async (action: 'approved' | 'rejected') => {
    if (!id || !onAction) return;
    setLoadingAction(action);
    await new Promise(r => setTimeout(r, 800));
    onAction(id, action);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  const themeClass = isApproved ? 'from-emerald-500 to-emerald-600' : isRejected ? 'from-red-500 to-rose-600' : 'from-orange-500 to-red-600';

  return (
    <div className="animate-slideIn bg-[#f6f7f8] min-h-screen pb-24 font-sans">
      <div className={`pt-12 pb-20 px-6 relative overflow-hidden bg-gradient-to-br transition-colors duration-500 ${themeClass}`}>
        <button 
          onClick={() => navigateTo(PageType.APPROVAL_CENTER)} 
          className="absolute top-4 left-4 size-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">{isApproved ? '报销已发放' : isRejected ? '报销已驳回' : '待财务复核'}</h2>
            <p className="text-white/70 text-sm mt-1">{isApproved ? '款项已汇入您的工资账户' : isRejected ? '请根据建议重新提交' : '正在复核单据真实性...'}</p>
          </div>
          <span className="material-symbols-outlined !text-6xl text-white/20">
            {isApproved ? 'paid' : isRejected ? 'cancel' : 'receipt_long'}
          </span>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-20 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-full bg-slate-100 overflow-hidden border border-slate-100 shadow-inner">
              <img src="https://picsum.photos/100?random=1" className="w-full h-full object-cover" alt="User" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{isInitiator ? '我自己' : '王晓强'}</h3>
              <p className="text-xs text-slate-400">制作部 · 今天 10:30</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <DetailRow label="报销总额" value="¥ 1,280.00" valueClass="font-black text-orange-600 text-xl" />
            <DetailRow label="费用类别" value="耗材采购" />
            <div className="pt-2 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 mb-2 font-black uppercase tracking-widest">费用明细</p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">10月户外广告喷绘材料采购费，已由制作组组长核实数量。</p>
            </div>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          {!isInitiator ? (
            <>
              <button 
                disabled={!!loadingAction}
                onClick={() => handleActionClick('rejected')}
                className={`flex-1 py-3.5 font-bold bg-slate-50 border border-slate-200 rounded-xl transition-all ${loadingAction === 'rejected' ? 'opacity-50' : 'active:scale-95'}`}
              >
                驳回
              </button>
              <button 
                disabled={!!loadingAction}
                onClick={() => handleActionClick('approved')}
                className={`flex-[2] py-3.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${loadingAction === 'approved' ? 'opacity-80' : 'active:scale-95'}`}
              >
                {loadingAction === 'approved' ? (
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : '复核通过'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigateTo(PageType.SUCCESS_FEEDBACK)}
              className="flex-[2] py-3.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all"
            >
              催办财务
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value, valueClass }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-400 font-medium">{label}</span>
    <span className={`text-sm text-slate-800 ${valueClass}`}>{value}</span>
  </div>
);

export default ExpenseReimbursementDetail;
