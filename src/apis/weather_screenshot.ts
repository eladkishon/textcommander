
import path from 'path'
import puppeteer from 'puppeteer';
import { DATA_FOLDER } from '../fs';

export const getWeatherScreenshot = async () => {
    console.log('Getting weather screenshot')

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }); // Run browser in non-headless mode
    const weatherPageUrl = 'https://www.google.com/search?q=weather in celsius'; // Example URL for New York
    const page = await browser.newPage();

    console.log('Navigating to the weather page:', weatherPageUrl);
    // Navigate to the weather page
    await page.goto(weatherPageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Wait for page to load completely

    console.log('Page loaded successfully');
    // Set viewport size for proper rendering of the screenshot
    await page.setViewport({ width: 1200, height: 800 });


    console.log('Taking screenshot of the weather page');

    // Screenshot path
    const screenshotPath = path.join(DATA_FOLDER, 'weather_page_screenshot.png');

    console.log('Screenshot path:', screenshotPath);
    // Capture the screenshot
    await page.screenshot({ path: screenshotPath });

}