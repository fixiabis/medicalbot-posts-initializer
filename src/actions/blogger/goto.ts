import { Page } from 'puppeteer';

const url = 'https://www.blogger.com/';

async function goto(page: Page) {
  await page.goto(url);
}

export default goto;
