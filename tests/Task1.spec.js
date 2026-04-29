import { test, expect } from '@playwright/test';

function futureDateValue(daysAhead = 30) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T10:00`;
}

test('Task 1 Test', async ({ page }) => {

    //Locators
    const emailInput = page.getByPlaceholder('you@email.com');
    const passwordInput = page.getByLabel('Password');
    const loginBtn = page.locator('#login-btn');

    let eventTitle;
    let matchedCard;
    let bookingRef;
    let matchedBookingCard;
    let seatsBeforeBooking;

    await test.step('Login', async () => {
        await page.goto('https://eventhub.rahulshettyacademy.com/login');

        await emailInput.fill('marie-valencia@gmail.com');
        await passwordInput.fill('Marie123.');
        await loginBtn.click();

        await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
        
    })

    await test.step('Create a new event', async () => {

        await page.getByRole('button', { name: 'Admin' }).click();
        await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();

        await expect(page.getByRole('heading', { name: '+ New Event' })).toBeVisible();

        eventTitle = `Test Event ${Date.now()}`;

        await page.locator('#event-title-input').fill(eventTitle);
        // await page.getByTestId('event-title-input').fill(eventTitle);

        await page.locator('#admin-event-form textarea').fill('This is a description for the test event.');
        await page.getByLabel('City').fill('New York');
        await page.getByLabel('Venue').fill('Madison Square Garden');
        await page.getByLabel('Event Date & Time').fill(futureDateValue());
        await page.getByLabel('Price ($)').fill('100');
        await page.getByLabel('Total Seats').fill('50');
        await page.locator('#add-event-btn').click();
        
        await expect(page.getByText('Event created!')).toBeVisible();
        
    })

    await test.step('Find the event card and capture seats', async () => {
        await page.getByTestId('nav-events').click();

        const eventCards = page.getByTestId('event-card');
        await expect(eventCards.first()).toBeVisible();

        matchedCard = eventCards.filter({ hasText: eventTitle });
        await expect(matchedCard).toBeVisible({ timeout: 5000 });

        const seatText = await matchedCard.locator(':text-matches("seat", "i")').innerText();
        seatsBeforeBooking = parseInt(seatText);
        console.log('Seats before booking:', seatsBeforeBooking);
    })

    await test.step('Start booking', async () => {
        await matchedCard.getByTestId('book-now-btn').click();
    })

    await test.step('Fill booking form', async () => {
    
        const ticketCount = page.locator('#ticket-count');
        await expect(ticketCount).toHaveText('1');

        await page.getByLabel("Full Name").fill('Marie Valencia');
        await page.locator('#customer-email').fill('marie-valencia@gmail.com');
        await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
        await page.locator('.confirm-booking-btn').click();
        
    })

    await test.step('Verify booking confirmation', async () => {
        const bookingRefEl = page.locator('.booking-ref').first();
        await expect(bookingRefEl).toBeVisible();

        bookingRef = (await bookingRefEl.innerText()).trim();
        console.log('Booking reference:', bookingRef);
    })

    await test.step('Verify in My Bookings', async () => {
        await page.getByTestId('nav-bookings').click();

        await expect(page).toHaveURL(/\/bookings$/);
        await expect(page.getByText(bookingRef)).toBeVisible();

        const bookingCards = page.locator('#booking-card');
        await expect(bookingCards.first()).toBeVisible();

        matchedBookingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
        await expect(matchedBookingCard).toBeVisible();

        await expect(matchedBookingCard).toContainText(eventTitle);

    })
    
    await test.step('Verify seat reduction', async () => {
        await page.goto('https://eventhub.rahulshettyacademy.com/events');

        const eventCards = page.getByTestId('event-card');
        await expect(eventCards.first()).toBeVisible();

        const updatedCard = eventCards.filter({ hasText: eventTitle }).first();
        await expect(updatedCard).toBeVisible();

        const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
        console.log('Seats after booking:', seatsAfterBooking);

        expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
    })
    
    
    
    
    
    
    
    
})
