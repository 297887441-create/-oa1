
import React, { useState } from 'react';
import { PageType } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
}

type RoleLevel = '学徒匠' | '熟手匠' | '精工匠' | '资深匠';

interface FeedbackRecord {
  id: string;
  name: string;
  role: RoleLevel;
  time: string;
  duration: string;
  taskType: string;
  content: string;
  images: string[];
  avatarInitial: string;
}

const ProjectDetail: React.FC<Props> = ({ navigateTo }) => {
  // 项目反馈详情状态
  const [expandedIds, setExpandedIds] = useState<string[]>(['1']);
  const [showHistory, setShowHistory] = useState(false);

  // 施工要求编辑相关状态
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([
    "需配合商场夜间闭店后进行施工（22:00后）。",
    "旧招牌拆卸时需注意保护墙面大理石，避免损坏。",
    "新灯箱需确保电源线隐藏，接头需做防水绝缘处理。"
  ]);
  const [tempRequirements, setTempRequirements] = useState<string[]>([]);

  // 进入编辑模式
  const handleStartEdit = () => {
    setTempRequirements([...requirements]);
    setIsEditingRequirements(true);
  };

  // 保存编辑
  const handleSaveRequirements = () => {
    setRequirements(tempRequirements.filter(req => req.trim() !== ''));
    setIsEditingRequirements(false);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditingRequirements(false);
  };

  // 修改单条要求
  const handleUpdateReq = (index: number, value: string) => {
    const newReqs = [...tempRequirements];
    newReqs[index] = value;
    setTempRequirements(newReqs);
  };

  // 删除单条要求
  const handleRemoveReq = (index: number) => {
    const newReqs = tempRequirements.filter((_, i) => i !== index);
    setTempRequirements(newReqs);
  };

  // 添加新要求
  const handleAddReq = () => {
    setTempRequirements([...tempRequirements, '']);
  };

  // 等级配色方案
  const levelStyles: Record<RoleLevel, { bg: string; text: string; border: string; tagBg: string }> = {
    '学徒匠': { 
      bg: 'bg-slate-50 dark:bg-slate-900/40', 
      text: 'text-slate-500', 
      border: 'border-slate-100 dark:border-slate-800', 
      tagBg: 'bg-slate-100 text-slate-500' 
    },
    '熟手匠': { 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      text: 'text-blue-600', 
      border: 'border-blue-100 dark:border-blue-800', 
      tagBg: 'bg-blue-100 text-blue-600' 
    },
    '精工匠': { 
      bg: 'bg-indigo-50 dark:bg-indigo-900/20', 
      text: 'text-indigo-600', 
      border: 'border-indigo-100 dark:border-indigo-800', 
      tagBg: 'bg-indigo-600 text-white' 
    },
    '资深匠': { 
      bg: 'bg-orange-50 dark:bg-orange-900/20', 
      text: 'text-orange-600', 
      border: 'border-orange-100 dark:border-orange-800', 
      tagBg: 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
    }
  };

  const initialFeedbacks: FeedbackRecord[] = [
    {
      id: '1',
      name: '张师傅',
      role: '资深匠',
      time: '2023-10-24 22:30',
      duration: '4.5 小时',
      taskType: '拆卸与布线',
      content: '已完成旧招牌拆卸，墙面大理石无受损。发现原电源线老化，已按要求更换新线并做好防水。',
      images: ['https://picsum.photos/400/400?random=10', 'https://picsum.photos/400/400?random=11'],
      avatarInitial: '张'
    },
    {
      id: '2',
      name: '李师傅',
      role: '精工匠',
      time: '2023-10-24 23:15',
      duration: '3.0 小时',
      taskType: '辅助安装',
      content: '协助张师傅进行主梁加固，并清理了现场施工垃圾，确保商场地面整洁。',
      images: ['https://picsum.photos/400/400?random=12'],
      avatarInitial: '李'
    }
  ];

  const historyFeedbacks: FeedbackRecord[] = [
    {
      id: '3',
      name: '王师傅',
      role: '熟手匠',
      time: '2023-10-23 21:00',
      duration: '2.5 小时',
      taskType: '现场测量',
      content: '对广告位进行了二次复核，确认了电源接入点的具体位置，已向物业报备。',
      images: ['https://picsum.photos/400/400?random=13'],
      avatarInitial: '王'
    },
    {
      id: '4',
      name: '赵小哥',
      role: '学徒匠',
      time: '2023-10-22 14:30',
      duration: '1.5 小时',
      taskType: '材料进场',
      content: '协助物流卸货并清点材料数量，确认物料无缺失和损坏。',
      images: ['https://picsum.photos/400/400?random=14'],
      avatarInitial: '赵'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const allFeedbacks = showHistory ? [...initialFeedbacks, ...historyFeedbacks] : initialFeedbacks;

  return (
    <div className="animate-fadeIn bg-[#f6f7f8] dark:bg-background-dark min-h-screen pb-32 font-sans overflow-x-hidden">
      {/* 顶部标题栏 */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-4 justify-between sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
        <div 
          onClick={() => navigateTo(PageType.INSTALLER_WORKBENCH)}
          className="flex size-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 active:bg-slate-100 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary font-bold">arrow_back_ios_new</span>
        </div>
        <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight flex-1 text-center">项目详细</h2>
        <div className="flex size-10 items-center justify-end">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">more_horiz</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* 项目概览卡片 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/5 rounded-full"></div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex justify-between items-start">
              <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-1 rounded-full font-bold">AZ-20231024-01</span>
              <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/20 text-xs px-2.5 py-1 rounded-full font-bold">进行中</span>
            </div>
            <h1 className="text-xl font-bold text-[#0d141b] dark:text-white">万达广场广告牌更换项目</h1>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">项目金额</span>
              <span className="text-primary text-2xl font-black">¥1,200.00</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-50 dark:border-slate-700">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">起止日期</span>
                <span className="text-[#0d141b] dark:text-slate-200 text-sm font-bold">2023.11.01 - 11.05</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">预计工时</span>
                <span className="text-[#0d141b] dark:text-slate-200 text-sm font-bold">8.5 小时</span>
              </div>
            </div>
          </div>
        </div>

        {/* 客户及位置 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary !text-xl filled-icon">contact_phone</span>
            <h3 className="font-bold text-base text-[#0d141b] dark:text-white tracking-tight">客户及位置</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600">
                  <span className="material-symbols-outlined text-slate-400">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d141b] dark:text-white">王经理</p>
                  <p className="text-[11px] text-slate-500 font-medium">现场负责人</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-emerald-100 dark:border-emerald-800">
                  <span className="material-symbols-outlined text-emerald-600 text-xl filled-icon">phone</span>
                </div>
                <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-blue-100 dark:border-blue-800">
                  <span className="material-symbols-outlined text-primary text-xl filled-icon">chat</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-4 border-t border-slate-50 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 mt-0.5 !text-xl">location_on</span>
              <div className="flex-1">
                <p className="text-[13px] text-[#0d141b] dark:text-slate-200 leading-relaxed font-medium">上海市杨浦区五角场街道国宾路58号万达广场C区3楼东侧</p>
              </div>
              <button className="bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-lg text-primary text-xs font-bold active:scale-95 transition-all">导航</button>
            </div>
          </div>
        </div>

        {/* 施工要求 - 支持在线编辑 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary !text-xl filled-icon">engineering</span>
              <h3 className="font-bold text-base text-[#0d141b] dark:text-white tracking-tight">施工要求</h3>
            </div>
            {!isEditingRequirements && (
              <button 
                onClick={handleStartEdit}
                className="size-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 active:text-primary active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined !text-lg">edit_note</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {isEditingRequirements ? (
              <div className="animate-fadeIn space-y-3">
                {tempRequirements.map((text, idx) => (
                  <div key={idx} className="flex gap-2 items-start group">
                    <span className="text-primary text-xs mt-3 shrink-0">•</span>
                    <div className="flex-1 relative">
                      <textarea
                        value={text}
                        onChange={(e) => handleUpdateReq(idx, e.target.value)}
                        placeholder="请输入施工要求..."
                        rows={1}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveReq(idx)}
                      className="mt-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined !text-lg">do_not_disturb_on</span>
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-4 mt-4">
                  <button 
                    onClick={handleAddReq}
                    className="w-full py-2 border border-dashed border-primary/30 rounded-xl text-primary text-xs font-bold flex items-center justify-center gap-1 active:bg-primary/5"
                  >
                    <span className="material-symbols-outlined !text-sm">add_circle</span>
                    添加新要求
                  </button>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-bold active:bg-slate-100"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveRequirements}
                      className="flex-[2] py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:opacity-90"
                    >
                      完成并保存
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 transition-all">
                {requirements.map((text, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-primary text-xs mt-1.5">•</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar pb-1">
            <div className="size-20 rounded-xl bg-cover bg-center shrink-0 border border-slate-100 shadow-sm" style={{ backgroundImage: 'url("https://picsum.photos/400/400?random=1")' }}></div>
            <div className="size-20 rounded-xl bg-slate-50 dark:bg-slate-700 flex flex-col items-center justify-center shrink-0 border-2 border-dashed border-slate-200 dark:border-slate-600 active:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-slate-400">add_a_photo</span>
              <span className="text-[9px] text-slate-400 mt-1 font-bold">上传现场</span>
            </div>
          </div>
        </div>

        {/* 项目反馈详情 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary !text-xl filled-icon">history_edu</span>
              <h3 className="font-bold text-base text-[#0d141b] dark:text-white tracking-tight">项目反馈详情</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">共 {allFeedbacks.length} 条报工</span>
          </div>
          
          <div className="space-y-4">
            {allFeedbacks.map((fb) => {
              const isExpanded = expandedIds.includes(fb.id);
              const style = levelStyles[fb.role];
              return (
                <div 
                  key={fb.id}
                  className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <div 
                    onClick={() => toggleExpand(fb.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-slate-700/50 transition-colors ${
                      isExpanded ? 'bg-slate-50/80 dark:bg-slate-700/50' : 'bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center font-black text-sm border transition-colors ${style.bg} ${style.text} ${style.border}`}>
                        {fb.avatarInitial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#0d141b] dark:text-white tracking-tight">{fb.name}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase shadow-sm ${style.tagBg}`}>
                            {fb.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{fb.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isExpanded && <span className="text-xs font-black text-slate-500 tabular-nums">{fb.duration}</span>}
                      <span className={`material-symbols-outlined text-slate-400 text-xl transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
                        expand_less
                      </span>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">报工时长</span>
                          <span className={`text-sm font-black ${style.text}`}>{fb.duration}</span>
                        </div>
                        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">任务类型</span>
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{fb.taskType}</span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {fb.content}
                      </div>
                      <div className="flex gap-3">
                        {fb.images.map((img, i) => (
                          <div 
                            key={i}
                            className="size-16 rounded-xl bg-cover bg-center border border-slate-100 shadow-sm active:scale-105 transition-transform" 
                            style={{ backgroundImage: `url("${img}")` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`w-full mt-6 py-3 border border-dashed rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all ${
              showHistory 
                ? 'bg-slate-100 text-slate-500 border-slate-300' 
                : 'bg-white text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`material-symbols-outlined !text-base transition-transform ${showHistory ? 'rotate-180 text-primary' : ''}`}>
              history
            </span>
            {showHistory ? '收起历史反馈' : '查看更多历史反馈'}
          </button>
        </div>
      </div>

      {/* 底部浮动按钮 (FAB) */}
      <button 
        onClick={() => navigateTo(PageType.PROJECT_REPORT)}
        className="fixed bottom-[96px] right-6 size-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-white dark:border-slate-900 active:scale-90 transition-all z-50"
      >
        <span className="material-symbols-outlined !text-3xl font-light">add</span>
      </button>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center py-2 pb-6 z-40 h-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigateTo(PageType.MESSAGE)} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined !text-2xl">chat_bubble</span>
          <span className="text-[11px] font-bold">消息</span>
        </button>
        <button onClick={() => navigateTo(PageType.HOME)} className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined !text-2xl filled-icon">home</span>
          <span className="text-[11px] font-bold">首页</span>
        </button>
        <button onClick={() => navigateTo(PageType.MINE)} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined !text-2xl">account_circle</span>
          <span className="text-[11px] font-bold">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default ProjectDetail;
