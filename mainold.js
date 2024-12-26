const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIE_FILE = path.resolve(__dirname, 'cookies.json');
const LOCAL_STORAGE_FILE = path.resolve(__dirname, 'localStorage.json');



(async () => {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false, userDataDir: './userData' });
    const page = await browser.newPage();

    // Navigate to WhatsApp Web
    // await openWhatsappPage(page)
    await page.goto('https://web.whatsapp.com');


    const chatListLocator = page.locator('[aria-label="Chat list"]')
    await chatListLocator.wait()


    // Get all chat elements

    let chatElements = []
    chatElements = await page.$$('div[aria-label="Chat list"] div[role="listitem"]');  // Updated for chat list rows

    do {

        for (let i = 0; i < chatElements.length; i++) {

            try {
                // Click on each chat to open
                const chat = chatElements[i];
                await chat.click();

                await page.waitForNetworkIdle()
                // Wait for messages to load

                // Scrape messages
                const messages = await page.$$eval(
                    'div[data-pre-plain-text] span.selectable-text',
                    (elements) => elements.map((el) => el.textContent.trim())
                );

                console.log(`Found ${messages.length} messages`)

                // Get chat name
                const chatName = await page.$eval('div[id="main"] header span', (node) => node.innerText);

                console.log(`Chat with ${chatName}:`);
                console.log(messages.join('\n'));


                const fileName = chatName.replace(/[\/:*?"<>|]/g, '') + '.txt';  // Remove invalid characters for file names
                const backupDir = 'backup'
                fs.mkdirSync(backupDir, { recursive: true });
                const filePath = path.join(backupDir, fileName);

                // Save the messages to the text file
                fs.writeFileSync(filePath, messages.join('\n'), { flag: 'wx', encoding: 'utf-8' });
                console.log(`Chat with ${chatName} saved to ${filePath}`);
            } catch (err) {
                console.error(err)
            }
        }
        chatListLocator.scroll({
            scrollTop: 300.
        })
        chatElements = await page.$$('div[aria-label="Chat list"] div[role="listitem"]');  // Updated for chat list rows


        // Close the browser
    } while (chatElements.length)


    await browser.close();

})();
