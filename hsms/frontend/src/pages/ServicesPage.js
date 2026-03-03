import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/api/services').then((res) => setServices(res.data.data || []));
  }, []);

  return (
    <div>
      <h2>Dịch vụ</h2>
      <div className="row g-3">
        {services.map((s) => (
          <div className="col-md-4" key={s.id}>
            <div className="card p-3 h-100">
              <h5>{s.name}</h5>
              <p>{s.description}</p>
              <div className="fw-bold text-primary">{s.basePrice} VND/giờ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
