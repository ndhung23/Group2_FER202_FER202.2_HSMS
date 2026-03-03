import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { statusClass } from '../utils/bookingStatus';

export default function HelperDashboard() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/api/bookings').then((res) => setItems(res.data.data || []));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/bookings/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h2>Helper Dashboard</h2>
      <table className="table">
        <thead><tr><th>Code</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {items.map((b) => (
            <tr key={b.id}>
              <td>{b.bookingCode}</td>
              <td><span className={`badge bg-${statusClass[b.status] || 'secondary'}`}>{b.status}</span></td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-info" onClick={() => updateStatus(b.id, 'IN_PROGRESS')}>Start</button>
                <button className="btn btn-sm btn-success" onClick={() => updateStatus(b.id, 'COMPLETED')}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
