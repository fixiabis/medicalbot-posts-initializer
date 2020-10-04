import Puppeteer, { Browser } from 'puppeteer';
import PuppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { blogger, analytics } from './actions';

const options: Puppeteer.LaunchOptions = {
  headless: true,
  ignoreHTTPSErrors: true,
  defaultViewport: { width: 1366, height: 768 },
  args: ['--start-maximized', '--no-sandbox', '--disable-popup-blocking'],
};

PuppeteerExtra.use(StealthPlugin()).launch(options).then(runTask);

const identifierId = 'twmedicalrobot001';
const password = '7wm3d1c41r0b07';
const blogDisplayName = 'twmedicalrobot001';
const blogTitle = 'twmedicalrobot001-00-11';
const blogDomainPrefix = 'twmedicalrobot001-00-11';
const analyticsAccountName = 'twmedicalrobot001';
const analyticsWebsiteName = 'twmedicalrobot001';
const analyticsWebsiteUrl = `${blogDomainPrefix}.blogspot.com`;

async function runTask(browser: Browser) {
  const page = await browser.newPage();

  try {
    await blogger.signIn(page, identifierId, password);

    const blogId = await blogger.createBlog(
      page,
      blogTitle,
      blogDomainPrefix,
      blogDisplayName
    );

    console.log(`blog id: ${blogId}`);

    const analyticsId = await analytics.createAnalytics(
      page,
      analyticsAccountName,
      analyticsWebsiteName,
      analyticsWebsiteUrl
    );

    console.log(`analytics id: ${analyticsId}`);

    const analyticsCode = await analytics.getCode(page, analyticsId);

    console.log(`analytics code: ${analyticsCode}`);

    await blogger.setBlogAnalyticsCode(page, blogId, analyticsCode);
  } catch (error) {
    console.log(error.message);
  } finally {
    await browser.close();
  }
}
