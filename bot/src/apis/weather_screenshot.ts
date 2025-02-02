import path from "path";
import puppeteer from "puppeteer";
import { DATA_FOLDER } from "../fs";
// import { db } from "../../../shared/db/db";
// import { weatherShortcutTable } from "../../../shared/db/schema";

const getLocation = async (userId: string) => {
  try {
    // Fetching weather location from the database
    // const locationRecord = await db
    //   .select()
    //   .from(weatherShortcutTable)
    //   .where({ user_id: userId })
    //   .limit(1)
    //   .execute();
    // if (locationRecord.length === 0) {
    //   console.log("No weather location found for this user.");
    //   return;
    // }
    // return locationRecord[0].location;
  } catch (error) {
    console.error("Error getting weather screenshot:", error);
  }
};

export const getWeatherScreenshot = async (userId: string) => {
  console.log("Getting weather screenshot");

  //fetching weather location
  // const location = await getLocation(userId);
  const location = "Tel Aviv";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }); // Run browser in non-headless mode
  const weatherPageUrl = `https://www.google.com/search?q=weather in celsius in ${location}`; // Example URL for New York
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  console.log("Navigating to the weather page:", weatherPageUrl);
  // Navigate to the weather page
  await page.goto(weatherPageUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  }); // Wait for page to load completely

  console.log("Page loaded successfully");
  // Set viewport size for proper rendering of the screenshot
  await page.setViewport({ width: 1200, height: 800 });

  console.log("Taking screenshot of the weather page");

  // Screenshot path
  const screenshotPath = path.join(DATA_FOLDER, "weather_page_screenshot.png");

  console.log("Screenshot path:", screenshotPath);
  // Capture the screenshot
  await page.screenshot({ path: screenshotPath });
};
