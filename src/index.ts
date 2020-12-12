import Axios from 'axios';
import Puppeteer from 'puppeteer';
import PuppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { blogger, analytics } from './actions';

const launchOptions: Puppeteer.LaunchOptions = {
  headless: false,
  ignoreHTTPSErrors: true,
  defaultViewport: { width: 1366, height: 768 },
  args: ['--start-maximized', '--no-sandbox', '--disable-popup-blocking'],
};

PuppeteerExtra.use(StealthPlugin());

const infoApiUrl =
  'https://script.google.com/macros/s/AKfycbyZtHBX9sRYRt9-2A76oFt2ANWzV9HgPK2jMWSQfJmoGlIZVXc/exec?sheet=blogs';

Axios.get(infoApiUrl)
  .then(({ data }) => data)
  .then(runTasks);

interface BlogInfo {
  title: string;
  domainPrefix: string;
  themeName: string;
  account: string;
  password: string;
  blogUserName: string;
}

async function runTasks(blogInfos: BlogInfo[]) {
  let browser: Puppeteer.Browser | null = null;
  let page: Puppeteer.Page | null = null;
  let prevBlogInfo: BlogInfo | null = null;

  for (const blogInfo of blogInfos) {
    const isBlogInfoAccountSignedIn = false;
    // const isBlogInfoAccountSignedIn =
    // prevBlogInfo && blogInfo.account === prevBlogInfo.account;

    if (!isBlogInfoAccountSignedIn && browser) {
      const pages = await browser.pages();
      await Promise.all(pages.map((page) => page.close()));
      await browser.close();
      browser = null;
    }

    if (!browser) {
      browser = await PuppeteerExtra.launch(launchOptions);
    }

    page = await browser.newPage();

    if (!isBlogInfoAccountSignedIn) {
      await blogger.signIn(page, blogInfo.account, blogInfo.password);
    } else {
      await blogger.goto(page);
    }

    await runTask(page, blogInfo);
    await page.close();
    page = null;
    prevBlogInfo = blogInfo;
  }
}

async function runTask(page: Puppeteer.Page, blogInfo: BlogInfo) {
  console.log('got info:', blogInfo);

  try {
    const blogId = await blogger.createBlog(
      page,
      blogInfo.title,
      blogInfo.domainPrefix,
      blogInfo.blogUserName
    );

    console.log(`blog id: ${blogId}`);

    const analyticsId = await analytics.createAnalytics(
      page,
      blogInfo.domainPrefix,
      blogInfo.domainPrefix,
      `${blogInfo.domainPrefix}.blogspot.com`
    );

    console.log(`analytics id: ${analyticsId}`);

    const analyticsCode = await analytics.getCode(page, analyticsId);

    console.log(`analytics code: ${analyticsCode}`);

    await blogger.setBlogAnalyticsCode(page, blogId, analyticsCode);
    await blogger.setBlogTheme(page, blogId, blogInfo.themeName);
  } catch (error) {
    console.log(error.message);
  }
}
