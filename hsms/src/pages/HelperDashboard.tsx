import { motion } from 'motion/react';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  Clock, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

export const HelperDashboard = () => {
  const jobs = [
    { id: '1', service: 'Dọn dẹp nhà cửa', date: 'Hôm nay', time: '08:00 - 10:00', status: 'Sắp tới', customer: 'Nguyễn An', price: '160,000đ', address: '123 Lê Lợi, Q.1' },
    { id: '2', service: 'Giặt ủi', date: 'Ngày mai', time: '14:00 - 16:00', status: 'Đã nhận', customer: 'Trần Bình', price: '140,000đ', address: '456 Nguyễn Huệ, Q.1' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-300">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-800 border-r border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold text-white">HomeJoy</span>
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Helper</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Công việc mới', icon: Briefcase, active: true },
            { name: 'Lịch của tôi', icon: Calendar },
            { name: 'Thu nhập', icon: DollarSign },
            { name: 'Đánh giá', icon: Star },
            { name: 'Hồ sơ', icon: User },
            { name: 'Cài đặt', icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-slate-700 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </a>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all mt-auto">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 bg-slate-900 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">Chào chị Hoa!</h1>
            <p className="text-slate-400 font-medium">Hôm nay chị có 2 công việc cần hoàn thành.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Trạng thái</p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Đang nhận việc
              </div>
            </div>
            <img src="https://picsum.photos/seed/helper1/100/100" className="w-12 h-12 rounded-2xl border-2 border-slate-700 shadow-xl" alt="Helper" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Thu nhập tháng', value: '8,450,000đ', icon: DollarSign, color: 'text-emerald-400' },
            { label: 'Việc hoàn thành', value: '42', icon: CheckCircle2, color: 'text-blue-400' },
            { label: 'Đánh giá TB', value: '4.9', icon: Star, color: 'text-amber-400' },
            { label: 'Tỷ lệ nhận việc', value: '98%', icon: Clock, color: 'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 bg-slate-700 rounded-xl", stat.color)}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Lịch làm việc hôm nay</h2>
            <button className="text-sm font-bold text-primary hover:underline">Xem lịch tuần</button>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ x: 10 }}
                className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col md:flex-row md:items-center gap-6 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      job.status === 'Sắp tới' ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                    )}>
                      {job.status}
                    </span>
                    <span className="text-slate-500 text-xs font-medium">{job.date} • {job.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{job.service}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User size={16} className="text-slate-500" />
                      {job.customer}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-slate-500" />
                      {job.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Thù lao</p>
                    <p className="text-xl font-extrabold text-emerald-400">{job.price}</p>
                  </div>
                  <button className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
