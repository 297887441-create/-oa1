
import React, { useState, useMemo } from 'react';
import { PageType, ApprovalItem } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType, mode?: 'approver' | 'initiator', status?: 'pending' | 'approved' | 'rejected', id?: string) => void;
  mode?: 'approver' | 'initiator';
  status?: 'pending' | 'approved' | 'rejected';
  id?: string;
  contracts: GlobalContract[];
  onAction: (id: string, action: 'approved' | 'rejected') => void;
  approvals: ApprovalItem[];
}

const ContractRemittanceDetail: React.FC<Props> = ({ navigateTo, mode = 'approver', status = 'pending', id, contracts, onAction, approvals }) => {
  const [loadingAction, setLoadingAction] = useState<'approved' | 'rejected' | null>(null);

  const currentApproval = useMemo(() => {
    return approvals.find(a => a.id === id);
  }, [approvals, id]);

  const relatedContract = useMemo(() => {
    if (!currentApproval?.relatedId) return null;
    return contracts.find(c => c.id === currentApproval.relatedId);
  }, [contracts, currentApproval]);

  const isInitiator = mode === 'initiator';
  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const handleActionClick = async (action: 'approved' | 'rejected') => {
    if (!id || !onAction) return;
    setLoadingAction(action);
    // 模拟处理动画
    await new Promise(r => setTimeout(r, 1000));
    onAction(id, action);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  const themeClass = isApproved ? 'from-emerald-500 to-teal-600' : isRejected ? 'from-red-500 to-rose-600' : 'from-primary to-blue-700';

  if (!currentApproval) return <div className="p-20 text-center">加载中...</div>;

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
            <p className="text-white/70 text-sm mt-1">{isApproved ? '回款款项已成功入账' : isRejected ? '回款登记已被驳回' : '等待财务/经理核实流水...'}</p>
          </div>
          <span className="material-symbols-outlined !text-6xl text-white/20">receipt_long</span>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-20 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-[1.2rem] bg-slate-50 overflow-hidden border border-slate-100">
              <img src={`https://picsum.photos/100?random=${id}`} className="w-full h-full object-cover" alt="User" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentApproval.user}</h3>
              <p className="text-xs text-slate-400">{currentApproval.dept} · {currentApproval.date}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium">回款登记金额</span>
              <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">{currentApproval.amount}</span>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 mb-2 uppercase font-black tracking-widest">关联合同项目</p>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-50">
                <p className="text-sm font-black text-slate-800 leading-snug">{relatedContract?.title || '未知合同'}</p>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">合同回款进度</span>
                    <span className="text-[10px] font-black text-primary">
                      {relatedContract ? Math.round((relatedContract.paid / relatedContract.amount) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${relatedContract ? (relatedContract.paid / relatedContract.amount) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-slate-400 mb-2 uppercase font-black tracking-widest">详情描述</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">“ {currentApproval.detail} ”</p>
            </div>

            <div className="pt-4 border-t border-slate-50">
               <p className="text-[10px] text-slate-400 mb-3 uppercase font-black tracking-widest">回款凭证</p>
               <div className="size-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-300">image</span>
               </div>
            </div>
          </div>
        </div>

        {/* 审批流向展示 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6 ml-1">审批链路</h3>
          <div className="relative ml-2 border-l-2 border-slate-50 pl-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-[41px] top-0 size-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
              <p className="text-[13px] font-bold text-slate-800 leading-none">发起申请</p>
              <p className="text-[10px] text-slate-400 mt-1">{currentApproval.user} · 已提交</p>
            </div>
            <div className="relative">
              <div className={`absolute -left-[41px] top-0 size-4 rounded-full border-4 border-white shadow-sm ${isApproved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-primary animate-pulse'}`}></div>
              <p className="text-[13px] font-bold text-slate-800 leading-none">财务/经理审核</p>
              <p className="text-[10px] text-slate-400 mt-1">{isApproved ? '已同意' : isRejected ? '已驳回' : '审核中'}</p>
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
            className={`flex-[2.5] py-3.5 bg-primary text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${loadingAction === 'approved' ? 'opacity-80' : 'active:scale-95'}`}
          >
            {loadingAction === 'approved' ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined !text-lg">verified</span>
                确认入账
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractRemittanceDetail;
