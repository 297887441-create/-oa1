
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // 模拟登录响应时间，增加体感平顺度
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center px-8 font-sans selection:bg-primary/10">
      {/* 极简背景点缀：一个极其微弱的蓝紫色调，增加空间层次 */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[340px] relative z-10 animate-fadeIn">
        {/* 品牌标识 */}
        <div className="mb-16 flex flex-col items-center">
          <div className="size-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(19,127,236,0.15)] border border-slate-50 mb-4">
             <span className="material-symbols-outlined text-primary !text-3xl filled-icon">rocket</span>
          </div>
          <h1 className="text-slate-900 text-2xl font-black tracking-tight">SignPlus</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">企业全链路操作系统</p>
        </div>

        {/* 登录表单 */}
        <div className="space-y-6">
          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-primary">登录账号</label>
            </div>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="admin_zhangwei"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-slate-900 font-bold text-sm outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                placeholder="手机号或用户名"
              />
            </div>
          </div>
          
          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-primary">验证密码</label>
              <button className="text-[11px] text-slate-300 font-bold hover:text-primary transition-colors">忘记密码？</button>
            </div>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="••••••••"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-slate-900 font-bold text-sm outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                placeholder="请输入登录密码"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden relative group"
            >
              {loading ? (
                <span className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="text-sm tracking-widest">确认登录</span>
                  <span className="material-symbols-outlined !text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 极简底部版权 */}
      <div className="absolute bottom-10 text-center">
         <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.5em]">SignPlus Enterprise Edition · V2.5.0</p>
      </div>
    </div>
  );
};

export default Login;
