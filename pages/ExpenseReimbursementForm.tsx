
import React, { useState, useMemo } from 'react';
import { PageType, ApprovalItem } from '../types';

interface ExpenseDetail {
  id: string;
  category: string;
  amount: string;
  description: string;
}

interface Props {
  navigateTo: (page: PageType) => void;
  onAddApproval?: (item: ApprovalItem) => void;
}

const ExpenseReimbursementForm: React.FC<Props> = ({ navigateTo, onAddApproval }) => {
  const [details, setDetails] = useState<ExpenseDetail[]>([
    { id: '1', category: 'material', amount: '', description: '' }
  ]);

  const totalAmount = useMemo(() => {
    return details.reduce((sum, item) => {
      const val = parseFloat(item.amount) || 0;
      return sum + val;
    }, 0).toFixed(2);
  }, [details]);

  const addDetail = () => {
    const newDetail: ExpenseDetail = {
      id: Date.now().toString(),
      category: 'material',
      amount: '',
      description: ''
    };
    setDetails([...details, newDetail]);
  };

  const removeDetail = (id: string) => {
    if (details.length <= 1) return;
    setDetails(details.filter(item => item.id !== id));
  };

  const updateDetail = (id: string, field: keyof ExpenseDetail, value: string) => {
    setDetails(details.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = () => {
    if (parseFloat(totalAmount) <= 0) {
      alert('请输入有效的报销金额');
      return;
    }

    if (onAddApproval) {
      const firstDetail = details[0]?.description || '报销申请';
      const newItem: ApprovalItem = {
        id: `EXP-${Date.now()}`,
        user: '我自己',
        dept: '制作部',
        type: '报销申请',
        amount: `¥ ${parseFloat(totalAmount).toLocaleString()}`,
        date: new Date().toLocaleDateString(),
        detail: details.length > 1 ? `包含 ${details.length} 项费用明细，总计 ${totalAmount}` : firstDetail,
        icon: 'receipt_long',
        color: 'bg-orange-500',
        route: PageType.EXPENSE_REIMBURSEMENT_DETAIL,
        status: 'pending'
      };
      onAddApproval(newItem);
    }
    
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  return (
    <div className="animate-slideIn bg-[#f6f7f8] dark:bg-slate-950 min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => navigateTo(PageType.APPROVAL_CENTER)} 
            className="material-symbols-outlined cursor-pointer text-slate-600 dark:text-slate-400"
          >
            arrow_back_ios
          </span>
          <h1 className="text-lg font-bold">报销申请</h1>
        </div>
        <div className="flex items-center">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">more_horiz</span>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto pb-48 no-scrollbar">
        <section className="mt-4">
          <h3 className="text-slate-500 text-[11px] font-black px-4 mb-2 uppercase tracking-[0.2em]">汇总信息</h3>
          <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
            <div className="px-4 py-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">总报销金额</p>
                <p className="text-[10px] text-slate-400 mt-0.5">（根据明细自动计算）</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-primary">¥</span>
                <span className={`text-3xl font-black tabular-nums ${parseFloat(totalAmount) > 0 ? 'text-primary' : 'text-slate-300'}`}>
                  {totalAmount}
                </span>
              </div>
            </div>
          </div>
        </section>

        {details.map((detail, index) => (
          <section key={detail.id} className="mt-6 animate-slideUp">
            <div className="flex justify-between items-end px-4 mb-2">
              <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                费用明细 ({index + 1})
              </h3>
              {index === 0 ? (
                <button 
                  onClick={addDetail}
                  className="text-primary text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10"
                >
                  <span className="material-symbols-outlined !text-[16px]">add_circle</span>
                  添加明细
                </button>
              ) : (
                <button 
                  onClick={() => removeDetail(detail.id)}
                  className="text-red-400 text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100"
                >
                  <span className="material-symbols-outlined !text-[16px]">do_not_disturb_on</span>
                  移除该项
                </button>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 space-y-px">
              <div className="px-4 py-4 flex items-center border-b border-slate-50 dark:border-slate-800 group">
                <label className="w-24 text-sm font-bold text-slate-600 dark:text-slate-400">报销类别</label>
                <div className="flex-1 relative">
                  <select 
                    value={detail.category}
                    onChange={(e) => updateDetail(detail.id, 'category', e.target.value)}
                    className="w-full border-none p-0 text-base font-bold bg-transparent focus:ring-0 text-right pr-6 text-slate-900 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="travel">差旅费</option>
                    <option value="material">材料费</option>
                    <option value="entertainment">业务招待费</option>
                    <option value="office">办公费</option>
                    <option value="other">其他杂费</option>
                  </select>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 pointer-events-none !text-lg">unfold_more</span>
                </div>
              </div>

              <div className="px-4 py-4 flex items-center border-b border-slate-50 dark:border-slate-800">
                <label className="w-24 text-sm font-bold text-slate-600 dark:text-slate-400">报销金额</label>
                <div className="flex-1 flex items-center justify-end gap-1.5">
                  <span className="text-sm font-black text-slate-900 dark:text-white">¥</span>
                  <input 
                    value={detail.amount}
                    onChange={(e) => updateDetail(detail.id, 'amount', e.target.value)}
                    className="w-full border-none p-0 text-lg font-black bg-transparent focus:ring-0 text-right placeholder:text-slate-200 text-primary tabular-nums" 
                    placeholder="0.00" 
                    type="number" 
                  />
                </div>
              </div>

              <div className="px-4 py-4 border-b border-slate-50 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3">费用说明</p>
                <textarea 
                  value={detail.description}
                  onChange={(e) => updateDetail(detail.id, 'description', e.target.value)}
                  className="w-full border-none p-0 text-sm font-medium bg-transparent focus:ring-0 placeholder:text-slate-300 resize-none text-slate-600 dark:text-slate-400 leading-relaxed" 
                  placeholder="请详细说明费用产生的缘由..." 
                  rows={2}
                ></textarea>
              </div>

              <div className="px-4 py-4">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">发票/凭证</p>
                <div className="flex gap-3">
                  <div className="size-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 active:bg-slate-100 active:scale-95 transition-all cursor-pointer group">
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">add_a_photo</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1.5">上传照片</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="mt-10 px-4 mb-20">
          <h3 className="text-slate-500 text-[11px] font-black mb-6 uppercase tracking-[0.2em]">审批流程</h3>
          <div className="relative ml-2 border-l-2 border-slate-100 dark:border-slate-800 pl-8 space-y-10">
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-4 border-[#f6f7f8] dark:border-slate-950 z-10 shadow-lg shadow-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-50">
                  <img className="w-full h-full object-cover" src="https://picsum.photos/100?random=me" alt="Avatar" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">发起人</p>
                  <p className="text-[11px] text-slate-400 font-medium">我自己</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-200 border-4 border-[#f6f7f8] dark:border-slate-950 z-10"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <span className="material-symbols-outlined text-primary !text-xl filled-icon">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">部门经理审批</p>
                  <p className="text-[11px] text-slate-400 font-medium">直接上级</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 ios-blur dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 z-40 safe-area-bottom pb-6">
        <div className="px-4 py-4 flex gap-3">
          <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold py-3.5 rounded-2xl active:bg-slate-50 transition-all text-sm">
            暂存草稿
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] bg-primary text-white font-black py-3.5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined !text-xl">send</span>
            提交报销申请
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReimbursementForm;
