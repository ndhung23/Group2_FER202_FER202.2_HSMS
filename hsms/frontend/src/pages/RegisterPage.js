import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', phone: '', password: '', role: 'CUSTOMER' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/api/auth/register', form);
    setMsg('Đăng ký thành công. Vui lòng đăng nhập.');
    setTimeout(() => nav('/login'), 800);
  };

  return (
    <div className="card p-4 col-md-6 mx-auto">
      <h2>Register</h2>
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={submit} className="d-grid gap-2">
        <input className="form-control" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="form-control" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="form-control" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="HELPER">HELPER</option>
        </select>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
