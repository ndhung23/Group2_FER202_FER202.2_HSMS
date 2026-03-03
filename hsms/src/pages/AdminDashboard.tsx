import { 
  BarChart3, 
  Users, 
  Briefcase, 
  ShieldAlert, 
  Settings, 
  Search, 
  Bell, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'T2', bookings: 40, revenue: 2400 },
  { name: 'T3', bookings: 30, revenue: 1398 },
  { name: 'T4', bookings: 20, revenue: 9800 },
  { name: 'T5', bookings: 27, revenue: 3908 },
  { name: 'T6', bookings: 18, revenue: 4800 },
  { name: 'T7', bookings: 23, revenue: 3800 },
  { name: 'CN', bookings: 34, revenue: 4300 },
];

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <span className="text-lg font-bold text-white">HomeJoy Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { name: 'Tổng quan', icon: BarChart3, active: true },
            { name: 'Người dùng', icon: Users },
            { name: 'Dịch vụ', icon: Briefcase },
            { name: 'Báo cáo', icon: ShieldAlert },
            { name: 'Cài đặt', icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                item.active ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        </header>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thống kê hệ thống</h1>
            <p className="text-sm text-slate-500">Dữ liệu cập nhật lúc 08:45 AM hôm nay.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2">
              <Filter size={14} /> Lọc
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Xuất báo cáo</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Doanh thu', value: '124.5M', change: '+12.5%', up: true },
            { label: 'Đơn hàng', value: '1,240', change: '+8.2%', up: true },
            { label: 'Helper mới', value: '45', change: '-2.4%', up: false },
            { label: 'Khiếu nại', value: '3', change: '-15%', up: true },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-bold",
                  stat.up ? "text-emerald-500" : "text-rose-500"
                )}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Tăng trưởng đơn hàng</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#1E88E5" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Doanh thu theo ngày</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="revenue" fill="#1E88E5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Helper mới đăng ký</h3>
            <button className="text-sm font-bold text-primary">Xem tất cả</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3">Họ tên</th>
                <th className="px-6 py-3">Dịch vụ</th>
                <th className="px-6 py-3">Khu vực</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Nguyễn Văn A', service: 'Dọn dẹp', area: 'Quận 1', status: 'Chờ duyệt' },
                { name: 'Trần Thị B', service: 'Nấu ăn', area: 'Quận 3', status: 'Đã duyệt' },
                { name: 'Lê Văn C', service: 'Máy lạnh', area: 'Quận 7', status: 'Chờ duyệt' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.service}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.area}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      user.status === 'Đã duyệt' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
