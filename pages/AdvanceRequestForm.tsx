
import React, { useState, useMemo } from 'react';
import { PageType, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  onAddApproval: (item: ApprovalItem) => void;
  approvals: ApprovalItem[];
}

const AdvanceRequestForm: React.FC<Props> = ({ navigateTo, onAddApproval, approvals }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [showError, setShowError] = useState(false);

  // 实时统计本人的预支金额 - 优化后的健壮逻辑
  const stats = useMemo(() => {
    const myAdvances = approvals.filter(a => a.type === '预支申请');
    
    const sumAmount = (list: ApprovalItem[]) => {
      return list.reduce((acc, curr) => {
        const val = parseFloat(curr.amount.replace(/[^\d.-]/g, '')) || 0;
        return acc + val;
      }, 0);
    };

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 更健壮的日期匹配：检查字符串中是否包含当前年/月
    const monthTotal = sumAmount(myAdvances.filter(a => {
      const dateStr = a.date;
      const monthPattern = new RegExp(`[/-]0?${currentMonth}[/-]|^0?${currentMonth}[/-]`);
      return dateStr.includes(currentYear.toString()) && monthPattern.test(dateStr);
    }));

    const yearTotal = sumAmount(myAdvances.filter(a => a.date.includes(currentYear.toString())));

    return {
      month: monthTotal,
      year: yearTotal
    };
  }, [approvals]);

  const handleSubmit = (e: React.MouseEvent) => {
    // 阻止可能的冒泡
    e.preventDefault();
    e.stopPropagation();

    if (!amount || !reason) {
      setShowError(true);
      // 3秒后自动取消错误高亮
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const newItem: ApprovalItem = {
      id: `ADV-${Date.now()}`,
      user: '张经理',
      dept: '销售部',
      type: '预支申请',
      amount: `¥ ${parseFloat(amount).toLocaleString()}`,
      date: new Date().toLocaleDateString(),
      detail: reason,
      icon: 'payments',
      color: 'bg-blue-500',
      route: PageType.ADVANCE_REQUEST_DETAIL,
      status: 'pending'
    };

    onAddApproval(newItem);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-48 font-sans selection:bg-primary/20">
      {/* 沉浸式页头 */}
      <header className="sticky top-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.APPROVAL_CENTER)}
              className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl font-black">arrow_back_ios_new</span>
            </button>
            <h2 className="text-lg font-black tracking-tight">发起预支申请</h2>
          </div>
          <div className="size-10 flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined">info</span>
          </div>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* 顶部个人统计卡片 */}
        <div className="grid grid-cols-2 gap-4 animate-slideUp">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm shadow-slate-100/50">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">本月预支总额</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-slate-300">¥</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                {stats.month.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1 w-8 bg-primary/20 rounded-full"></div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm shadow-slate-100/50">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">本年累计预支</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-slate-300">¥</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                {stats.year.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1 w-8 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* 金额输入卡片 */}
        <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border transition-all animate-slideUp duration-500 ${showError && !amount ? 'border-red-400 ring-4 ring-red-50 shadow-red-100' : 'shadow-slate-200/50 border-slate-50 dark:border-slate-800'}`} style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className={`size-8 rounded-lg flex items-center justify-center transition-colors ${showError && !amount ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-primary'}`}>
              <span className="material-symbols-outlined !text-lg filled-icon">account_balance_wallet</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${showError && !amount ? 'text-red-500' : 'text-slate-400'}`}>
              Advance Amount {showError && !amount && ' (必填)'}
            </p>
          </div>
          
          <div className="relative group">
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black transition-colors ${showError && !amount ? 'text-red-300' : 'text-slate-300 group-focus-within:text-primary'}`}>¥</span>
            <input 
              autoFocus
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setShowError(false); }}
              placeholder="0.00"
              className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-5xl font-black text-slate-900 dark:text-white outline-none focus:ring-0 placeholder:text-slate-100 dark:placeholder:text-slate-800 tabular-nums"
            />
          </div>
          <div className={`h-px w-full mt-4 transition-colors ${showError && !amount ? 'bg-red-200' : 'bg-slate-50 dark:bg-slate-800'}`}></div>
          <p className="mt-4 text-[11px] text-slate-400 font-medium">提示：请根据实际需求准确填写预支金额</p>
        </div>

        {/* 事由描述卡片 */}
        <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border transition-all animate-slideUp duration-500 ${showError && !reason ? 'border-red-400 ring-4 ring-red-50 shadow-red-100' : 'border-slate-50 dark:border-slate-800'}`} style={{ animationDelay: '200ms' }}>
          <div className="p-6">
            <label className={`text-[10px] font-black uppercase tracking-widest block mb-4 ml-1 ${showError && !reason ? 'text-red-500' : 'text-slate-400'}`}>
              预支事由描述 {showError && !reason && ' (请填写用途)'}
            </label>
            <textarea 
              value={reason}
              onChange={(e) => { setReason(e.target.value); setShowError(false); }}
              rows={4}
              placeholder="请输入本次预支款项的具体用途（如：材料采购、现场补助等）..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/10 resize-none leading-relaxed shadow-inner outline-none"
            ></textarea>
          </div>
        </div>

        {/* 流程预览 */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">审批流程路径</h3>
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-xs font-black">本人</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">发起</span>
            </div>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-4 border-t-2 border-dashed"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined !text-xl">payments</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">财务部</span>
            </div>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-4 border-t-2 border-dashed"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined !text-xl">verified_user</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">管理层</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部提交区域 - 提升层级并确保点击 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-[100] safe-area-bottom pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          type="button"
          onClick={handleSubmit}
          className={`w-full h-16 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-[0.96] touch-none ${showError ? 'bg-red-500 shadow-red-200 animate-shake' : 'bg-primary shadow-primary/30'}`}
        >
          <span className="text-lg tracking-tight">
            {showError ? '请补全信息后再提交' : '确认提交申请'}
          </span>
          <span className={`material-symbols-outlined !text-xl transition-transform ${!showError && 'group-hover:translate-x-1'}`}>
            {showError ? 'priority_high' : 'send'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdvanceRequestForm;
