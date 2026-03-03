import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, Calendar, Clock, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { HELPERS } from '../constants';

export const HelperDetailPage = () => {
  const { id } = useParams();
  const helper = HELPERS.find(h => h.id === id);

  if (!helper) return <div className="p-20 text-center">Helper không tồn tại</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/helpers" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-8">
          <ArrowLeft size={20} /> Quay lại danh sách
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative">
                  <img
                    src={helper.avatar}
                    alt={helper.name}
                    className="w-40 h-40 rounded-[32px] object-cover border-4 border-white shadow-lg"
                  />
                  {helper.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl border-4 border-white">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">{helper.name}</h1>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">Đang rảnh</span>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={18} fill="currentColor" />
                      <span className="text-lg font-bold text-slate-900">{helper.rating}</span>
                      <span className="text-sm text-slate-400">({helper.reviewCount} đánh giá)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin size={18} />
                      <span className="text-sm font-medium">Quận 1, TP. HCM</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Kinh nghiệm</p>
                      <p className="text-lg font-bold text-slate-900">{helper.experience}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Hoàn thành</p>
                      <p className="text-lg font-bold text-slate-900">450+</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phản hồi</p>
                      <p className="text-lg font-bold text-slate-900">99%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Giới thiệu bản thân</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {helper.bio}
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Kỹ năng & Chuyên môn</h3>
              <div className="flex flex-wrap gap-3">
                {helper.specialties.map((s) => (
                  <div key={s} className="flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-xl font-bold text-sm">
                    <CheckCircle2 size={16} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Đánh giá từ khách hàng</h2>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                    <img
                      src={`https://picsum.photos/seed/reviewer${i}/100/100`}
                      className="w-12 h-12 rounded-full object-cover"
                      alt="Reviewer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900">Khách hàng {i}</h4>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">2 ngày trước</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Chị Hoa làm việc rất cẩn thận, sạch sẽ và đúng giờ. Gia đình tôi rất hài lòng và sẽ tiếp tục đặt chị trong tương lai.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Đặt lịch với {helper.name}</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Ngày rảnh gần nhất</p>
                    <p className="text-sm font-bold text-slate-900">Hôm nay, 04/03</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Clock size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Khung giờ</p>
                    <p className="text-sm font-bold text-slate-900">08:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              <Link
                to={`/booking?helper=${helper.id}`}
                className="block w-full text-center py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 mb-4"
              >
                Đặt lịch ngay
              </Link>
              <button className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <MessageSquare size={20} /> Chat với Helper
              </button>
              
              <p className="mt-6 text-center text-xs text-slate-400 px-4">
                Bằng cách đặt lịch, bạn đồng ý với các điều khoản bảo hiểm và an toàn của HomeJoy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
