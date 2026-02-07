
import React, { useState, useEffect } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  status?: 'success' | 'error'; // 模拟支持传入状态
}

const SuccessFeedback: React.FC<Props> = ({ navigateTo, status = 'success' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center font-display">
      {/* 顶部简洁导航 */}
      <div className="w-full flex items-center justify-between px-4 py-3 h-14 border-b border-gray-50 dark:border-gray-800">
        <span 
          onClick={() => navigateTo(PageType.HOME)} 
          className="material-symbols-outlined cursor-pointer text-gray-400 hover:text-gray-900 transition-colors"
        >
          close
        </span>
        <h1 className="text-base font-bold dark:text-white">操作反馈</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 w-full pb-20">
        {/* 动态图标区域 */}
        <div className={`mb-8 transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className={`size-28 rounded-full flex items-center justify-center shadow-2xl ${
            isSuccess 
              ? 'bg-emerald-50 text-emerald-500 shadow-emerald-100 dark:bg-emerald-500/10 dark:shadow-none' 
              : 'bg-red-50 text-red-500 shadow-red-100 dark:bg-red-500/10 dark:shadow-none'
          }`}>
            <span className="material-symbols-outlined !text-[80px] filled-icon">
              {isSuccess ? 'check_circle' : 'cancel'}
            </span>
          </div>
        </div>

        {/* 动态文本区域 */}
        <div className={`text-center space-y-3 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSuccess ? '提交成功' : '提交失败'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
            {isSuccess 
              ? '您的申请已成功提交至审批系统，请耐心等待管理员审核。' 
              : '很抱歉，由于网络连接波动或系统校验未通过，您的申请未能成功提交。'}
          </p>
        </div>

        {/* 失败时的错误信息提示（可选） */}
        {!isSuccess && (
          <div className={`mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl w-full border border-gray-100 dark:border-slate-700 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-sm text-gray-400">info</span>
              <p className="text-[11px] text-gray-400 leading-tight">错误代码：ERR_VALIDATION_004<br/>建议检查表单必填项是否填写完整后重试。</p>
            </div>
          </div>
        )}

        {/* 底部按钮路径 */}
        <div className={`w-full mt-16 space-y-4 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button 
            onClick={() => navigateTo(PageType.HOME)}
            className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.97] ${
              isSuccess 
                ? 'bg-primary text-white shadow-primary/20' 
                : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            }`}
          >
            {isSuccess ? '返回首页' : '重新提交'}
          </button>
          
          <button 
            onClick={() => navigateTo(isSuccess ? PageType.APPROVAL_MY_INITIATED : PageType.HOME)}
            className="w-full h-14 border-2 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold text-base active:scale-[0.97] transition-all bg-white dark:bg-transparent"
          >
            {isSuccess ? '查看申请记录' : '取消并返回'}
          </button>
        </div>
      </div>
      
      {/* 底部装饰安全区 */}
      <div className="h-6 safe-area-bottom"></div>
    </div>
  );
};

export default SuccessFeedback;
