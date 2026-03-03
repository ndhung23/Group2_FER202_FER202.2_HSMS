import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Search, Filter, ChevronRight } from 'lucide-react';
import { HELPERS } from '../constants';

export const HelperListPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Đội ngũ Helper chuyên nghiệp</h1>
            <p className="text-slate-600">Tìm kiếm người giúp việc phù hợp nhất với yêu cầu của bạn.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên, kỹ năng..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Filter size={20} />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HELPERS.map((helper) => (
            <motion.div
              key={helper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={helper.avatar}
                      alt={helper.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    {helper.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-lg border-2 border-white">
                        <ShieldCheck size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{helper.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-slate-900">{helper.rating}</span>
                      <span className="text-xs text-slate-400 font-medium">({helper.reviewCount} đánh giá)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin size={12} />
                      <span>Quận 1, TP. HCM</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Kỹ năng chính</p>
                    <div className="flex flex-wrap gap-2">
                      {helper.specialties.map((s) => (
                        <span key={s} className="px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {helper.bio}
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Kinh nghiệm</p>
                      <p className="text-sm font-bold text-slate-900">{helper.experience}</p>
                    </div>
                    <Link
                      to={`/helpers/${helper.id}`}
                      className="flex items-center gap-1 text-primary font-bold text-sm hover:gap-2 transition-all"
                    >
                      Chi tiết <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
