const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'data', 'database.json');
const dbRaw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbRaw);

// Add more bookings for helper 3
const newBookings = [
    {
        "id": "101",
        "bookingCode": "BK-20260301-1111",
        "customerId": "2",
        "serviceId": "1",
        "addressId": "1",
        "startTime": "2026-03-01T08:00:00Z",
        "endTime": "2026-03-01T10:00:00Z",
        "durationMinutes": 120,
        "note": "Clean the house",
        "status": "COMPLETED",
        "assignedHelperId": "3",
        "pricing": { "base": 120000, "surge": 0, "discount": 0, "total": 120000, "currency": "VND" },
        "paymentStatus": { "deposit": "PAID", "final": "PAID" },
        "evidenceMedia": ["photo1.jpg"],
        "createdAt": "2026-02-28T08:00:00Z",
        "updatedAt": "2026-03-01T10:30:00Z"
    },
    {
        "id": "102",
        "bookingCode": "BK-20260302-2222",
        "customerId": "2",
        "serviceId": "2",
        "addressId": "1",
        "startTime": "2026-03-02T13:00:00Z",
        "endTime": "2026-03-02T16:00:00Z",
        "durationMinutes": 180,
        "note": "Apartment cleaning",
        "status": "COMPLETED",
        "assignedHelperId": "3",
        "pricing": { "base": 300000, "surge": 0, "discount": 0, "total": 300000, "currency": "VND" },
        "paymentStatus": { "deposit": "PAID", "final": "PAID" },
        "evidenceMedia": ["photo2.jpg"],
        "createdAt": "2026-03-01T08:00:00Z",
        "updatedAt": "2026-03-02T16:30:00Z"
    },
    {
        "id": "103",
        "bookingCode": "BK-20260303-3333",
        "customerId": "4",
        "serviceId": "3",
        "addressId": "1",
        "startTime": "2026-03-03T18:00:00Z",
        "endTime": "2026-03-03T20:00:00Z",
        "durationMinutes": 120,
        "note": "Post-party cleanup",
        "status": "CANCELLED",
        "assignedHelperId": "3",
        "pricing": { "base": 200000, "surge": 0, "discount": 0, "total": 200000, "currency": "VND" },
        "paymentStatus": { "deposit": "PAID", "final": "PENDING" },
        "evidenceMedia": [],
        "createdAt": "2026-03-02T08:00:00Z",
        "updatedAt": "2026-03-03T18:30:00Z"
    },
    {
        "id": "104",
        "bookingCode": "BK-20260304-4444",
        "customerId": "2",
        "serviceId": "4",
        "addressId": "1",
        "startTime": "2026-03-04T07:00:00Z",
        "endTime": "2026-03-04T09:00:00Z",
        "durationMinutes": 120,
        "note": "Babysitting",
        "status": "COMPLETED",
        "assignedHelperId": "3",
        "pricing": { "base": 160000, "surge": 0, "discount": 0, "total": 160000, "currency": "VND" },
        "paymentStatus": { "deposit": "PAID", "final": "PAID" },
        "evidenceMedia": [],
        "createdAt": "2026-03-03T08:00:00Z",
        "updatedAt": "2026-03-04T09:30:00Z"
    }
];

// Add more payouts for helper 3
const newPayouts = [
    { "id": "101", "bookingId": "101", "helperId": "3", "grossAmount": 120000, "commissionRate": 0.2, "commissionAmount": 24000, "helperAmount": 96000, "status": "PAID", "paidAt": "2026-03-01T18:00:00Z" },
    { "id": "102", "bookingId": "102", "helperId": "3", "grossAmount": 300000, "commissionRate": 0.2, "commissionAmount": 60000, "helperAmount": 240000, "status": "PAID", "paidAt": "2026-03-03T18:00:00Z" },
    { "id": "103", "bookingId": "103", "helperId": "3", "grossAmount": 200000, "commissionRate": 0.2, "commissionAmount": 40000, "helperAmount": 160000, "status": "CANCELLED", "paidAt": null },
    { "id": "104", "bookingId": "104", "helperId": "3", "grossAmount": 160000, "commissionRate": 0.2, "commissionAmount": 32000, "helperAmount": 128000, "status": "PAID", "paidAt": "2026-03-05T18:00:00Z" }
];

// Add more reviews for helper 3
const newReviews = [
    { "id": "101", "bookingId": "101", "customerId": "2", "helperId": "3", "rating": 5, "comment": "Tuyệt vời", "tags": ["Sạch sẽ"], "createdAt": "2026-03-02T11:00:00Z" },
    { "id": "102", "bookingId": "102", "customerId": "2", "helperId": "3", "rating": 4, "comment": "Làm sạch ban công hơi lâu", "tags": ["Đúng giờ"], "createdAt": "2026-03-04T11:00:00Z" },
    { "id": "104", "bookingId": "104", "customerId": "2", "helperId": "3", "rating": 5, "comment": "Bé rất thích cô", "tags": ["Thân thiện", "Nhiệt tình"], "createdAt": "2026-03-05T11:00:00Z" },
    { "id": "105", "bookingId": "1", "customerId": "4", "helperId": "3", "rating": 5, "comment": "Rất hài lòng", "tags": ["Kỹ lưỡng"], "createdAt": "2026-03-08T11:00:00Z" }
];

db.bookings.push(...newBookings);
db.payouts.push(...newPayouts);
db.reviews.push(...newReviews);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Mock data appended successfully!');
