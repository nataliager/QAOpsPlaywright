import { test, expect } from '@playwright/test';

// Setup — BASE_URL
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Setup — reusable helper: logs in and confirms Browse Events → link is visible
async function loginAndGoToBooking(page) {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill('marie-valencia@gmail.com');
    await page.getByLabel('Password').fill('Marie123.');
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// ── Test 1: Single ticket booking is eligible for refund ──────────────────────
test('Single ticket booking is eligible for refund', async ({ page }) => {

    // Step 1 — Login: call login helper
    await test.step('Login', async () => {
        await loginAndGoToBooking(page);
    })

    // Step 2 — Book first event with 1 ticket (default)
    // - Navigate to /events
    // - Click Book Now on the very first event card (event-card → first → book-now-btn)
    // - Fill Full Name, Email, Phone
    // - Click confirm button (.confirm-booking-btn)
    await test.step('Book first event with 1 ticket', async () => {
        await page.goto(`${BASE_URL}/events`);

        const firstCard = page.getByTestId('event-card').first();
        await firstCard.getByTestId('book-now-btn').click();

        await page.getByLabel('Full Name').fill('Marie Valencia');
        await page.locator('#customer-email').fill('marie-valencia@gmail.com');
        await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
        await page.locator('.confirm-booking-btn').click();
    })

    // Step 3 — Navigate to booking detail
    // - Click View My Bookings link
    // - Assert URL is /bookings
    // - Click the first View Details link
    // - Assert: text Booking Information is visible
    await test.step('Navigate to booking detail', async () => {
        await page.getByRole('link', { name: 'View My Bookings' }).click();
        await expect(page).toHaveURL(/\/bookings$/);

        await page.getByRole('link', { name: 'View Details' }).first().click();
        await expect(page.getByText('Booking Information')).toBeVisible();
    })

    // Step 4 — Validate booking ref
    // - Read booking ref from page (span.font-mono)
    // - Read event title from h1
    // - Assert: first character of booking ref equals first character of event title
    await test.step('Validate booking ref', async () => {
        const bookingRefEl = page.locator('span.font-mono').first();
        await expect(bookingRefEl).toBeVisible({ timeout: 5000 });
        const bookingRef = (await bookingRefEl.innerText()).trim();
        const eventTitle = (await page.locator('h1').first().innerText()).trim();
        expect(bookingRef[0].toLowerCase()).toBe(eventTitle[0].toLowerCase());
    })

    // Step 5 — Check refund eligibility
    // - Click the Check Refund Eligibility button (data-testid="check-refund-btn")
    // - Assert: spinner (#refund-spinner) is immediately visible
    // - Assert: spinner is no longer visible within 6 seconds
    await test.step('Check refund eligibility', async () => {
        await page.getByTestId('check-refund-btn').click();
        await expect(page.locator('#refund-spinner')).toBeVisible();
        await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
    })

    // Step 6 — Validate result
    // - Locate #refund-result and assert it is visible
    // - Assert it contains text "Eligible for refund"
    // - Assert it contains text "Single-ticket bookings qualify for a full refund"
    await test.step('Validate result', async () => {
        const result = page.locator('#refund-result');
        await expect(result).toBeVisible();
        await expect(result).toContainText('Eligible for refund');
        await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
    })

})

// ── Test 2: Group ticket booking is NOT eligible for refund ───────────────────
test('Group ticket booking is NOT eligible for refund', async ({ page }) => {

    // Step 1 — Login: call login helper
    await test.step('Login', async () => {
        await loginAndGoToBooking(page);
    })

    // Step 2 — Same as Test 1, except click + button twice to increase quantity to 3
    // - Locate increment button with button:has-text("+") and click it twice
    await test.step('Book first event with 3 tickets', async () => {
        await page.goto(`${BASE_URL}/events`);

        const firstCard = page.getByTestId('event-card').first();
        await firstCard.getByTestId('book-now-btn').click();

        const incrementBtn = page.locator('button:has-text("+")');
        await incrementBtn.click();
        await incrementBtn.click();

        await page.getByLabel('Full Name').fill('Marie Valencia');
        await page.locator('#customer-email').fill('marie-valencia@gmail.com');
        await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
        await page.locator('.confirm-booking-btn').click();
    })

    // Steps 3–5 — Identical to Test 1
    await test.step('Navigate to booking detail', async () => {
        await page.getByRole('link', { name: 'View My Bookings' }).click();
        await expect(page).toHaveURL(/\/bookings$/);

        await page.getByRole('link', { name: 'View Details' }).first().click();
        await expect(page.getByText('Booking Information')).toBeVisible();
    })

    await test.step('Validate booking ref', async () => {
        const bookingRefEl = page.locator('span.font-mono').first();
        await expect(bookingRefEl).toBeVisible({ timeout: 5000 });
        const bookingRef = (await bookingRefEl.innerText()).trim();
        const eventTitle = (await page.locator('h1').first().innerText()).trim();
        expect(bookingRef[0].toLowerCase()).toBe(eventTitle[0].toLowerCase());
    })

    await test.step('Check refund eligibility', async () => {
        await page.getByTestId('check-refund-btn').click();
        await expect(page.locator('#refund-spinner')).toBeVisible();
        await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
    })

    // Step 6 — Validate result (different assertions)
    // - Assert result contains "Not eligible for refund"
    // - Assert result contains "Group bookings (3 tickets) are non-refundable"
    await test.step('Validate result', async () => {
        const result = page.locator('#refund-result');
        await expect(result).toBeVisible();
        await expect(result).toContainText('Not eligible for refund');
        await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
    })

})
