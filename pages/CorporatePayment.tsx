
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { PayoutItem } from '../App';

interface Props {
  navigateTo: (page: PageType, mode?: any, status?: any, id?: any, from?: PageType) => void;
  pendingPayments: PayoutItem[];
  paidHistory: PayoutItem[];
  onCompletePayment: (items: PayoutItem[]) => void;
}

const CorporatePayment: React.FC<Props> = ({ navigateTo, pendingPayments, paidHistory, onCompletePayment }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PayoutItem | null>(null);

  const totalPending = useMemo(() => {
    return pendingPayments.reduce((sum, item) => {
      const val = parseFloat(item.amount.replace(/[^\d.-]/g, '')) || 0;
      return sum + val;
    }, 0);
  }, [pendingPayments]);

  const confirmSinglePay = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onCompletePayment([selectedItem]);
    setIsProcessing(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-[#f2f4f7] dark:bg-background-dark min-h-screen pb-40 font-sans">
      <div className="bg-gradient-to-br from-[#137fec] to-[#0a5ab3] pt-12 pb-24 px-6 relative overflow-hidden">
        <button 
          onClick={() => navigateTo(PageType.ADMIN_WORKBENCH)}
          className="absolute top-12 left-4 size-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10 z-50"
        >
          <span className="material-symbols-outlined !text-xl">arrow_back</span>
        </button>
        
        <div className="relative z-10 pt-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-white/90 !text-xl">verified_user</span>
            <h2 className="text-white text-lg font-black tracking-tight">企业财务拨付中心</h2>
          </div>
          
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">待拨付总金额</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-white/60 text-lg font-black">¥</span>
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                  {totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-black/20 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full text-[10px] font-black border border-white/10">
                {pendingPayments.length} 条待付指令
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 shadow-xl border border-slate-50 dark:border-slate-800">
          <button onClick={() => setActiveTab('pending')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'pending' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>待支付单据</button>
          <button onClick={() => setActiveTab('paid')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'paid' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>已支付记录</button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {activeTab === 'pending' ? (
          pendingPayments.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-800 animate-slideUp">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary border border-blue-100">
                    <span className="material-symbols-outlined !text-2xl filled-icon">payments</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-none">{item.user}</h4>
                    <p className="text-[11px] text-slate-400 font-bold mt-1.5">{item.dept} · {item.type}</p>
                  </div>
                </div>
                <div className="text-right"><span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{item.amount}</span></div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                   <div className="flex items-baseline gap-0.5">
                      <span className="text-primary font-black text-[10px]">Ali</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">收款账户</span>
                   </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.payeeName} ({item.alipayAccount})</p>
                  <p className="text-[11px] text-slate-400 font-medium italic">“ {item.detail} ”</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => navigateTo(item.route, 'initiator', 'approved', undefined, PageType.CORPORATE_PAYMENT)}
                  className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-2xl text-[11px] active:scale-95"
                >
                  详情
                </button>
                <button onClick={() => setSelectedItem(item)} className="flex-[2.5] h-12 bg-primary text-white font-black rounded-2xl text-[11px] shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                  <span className="material-symbols-outlined !text-lg">send_to_mobile</span>单笔拨付
                </button>
              </div>
            </div>
          ))
        ) : (
          paidHistory.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 opacity-60 flex justify-between items-center">
               <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-500">check_circle</span><p className="text-sm font-bold">{item.user} 的{item.type}</p></div>
               <span className="text-sm font-black">{item.amount}</span>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl text-center">
            <h3 className="text-lg font-black mb-8">支付指令确认</h3>
            <div className="flex flex-col items-center mb-8">
               <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"><span className="material-symbols-outlined !text-3xl">fingerprint</span></div>
               <p className="text-3xl font-black">{selectedItem.amount}</p>
            </div>
            <button onClick={confirmSinglePay} disabled={isProcessing} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">
              {isProcessing ? '正在拨付...' : '确认安全拨付'}
            </button>
            <button onClick={() => setSelectedItem(null)} className="w-full h-12 text-slate-400 font-bold mt-2">取消</button>
          </div>
        </div>
      )}

      {activeTab === 'pending' && pendingPayments.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-white/80 backdrop-blur-md z-50 pb-8">
           <button className="w-full h-14 bg-[#0f172a] text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3">
             <span className="material-symbols-outlined !text-xl text-yellow-400">bolt</span>
             一键批量拨付 (¥{totalPending.toLocaleString()})
           </button>
        </div>
      )}
    </div>
  );
};

export default CorporatePayment;
