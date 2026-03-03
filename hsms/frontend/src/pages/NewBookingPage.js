import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function NewBookingPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ serviceId: '', addressId: 'addr_demo', startTime: '', endTime: '', note: '' });

  useEffect(() => {
    api.get('/api/services').then((res) => setServices(res.data.data || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/api/bookings', form);
    alert('Booking created');
  };

  return (
    <div className="card p-4">
      <h2>Create Booking</h2>
      <form onSubmit={submit} className="row g-2">
        <div className="col-md-6">
          <select className="form-select" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
            <option value="">Select service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="col-md-3"><input className="form-control" type="datetime-local" onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
        <div className="col-md-3"><input className="form-control" type="datetime-local" onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
        <div className="col-12"><textarea className="form-control" placeholder="Note" onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
        <div className="col-12"><button className="btn btn-primary">Create</button></div>
      </form>
    </div>
  );
}
