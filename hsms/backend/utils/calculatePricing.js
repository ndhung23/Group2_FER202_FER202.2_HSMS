function calculatePricing({ basePrice, durationHours, surge = 0, discount = 0, commissionRate = 0.2 }) {
  const subtotal = basePrice * durationHours;
  const total = Math.max(0, subtotal + surge - discount);
  const commission = total * commissionRate;
  const helperReceive = total - commission;

  return {
    subtotal,
    surge,
    discount,
    total,
    commissionRate,
    commission,
    helperReceive,
  };
}

module.exports = { calculatePricing };
