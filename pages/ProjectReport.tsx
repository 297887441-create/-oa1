
import React, { useState } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

const ProjectReport: React.FC<Props> = ({ navigateTo }) => {
  const [hours, setHours] = useState(10);

  return (
    <div className="animate-slideIn">
      <div className="bg-white dark:bg-slate-900 p-4 sticky top-0 z-30 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)} className="material-symbols-outlined">chevron_left</button>
        <h2 className="font-bold text-lg">项目报工</h2>
        <span className="material-symbols-outlined">more_horiz</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Project Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">项目信息</label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
            <p className="font-bold text-base">万达广场广告牌更换项目</p>
            <p className="text-slate-400 text-xs mt-1"># AZ-20231024-01</p>
          </div>
        </div>

        {/* Task Type */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold mb-3">任务类型</label>
          <select className="w-full h-12 rounded-lg bg-slate-50 border-slate-200 px-4 text-sm focus:ring-primary focus:border-primary">
            <option>安装</option>
            <option>测量</option>
            <option>维修</option>
          </select>
        </div>

        {/* Reporting Date */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
          <label className="text-sm font-bold">报工日期</label>
          <input type="date" value="2023-10-24" className="border-none text-primary font-bold p-0 focus:ring-0 text-right" />
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold mb-3">详细描述</label>
          <textarea 
            className="w-full bg-slate-50 rounded-lg border-slate-200 p-3 text-sm focus:ring-primary focus:border-primary" 
            placeholder="请详细描述今日工作内容..."
            rows={4}
          />
        </div>

        {/* Time Tracking */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold mb-3">起止时间</label>
          <div className="flex items-center justify-between border-b border-slate-50 py-2">
            <span className="text-slate-500 text-sm">起止范围</span>
            <div className="flex items-center gap-2">
              <input type="time" defaultValue="07:00" className="border-none text-primary font-bold p-0 focus:ring-0" />
              <span className="text-slate-300">至</span>
              <input type="time" defaultValue="18:00" className="border-none text-primary font-bold p-0 focus:ring-0" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-slate-500 text-sm">计算工时</span>
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold text-xl">{hours}</span>
              <span className="text-slate-400 text-sm">h</span>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-bold">现场拍照</label>
            <span className="text-xs text-slate-400">最多支持9张</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-primary cursor-pointer">
              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              <span className="text-[10px] mt-1 text-slate-400">上传图片</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40">
        <button 
          onClick={() => navigateTo(PageType.SUCCESS_FEEDBACK)}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">task_alt</span> 确认并提交报工
        </button>
      </div>
    </div>
  );
};

export default ProjectReport;
