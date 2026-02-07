
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

interface WorkRecord {
  date: string;
  day: string;
  hours: string | number;
  project?: string;
  timeRange?: string;
  content?: string;
  rest: boolean;
}

const WorkHourStats: React.FC<Props> = ({ navigateTo }) => {
  // 模拟按月份组织的报工数据
  const monthlyData: Record<string, WorkRecord[]> = {
    '2023-08': [
      { date: '08-15', day: '周二', hours: 8, project: '户外大屏亮化工程', timeRange: '08:00 - 17:00', content: '模组更换与布线调试。', rest: false },
      { date: '08-14', day: '周一', hours: 9, project: '地铁导向牌安装', timeRange: '09:00 - 19:00', content: '2号线站厅层导向牌吊装。', rest: false },
      { date: '08-13', day: '周日', hours: '休息', rest: true },
    ],
    '2023-09': [
      { date: '09-20', day: '周三', hours: 10, project: '写字楼亮化维护', timeRange: '08:00 - 19:00', content: '高空吊绳作业，检查电源适配器。', rest: false },
      { date: '09-19', day: '周二', hours: 8, project: '连锁店门头更换', timeRange: '08:30 - 17:30', content: '拆除旧标识，安装新LOGO。', rest: false },
      { date: '09-18', day: '周一', hours: '休息', rest: true },
    ],
    '2023-10': [
      { date: '10-24', day: '周二', hours: 10, project: '万达广场广告牌更换项目', timeRange: '07:00 - 18:00 (含午休1h)', content: '主要负责北侧广场主广告牌的旧画布拆除及新喷绘安装。', rest: false },
      { date: '10-23', day: '周一', hours: 8, project: '龙湖天街外墙发光字安装', timeRange: '08:00 - 17:00 (含午休1h)', content: '完成发光模组测试及支架加固，处理了强电接口问题。', rest: false },
      { date: '10-22', day: '周日', hours: '休息', rest: true },
      { date: '10-21', day: '周六', hours: 6, project: '临时物料搭建', timeRange: '13:00 - 19:00', content: '配合活动现场桁架搭建。', rest: false },
    ],
    '2023-11': [
      { date: '11-05', day: '周日', hours: '休息', rest: true },
      { date: '11-04', day: '周六', hours: 8, project: '园区标识标牌', timeRange: '08:00 - 17:00', content: '园区指引牌地基开挖。', rest: false },
    ],
    '2023-12': [
      { date: '12-01', day: '周五', hours: 8, project: '年终展会布展', timeRange: '08:00 - 17:00', content: '展位背景板安装。', rest: false },
    ],
  };

  const months = [
    { key: '2023-08', year: '2023', name: '8月' },
    { key: '2023-09', year: '2023', name: '9月' },
    { key: '2023-10', year: '2023', name: '10月' },
    { key: '2023-11', year: '2023', name: '11月' },
    { key: '2023-12', year: '2023', name: '12月' },
  ];

  const [selectedMonthKey, setSelectedMonthKey] = useState('2023-10');

  // 过滤当前选中月份的记录
  const currentRecords = useMemo(() => {
    return monthlyData[selectedMonthKey] || [];
  }, [selectedMonthKey]);

  // 实时统计：累计工时
  const totalHours = useMemo(() => {
    return currentRecords.reduce((acc, curr) => {
      if (typeof curr.hours === 'number') return acc + curr.hours;
      return acc;
    }, 0);
  }, [currentRecords]);

  // 实时统计：出勤天数（非休息的天数）
  const attendanceDays = useMemo(() => {
    return currentRecords.filter(r => !r.rest).length;
  }, [currentRecords]);

  return (
    <div className="animate-fadeIn bg-[#f6f7f8] dark:bg-background-dark min-h-screen pb-44 font-sans no-scrollbar">
      {/* 顶部标题栏 */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
        <div 
          onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
          className="flex size-10 shrink-0 items-center justify-start cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">chevron_left</span>
        </div>
        <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">工时统计明细列表</h2>
        <div className="size-10"></div>
      </div>

      {/* 月份选择器轴 */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 sticky top-[57px] z-20 border-b border-slate-50 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between gap-2 min-w-max px-2">
          {months.map((m) => (
            <div 
              key={m.key}
              onClick={() => setSelectedMonthKey(m.key)}
              className={`flex flex-col items-center px-5 py-2 shrink-0 transition-all cursor-pointer ${
                selectedMonthKey === m.key 
                  ? 'border-b-2 border-primary bg-primary/5 rounded-t-lg' 
                  : 'text-slate-400 active:scale-95'
              }`}
            >
              <span className={`text-[10px] font-bold ${selectedMonthKey === m.key ? 'text-primary' : 'text-slate-400'}`}>{m.year}</span>
              <span className={`text-sm font-bold ${selectedMonthKey === m.key ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 报工列表 */}
      <div className="p-4 flex flex-col gap-4 min-h-[40vh]">
        {currentRecords.length > 0 ? (
          currentRecords.map((record, idx) => (
            <div 
              key={idx}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 transition-all animate-slideUp ${
                record.rest ? 'opacity-70 grayscale-[0.5]' : ''
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#0d141b] dark:text-white tracking-tighter">{record.date}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg font-bold">{record.day}</span>
                </div>
                <div className={`font-black text-lg ${record.rest ? 'text-slate-300 italic' : 'text-primary'}`}>
                  {record.rest ? '休息' : `${record.hours}h`}
                </div>
              </div>

              {!record.rest ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-400 !text-lg">business_center</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5">{record.project}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-400 !text-lg">schedule</span>
                    </div>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{record.timeRange}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl mt-2 border border-slate-100 dark:border-slate-800/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">工作内容</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {record.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-300 italic py-2">
                  <span className="material-symbols-outlined !text-xl">event_busy</span>
                  <p className="text-sm font-medium">今日无报工记录</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <span className="material-symbols-outlined !text-6xl mb-4">history_toggle_off</span>
            <p className="text-sm font-bold">该月份暂无报工记录</p>
          </div>
        )}
      </div>

      {/* 底部悬浮汇总卡片 - 实时统计数据 */}
      <div className="fixed bottom-[84px] left-6 right-6 z-40">
        <div className="bg-[#0f172a] shadow-2xl shadow-blue-900/20 rounded-[1.75rem] py-3.5 px-6 flex items-center justify-between text-white relative overflow-hidden border border-white/10 transition-all active:scale-[0.98]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-50"></div>
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="size-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white !text-xl filled-icon">query_stats</span>
            </div>
            <div>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.15em] mb-0.5">累计工时</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black tabular-nums tracking-tighter transition-all duration-300">{totalHours}</span>
                <span className="text-[10px] text-white/40 font-bold">h</span>
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="text-right relative z-10">
            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.15em] mb-0.5">出勤天数</p>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-black tabular-nums tracking-tighter transition-all duration-300">{attendanceDays}</span>
              <span className="text-[10px] text-white/40 font-bold">天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkHourStats;
