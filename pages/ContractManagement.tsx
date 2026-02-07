
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { GlobalContract, GlobalCustomer } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  contracts: GlobalContract[];
  setContracts: React.Dispatch<React.SetStateAction<GlobalContract[]>>;
  customers: GlobalCustomer[];
}

const ContractManagement: React.FC<Props> = ({ navigateTo, contracts, setContracts, customers }) => {
  const [activeTab, setActiveTab] = useState<'executing' | 'completed'>('executing');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  
  // 新合同表单状态
  const [newContract, setNewContract] = useState({
    title: '',
    customer: '',
    customerId: '',
    amount: '',
    nextDate: '',
    address: ''
  });

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
  }, [contracts, activeTab]);

  const stats = useMemo(() => {
    const total = contracts.reduce((acc, c) => acc + c.amount, 0);
    const paid = contracts.reduce((acc, c) => acc + c.paid, 0);
    const pending = total - paid;
    return { 
      total: (total / 10000).toFixed(1), 
      paid: (paid / 10000).toFixed(1), 
      pending: (pending / 10000).toFixed(1) 
    };
  }, [contracts]);

  const handleAddContract = () => {
    if (!newContract.title || !newContract.customer || !newContract.address) {
      alert('请填写必填项');
      return;
    }

    const contract: GlobalContract = {
      id: `HT-${Date.now()}`,
      title: newContract.title,
      customer: newContract.customer,
      address: newContract.address,
      amount: parseFloat(newContract.amount) || 0,
      paid: 0,
      status: 'executing',
      installStatus: 'pending',
      thumbnail: `https://picsum.photos/400/400?random=${Date.now()}`,
      owner: '张经理'
    };

    setContracts([contract, ...contracts]);
    setShowAddModal(false);
    setNewContract({ title: '', customer: '', customerId: '', amount: '', nextDate: '', address: '' });
  };

  const selectCustomer = (customer: GlobalCustomer) => {
    setNewContract({ ...newContract, customer: customer.name, customerId: customer.id });
    setShowCustomerSelector(false);
  };

  return (
    <div className="bg-[#f6f7f9] dark:bg-background-dark min-h-screen pb-24 font-sans">
      {/* 顶部导航 */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 justify-between sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => navigateTo(PageType.SALES_WORKBENCH)} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined !text-xl font-bold">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-black tracking-tight">合同台账</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined !text-xl font-bold">add</span>
        </button>
      </div>

      {/* 统计数据 */}
      <div className="px-5 py-4">
        <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-3 gap-2 relative z-10">
            <div><p className="text-[9px] text-white/40 font-bold mb-1">合同总额</p><p className="text-base font-black">¥{stats.total}w</p></div>
            <div><p className="text-[9px] text-emerald-400 font-bold mb-1">已回款</p><p className="text-base font-black text-emerald-400">¥{stats.paid}w</p></div>
            <div><p className="text-[9px] text-orange-400 font-bold mb-1">待回款</p><p className="text-base font-black text-orange-400">¥{stats.pending}w</p></div>
          </div>
        </div>
      </div>

      {/* 列表部分 */}
      <div className="bg-white dark:bg-slate-900 sticky top-[72px] z-20 border-b border-slate-100">
        <div className="flex px-5 items-center gap-8">
            {[ { id: 'executing', label: '执行中' }, { id: 'completed', label: '已完成' } ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 text-xs font-black relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
              </button>
            ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {filteredContracts.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 p-6 shadow-sm">
             <h4 className="font-black text-base mb-2">{item.title}</h4>
             <p className="text-xs text-slate-400 mb-4">{item.customer}</p>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">项目金额</span>
                <span className="font-black text-primary">¥{item.amount.toLocaleString()}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 1:1 还原的新建合同弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-5 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            
            {/* 顶部标题与关闭 */}
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-900 dark:text-white">新建合同</h3>
               <button onClick={() => setShowAddModal(false)} className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90">
                  <span className="material-symbols-outlined !text-xl">close</span>
               </button>
            </div>

            <div className="space-y-5">
              {/* 项目名称 */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-2 block ml-1">项目名称 *</label>
                <input 
                  autoFocus
                  value={newContract.title}
                  onChange={(e) => setNewContract({...newContract, title: e.target.value})}
                  className="w-full h-12 bg-[#f4f7f9] dark:bg-slate-800 rounded-xl px-5 text-sm font-bold border-2 border-transparent focus:border-slate-900 dark:focus:border-primary transition-all outline-none" 
                  placeholder="项目全称"
                />
              </div>

              {/* 客户名称：核心逻辑实现 */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-2 block ml-1">客户名称 *</label>
                <div 
                  onClick={() => setShowCustomerSelector(true)}
                  className="w-full h-12 bg-[#f4f7f9] dark:bg-slate-800 rounded-xl px-5 flex items-center justify-between cursor-pointer active:bg-slate-100 transition-colors"
                >
                  <span className={`text-sm font-bold ${newContract.customer ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                    {newContract.customer || '客户公司名'}
                  </span>
                  <span className="material-symbols-outlined text-slate-300">expand_more</span>
                </div>
              </div>

              {/* 分栏：合同总额与回款时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 mb-2 block ml-1">合同总额 (元)</label>
                  <input 
                    type="number"
                    value={newContract.amount}
                    onChange={(e) => setNewContract({...newContract, amount: e.target.value})}
                    className="w-full h-12 bg-[#f4f7f9] dark:bg-slate-800 rounded-xl px-5 text-sm font-black text-primary border-2 border-transparent outline-none" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 mb-2 block ml-1">下次回款时间</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={newContract.nextDate}
                      onChange={(e) => setNewContract({...newContract, nextDate: e.target.value})}
                      className="w-full h-12 bg-[#f4f7f9] dark:bg-slate-800 rounded-xl px-4 text-xs font-bold text-slate-500 border-2 border-transparent outline-none appearance-none" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 pointer-events-none !text-lg">calendar_today</span>
                  </div>
                </div>
              </div>

              {/* 详细地址 */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-2 block ml-1">详细地址 *</label>
                <textarea 
                  value={newContract.address}
                  onChange={(e) => setNewContract({...newContract, address: e.target.value})}
                  className="w-full bg-[#f4f7f9] dark:bg-slate-800 rounded-2xl px-5 py-4 text-sm font-medium border-2 border-transparent outline-none min-h-[90px] resize-none" 
                  placeholder="施工详细地址"
                />
              </div>

              {/* 底部按钮 */}
              <div className="pt-6 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 h-14 bg-[#f4f7f9] dark:bg-slate-800 text-slate-400 font-bold rounded-2xl active:scale-95 transition-all text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddContract}
                  className="flex-[2] h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-[0.98] transition-all text-sm"
                >
                  创建台账
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 客户选择器底层抽屉 */}
      {showCustomerSelector && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black tracking-tight">选择客户</h3>
               <button onClick={() => setShowCustomerSelector(false)} className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10">
              {customers.map(c => (
                <div 
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    newContract.customerId === c.id ? 'border-primary bg-primary/5' : 'border-slate-50 active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-black">{c.avatar}</div>
                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-white leading-none">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5">{c.type} · {c.projects} 个项目</p>
                    </div>
                  </div>
                  {newContract.customerId === c.id && (
                    <span className="material-symbols-outlined text-primary filled-icon">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;
