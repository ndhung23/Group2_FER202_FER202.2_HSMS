import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { SERVICES, HELPERS } from '../constants';
import * as Icons from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/30 rounded-l-[100px] hidden lg:block" />
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-light text-primary rounded-full text-sm font-bold mb-6">
                ✨ Giải pháp giúp việc gia đình số 1
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                Gia đình hạnh phúc, <br />
                <span className="text-primary">Nhà cửa tinh tươm</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                HomeJoy kết nối bạn với những người giúp việc chuyên nghiệp, đã qua kiểm duyệt kỹ lưỡng. Đặt lịch chỉ trong 60 giây.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group"
                >
                  Đặt dịch vụ ngay
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
                >
                  Xem các dịch vụ
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                      alt="User"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    <span className="text-slate-900 font-bold">4.9/5</span> từ 10,000+ khách hàng
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://picsum.photos/seed/cleaning/800/1000"
                  alt="Cleaning Service"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Bảo hiểm</p>
                  <p className="text-sm font-bold text-slate-900">An tâm 100%</p>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-10 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Nhanh chóng</p>
                  <p className="text-sm font-bold text-slate-900">Có mặt sau 60p</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Dịch vụ đa dạng cho gia đình</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các giải pháp chăm sóc nhà cửa để bạn có thêm thời gian tận hưởng cuộc sống.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SERVICES.map((service) => {
              const Icon = (Icons as any)[service.icon] || Icons.HelpCircle;
              return (
                <Link
                  key={service.id}
                  to={`/booking?service=${service.id}`}
                  className="group p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-primary hover:bg-white hover:shadow-xl transition-all text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-4 mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{service.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Đặt dịch vụ dễ dàng trong 3 bước</h2>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Chọn dịch vụ', desc: 'Lựa chọn loại dịch vụ bạn cần và nhập thông tin căn nhà.' },
                  { step: '02', title: 'Chọn thời gian', desc: 'Chọn ngày và giờ phù hợp với lịch sinh hoạt của gia đình.' },
                  { step: '03', title: 'Hoàn tất & Thư giãn', desc: 'Helper sẽ đến đúng giờ và hoàn thành công việc xuất sắc.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                >
                  Bắt đầu đặt lịch ngay <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
                <img
                  src="https://picsum.photos/seed/app/600/800"
                  alt="App Interface"
                  className="rounded-3xl shadow-inner"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Helpers */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Đội ngũ Helper tiêu biểu</h2>
              <p className="text-slate-600">Những người giúp việc có đánh giá cao nhất trong tháng qua.</p>
            </div>
            <Link to="/helpers" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {HELPERS.map((helper) => (
              <motion.div
                key={helper.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={helper.avatar}
                    alt={helper.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-yellow-500 font-bold text-sm shadow-sm">
                    <Star size={14} fill="currentColor" />
                    {helper.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{helper.name}</h3>
                    {helper.verified && <CheckCircle2 size={18} className="text-primary" />}
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{helper.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {helper.specialties.map((s) => (
                      <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/helpers/${helper.id}`}
                    className="block w-full text-center py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[48px] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 border-8 border-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-white rounded-full" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 relative z-10">
              Sẵn sàng để ngôi nhà <br /> của bạn tỏa sáng?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto relative z-10">
              Tham gia cùng 50,000+ gia đình đã tin tưởng sử dụng HomeJoy mỗi ngày.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link
                to="/booking"
                className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all shadow-xl"
              >
                Đặt lịch ngay bây giờ
              </Link>
              <Link
                to="/register"
                className="px-10 py-5 bg-primary-dark text-white border border-white/20 rounded-2xl font-bold text-xl hover:bg-blue-800 transition-all"
              >
                Đăng ký thành viên
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
