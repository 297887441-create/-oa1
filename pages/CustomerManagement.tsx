
import React, { useState } from 'react';
import { PageType } from '../types';
import { GlobalCustomer } from '../App';

interface Props {
  navigateTo: (page: PageType, mode?: any, status?: any, customerId?: string) => void;
  customers: GlobalCustomer[];
  setCustomers: React.Dispatch<React.SetStateAction<GlobalCustomer[]>>;
}

const CustomerManagement: React.FC<Props> = ({ navigateTo, customers, setCustomers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    type: 'VIP' as const,
    contact: '',
    phone: '',
    address: '',
    owner: '张经理' // 默认负责人
  });

  // 模拟企业内部员工列表
  const staffList = [
    { name: '张经理', avatar: 'https://picsum.photos/100?random=11' },
    { name: '王组长', avatar: 'https://picsum.photos/100?random=12' },
    { name: '李经理', avatar: 'https://picsum.photos/100?random=13' },
    { name: '赵主管', avatar: 'https://picsum.photos/100?random=14' },
    { name: '陈专员', avatar: 'https://picsum.photos/100?random=15' }
  ];

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      alert('请输入客户名称');
      return;
    }

    const customer: GlobalCustomer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      projects: 0,
      total: '0.0',
      type: newCustomer.type as any,
      avatar: newCustomer.name.charAt(0).toUpperCase(),
      contact: newCustomer.contact,
      phone: newCustomer.phone,
      address: newCustomer.address,
      owner: newCustomer.owner
    };

    setCustomers([customer, ...customers]);
    setShowAddModal(false);
    setNewCustomer({ name: '', type: 'VIP', contact: '', phone: '', address: '', owner: '张经理' });
  };

  return (
    <div className="bg-[#f6f7f9] dark:bg-background-dark min-h-screen pb-24 font-sans animate-fadeIn">
      {/* 顶部导航 */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={() => navigateTo(PageType.SALES_WORKBENCH)} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
             <span className="material-symbols-outlined !text-xl font-black">arrow_back_ios_new</span>
           </button>
           <h2 className="text-lg font-black tracking-tight">客户资产</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-black">add</span>
          </button>
          <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>

      <div className="p-5">
        {/* 数据面板 */}
        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]"></div>
           <div className="relative z-10">
             <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.25em] mb-4">Active Customers Assets</p>
             <div className="flex items-center gap-3">
                <span className="text-6xl font-black tracking-tighter leading-none animate-pulse-slow">
                  {customers.length}
                </span>
                <div className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-black flex items-center gap-0.5">
                  <span className="material-symbols-outlined !text-[12px]">trending_up</span>
                  +{(customers.length / 10).toFixed(1)}%
                </div>
             </div>
             <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-wider mb-1.5">本月新增</p>
                  <p className="text-lg font-black">08 <span className="text-[10px] text-white/20 font-bold ml-0.5">位</span></p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-wider mb-1.5">成交转化率</p>
                  <p className="text-lg font-black">42.5<span className="text-[10px] text-white/20 font-bold ml-0.5">%</span></p>
                </div>
             </div>
           </div>
        </div>

        {/* 客户列表 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Customer List</h3>
            <span className="material-symbols-outlined text-slate-300">sort</span>
          </div>
          
          {customers.map((c, idx) => (
            <div 
              key={c.id} 
              onClick={() => navigateTo(PageType.CUSTOMER_DETAIL, undefined, undefined, c.id)}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer group animate-slideUp"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
               <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary font-black text-2xl border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                  {c.avatar}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-[15px] font-black text-slate-900 dark:text-white truncate pr-2 tracking-tight">{c.name}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm ${
                      c.type === 'TOP' ? 'bg-rose-50 text-rose-600' : 
                      c.type === 'KA' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>{c.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                     <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">person</span>
                        负责人：{c.owner || '未分配'}
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 新增客户弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black tracking-tight">新增客户档案</h3>
               <button onClick={() => setShowAddModal(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">客户名称 *</label>
                <input 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                  placeholder="如：腾讯科技（深圳）有限公司"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">客户等级</label>
                <div className="flex gap-2">
                  {['VIP', 'KA', 'TOP', 'NORMAL'].map(t => (
                    <button
                      key={t}
                      onClick={() => setNewCustomer({...newCustomer, type: t as any})}
                      className={`flex-1 h-10 rounded-xl text-[10px] font-black border-2 transition-all ${
                        newCustomer.type === t 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-slate-50 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 新增负责人选择 */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">选择负责人 *</label>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {staffList.map((staff) => (
                    <div 
                      key={staff.name}
                      onClick={() => setNewCustomer({...newCustomer, owner: staff.name})}
                      className={`flex flex-col items-center gap-2 shrink-0 cursor-pointer transition-all ${
                        newCustomer.owner === staff.name ? 'scale-110' : 'opacity-50 grayscale'
                      }`}
                    >
                      <div className={`size-12 rounded-2xl border-2 p-0.5 relative transition-all ${
                        newCustomer.owner === staff.name ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'
                      }`}>
                        <img src={staff.avatar} className="w-full h-full object-cover rounded-[12px]" alt={staff.name} />
                        {newCustomer.owner === staff.name && (
                          <div className="absolute -bottom-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white">
                            <span className="material-symbols-outlined !text-[10px] font-black">check</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-black ${newCustomer.owner === staff.name ? 'text-primary' : 'text-slate-400'}`}>
                        {staff.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">主要联系人</label>
                  <input 
                    value={newCustomer.contact}
                    onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
                    className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 border-none text-sm font-bold" 
                    placeholder="姓名"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">联系电话</label>
                  <input 
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 border-none text-sm font-bold" 
                    placeholder="手机号"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">公司地址</label>
                <textarea 
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none" 
                  placeholder="请输入客户公司的详细办公地址"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-2xl active:scale-95 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddCustomer}
                  className="flex-[2] h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined !text-xl">person_add</span>
                  创建并同步资产
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
