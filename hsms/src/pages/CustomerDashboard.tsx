import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Star,
  Bell,
  Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';

export const CustomerDashboard = () => {
  const bookings = [
    { id: '1', service: 'Dọn dẹp nhà cửa', date: '05/03/2026', time: '08:00', status: 'Sắp tới', helper: 'Nguyễn Thị Hoa', price: '160,000đ' },
    { id: '2', service: 'Giặt ủi', date: '01/03/2026', time: '14:00', status: 'Hoàn thành', helper: 'Lê Thị Mai', price: '140,000đ' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold text-slate-900">HomeJoy</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Tổng quan', icon: Calendar, active: true },
            { name: 'Lịch sử đặt', icon: Clock },
            { name: 'Ví của tôi', icon: Wallet },
            { name: 'Thông báo', icon: Bell },
            { name: 'Cài đặt', icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </a>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all mt-auto">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Chào buổi sáng, An!</h1>
            <p className="text-slate-500 font-medium">Hôm nay bạn có 1 lịch dọn dẹp sắp tới.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img src="https://picsum.photos/seed/user/100/100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Nguyễn An</p>
                <p className="text-xs text-slate-400 font-medium">Khách hàng Vàng</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Số dư ví', value: '1,250,000đ', icon: Wallet, color: 'bg-blue-500' },
            { label: 'Số đơn đã đặt', value: '12', icon: Calendar, color: 'bg-emerald-500' },
            { label: 'Điểm thưởng', value: '450', icon: Star, color: 'bg-amber-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Lịch đặt gần đây</h2>
            <button className="text-sm font-bold text-primary hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Dịch vụ</th>
                  <th className="px-8 py-4">Helper</th>
                  <th className="px-8 py-4">Thời gian</th>
                  <th className="px-8 py-4">Trạng thái</th>
                  <th className="px-8 py-4">Tổng tiền</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">{booking.service}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> Quận 1, TP. HCM
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img src={`https://picsum.photos/seed/${booking.helper}/100/100`} className="w-8 h-8 rounded-full" alt="Helper" />
                        <span className="text-sm font-medium text-slate-700">{booking.helper}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{booking.date}</p>
                      <p className="text-xs text-slate-400">{booking.time}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        booking.status === 'Sắp tới' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900">{booking.price}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
