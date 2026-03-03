import './App.css';

const members = [
  {
    name: 'Member 1',
    branch: 'feature/member-1-auth-users',
    scope: 'Auth + Users API',
  },
  {
    name: 'Member 2',
    branch: 'feature/member-2-services-bookings',
    scope: 'Services + Booking core',
  },
  {
    name: 'Member 3',
    branch: 'feature/member-3-helper-module',
    scope: 'Helper profile + schedules',
  },
  {
    name: 'Member 4',
    branch: 'feature/member-4-payment-review',
    scope: 'Payments + Reviews',
  },
  {
    name: 'Member 5',
    branch: 'feature/member-5-admin-report-coupon',
    scope: 'Admin + report + coupon',
  },
  {
    name: 'Member 6',
    branch: 'feature/member-6-frontend-integration',
    scope: 'Frontend pages + API integration',
  },
];

const endpoints = [
  'POST /api/auth/register',
  'POST /api/auth/login',
  'GET /api/services',
  'POST /api/bookings',
  'GET /api/helpers/dashboard',
  'GET /api/admin/dashboard',
];

function App() {
  return (
    <div className="app">
      <header className="hero">
        <h1>Home Service Marketplace (HSMS)</h1>
        <p>MVP scaffold (JavaScript only - no TypeScript)</p>
      </header>

      <section className="panel">
        <h2>Team branch ownership (6 members)</h2>
        <div className="grid">
          {members.map((member) => (
            <article className="card" key={member.branch}>
              <h3>{member.name}</h3>
              <p>{member.scope}</p>
              <code>{member.branch}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Backend status</h2>
        <ul>
          <li>Stack: Node.js + Express + file database</li>
          <li>Auth: JWT middleware + role check</li>
          <li>Pricing: total = basePrice × hours + surge - discount</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Core API stubs</h2>
        <div className="endpoint-list">
          {endpoints.map((endpoint) => (
            <span className="badge" key={endpoint}>
              {endpoint}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
