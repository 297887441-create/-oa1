import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

interface SalaryData {
  month: string;
  basePay: number;
  subsidies: { name: string; amount: number }[];
  commission: number;
  performance: number;
  // 模拟从“奖惩明细”同步过来的数据
  rewards: { name: string; amount: number }[];
  punishments: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  status: 'pending' | 'confirmed';
}

const SalarySlip: React.FC<Props> = ({ navigateTo }) => {
  const [selectedMonth, setSelectedMonth] = useState('2023-11');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 基础薪资数据
  const mockSalary: SalaryData = {
    month: '2023-11',
    basePay: 6500.00,
    subsidies: [
      { name: '高温补贴', amount: 300.00 },
      { name: '伙食/通讯补贴', amount: 500.00 },
      { name: '交通/差旅补差', amount: 850.00 }
    ],
    commission: 4250.00,
    performance: 1500.00,
    // 以下数据对应 MyRewardsPunishments 中的记录
    rewards: [
      { name: '23Q3季度销售冠军奖金', amount: 2000.00 },
      { name: '优质服务特别贡献奖', amount: 500.00 }
    ],
    punishments: [
      { name: '考勤迟到处罚', amount: 50.00 }
    ],
    deductions: [
      { name: '养老保险', amount: 520.00 },
      { name: '医疗保险', amount: 130.00 },
      { name: '住房公积金', amount: 390.00 },
      { name: '个人所得税', amount: 459.50 }
    ],
    status: 'pending'
  };

  // 计算应发总计 (底薪+补贴+提成+绩效+奖励)
  const totalIncentives = useMemo(() => {
    const subsidyTotal = mockSalary.subsidies.reduce((s, i) => s + i.amount, 0);
    const rewardTotal = mockSalary.rewards.reduce((s, i) => s + i.amount, 0);
    return mockSalary.basePay + mockSalary.commission + mockSalary.performance + subsidyTotal + rewardTotal;
  }, [mockSalary]);

  // 计算扣除总计 (固定扣款+行政处罚)
  const totalDeductions = useMemo(() => {
    const deductionTotal = mockSalary.deductions.reduce((s, i) => s + i.amount, 0);
    const punishmentTotal = mockSalary.punishments.reduce((s, i) => s + i.amount, 0);
    return deductionTotal + punishmentTotal;
  }, [mockSalary]);

  // 实发工资
  const finalTakeHomePay = totalIncentives - totalDeductions;

  const formatAmount = (amount: number) => {
    if (isPrivacyMode) return '****';
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  const handleConfirm = () => {
    if (window.confirm('确认本月薪资核算无误并签收电子工资单吗？')) {
      setIsConfirmed(true);
    }
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-40 font-sans selection:bg-primary/20 no-scrollbar">
      
      {/* 沉浸式高级页头 */}
      <div className="bg-[#101922] pt-10 pb-20 px-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.HR_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">电子工资单</h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10"
            >
              <span className="material-symbols-outlined !text-xl">
                {isPrivacyMode ? 'visibility_off' : 'visibility'}
              </span>
            </button>
            <div className="relative">
              <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer">
                <span className="text-white text-xs font-bold tabular-nums">{selectedMonth.replace('-', '年')}月</span>
                <span className="material-symbols-outlined text-white/40 !text-base">expand_more</span>
              </div>
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
           <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.25em] mb-4">Take-home Pay / 本月实发薪资</p>
           <div className="flex items-baseline gap-2 mb-8">
             <span className="text-white/40 text-2xl font-medium">¥</span>
             <span className="text-6xl font-black text-white tracking-tighter tabular-nums">
               {formatAmount(finalTakeHomePay)}
             </span>
           </div>
           
           <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1.5 border ${
                isConfirmed 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                <span className="material-symbols-outlined !text-[16px]">{isConfirmed ? 'verified' : 'pending_actions'}</span>
                {isConfirmed ? '已完成在线签收' : '待本人核对确认'}
              </div>
           </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-5">
        
        {/* 核心指标快照 */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 shadow-xl shadow-slate-200/40 border border-white dark:border-slate-800 flex justify-between">
           <div className="text-center flex-1">
             <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">应发总计</p>
             <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">¥{formatAmount(totalIncentives)}</p>
           </div>
           <div className="w-px h-8 bg-slate-50 dark:bg-slate-800 self-center"></div>
           <div className="text-center flex-1">
             <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">应扣总计</p>
             <p className="text-lg font-black text-rose-500 tabular-nums">¥{formatAmount(totalDeductions)}</p>
           </div>
        </div>

        {/* 薪资构成明细 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">薪资构成明细 Breakdown</h3>
             <span className="text-[10px] text-slate-300 font-bold italic">数据生成于: 2023-12-05</span>
          </div>

          <div className="space-y-3">
            {/* 1. 固定收入与补贴 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm">
               <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">固定薪酬与补贴</h4>
               </div>
               <div className="space-y-4">
                  <SalaryRow label="月度基本薪资" value={mockSalary.basePay} isPrivacy={isPrivacyMode} />
                  {mockSalary.subsidies.map((s, i) => (
                    <SalaryRow key={i} label={s.name} value={s.amount} isPrivacy={isPrivacyMode} />
                  ))}
               </div>
            </div>

            {/* 2. 激励奖金 (包含奖惩中的奖励) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm">
               <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                     <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">激励与专项奖励</h4>
                  </div>
                  <button 
                    onClick={() => navigateTo(PageType.MY_REWARDS_PUNISHMENTS)}
                    className="text-[10px] font-black text-primary flex items-center gap-0.5"
                  >
                    查看明细 <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                  </button>
               </div>
               <div className="space-y-4">
                  <SalaryRow label="安装项目提成累计" value={mockSalary.commission} isPrivacy={isPrivacyMode} isPrimary />
                  <SalaryRow label="月度绩效奖金" value={mockSalary.performance} isPrivacy={isPrivacyMode} />
                  {mockSalary.rewards.map((r, i) => (
                    <SalaryRow key={i} label={r.name} value={r.amount} isPrivacy={isPrivacyMode} isReward />
                  ))}
               </div>
            </div>

            {/* 3. 应扣项目 (包含奖惩中的处罚) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm">
               <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">应扣款项</h4>
               </div>
               <div className="space-y-4">
                  {mockSalary.deductions.map((d, i) => (
                    <SalaryRow key={i} label={d.name} value={d.amount} isPrivacy={isPrivacyMode} isNegative />
                  ))}
                  {mockSalary.punishments.map((p, i) => (
                    <SalaryRow key={i} label={p.name} value={p.amount} isPrivacy={isPrivacyMode} isNegative />
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* 底部备注 */}
        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-[2rem] border border-indigo-100/50">
           <div className="flex gap-3">
              <span className="material-symbols-outlined text-indigo-500 !text-xl">info</span>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold leading-relaxed">
                备注：实发工资已包含本月所有奖惩明细。如有任何疑问，请在确认薪资前联系财务部（分机：808）进行复核。
              </p>
           </div>
        </div>
      </div>

      {/* 底部确认按钮栏 */}
      {!isConfirmed && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 safe-area-bottom pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
           <button 
             onClick={handleConfirm}
             className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
           >
             <span className="material-symbols-outlined !text-xl">draw</span>
             <span className="text-lg">确认核算无误并签收</span>
           </button>
        </div>
      )}

      {isConfirmed && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 z-50 safe-area-bottom pb-8 text-center pointer-events-none">
           <div className="bg-emerald-500 text-white font-black py-3 px-6 rounded-full inline-flex items-center gap-2 shadow-2xl animate-slideUp">
             <span className="material-symbols-outlined !text-xl">verified</span>
             电子签单已回传财务系统
           </div>
        </div>
      )}
    </div>
  );
};

const SalaryRow = ({ label, value, isPrivacy, isNegative, isPrimary, isReward }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400">{label}</span>
    <span className={`text-[15px] font-black tabular-nums tracking-tight ${
      isNegative ? 'text-rose-500' : 
      isReward ? 'text-emerald-500' :
      isPrimary ? 'text-primary' : 
      'text-slate-900 dark:text-white'
    }`}>
      {isNegative ? '-' : isReward ? '+' : ''} ¥{isPrivacy ? '****' : value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  </div>
);

export default SalarySlip;