import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminServicesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', basePrice: '', description: '' });

  const load = () => api.get('/api/services').then((res) => setItems(res.data.data || []));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/api/services', { ...form, basePrice: Number(form.basePrice) });
    setForm({ name: '', basePrice: '', description: '' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/api/services/${id}`);
    load();
  };

  return (
    <div>
      <h2>Admin - Services CRUD</h2>
      <form onSubmit={create} className="row g-2 mb-3">
        <div className="col"><input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="col"><input className="form-control" placeholder="Base price" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} /></div>
        <div className="col"><input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="col-auto"><button className="btn btn-primary">Create</button></div>
      </form>

      <table className="table">
        <thead><tr><th>Name</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.basePrice}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => remove(s.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
