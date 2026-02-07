
import React, { useState, useMemo } from 'react';
import { PageType, Employee, ApprovalItem } from '../types';

interface Props {
  navigateTo: (page: PageType) => void;
  employees: Employee[];
  setEmployees: (newEmployees: Employee[]) => void;
  setApprovals: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
  departments: string[];
}

const HRStaffManagement: React.FC<Props> = ({ navigateTo, employees, setEmployees, setApprovals, departments }) => {
  const [viewMode, setViewMode] = useState<'staff' | 'dept'>('staff');
  const [activeTab, setActiveTab] = useState<'active' | 'offboarded'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOffboardModal, setShowOffboardModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 表单初始状态
  const initialFormData: Partial<Employee> = {
    name: '',
    dept: departments[0] || '行政部',
    phone: '',
    idCard: '',
    bankCardNumber: '',
    bankName: '中国建设银行',
    alipayAccount: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0]
  };
  
  const [formData, setFormData] = useState<Partial<Employee>>(initialFormData);
  const [offboardDate, setOffboardDate] = useState(new Date().toISOString().split('T')[0]);

  // 自动生成的账号信息
  const loginInfo = useMemo(() => {
    const phone = formData.phone || '';
    return {
      username: phone,
      password: phone.length >= 6 ? phone.slice(-6) : '******'
    };
  }, [formData.phone]);

  // 过滤后的员工
  const filteredStaff = useMemo(() => {
    return employees.filter(e => 
      e.status === activeTab && 
      (e.name.includes(searchQuery) || e.phone.includes(searchQuery) || e.username.includes(searchQuery))
    );
  }, [employees, activeTab, searchQuery]);

  // 处理入职
  const handleAddEmployee = () => {
    if (!formData.name || !formData.phone || formData.phone.length < 11) {
      alert('请填写完整姓名及有效的手机号');
      return;
    }

    const newEmp: Employee = {
      id: Date.now().toString(),
      name: formData.name || '',
      dept: formData.dept || (departments[0] || '行政部'),
      phone: formData.phone || '',
      username: formData.phone || '', 
      password: (formData.phone || '').slice(-6),
      idCard: formData.idCard,
      bankCardNumber: formData.bankCardNumber,
      bankName: formData.bankName,
      alipayAccount: formData.alipayAccount,
      status: 'active',
      joinDate: formData.joinDate || '',
      avatar: (formData.name || '').charAt(0)
    };

    setEmployees([newEmp, ...employees]);

    // 抄送管理层：生成入职通知
    const notify: ApprovalItem = {
      id: `NOTIFY-JOIN-${Date.now()}`,
      user: '人事行政部',
      dept: '行政部',
      type: '入职备案',
      amount: '新增成员',
      date: new Date().toLocaleDateString(),
      detail: `员工【${newEmp.name}】已加入【${newEmp.dept}】。登录账号：${newEmp.username}`,
      icon: 'person_add',
      color: 'bg-emerald-500',
      route: PageType.HOME,
      status: 'approved'
    };
    setApprovals(prev => [notify, ...prev]);

    setShowAddModal(false);
    setFormData(initialFormData);
  };

  // 处理离职
  const handleConfirmOffboard = () => {
    if (!showOffboardModal) return;
    const emp = employees.find(e => e.id === showOffboardModal);
    if (!emp) return;

    setEmployees(employees.map(e => 
      e.id === showOffboardModal 
        ? { ...e, status: 'offboarded', offboardDate: offboardDate } 
        : e
    ));

    // 抄送管理层：生成离职通知
    const notify: ApprovalItem = {
      id: `NOTIFY-LEAVE-${Date.now()}`,
      user: '人事行政部',
      dept: '行政部',
      type: '离职备案',
      amount: '账号已封禁',
      date: new Date().toLocaleDateString(),
      detail: `员工【${emp.name}】（${emp.dept}）已办理离职。最后工作日：${offboardDate}。系统权限已回收。`,
      icon: 'person_remove',
      color: 'bg-slate-500',
      route: PageType.HOME,
      status: 'approved'
    };
    setApprovals(prev => [notify, ...prev]);

    setShowOffboardModal(null);
  };

  return (
    <div className="animate-fadeIn bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-32 font-sans no-scrollbar">
      
      {/* 顶部：沉浸式页头 */}
      <div className="bg-[#101922] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo(PageType.HR_WORKBENCH)}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90"
            >
              <span className="material-symbols-outlined !text-xl">arrow_back</span>
            </button>
            <div>
               <h2 className="text-white text-lg font-bold tracking-tight leading-none">公司人员名册</h2>
               <p className="text-white/30 text-[9px] font-black uppercase mt-1 tracking-widest italic">Staff Directory</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-black">person_add</span>
          </button>
        </div>

        {/* 顶部视图切换 */}
        <div className="relative z-10 flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5">
           <button 
            onClick={() => setViewMode('staff')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'staff' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40'}`}
           >
             人员名册
           </button>
           <button 
            onClick={() => setViewMode('dept')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'dept' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40'}`}
           >
             部门概览
           </button>
        </div>
      </div>

      <main className="px-5 -mt-6 relative z-20">
        {viewMode === 'staff' ? (
          <div className="space-y-6">
            {/* 搜索与分类 */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 dark:border-slate-800">
               <div className="flex gap-1">
                  <button onClick={() => setActiveTab('active')} className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all ${activeTab === 'active' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'text-slate-400'}`}>在职 ({employees.filter(e=>e.status==='active').length})</button>
                  <button onClick={() => setActiveTab('offboarded')} className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all ${activeTab === 'offboarded' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>离职 ({employees.filter(e=>e.status==='offboarded').length})</button>
               </div>
               <div className="mt-2 px-3 pb-2 flex items-center h-10 gap-2 border-t border-slate-50 dark:border-slate-800 pt-2">
                  <span className="material-symbols-outlined text-slate-300 !text-xl">search</span>
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold placeholder:text-slate-300" placeholder="搜姓名、账号、手机..." 
                  />
               </div>
            </div>

            {/* 列表流 */}
            <div className="space-y-4">
              {filteredStaff.map((emp, idx) => (
                <div key={emp.id} className={`bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-white dark:border-slate-800 shadow-sm animate-slideUp group relative overflow-hidden ${emp.status === 'offboarded' ? 'opacity-60 grayscale-[0.4]' : ''}`} style={{ animationDelay: `${idx*80}ms` }}>
                   <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md ${emp.status === 'active' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                          {emp.avatar}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            {emp.name}
                            {emp.status === 'offboarded' && <span className="ml-2 text-[10px] bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full font-black uppercase">已禁登</span>}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-[0.15em]">{emp.dept} · {emp.status === 'active' ? `${emp.joinDate} 入职` : `${emp.offboardDate} 离职`}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => emp.status === 'active' ? setShowOffboardModal(emp.id) : setEmployees(employees.map(e => e.id === emp.id ? {...e, status: 'active', offboardDate: undefined} : e))}
                        className={`h-8 px-3 rounded-lg text-[10px] font-black border transition-all ${emp.status === 'active' ? 'text-rose-500 border-rose-100 active:bg-rose-50' : 'text-emerald-500 border-emerald-100 active:bg-emerald-50'}`}
                      >
                        {emp.status === 'active' ? '办理离职' : '重新启用'}
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div>
                         <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">登录系统账号</p>
                         <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.username}</p>
                      </div>
                      <div>
                         <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">联系手机号</p>
                         <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.phone}</p>
                      </div>
                   </div>

                   {emp.status === 'active' && emp.bankCardNumber && (
                      <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-center gap-2">
                         <span className="material-symbols-outlined !text-sm text-blue-400">account_balance_wallet</span>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">回款绑定：{emp.bankName} (尾号 {emp.bankCardNumber.slice(-4)})</p>
                      </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 部门视图：可视化公司架构 */
          <div className="space-y-4">
            {departments.map((dept, idx) => {
              const staff = employees.filter(e => e.dept === dept && e.status === 'active');
              return (
                <div key={dept} className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm animate-slideUp" style={{ animationDelay: `${idx*100}ms` }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined !text-xl filled-icon">corporate_fare</span>
                       </div>
                       <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white">{dept}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">全员 {staff.length} 人</p>
                       </div>
                    </div>
                    <button className="material-symbols-outlined text-slate-200">settings</button>
                  </div>

                  <div className="flex -space-x-3">
                     {staff.map((s, i) => (
                       <div key={s.id} className="size-9 rounded-full bg-slate-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-primary shadow-sm overflow-hidden">
                          {s.avatar}
                       </div>
                     ))}
                     {staff.length === 0 && <p className="text-[11px] text-slate-300 italic font-bold">暂无分配成员</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 离职日期填写弹窗 */}
      {showOffboardModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 animate-scaleIn shadow-2xl">
             <h3 className="text-lg font-black text-center mb-1 text-slate-800 dark:text-white">确定办理离职？</h3>
             <p className="text-[10px] text-slate-400 text-center mb-8 font-bold">该操作将同步抄送管理层备案，并封禁账号</p>
             
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">最后工作日期 *</label>
                  <input 
                    type="date"
                    value={offboardDate}
                    onChange={(e) => setOffboardDate(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-sm font-bold"
                  />
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowOffboardModal(null)} className="flex-1 h-12 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs">取消</button>
                   <button onClick={handleConfirmOffboard} className="flex-[2] h-12 bg-rose-500 text-white font-black rounded-xl shadow-lg text-xs">确认离职</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 入职表单弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 animate-slideUp shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar pb-12">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">新员工入职详细登记</h3>
                <button onClick={() => setShowAddModal(false)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>

             <div className="space-y-8">
                <section className="space-y-5">
                   <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-3">基本身份与岗位信息</p>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">员工姓名 *</label>
                      <input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold placeholder:text-slate-300" placeholder="真实姓名" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">分配部门</label>
                       <select 
                         value={formData.dept}
                         onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                         className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold"
                       >
                         {departments.map(d => <option key={d}>{d}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">入职日期</label>
                       <input 
                         type="date"
                         value={formData.joinDate}
                         onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                         className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border-none text-xs font-bold"
                       />
                     </div>
                   </div>
                </section>

                <section className="space-y-5">
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-3">薪酬打卡银行账户</p>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">个人身份证号</label>
                      <input 
                        value={formData.idCard}
                        onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold placeholder:text-slate-200" placeholder="18位身份证号" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">报账用银行卡号</label>
                      <input 
                        value={formData.bankCardNumber}
                        onChange={(e) => setFormData({ ...formData, bankCardNumber: e.target.value })}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold placeholder:text-slate-200" placeholder="储蓄卡号" 
                      />
                   </div>
                </section>

                <section className="space-y-5">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-3">系统权限自动配置</p>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">联系电话 (核心登录主键) *</label>
                      <input 
                        type="tel"
                        maxLength={11}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-5 border-none text-sm font-bold ring-2 ring-blue-500/10" placeholder="11位手机号" 
                      />
                   </div>

                   <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100/50 space-y-4">
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="material-symbols-outlined !text-sm">shield</span>
                        智能生成的凭证
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">Username</label>
                            <div className="h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center px-3 text-xs font-black text-primary border border-blue-50 truncate">
                               {loginInfo.username || '等待输入电话'}
                            </div>
                         </div>
                         <div>
                            <label className="text-[9px] font-black text-slate-400 mb-1 block uppercase">Password</label>
                            <div className="h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center px-3 text-xs font-black text-slate-700 border border-blue-50">
                               {loginInfo.password}
                            </div>
                         </div>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed font-bold italic">
                        * 手机号即账号，后六位即初始密码。
                      </p>
                   </div>
                </section>

                <div className="pt-4">
                   <button 
                    onClick={handleAddEmployee}
                    className="w-full h-16 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     <span className="material-symbols-outlined">verified</span>
                     入职登记并同步抄送管理层
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRStaffManagement;
