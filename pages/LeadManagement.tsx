
import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import { EnhancedLead, EnhancedOpportunity, FollowUpRecord } from '../App';

interface Props {
  navigateTo: (page: PageType) => void;
  leads: EnhancedLead[];
  setLeads: React.Dispatch<React.SetStateAction<EnhancedLead[]>>;
  opportunities: EnhancedOpportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<EnhancedOpportunity[]>>;
}

const LeadManagement: React.FC<Props> = ({ navigateTo, leads, setLeads, opportunities, setOpportunities }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'discovery' | 'contacted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState<string | null>(null);
  
  // 商机流转表单状态
  const [showConvertModal, setShowConvertModal] = useState<EnhancedLead | null>(null);
  const [convertForm, setConvertForm] = useState({
    customer: '',
    contact: '',
    phone: '',
    amount: '',
    memo: ''
  });

  // 记踩点表单状态
  const [followUpContent, setFollowUpContent] = useState('');
  const [nextVisitTime, setNextVisitTime] = useState('');

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchTab = activeTab === 'all' || lead.status === activeTab;
      const matchSearch = lead.address.includes(searchQuery) || lead.locationName.includes(searchQuery);
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery, leads]);

  const handleSaveFollowUp = () => {
    if (!followUpContent.trim()) return;

    const leadId = showFollowUpModal;
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newRecord: FollowUpRecord = {
      id: Date.now().toString(),
      time: timeStr,
      content: followUpContent,
      result: nextVisitTime ? '已预约下次拜访' : '已完成本次现场查看'
    };

    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          nextVisit: nextVisitTime || lead.nextVisit,
          history: [newRecord, ...lead.history]
        };
      }
      return lead;
    }));

    setFollowUpContent('');
    setNextVisitTime('');
    setShowFollowUpModal(null);
  };

  // 处理标记为无效信息
  const handleMarkInvalid = (id: string) => {
    if (window.confirm('确定要将该线索标记为无效吗？标记后线索将从列表中移除。')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  // 处理转化商机
  const handleStartConvert = (lead: EnhancedLead) => {
    setConvertForm({
      customer: lead.locationName,
      contact: lead.contactName || '',
      phone: lead.phone || '',
      amount: '',
      memo: lead.desc
    });
    setShowConvertModal(lead);
  };

  const confirmConvert = () => {
    if (!convertForm.amount) {
      alert('请填写预估金额');
      return;
    }

    const lead = showConvertModal!;
    const newOpportunity: EnhancedOpportunity = {
      id: `opp-${Date.now()}`,
      name: lead.locationName,
      customer: convertForm.customer,
      amount: parseFloat(convertForm.amount),
      stageLabel: '方案报价',
      owner: '我',
      avatar: 'https://picsum.photos/100?random=me',
      updateTime: '刚刚',
      status: 'active',
      nextContactDate: lead.nextVisit,
      history: lead.history
    };

    // 状态流转：从线索移除，加入商机
    setLeads(prev => prev.filter(l => l.id !== lead.id));
    setOpportunities(prev => [newOpportunity, ...prev]);
    
    // 清理并跳转
    setShowConvertModal(null);
    navigateTo(PageType.OPPORTUNITY_MANAGEMENT);
  };

  const getUrgencyColor = (dateStr?: string) => {
    if (!dateStr) return 'text-slate-400 bg-slate-50';
    const isToday = new Date(dateStr).toDateString() === new Date().toDateString();
    return isToday ? 'text-red-500 bg-red-50 ring-red-100' : 'text-blue-500 bg-blue-50 ring-blue-100';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'discovery': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'contacted': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-[#f4f7f9] dark:bg-background-dark min-h-screen pb-32 font-sans animate-fadeIn">
      {/* 头部导航 */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo(PageType.SALES_WORKBENCH)} className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
              <span className="material-symbols-outlined !text-xl font-bold">arrow_back_ios_new</span>
            </button>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none">线索雷达</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Leads Discovery</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 rounded-xl bg-primary text-white flex items-center gap-2 font-black text-xs shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined !text-lg">add_location</span>
            新增踩点
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center px-4 h-12 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-slate-400 !text-xl">map</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm flex-1 ml-3 placeholder:text-slate-400 font-medium" 
              placeholder="搜地址、搜项目名..." 
            />
          </div>
        </div>

        <div className="flex px-4 border-t border-slate-100">
          {[
            { id: 'all', label: '全部线索' },
            { id: 'discovery', label: '待发现' },
            { id: 'contacted', label: '已对接' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-4 text-xs font-black relative whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* 列表流 */}
      <div className="p-4 space-y-4">
        {filteredLeads.map((lead, idx) => (
          <div 
            key={lead.id} 
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none animate-slideUp overflow-hidden"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1 truncate">{lead.locationName}</h3>
                <div className="flex items-start gap-1 text-slate-400">
                  <span className="material-symbols-outlined !text-[12px] mt-0.5">location_on</span>
                  <p className="text-[10px] font-bold leading-relaxed truncate">{lead.address}</p>
                </div>
              </div>
              <div className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                {lead.status === 'discovery' ? '现场踩点' : '跟进中'}
              </div>
            </div>

            {lead.nextVisit && (
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-4 ring-1 ring-inset ${getUrgencyColor(lead.nextVisit)}`}>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined !text-sm filled-icon">alarm</span>
                  <span className="text-[10px] font-black uppercase">下次前往：{lead.nextVisit}</span>
                </div>
                <span className="material-symbols-outlined !text-sm">directions_run</span>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4">
               <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-2">
                 "{lead.desc}"
               </p>
            </div>

            {/* 操作栏优化：加入“无效”按钮并保持单行 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-1 flex-nowrap">
               <div className="flex flex-col min-w-[60px] shrink-0">
                  <span className="text-[8px] text-red-400 font-black tracking-widest uppercase leading-none mb-1">Status</span>
                  <span className="text-[9px] text-red-500 font-black whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px]">
                    {lead.contactName ? lead.contactName : '尚未联系'}
                  </span>
               </div>
               
               <div className="flex items-center gap-0.5 ml-auto flex-nowrap shrink-0 overflow-x-hidden">
                  <button 
                    onClick={() => setViewingHistoryId(viewingHistoryId === lead.id ? null : lead.id)}
                    className="size-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 active:bg-primary active:text-white transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined !text-base">history</span>
                  </button>
                  <button 
                    onClick={() => setShowFollowUpModal(lead.id)}
                    className="h-8 px-1.5 rounded-lg bg-white text-primary border border-primary/20 text-[9px] font-black active:bg-primary/5 transition-all flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined !text-[14px]">edit_location</span>
                    记踩点
                  </button>
                  <button 
                    onClick={() => handleStartConvert(lead)}
                    className="h-8 px-1.5 rounded-lg bg-primary text-white text-[9px] font-black shadow-md shadow-primary/10 active:translate-y-0.5 transition-all flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined !text-[14px]">assignment</span>
                    定商机
                  </button>
                  <button 
                    onClick={() => handleMarkInvalid(lead.id)}
                    className="h-8 px-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-black active:bg-red-50 active:text-red-500 active:border-red-100 transition-all flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined !text-[14px]">delete_sweep</span>
                    无效
                  </button>
               </div>
            </div>

            {viewingHistoryId === lead.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-slideUp">
                {lead.history.length > 0 ? lead.history.map((h) => (
                  <div key={h.id} className="relative pl-5">
                    <div className="absolute left-0 top-1.5 size-1.5 rounded-full bg-primary"></div>
                    <p className="text-[9px] font-black text-slate-400 mb-0.5">{h.time} · {h.result}</p>
                    <p className="text-[10px] text-slate-700 font-medium">{h.content}</p>
                  </div>
                )) : <p className="text-[9px] text-slate-300 text-center py-2">暂无历史记录</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 补全商机信息弹窗 (Bottom Sheet) */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-6 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black tracking-tight">商机流转 · 补全信息</h3>
               <button onClick={() => setShowConvertModal(null)} className="size-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">客户名称 *</label>
                <input 
                  value={convertForm.customer}
                  onChange={(e) => setConvertForm({...convertForm, customer: e.target.value})}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20" 
                  placeholder="公司或个人称呼"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">联系人</label>
                  <input 
                    value={convertForm.contact}
                    onChange={(e) => setConvertForm({...convertForm, contact: e.target.value})}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20" 
                    placeholder="姓名"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">联系电话</label>
                  <input 
                    value={convertForm.phone}
                    onChange={(e) => setConvertForm({...convertForm, phone: e.target.value})}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20" 
                    placeholder="手机号"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">预估商机金额 (元) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm">¥</span>
                  <input 
                    type="number"
                    value={convertForm.amount}
                    onChange={(e) => setConvertForm({...convertForm, amount: e.target.value})}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl pl-9 pr-4 border-none text-base font-black text-primary focus:ring-1 focus:ring-primary/20" 
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">初步方案备注</label>
                <textarea 
                  value={convertForm.memo}
                  onChange={(e) => setConvertForm({...convertForm, memo: e.target.value})}
                  className="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-1 focus:ring-primary/20 p-4 text-xs font-medium leading-relaxed" 
                  placeholder="描述客户的具体需求点..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setShowConvertModal(null)}
                className="flex-1 h-12 bg-slate-100 text-slate-500 font-bold rounded-2xl active:scale-95 transition-all text-xs"
              >
                取消
              </button>
              <button 
                onClick={confirmConvert}
                className="flex-[2] h-12 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined !text-lg">rocket_launch</span>
                确认并转化为商机
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 记踩点弹窗 */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-6 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black">现场跟进笔记</h3>
               <button onClick={() => setShowFollowUpModal(null)} className="size-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">本次踩点发现</label>
                <textarea 
                  value={followUpContent}
                  onChange={(e) => setFollowUpContent(e.target.value)}
                  className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-1 focus:ring-primary/20 p-4 text-xs leading-relaxed" 
                  placeholder="有没有见到人？装修到哪一步了？"
                ></textarea>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">下次预约时间</label>
                <input 
                  type="datetime-local" 
                  value={nextVisitTime}
                  onChange={(e) => setNextVisitTime(e.target.value)}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20 text-slate-500" 
                />
              </div>

              <button 
                onClick={handleSaveFollowUp}
                className="w-full h-12 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs"
              >
                保存并更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增线索弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 animate-scaleIn shadow-2xl">
            <h3 className="text-lg font-black mb-1 text-center">新增现场线索</h3>
            <p className="text-[10px] text-slate-400 text-center mb-6 font-medium">发现有需求的地点？先记下来！</p>
            
            <div className="space-y-4">
              <input className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20" placeholder="地点名称 *" />
              <input className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold focus:ring-1 focus:ring-primary/20" placeholder="详细地址 *" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-12 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs">取消</button>
                <button onClick={() => setShowAddModal(false)} className="flex-[2] h-12 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 text-xs">立即保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
