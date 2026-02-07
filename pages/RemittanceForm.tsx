
import React, { useState, useMemo } from 'react';
import { PageType, ApprovalItem } from '../types';
import { GlobalContract } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
  onAddApproval: (item: ApprovalItem) => void;
}

const RemittanceForm: React.FC<Props> = ({ navigateTo, contracts, onAddApproval }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [remittanceAmount, setRemittanceAmount] = useState<string>('');

  const selectedContract = useMemo(() => {
    const found = contracts.find(c => c.id === selectedContractId);
    if (found && remittanceAmount === '') {
      setRemittanceAmount((found.amount - found.paid).toString());
    }
    return found;
  }, [selectedContractId, contracts]);

  const pendingTotal = selectedContract ? (selectedContract.amount - selectedContract.paid) : 0;

  const handleSubmit = () => {
    if (!selectedContractId) {
      alert('请选择合同');
      return;
    }
    const amountNum = parseFloat(remittanceAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('请输入有效的回款金额');
      return;
    }

    // 正确：将 route 指向合同回款专用详情页
    const newItem: ApprovalItem = {
      id: `REM-${Date.now()}`,
      user: '张经理', 
      dept: '销售部',
      type: '合同回款',
      amount: `¥ ${amountNum.toLocaleString()}`,
      date: new Date().toLocaleDateString(),
      detail: `对合同《${selectedContract?.title}》登记回款，金额 ¥${amountNum.toLocaleString()}`,
      icon: 'payments',
      color: 'bg-emerald-500',
      route: PageType.CONTRACT_REMITTANCE_DETAIL, 
      status: 'pending',
      relatedId: selectedContractId,
      metadata: {
        amount: amountNum
      }
    };

    onAddApproval(newItem);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  return (
    <div className="animate-slideIn bg-[#f8fafc] dark:bg-background-dark min-h-screen flex flex-col font-sans">
      <div className="flex items-center bg-white dark:bg-slate-900 px-4 py-3 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigateTo(PageType.SALES_WORKBENCH)} className="material-symbols-outlined text-slate-900 dark:text-white">chevron_left</button>
        <h2 className="text-lg font-bold flex-1 text-center">登记回款</h2>
        <div className="w-6"></div>
      </div>

      <div className="p-4 space-y-4 pb-40 overflow-y-auto no-scrollbar">
        <div 
          onClick={() => setShowSelector(true)}
          className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8"></div>
          
          <div className="flex items-start gap-4 mb-5 relative z-10">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-primary border border-blue-100/50">
              <span className="material-symbols-outlined !text-2xl filled-icon">description</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mb-1">合同名称</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-snug truncate pr-4">
                  {selectedContract ? selectedContract.title : '点击选择合同项目'}
                </p>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">unfold_more</span>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-slate-50 dark:bg-slate-800 w-full mb-5"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg border border-orange-100/50">
              <span className="material-symbols-outlined !text-lg filled-icon">account_balance_wallet</span>
              <span className="text-[11px] font-black uppercase tracking-wider">待收总额</span>
            </div>
            <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">
              ¥ {pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-white dark:border-gray-800 shadow-sm space-y-px">
          <div className="p-5">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">本次回款金额 <span className="text-red-500 font-bold">*</span></label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300 group-focus-within:text-primary transition-colors">¥</span>
              <input 
                type="number" 
                value={remittanceAmount}
                onChange={(e) => setRemittanceAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl h-14 pl-10 pr-4 text-2xl font-black text-primary focus:ring-2 focus:ring-primary/20 transition-all tabular-nums" 
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="p-5 border-t border-slate-50 dark:border-gray-800">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">回款日期 <span className="text-red-500 font-bold">*</span></label>
            <div className="relative">
              <input type="date" defaultValue="2023-10-27" className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl h-12 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary/20" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-300 pointer-events-none">calendar_today</span>
            </div>
          </div>

          <div className="p-5 border-t border-slate-50 dark:border-gray-800">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">回款凭证</label>
            <div className="flex gap-3">
              <div className="size-24 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-gray-400 active:scale-95 transition-all cursor-pointer group hover:bg-slate-100 transition-all">
                <span className="material-symbols-outlined text-3xl group-hover:text-primary">add_a_photo</span>
                <span className="text-[10px] mt-1.5 font-black uppercase tracking-wider">上传凭证</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black tracking-tight">选择回款合同</h3>
              <button onClick={() => setShowSelector(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-6">
              {contracts.filter(c => c.status === 'executing').map(c => (
                <div 
                  key={c.id}
                  onClick={() => {
                    setSelectedContractId(c.id);
                    setRemittanceAmount(''); 
                    setShowSelector(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedContractId === c.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-100 dark:border-slate-800 active:bg-slate-50'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-black text-sm text-slate-800 dark:text-white truncate">{c.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">待收：¥ {(c.amount - c.paid).toLocaleString()}</p>
                  </div>
                  {selectedContractId === c.id && (
                    <span className="material-symbols-outlined text-primary filled-icon">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 border-t border-gray-100 dark:border-gray-800 z-50 safe-area-bottom pb-8">
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined !text-xl">send</span>
          提交登记申请
        </button>
      </div>
    </div>
  );
};

export default RemittanceForm;
