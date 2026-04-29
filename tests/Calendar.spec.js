import { test, expect } from '@playwright/test';

test('Calendar validations', async ({ page }) => {

    const monthNumber = "6";
    const dateNumber = "15";
    const yearNumber = "2027";
    const expectedDate = [monthNumber, dateNumber, yearNumber];

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    //Open calendar
    await page.locator(".react-date-picker__inputGroup").click();

    //select year section
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    //Select year
    await page.getByText(yearNumber).click();

    //Select month
    await page.locator(".react-calendar__year-view .react-calendar__tile").nth(Number(monthNumber) - 1).click();

    //Select date
    await page.locator(`//abbr[text()="${dateNumber}"]`).click();

    //Assertion
    const inputs = page.locator('.react-date-picker__inputGroup__input');

    for (let i = 0; i < expectedDate.length; i++) {
        await expect(inputs.nth(i)).toHaveValue(expectedDate[i]);
    }

    
})
