export function calculateEndTimeText(startTime, durationMinutes) {
  if (!startTime || !durationMinutes) return "--:--";

  const [h, m] = String(startTime).split(":");
  const d = new Date();
  d.setHours(Number(h));
  d.setMinutes(Number(m) + Number(durationMinutes));

  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function buildPricing(basePrice) {
  const base = Number(basePrice || 0);
  return {
    base,
    surge: 0,
    discount: 0,
    total: base,
    currency: "VND"
  };
}

export function sortByNewest(items) {
  return [...(items || [])].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.updatedAt || a.startTime || 0).getTime();
    const bTime = new Date(b.createdAt || b.updatedAt || b.startTime || 0).getTime();
    return bTime - aTime;
  });
}
