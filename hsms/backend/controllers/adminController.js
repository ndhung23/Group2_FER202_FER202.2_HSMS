async function adminDashboard(req, res) {
  return res.json({
    message: 'Admin dashboard stub',
    data: {
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
  });
}

module.exports = { adminDashboard };
