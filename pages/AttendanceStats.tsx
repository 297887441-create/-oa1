
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

interface DailyAttendance {
  date: number;
  status: 'normal' | 'abnormal' | 'leave' | 'rest';
  inTime?: string;
  inLocation?: string;
  outTime?: string;
  outLocation?: string;
}

const AttendanceStats: React.FC<Props> = ({ navigateTo }) => {
  const [selectedMonth, setSelectedMonth] = useState('2023-11');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  // 模拟当月考勤数据
  const attendanceData: Record<number, DailyAttendance> = {
    1: { date: 1, status: 'normal', inTime: '08:45', inLocation: '杨浦万达', outTime: '18:15', outLocation: '杨浦万达' },
    2: { date: 2, status: 'normal', inTime: '08:50', inLocation: '公司本部', outTime: '18:05', outLocation: '公司本部' },
    3: { date: 3, status: 'abnormal', inTime: '09:45', inLocation: '静安大悦城', outTime: '18:30', outLocation: '静安大悦城' },
    4: { date: 4, status: 'rest' },
    5: { date: 5, status: 'rest' },
    6: { date: 6, status: 'leave' },
    15: { date: 15, status: 'normal', inTime: '08:30', inLocation: '虹桥T2', outTime: '19:00', outLocation: '虹桥T2' },
    20: { date: 20, status: 'normal', inTime: '08:55', inLocation: '徐家汇港汇', outTime: '18:10', outLocation: '徐家汇港汇' },
  };

  const daysInMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(attendanceData[i] || { date: i, status: 'normal', inTime: '08:50', outTime: '18:10' });
    }
    return days;
  }, [daysInMonth]);

  const stats = useMemo(() => ({
    worked: 21,
    abnormal: 2,
    leave: 1,
    absent: 0
  }), []);

  const selectedDetail = attendanceData[selectedDay] || { date: selectedDay, status: 'normal', inTime: '08:50', inLocation: '预设打卡点', outTime: '18:10', outLocation: '预设打卡点' };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-20 font-sans selection:bg-primary/20 no-scrollbar">
      
      <div className="bg-[#101922] pt-10 pb-16 px-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <h2 className="text-white text-lg font-bold tracking-tight">我的考勤中心</h2>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer">
              <span className="text-white text-xs font-black tabular-nums">{selectedMonth.replace('-', '年')}月</span>
              <span className="material-symbols-outlined text-white/40 !text-base">calendar_month</span>
            </div>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-2">
           {[
             { label: '出勤(天)', value: stats.worked, color: 'text-white' },
             { label: '异常打卡', value: stats.abnormal, color: 'text-amber-400' },
             { label: '请假(天)', value: stats.leave, color: 'text-blue-400' },
             { label: '缺卡/旷工', value: stats.absent, color: 'text-rose-400' },
           ].map((s, idx) => (
             <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
                <p className={`text-[18px] font-black tabular-nums leading-none mb-1.5 ${s.color}`}>{s.value}</p>
                <p className="text-[8px] text-white/30 font-black uppercase tracking-widest text-center whitespace-nowrap">{s.label}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 shadow-xl shadow-slate-200/40 dark:shadow-none border border-white dark:border-slate-800">
           <div className="grid grid-cols-7 gap-1 mb-6">
              {['日', '一', '二', '三', '四', '五', '六'].map(w => (
                <div key={w} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{w}</div>
              ))}
           </div>
           
           <div className="grid grid-cols-7 gap-y-4">
              {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}
              
              {calendarDays.map((day) => (
                <div 
                  key={day.date} 
                  onClick={() => setSelectedDay(day.date)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                   <div className={`size-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                     selectedDay === day.date 
                       ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                       : 'text-slate-800 dark:text-slate-200 active:bg-slate-50'
                   }`}>
                      {day.date}
                   </div>
                   <div className="flex gap-0.5 h-1">
                      {day.status === 'normal' && <div className="size-1 rounded-full bg-emerald-400"></div>}
                      {day.status === 'abnormal' && <div className="size-1 rounded-full bg-amber-400"></div>}
                      {day.status === 'leave' && <div className="size-1 rounded-full bg-blue-400"></div>}
                      {day.status === 'rest' && <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-5">
        <div className="flex items-center justify-between px-1">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-primary rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">{selectedDay}日 轨迹详情</h3>
           </div>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Punch-in Trace</span>
        </div>

        {selectedDetail.status === 'rest' ? (
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all">
             <div className="size-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-inner mb-4">
                <span className="material-symbols-outlined !text-3xl text-slate-300">event_busy</span>
             </div>
             <p className="text-xs font-black text-slate-400 tracking-widest uppercase italic">Relax / 今日休息</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-white dark:border-slate-800 shadow-sm flex items-start gap-5 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
               <div className="flex flex-col items-center shrink-0">
                  <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-2xl filled-icon">login</span>
                  </div>
                  <div className="w-0.5 h-10 bg-slate-50 dark:bg-slate-800 my-1"></div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Start / 上班打卡</p>
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{selectedDetail.inTime}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {selectedDetail.inLocation || '自动校验位置中...'}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                     <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded shadow-sm border border-emerald-100/50 uppercase">Normal OK</span>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-white dark:border-slate-800 shadow-sm flex items-start gap-5 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-400/20"></div>
               <div className="flex flex-col items-center shrink-0">
                  <div className="size-11 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-2xl filled-icon">logout</span>
                  </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End / 下班打卡</p>
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{selectedDetail.outTime || '--:--'}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {selectedDetail.outLocation || (selectedDetail.outTime ? '现场施工打卡完成' : '暂无下班记录')}
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 px-6">
         <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-[2rem] flex gap-4 border border-indigo-100/50">
            <div className="size-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
               <span className="material-symbols-outlined !text-xl filled-icon">lightbulb</span>
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold leading-relaxed">
              管理员提示：若发现定位不准或漏打卡，请在 24 小时内向行政部发起“考勤补登记”申请，避免影响提成核算。
            </p>
         </div>
      </div>

    </div>
  );
};

export default AttendanceStats;
