
export enum PageType {
  HOME = 'home',
  MESSAGE = 'message',
  MINE = 'mine',
  LOGIN = 'login',
  SALES_WORKBENCH = 'sales_workbench',
  INSTALLER_WORKBENCH = 'installer_workbench',
  ADMIN_WORKBENCH = 'admin_workbench',
  ADMIN_PC_WORKBENCH = 'admin_pc_workbench',
  SYSTEM_SETTINGS = 'system_settings',
  ORG_STRUCTURE = 'org_structure',
  APPROVAL_SETTINGS = 'approval_settings',
  WORKFLOW_EDITOR = 'workflow_editor',
  REMITTANCE_FORM = 'remittance_form',
  PROJECT_REPORT = 'project_report',
  WORK_HOUR_STATS = 'work_hour_stats',
  PROJECT_DETAIL = 'project_detail',
  PROJECT_LIST = 'project_list',
  APPROVAL_CENTER = 'approval_center',
  APPROVAL_TO_ME = 'approval_to_me',
  APPROVAL_MY_INITIATED = 'approval_my_initiated',
  SUCCESS_FEEDBACK = 'success_feedback',
  CONTRACT_MANAGEMENT = 'contract_management',
  CUSTOMER_MANAGEMENT = 'customer_management',
  CUSTOMER_DETAIL = 'customer_detail',
  LEAD_MANAGEMENT = 'lead_management',
  OPPORTUNITY_MANAGEMENT = 'opportunity_management',
  ADVANCE_REQUEST = 'advance_request',
  LEAVE_REQUEST = 'leave_request',
  EXPENSE_REIMBURSEMENT = 'expense_reimbursement',
  ADVANCE_REQUEST_DETAIL = 'advance_request_detail',
  LEAVE_REQUEST_DETAIL = 'leave_request_detail',
  EXPENSE_REIMBURSEMENT_DETAIL = 'expense_reimbursement_detail',
  CORPORATE_PAYMENT = 'corporate_payment',
  INTERFACE_SETTINGS = 'interface_settings',
  PAYMENT_MANAGEMENT = 'payment_management',
  CONTRACT_REMITTANCE_DETAIL = 'contract_remittance_detail',
  MY_REWARDS_PUNISHMENTS = 'my_rewards_punishments',
  COMMISSION_STATS = 'commission_stats',
  ATTENDANCE_STATS = 'attendance_stats',
  MATERIAL_LOGS = 'material_logs',
  SALARY_SLIP = 'salary_slip',
  HR_WORKBENCH = 'hr_workbench',
  HR_RP_MANAGEMENT = 'hr_rp_management',
  HR_ANNOUNCEMENT_MANAGEMENT = 'hr_announcement_management',
  HR_STAFF_MANAGEMENT = 'hr_staff_management'
}

export enum Department {
  ADMIN = '行政部',
  SALES = '业务部',
  INSTALLER = '安装部',
  HR = '人事部'
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  phone: string;
  username: string;
  password?: string;
  status: 'active' | 'offboarded';
  joinDate: string;
  offboardDate?: string;
  avatar: string;
  idCard?: string;
  bankCardNumber?: string;
  bankName?: string;
  alipayAccount?: string;
}

export interface Announcement {
  id: string | number;
  tag: string;
  tagBg: string;
  title: string;
  dept: string;
  time: string;
  views: string | number;
  content?: string;
}

export interface OrderRecord {
  id: string;
  projectName: string;
  completeDate: string;
  totalWorkHours: number;
  commission: number | null;
  status: 'confirmed' | 'pending';
}

export interface RewardPunishmentRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'reward' | 'punishment';
  title: string;
  amount: string;
  date: string;
  reason: string;
  dept: string;
  icon: string;
}

export interface WorkbenchModule {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: PageType;
  desc: string;
}

export type WorkbenchMapping = Record<string, string[]>;

export interface ApprovalItem {
  id: string;
  user: string;
  dept: string;
  type: string;
  amount: string;
  date: string;
  detail: string;
  icon: string;
  color: string;
  route: PageType;
  status: 'pending' | 'approved' | 'rejected';
  relatedId?: string;
  metadata?: any;
}

export interface ApprovalTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  nodes: WorkflowNode[];
}

export interface WorkflowNode {
  id: string;
  type: 'approver' | 'cc';
  mode: 'single' | 'joint' | 'sequential';
  title: string;
  assignees: { name: string; avatar: string }[];
}
