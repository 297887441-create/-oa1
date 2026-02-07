
import React, { useState } from 'react';
import { PageType, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  onAddApproval: (item: ApprovalItem) => void;
}

const LeaveRequestForm: React.FC<Props> = ({ navigateTo, onAddApproval }) => {
  const [formData, setFormData] = useState({
    type: '事假',
    startTime: '',
    endTime: '',
    reason: ''
  });

  const handleSubmit = () => {
    if (!formData.reason) {
      alert('请填写请假事由');
      return;
    }

    const newItem: ApprovalItem = {
      id: `LV-${Date.now()}`,
      user: '我自己',
      dept: '行政部',
      type: '请假申请',
      amount: '2.0 天', // 简化处理，实际应根据时间计算
      date: new Date().toLocaleDateString(),
      detail: `${formData.type}: ${formData.reason}`,
      icon: 'calendar_month',
      color: 'bg-indigo-500',
      route: PageType.LEAVE_REQUEST_DETAIL,
      status: 'pending'
    };

    onAddApproval(newItem);
    navigateTo(PageType.SUCCESS_FEEDBACK);
  };

  return (
    <div className="animate-slideIn bg-[#f2f3f5] min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 flex items-center bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex size-10 items-center">
          <span 
            onClick={() => navigateTo(PageType.APPROVAL_CENTER)} 
            className="material-symbols-outlined text-gray-700 cursor-pointer"
          >
            arrow_back_ios
          </span>
        </div>
        <h2 className="text-lg font-semibold flex-1 text-center">请假申请</h2>
        <div className="size-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-48">
        <div className="mt-3 space-y-px">
          <div className="flex items-center bg-white px-4 min-h-14 justify-between border-b border-gray-50">
            <p className="text-gray-800 font-normal">请假类型</p>
            <div className="flex items-center gap-1">
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="border-none bg-transparent text-slate-900 font-bold text-base focus:ring-0 text-right pr-2 appearance-none"
              >
                <option>事假</option>
                <option>病假</option>
                <option>年假</option>
              </select>
              <span className="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 min-h-14 justify-between border-b border-gray-50">
            <p className="text-gray-800 font-normal">开始时间</p>
            <div className="flex items-center gap-1">
              <input 
                type="datetime-local" 
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="border-none bg-transparent text-slate-900 font-bold text-base focus:ring-0 text-right p-0" 
              />
              <span className="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 min-h-14 justify-between border-b border-gray-50">
            <p className="text-gray-800 font-normal">结束时间</p>
            <div className="flex items-center gap-1">
              <input 
                type="datetime-local" 
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="border-none bg-transparent text-slate-900 font-bold text-base focus:ring-0 text-right p-0" 
              />
              <span className="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-4 mt-2">
          <p className="text-gray-800 text-base font-normal mb-2">请假事由 <span className="text-red-500">*</span></p>
          <textarea 
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full min-h-[120px] border-none p-0 focus:ring-0 text-base text-gray-500 bg-transparent placeholder-gray-300 resize-none leading-relaxed" 
            placeholder="请输入请假事由"
          ></textarea>
        </div>

        <div className="bg-white px-4 py-6 mt-2">
          <p className="text-gray-800 text-base font-medium mb-8">审批流程</p>
          <div className="flex items-center gap-6 px-2 overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="size-11 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold relative">
                本人
              </div>
              <span className="text-[11px] text-gray-500 mt-1">申请人</span>
            </div>
            <span className="material-symbols-outlined text-gray-200">arrow_forward</span>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="size-11 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
                <span className="material-symbols-outlined text-gray-400">person</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1">部门经理</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all text-base"
        >
          提交申请
        </button>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
