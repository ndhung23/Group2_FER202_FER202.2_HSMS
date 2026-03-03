import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { statusClass } from '../utils/bookingStatus';

export default function CustomerBookingsPage() {
  const [items, setItems] = useState([]);

  const fetchData = () => api.get('/api/bookings').then((res) => setItems(res.data.data || []));

  useEffect(() => { fetchData(); }, []);

  const markCancelled = async (id) => {
    await api.patch(`/api/bookings/${id}/status`, { status: 'CANCELLED' });
    fetchData();
  };

  return (
    <div>
      <h2>My Bookings</h2>
      <table className="table">
        <thead><tr><th>Code</th><th>Status</th><th>Total</th><th></th></tr></thead>
        <tbody>
          {items.map((b) => (
            <tr key={b.id}>
              <td>{b.bookingCode}</td>
              <td><span className={`badge bg-${statusClass[b.status] || 'secondary'}`}>{b.status}</span></td>
              <td>{b.pricing?.total}</td>
              <td>{b.status === 'PENDING_MATCH' && <button className="btn btn-sm btn-danger" onClick={() => markCancelled(b.id)}>Cancel</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
