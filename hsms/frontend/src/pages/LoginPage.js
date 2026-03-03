import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.data);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card p-4 col-md-6 mx-auto">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="d-grid gap-2">
        <input className="form-control" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="form-control" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
