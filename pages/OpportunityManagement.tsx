
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { EnhancedOpportunity, FollowUpRecord, GlobalCustomer } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  opportunities: EnhancedOpportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<EnhancedOpportunity[]>>;
  customers: GlobalCustomer[];
}

const OpportunityManagement: React.FC<Props> = ({ navigateTo, opportunities, setOpportunities, customers }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showFollowUpModal, setShowFollowUpModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  
  const [followUpContent, setFollowUpContent] = useState('');
  const [nextDate, setNextDate] = useState('');

  // 新商机表单状态
  const [newOpp, setNewOpp] = useState({
    name: '',
    customer: '',
    customerId: '',
    amount: '',
    stageLabel: '方案报价'
  });

  const stats = useMemo(() => {
    const total = opportunities.length;
    const won = opportunities.filter(o => o.status === 'won').length;
    const rate = total > 0 ? ((won / total) * 100).toFixed(1) : '0';
    return { total, won, rate };
  }, [opportunities]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const setStatus = (id: string, newStatus: 'won' | 'lost') => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleSaveFollowUp = () => {
    if (!followUpContent.trim()) return;
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newRecord: FollowUpRecord = {
      id: Date.now().toString(),
      time: timeStr,
      content: followUpContent,
      result: nextDate ? '预约推进' : '常规跟进'
    };
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === showFollowUpModal) {
        return {
          ...opp,
          nextContactDate: nextDate || opp.nextContactDate,
          history: [newRecord, ...opp.history],
          updateTime: '刚刚'
        };
      }
      return opp;
    }));
    setFollowUpContent('');
    setNextDate('');
    setShowFollowUpModal(null);
  };

  const handleCreateOpportunity = () => {
    if (!newOpp.name || !newOpp.customer || !newOpp.amount) {
      alert('请填写必填信息');
      return;
    }

    const opportunity: EnhancedOpportunity = {
      id: `opp-${Date.now()}`,
      name: newOpp.name,
      customer: newOpp.customer,
      amount: parseFloat(newOpp.amount),
      stageLabel: newOpp.stageLabel,
      owner: '张经理',
      avatar: 'https://picsum.photos/100?random=me',
      updateTime: '刚刚',
      status: 'active',
      history: []
    };

    setOpportunities([opportunity, ...opportunities]);
    setShowAddModal(false);
    setNewOpp({ name: '', customer: '', customerId: '', amount: '', stageLabel: '方案报价' });
  };

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
    return dateStr.includes(today);
  };

  return (
    <div className="bg-slate-50 dark:bg-background-dark min-h-screen pb-32 font-sans animate-fadeIn">
      {/* 紧凑页头 */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center px-4 h-14 justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo(PageType.SALES_WORKBENCH)} className="text-slate-500">
              <span className="material-symbols-outlined !text-2xl">arrow_back</span>
            </button>
            <h2 className="text-base font-bold">商机管理</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5">商机转化率</p>
                <p className="text-sm font-black text-primary leading-none">{stats.rate}%</p>
             </div>
             <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
             <button className="material-symbols-outlined text-slate-400 !text-xl">filter_alt</button>
          </div>
        </div>
      </div>

      {/* 商机列表 */}
      <div className="p-3 space-y-3">
        {opportunities.map((opp) => {
          const isExpanded = expandedIds.includes(opp.id);
          const urgent = isToday(opp.nextContactDate);
          
          return (
            <div 
              key={opp.id} 
              className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm transition-all overflow-hidden animate-slideUp ${
                opp.status === 'won' ? 'border-emerald-100 opacity-80' : 
                opp.status === 'lost' ? 'border-slate-100 grayscale opacity-60' : 
                'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      opp.status === 'won' ? 'bg-emerald-500 text-white' : 
                      opp.status === 'lost' ? 'bg-slate-400 text-white' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      {opp.status === 'won' ? '已成交' : opp.status === 'lost' ? '已流失' : opp.stageLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{opp.updateTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src={opp.avatar} className="size-4 rounded-full" alt="" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{opp.owner}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{opp.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] text-slate-500">{opp.customer}</p>
                  <p className="text-xs font-black text-primary">¥{opp.amount.toLocaleString()}</p>
                </div>

                {opp.status === 'active' && opp.nextContactDate && (
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-4 text-[10px] font-bold border ${
                    urgent ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800'
                  }`}>
                    <span className="material-symbols-outlined !text-[14px] filled-icon">notification_important</span>
                    <span>待跟进: {opp.nextContactDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800 gap-2">
                  <div className="flex gap-1.5">
                    {opp.status === 'active' && (
                      <>
                        <button 
                          onClick={() => setStatus(opp.id, 'won')}
                          className="h-8 px-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold flex items-center gap-1 active:bg-emerald-100"
                        >
                          <span className="material-symbols-outlined !text-sm">verified</span>赢单
                        </button>
                        <button 
                          onClick={() => setStatus(opp.id, 'lost')}
                          className="h-8 px-2.5 rounded-lg bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold flex items-center gap-1 active:bg-red-100"
                        >
                          <span className="material-symbols-outlined !text-sm">cancel</span>输单
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button 
                      onClick={() => setShowFollowUpModal(opp.id)}
                      className="h-8 px-3 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined !text-sm">add</span>跟进
                    </button>
                    <button 
                      onClick={() => toggleExpand(opp.id)}
                      className={`size-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-slate-100 text-primary' : 'text-slate-300'}`}
                    >
                      <span className="material-symbols-outlined !text-xl">{isExpanded ? 'expand_less' : 'history'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="space-y-3">
                    {opp.history.length > 0 ? opp.history.map((h, i) => (
                      <div key={h.id} className="relative pl-4 border-l-2 border-primary/20">
                        <div className="absolute -left-[5px] top-1 size-2 rounded-full bg-primary"></div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-bold">{h.time}</span>
                          <span className="text-[9px] text-primary font-black uppercase">{h.result}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">{h.content}</p>
                      </div>
                    )) : (
                      <p className="text-center text-[10px] text-slate-400 py-2 italic">暂无记录</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 跟进笔记弹窗 */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-2xl p-5 shadow-2xl animate-scaleIn">
            <h3 className="text-sm font-bold mb-4">记录跟进</h3>
            <div className="space-y-4">
              <textarea 
                value={followUpContent}
                onChange={(e) => setFollowUpContent(e.target.value)}
                className="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 text-xs outline-none focus:ring-1 focus:ring-primary" 
                placeholder="沟通内容..."
              ></textarea>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 ml-1">下次联系</label>
                <input 
                  type="datetime-local" 
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 border border-slate-100 dark:border-slate-700 text-xs font-bold" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowFollowUpModal(null)} className="flex-1 h-10 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs">取消</button>
                <button onClick={handleSaveFollowUp} className="flex-1 h-10 bg-primary text-white font-bold rounded-xl text-xs shadow-lg shadow-primary/20">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新增商机表单弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black tracking-tight">新增商机项目</h3>
               <button onClick={() => setShowAddModal(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">商机名称 *</label>
                <input 
                  value={newOpp.name}
                  onChange={(e) => setNewOpp({...newOpp, name: e.target.value})}
                  className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                  placeholder="如：星巴克旗舰店发光字更换"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">关联客户 *</label>
                <div 
                  onClick={() => setShowCustomerSelector(true)}
                  className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 flex items-center justify-between cursor-pointer active:bg-slate-200 transition-colors"
                >
                  <span className={`text-sm font-bold ${newOpp.customer ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {newOpp.customer || '点击选择客户'}
                  </span>
                  <span className="material-symbols-outlined text-slate-300">expand_more</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">预计金额 (元)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm">¥</span>
                    <input 
                      type="number"
                      value={newOpp.amount}
                      onChange={(e) => setNewOpp({...newOpp, amount: e.target.value})}
                      className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl pl-9 pr-4 border-none text-base font-black text-primary" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">商机阶段</label>
                  <select 
                    value={newOpp.stageLabel}
                    onChange={(e) => setNewOpp({...newOpp, stageLabel: e.target.value})}
                    className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 border-none text-xs font-bold appearance-none"
                  >
                    <option>初步接触</option>
                    <option>方案报价</option>
                    <option>商务谈判</option>
                    <option>合同签订</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-2xl active:scale-95 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleCreateOpportunity}
                  className="flex-[2] h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined !text-xl">rocket_launch</span>
                  确认立项
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 客户选择抽屉 */}
      {showCustomerSelector && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
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
                  onClick={() => {
                    setNewOpp({...newOpp, customer: c.name, customerId: c.id});
                    setShowCustomerSelector(false);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    newOpp.customerId === c.id ? 'border-primary bg-primary/5' : 'border-slate-50 active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-black">{c.avatar}</div>
                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-white leading-none">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5">{c.type} · {c.owner || '未分配'}</p>
                    </div>
                  </div>
                  {newOpp.customerId === c.id && (
                    <span className="material-symbols-outlined text-primary filled-icon">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB 悬浮新增按钮 */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 size-14 bg-[#0f172a] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-20 border-4 border-white dark:border-slate-800"
      >
        <span className="material-symbols-outlined !text-3xl">add</span>
      </button>
    </div>
  );
};

export default OpportunityManagement;
