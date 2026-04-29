const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = { email: 'testuser.yahoo@yahoo.com', password: 'Yahoo@1234' };
const GMAIL_USER = { email: 'marie.valencia@gmail.com', password: 'Marie123.' };

async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);
  await page.locator('#login-btn').click();
  await page.waitForURL(`${BASE_URL}/`);
}

test('Cross-User Booking Access Denied', async ({ page, request }) => {
  // Step 1 — Login as Yahoo user via API
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { email: YAHOO_USER.email, password: YAHOO_USER.password },
  });
  expect(loginRes.ok()).toBeTruthy();
  const loginJson = await loginRes.json();
  const token = loginJson.token;

  // Step 2 — Fetch events to get a valid event ID
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(eventsRes.ok()).toBeTruthy();
  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id;
  console.log(eventId);

  // Step 3 — Create a booking as Yahoo user
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '9876543210',
      quantity: 1,
    },
  });
  expect(bookingRes.ok()).toBeTruthy();
  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  // Step 4 — Login as Gmail user via browser UI
  await loginAs(page, GMAIL_USER);

  // Step 5 — Navigate to Yahoo's booking URL as Gmail user
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { waitUntil: 'networkidle' });

  // Step 6 — Validate Access Denied
  await expect(page.getByText('Access Denied')).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();
});
