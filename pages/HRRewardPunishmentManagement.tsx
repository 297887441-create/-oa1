
import React, { useState, useMemo } from 'react';
import { PageType, RewardPunishmentRecord } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  records: RewardPunishmentRecord[];
  onAddRecord: (record: RewardPunishmentRecord) => void;
}

const HRRewardPunishmentManagement: React.FC<Props> = ({ navigateTo, records, onAddRecord }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    type: 'reward' as 'reward' | 'punishment',
    title: '',
    amount: '',
    reason: '',
    dept: '业务部'
  });

  // 模拟全公司员工名单供 HR 选择
  const employees = ['张伟', '李晓明', '王五', '赵六', '孙七', '陈八'];

  const filteredRecords = useMemo(() => {
    return records.filter(r => r.userName.includes(searchQuery) || r.title.includes(searchQuery));
  }, [records, searchQuery]);

  const handleSubmit = () => {
    if (!formData.userName || !formData.title || !formData.amount) return;

    const newRecord: RewardPunishmentRecord = {
      id: `rp-${Date.now()}`,
      userId: 'external', 
      userName: formData.userName,
      type: formData.type,
      title: formData.title,
      amount: `${formData.type === 'reward' ? '+' : '-'} ¥ ${formData.amount}`,
      date: new Date().toISOString().split('T')[0],
      reason: formData.reason,
      dept: formData.dept,
      icon: formData.type === 'reward' ? 'military_tech' : 'timer_off'
    };

    onAddRecord(newRecord);
    setShowForm(false);
    setFormData({ userName: '', type: 'reward', title: '', amount: '', reason: '', dept: '业务部' });
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-20 font-sans no-scrollbar">
      
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.HR_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">全员奖惩录入管理</h2>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 rounded-2xl flex items-center px-4 h-12 border border-white/10 focus-within:bg-white/20 transition-all">
            <span className="material-symbols-outlined text-white/40 !text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-white text-sm flex-1 ml-3 placeholder:text-white/20 font-bold" 
              placeholder="搜索员工姓名、事由..." 
            />
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {filteredRecords.map((record, idx) => (
          <div 
            key={record.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-white dark:border-slate-800 shadow-sm animate-slideUp"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
             <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                   <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                     record.type === 'reward' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                      <span className="material-symbols-outlined !text-xl filled-icon">{record.icon}</span>
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        <span className="text-primary mr-1">@{record.userName}</span> {record.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{record.dept} · {record.date}</p>
                   </div>
                </div>
                <span className={`text-base font-black tabular-nums ${
                  record.type === 'reward' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                   {record.amount}
                </span>
             </div>
             <p className="text-xs text-slate-500 italic px-2 border-l-2 border-slate-100 mb-2">“ {record.reason} ”</p>
          </div>
        ))}
      </div>

      {/* FAB: 新增录入 */}
      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-10 right-6 size-14 rounded-full bg-amber-500 text-white shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-white"
      >
        <span className="material-symbols-outlined !text-3xl font-light">add_circle</span>
      </button>

      {/* 录入表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">录入奖惩项</h3>
                <button onClick={() => setShowForm(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">选择员工 *</label>
                   <select 
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold appearance-none"
                   >
                     <option value="">请选择员工</option>
                     {employees.map(e => <option key={e} value={e}>{e}</option>)}
                   </select>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">奖惩类型</label>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setFormData({ ...formData, type: 'reward' })}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.type === 'reward' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
                      >
                        奖金/奖励
                      </button>
                      <button 
                        onClick={() => setFormData({ ...formData, type: 'punishment' })}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.type === 'punishment' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
                      >
                        扣款/处罚
                      </button>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">具体事由标题 *</label>
                   <input 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold focus:ring-2 focus:ring-amber-500/20" placeholder="如：Q3季度个人销售冠军" 
                   />
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">金额 (元) *</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">¥</span>
                      <input 
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-10 border-none text-base font-black text-amber-600 tabular-nums" placeholder="0.00" 
                      />
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">备注说明</label>
                   <textarea 
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border-none text-sm font-medium focus:ring-2 focus:ring-amber-500/20 min-h-[100px] resize-none" placeholder="补充详细背景信息..." 
                   />
                </div>

                <div className="pt-4">
                   <button 
                    onClick={handleSubmit}
                    className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     <span className="material-symbols-outlined">verified</span>
                     提交并同步至员工工资单
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRRewardPunishmentManagement;
