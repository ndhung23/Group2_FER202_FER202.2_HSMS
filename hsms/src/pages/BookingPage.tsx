import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Check, 
  ChevronRight, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  Info,
  ArrowLeft
} from 'lucide-react';
import { SERVICES, HELPERS } from '../constants';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialService = searchParams.get('service');
  
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    serviceId: initialService || '',
    address: '',
    date: '',
    time: '',
    duration: 2,
    note: '',
    paymentMethod: 'cash'
  });

  const selectedService = SERVICES.find(s => s.id === formData.serviceId);
  const totalPrice = selectedService ? selectedService.pricePerHour * formData.duration : 0;

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { id: 1, title: 'Thông tin dịch vụ' },
    { id: 2, title: 'Thời gian & Địa điểm' },
    { id: 3, title: 'Xác nhận & Thanh toán' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                    step === s.id ? "bg-primary text-white shadow-lg shadow-primary/30" : 
                    step > s.id ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                  )}>
                    {step > s.id ? <Check size={20} /> : s.id}
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    step === s.id ? "text-primary" : "text-slate-400"
                  )}>
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-200 mx-4 mt-5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Bạn cần giúp việc gì?</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {SERVICES.map((s) => {
                      const Icon = (Icons as any)[s.icon] || Icons.HelpCircle;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setFormData({ ...formData, serviceId: s.id })}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3",
                            formData.serviceId === s.id ? "border-primary bg-primary-light/30" : "border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            formData.serviceId === s.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                          )}>
                            <Icon size={20} />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Thời lượng ước tính (giờ)</label>
                    <div className="flex gap-4">
                      {[2, 3, 4, 5].map((h) => (
                        <button
                          key={h}
                          onClick={() => setFormData({ ...formData, duration: h })}
                          className={cn(
                            "flex-1 py-3 rounded-xl font-bold transition-all",
                            formData.duration === h ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!formData.serviceId}
                    onClick={nextStep}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp theo
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Thời gian & Địa điểm</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ làm việc</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          placeholder="Số nhà, tên đường, phường, quận..."
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ngày làm việc</label>
                        <input
                          type="date"
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Giờ bắt đầu</label>
                        <input
                          type="time"
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú cho Helper (không bắt buộc)</label>
                      <textarea
                        rows={3}
                        placeholder="Ví dụ: Nhà có nuôi chó, cần lau kỹ cửa kính..."
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} /> Quay lại
                    </button>
                    <button
                      disabled={!formData.address || !formData.date || !formData.time}
                      onClick={nextStep}
                      className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Xác nhận & Thanh toán</h2>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Dịch vụ</span>
                      <span className="font-bold text-slate-900">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Thời gian</span>
                      <span className="font-bold text-slate-900">{formData.date} lúc {formData.time} ({formData.duration}h)</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Địa chỉ</span>
                      <span className="font-bold text-slate-900 text-right max-w-[200px]">{formData.address}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-4">Phương thức thanh toán</label>
                    <div className="space-y-3">
                      {[
                        { id: 'cash', name: 'Tiền mặt', icon: CreditCard },
                        { id: 'wallet', name: 'Ví HomeJoy', icon: Info },
                        { id: 'momo', name: 'Ví MoMo', icon: Info },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all",
                            formData.paymentMethod === p.id ? "border-primary bg-primary-light/30" : "border-slate-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <p.icon size={20} className={formData.paymentMethod === p.id ? "text-primary" : "text-slate-400"} />
                            <span className="font-bold text-slate-900">{p.name}</span>
                          </div>
                          {formData.paymentMethod === p.id && <Check size={20} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={() => {
                        alert('Đặt lịch thành công!');
                        navigate('/dashboard/customer');
                      }}
                      className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/30"
                    >
                      Xác nhận đặt lịch - {totalPrice.toLocaleString()}đ
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Tóm tắt đơn hàng</h3>
              
              {selectedService ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                      {React.createElement((Icons as any)[selectedService.icon] || Icons.HelpCircle, { size: 20 })}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Dịch vụ</p>
                      <p className="text-sm font-bold text-slate-900">{selectedService.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Đơn giá</span>
                      <span className="text-slate-900 font-medium">{selectedService.pricePerHour.toLocaleString()}đ/h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Thời lượng</span>
                      <span className="text-slate-900 font-medium">{formData.duration} giờ</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-900 font-bold">Tổng cộng</span>
                      <span className="text-2xl font-extrabold text-primary">{totalPrice.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
                    <Info size={20} className="text-primary flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Giá đã bao gồm phí dịch vụ và bảo hiểm an tâm. Không phát sinh thêm chi phí.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Vui lòng chọn dịch vụ để xem tóm tắt</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
