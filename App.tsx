
import React, { useState, useMemo } from 'react';
import { PageType, Department, WorkbenchMapping, ApprovalItem, ApprovalTemplate, Announcement, RewardPunishmentRecord, Employee, WorkflowNode, OrderRecord } from './types';
import Home from './pages/Home';
import Login from './pages/Login';
import MessageCenter from './pages/MessageCenter';
import SalesWorkbench from './pages/SalesWorkbench';
import InstallerWorkbench from './pages/InstallerWorkbench';
import AdminWorkbench from './pages/AdminWorkbench';
import ApprovalCenter from './pages/ApprovalCenter';
import ApprovalToMe from './pages/ApprovalToMe';
import ApprovalMyInitiated from './pages/ApprovalMyInitiated';
import SuccessFeedback from './pages/SuccessFeedback';
import CustomerManagement from './pages/CustomerManagement';
import ContractManagement from './pages/ContractManagement';
import HRWorkbench from './pages/HRWorkbench';
import HRRewardPunishmentManagement from './pages/HRRewardPunishmentManagement';
import HRAnnouncementManagement from './pages/HRAnnouncementManagement';
import HRStaffManagement from './pages/HRStaffManagement';
import MyRewardsPunishments from './pages/MyRewardsPunishments';
import CommissionStats from './pages/CommissionStats';
import AttendanceStats from './pages/AttendanceStats';
import MaterialLogs from './pages/MaterialLogs';
import SalarySlip from './pages/SalarySlip';
import Profile from './pages/Profile';
import SystemSettings from './pages/SystemSettings';
import OrgStructure from './pages/OrgStructure';
import ApprovalSettings from './pages/ApprovalSettings';
import InterfaceSettings from './pages/InterfaceSettings';
import LeadManagement from './pages/LeadManagement';
import OpportunityManagement from './pages/OpportunityManagement';
import CustomerDetail from './pages/CustomerDetail';
import AdminPCWorkbench from './pages/AdminPCWorkbench';
import WorkHourStats from './pages/WorkHourStats';
import ProjectReport from './pages/ProjectReport';
import RemittanceForm from './pages/RemittanceForm';
import ProjectDetail from './pages/ProjectDetail';
import ProjectList from './pages/ProjectList';
import AdvanceRequestForm from './pages/AdvanceRequestForm';
import LeaveRequestForm from './pages/LeaveRequestForm';
import ExpenseReimbursementForm from './pages/ExpenseReimbursementForm';
import AdvanceRequestDetail from './pages/AdvanceRequestDetail';
import LeaveRequestDetail from './pages/LeaveRequestDetail';
import ExpenseReimbursementDetail from './pages/ExpenseReimbursementDetail';
import CorporatePayment from './pages/CorporatePayment';
import PaymentManagement from './pages/PaymentManagement';
import ContractRemittanceDetail from './pages/ContractRemittanceDetail';
import WorkflowEditor from './pages/WorkflowEditor';

export interface FollowUpRecord { id: string; time: string; content: string; result: string; }
export interface EnhancedLead { id: string; locationName: string; address: string; status: 'discovery' | 'contacted'; nextVisit?: string; desc: string; contactName?: string; phone?: string; history: FollowUpRecord[]; }
export interface EnhancedOpportunity { id: string; name: string; customer: string; amount: number; stageLabel: string; owner: string; avatar: string; updateTime: string; status: 'active' | 'won' | 'lost'; nextContactDate?: string; history: FollowUpRecord[]; }

export interface GlobalContract { id: string; title: string; customer: string; address: string; amount: number; paid: number; status: 'executing' | 'completed'; installStatus: 'pending' | 'active' | 'completed'; thumbnail: string; owner: string; dueDate?: string; }
export interface GlobalCustomer { id: string; name: string; projects: number; total: string; type: 'VIP' | 'KA' | 'TOP' | 'NORMAL'; avatar: string; contact?: string; phone?: string; address?: string; owner?: string; }
export interface PayoutItem extends ApprovalItem { payeeName: string; alipayAccount: string; }

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.LOGIN);
  const [currentDept, setCurrentDept] = useState<Department>(Department.ADMIN);
  const [navParams, setNavParams] = useState<any>({});

  const [departments, setDepartments] = useState<string[]>(['行政部', '安装部', '业务部', '制作部', '财务部']);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: '张伟', dept: '行政部', phone: '13800138000', username: '13800138000', password: '138000', status: 'active', joinDate: '2022-01-01', avatar: '张' },
    { id: '2', name: '李晓明', dept: '安装部', phone: '13911112222', username: '13911112222', password: '112222', status: 'active', joinDate: '2023-05-15', avatar: '李' },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, tag: '重要', tagBg: 'bg-red-500/20 text-red-400', title: '关于 2024 年国庆节放假及值班安排的通知', dept: '行政部', time: '刚刚', views: '128' },
  ]);

  const [commissionOrders] = useState<OrderRecord[]>([
    { id: 'AZ-1001', projectName: '万达商业广场门头发光字安装', completeDate: '2023-11-20', totalWorkHours: 12.5, commission: 450, status: 'confirmed' },
    { id: 'AZ-1002', projectName: '星巴克港汇恒隆店外墙亮化', completeDate: '2023-11-18', totalWorkHours: 8.0, commission: null, status: 'pending' },
    { id: 'AZ-1003', projectName: '静安大悦城5F导视系统更换', completeDate: '2023-11-15', totalWorkHours: 15.0, commission: 620, status: 'confirmed' },
    { id: 'AZ-1004', projectName: '龙湖天街外景广告位维护', completeDate: '2023-11-10', totalWorkHours: 6.5, commission: null, status: 'pending' },
    { id: 'AZ-0985', projectName: '虹桥机场T2指引牌加固', completeDate: '2023-10-25', totalWorkHours: 10.0, commission: 380, status: 'confirmed' },
  ]);

  const [rpRecords, setRpRecords] = useState<RewardPunishmentRecord[]>([]);
  const [contracts, setContracts] = useState<GlobalContract[]>([
    { id: 'HT-001', title: '万达广场广告牌更换项目', customer: '万达商业管理有限公司', address: '上海市杨浦区国宾路58号', amount: 120000, paid: 45000, status: 'executing', installStatus: 'active', thumbnail: 'https://picsum.photos/400/400?random=1', owner: '张经理' },
  ]);

  const [customers, setCustomers] = useState<GlobalCustomer[]>([
    { id: 'C001', name: '万达商业管理有限公司', projects: 5, total: '240.5', type: 'TOP', avatar: 'W', address: '上海市杨浦区' },
  ]);

  const [leads, setLeads] = useState<EnhancedLead[]>([]);
  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [approvalTemplates] = useState<ApprovalTemplate[]>([
    { id: 'T1', name: '通用预支报销', icon: 'receipt_long', color: 'bg-blue-500', nodes: [] },
    { id: 'T2', name: '合同折扣审批', icon: 'history_edu', color: 'bg-indigo-500', nodes: [] },
  ]);

  const [workbenchMapping, setWorkbenchMapping] = useState<WorkbenchMapping>({
    ['行政部']: ['admin', 'approval', 'install', 'sales', 'hr'],
    ['业务部']: ['approval', 'sales'],
    ['安装部']: ['approval', 'install'],
    ['人事部']: ['hr', 'approval', 'admin']
  });

  const navigateTo = (page: PageType, mode?: any, status?: any, idOrData?: any) => {
    setCurrentPage(page);
    setNavParams({ mode, status, data: idOrData });
  };

  const handleUpdateEmployees = (newEmployees: Employee[]) => setEmployees(newEmployees);

  const renderPage = () => {
    switch (currentPage) {
      case PageType.LOGIN: return <Login onLogin={() => setCurrentPage(PageType.HOME)} />;
      case PageType.HOME: return <Home navigateTo={navigateTo} currentDept={currentDept} workbenchMapping={workbenchMapping} announcements={announcements} />;
      case PageType.MESSAGE: return <MessageCenter navigateTo={navigateTo} />;
      case PageType.SALES_WORKBENCH: return <SalesWorkbench navigateTo={navigateTo} leadsCount={leads.length} oppsCount={opportunities.length} oppsTotal={0} />;
      case PageType.INSTALLER_WORKBENCH: return <InstallerWorkbench navigateTo={navigateTo} contracts={contracts} commissionOrders={commissionOrders} />;
      case PageType.ADMIN_WORKBENCH: return <AdminWorkbench navigateTo={navigateTo} contracts={contracts} />;
      case PageType.APPROVAL_CENTER: return <ApprovalCenter navigateTo={navigateTo} todoCount={approvals.filter(a => a.status === 'pending').length} requestCount={approvals.length} pendingList={approvals.filter(a => a.status === 'pending')} />;
      case PageType.APPROVAL_TO_ME: return <ApprovalToMe navigateTo={navigateTo} pendingList={approvals.filter(a => a.status === 'pending')} finishedList={approvals.filter(a => a.status !== 'pending')} onAction={(id, act) => setApprovals(approvals.map(a => a.id === id ? {...a, status: act} : a))} />;
      case PageType.APPROVAL_MY_INITIATED: return <ApprovalMyInitiated navigateTo={navigateTo} list={approvals} />;
      case PageType.SUCCESS_FEEDBACK: return <SuccessFeedback navigateTo={navigateTo} />;
      case PageType.CUSTOMER_MANAGEMENT: return <CustomerManagement navigateTo={navigateTo} customers={customers} setCustomers={setCustomers} />;
      case PageType.CONTRACT_MANAGEMENT: return <ContractManagement navigateTo={navigateTo} contracts={contracts} setContracts={setContracts} customers={customers} />;
      case PageType.HR_WORKBENCH: return <HRWorkbench navigateTo={navigateTo} />;
      case PageType.HR_ANNOUNCEMENT_MANAGEMENT: return <HRAnnouncementManagement navigateTo={navigateTo} announcements={announcements} onPublishNotice={(n) => setAnnouncements([n, ...announcements])} onDeleteNotice={(id) => setAnnouncements(announcements.filter(a => a.id !== id))} />;
      case PageType.HR_RP_MANAGEMENT: return <HRRewardPunishmentManagement navigateTo={navigateTo} records={rpRecords} onAddRecord={(r) => setRpRecords([r, ...rpRecords])} />;
      case PageType.HR_STAFF_MANAGEMENT: return <HRStaffManagement navigateTo={navigateTo} employees={employees} setEmployees={handleUpdateEmployees} setApprovals={setApprovals} departments={departments} />;
      case PageType.MY_REWARDS_PUNISHMENTS: return <MyRewardsPunishments navigateTo={navigateTo} />;
      case PageType.SALARY_SLIP: return <SalarySlip navigateTo={navigateTo} />;
      case PageType.ATTENDANCE_STATS: return <AttendanceStats navigateTo={navigateTo} />;
      case PageType.COMMISSION_STATS: return <CommissionStats navigateTo={navigateTo} orders={commissionOrders} />;
      case PageType.MATERIAL_LOGS: return <MaterialLogs navigateTo={navigateTo} />;
      case PageType.MINE: return <Profile navigateTo={navigateTo} />;
      case PageType.INTERFACE_SETTINGS: return <InterfaceSettings navigateTo={navigateTo} mapping={workbenchMapping} setMapping={setWorkbenchMapping} departments={departments} />;
      case PageType.LEAD_MANAGEMENT: return <LeadManagement navigateTo={navigateTo} leads={leads} setLeads={setLeads} opportunities={opportunities} setOpportunities={setOpportunities} />;
      case PageType.OPPORTUNITY_MANAGEMENT: return <OpportunityManagement navigateTo={navigateTo} opportunities={opportunities} setOpportunities={setOpportunities} customers={customers} />;
      case PageType.CUSTOMER_DETAIL: return <CustomerDetail navigateTo={navigateTo} customerId={navParams.data} contracts={contracts} opportunities={opportunities} customers={customers} />;
      case PageType.ADMIN_PC_WORKBENCH: return <AdminPCWorkbench navigateTo={navigateTo} contracts={contracts} customers={customers} opportunities={opportunities} />;
      case PageType.SYSTEM_SETTINGS: return <SystemSettings navigateTo={navigateTo} />;
      case PageType.ORG_STRUCTURE: return <OrgStructure navigateTo={navigateTo} departments={departments} setDepartments={setDepartments} />;
      case PageType.WORK_HOUR_STATS: return <WorkHourStats navigateTo={navigateTo} />;
      case PageType.PROJECT_REPORT: return <ProjectReport navigateTo={navigateTo} />;
      case PageType.REMITTANCE_FORM: return <RemittanceForm navigateTo={navigateTo} contracts={contracts} onAddApproval={(a) => setApprovals([a, ...approvals])} />;
      case PageType.PROJECT_DETAIL: return <ProjectDetail navigateTo={navigateTo} />;
      case PageType.PROJECT_LIST: return <ProjectList navigateTo={navigateTo} contracts={contracts} />;
      case PageType.ADVANCE_REQUEST: return <AdvanceRequestForm navigateTo={navigateTo} onAddApproval={(a) => setApprovals([a, ...approvals])} approvals={approvals} />;
      case PageType.LEAVE_REQUEST: return <LeaveRequestForm navigateTo={navigateTo} onAddApproval={(a) => setApprovals([a, ...approvals])} />;
      case PageType.EXPENSE_REIMBURSEMENT: return <ExpenseReimbursementForm navigateTo={navigateTo} onAddApproval={(a) => setApprovals([a, ...approvals])} />;
      case PageType.ADVANCE_REQUEST_DETAIL: return <AdvanceRequestDetail navigateTo={navigateTo} id={navParams.data} mode={navParams.mode} status={navParams.status} onAction={(id, act) => setApprovals(approvals.map(a => a.id === id ? {...a, status: act} : a))} />;
      case PageType.LEAVE_REQUEST_DETAIL: return <LeaveRequestDetail navigateTo={navigateTo} id={navParams.data} mode={navParams.mode} status={navParams.status} onAction={(id, act) => setApprovals(approvals.map(a => a.id === id ? {...a, status: act} : a))} />;
      case PageType.EXPENSE_REIMBURSEMENT_DETAIL: return <ExpenseReimbursementDetail navigateTo={navigateTo} id={navParams.data} mode={navParams.mode} status={navParams.status} onAction={(id, act) => setApprovals(approvals.map(a => a.id === id ? {...a, status: act} : a))} />;
      case PageType.CORPORATE_PAYMENT: return <CorporatePayment navigateTo={navigateTo} pendingPayments={payouts} paidHistory={[]} onCompletePayment={(items) => setPayouts(payouts.filter(p => !items.includes(p)))} />;
      case PageType.PAYMENT_MANAGEMENT: return <PaymentManagement navigateTo={navigateTo} contracts={contracts} />;
      case PageType.CONTRACT_REMITTANCE_DETAIL: return <ContractRemittanceDetail navigateTo={navigateTo} id={navParams.data} mode={navParams.mode} status={navParams.status} contracts={contracts} approvals={approvals} onAction={(id, act) => setApprovals(approvals.map(a => a.id === id ? {...a, status: act} : a))} />;
      case PageType.APPROVAL_SETTINGS: return <ApprovalSettings navigateTo={navigateTo} templates={approvalTemplates} />;
      case PageType.WORKFLOW_EDITOR: return <WorkflowEditor navigateTo={navigateTo} template={approvalTemplates.find(t => t.id === navParams.data) || approvalTemplates[0]} />;
      default: return <Home navigateTo={navigateTo} currentDept={currentDept} workbenchMapping={workbenchMapping} announcements={announcements} />;
    }
  };

  // 定义不需要底部导航栏的页面
  const hideNavPages = [
    PageType.LOGIN,
    PageType.ADMIN_PC_WORKBENCH,
    PageType.WORKFLOW_EDITOR,
    PageType.HR_STAFF_MANAGEMENT,
    PageType.HR_ANNOUNCEMENT_MANAGEMENT,
    PageType.HR_RP_MANAGEMENT,
    PageType.SALARY_SLIP,
    PageType.ORG_STRUCTURE
  ];

  const isPCMode = currentPage === PageType.ADMIN_PC_WORKBENCH;

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-all duration-500 ${isPCMode ? 'w-full' : 'max-w-md mx-auto shadow-2xl bg-white'}`}>
      {renderPage()}
      {!hideNavPages.includes(currentPage) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-2 pb-6 z-40 h-20">
          <button onClick={() => setCurrentPage(PageType.HOME)} className={`flex flex-col items-center gap-1 ${currentPage === PageType.HOME ? 'text-primary' : 'text-slate-300'}`}>
            <span className="material-symbols-outlined !text-2xl">home</span>
            <span className="text-[10px] font-bold">首页</span>
          </button>
          <button onClick={() => setCurrentPage(PageType.MESSAGE)} className={`flex flex-col items-center gap-1 ${currentPage === PageType.MESSAGE ? 'text-primary' : 'text-slate-300'}`}>
            <span className="material-symbols-outlined !text-2xl">chat_bubble</span>
            <span className="text-[10px] font-bold">消息</span>
          </button>
          <button onClick={() => setCurrentPage(PageType.MINE)} className={`flex flex-col items-center gap-1 ${currentPage === PageType.MINE ? 'text-primary' : 'text-slate-300'}`}>
            <span className="material-symbols-outlined !text-2xl">person</span>
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
