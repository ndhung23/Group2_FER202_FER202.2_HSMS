import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export const ServiceListPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Dịch vụ của chúng tôi</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            HomeJoy cung cấp các giải pháp toàn diện cho ngôi nhà của bạn. Chọn dịch vụ phù hợp và đặt lịch ngay hôm nay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = (Icons as any)[service.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.name}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Giá từ</p>
                    <p className="text-xl font-extrabold text-primary">{service.pricePerHour.toLocaleString()}đ/h</p>
                  </div>
                  <Link
                    to={`/booking?service=${service.id}`}
                    className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
