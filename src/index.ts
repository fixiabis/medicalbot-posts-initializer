import Axios from 'axios';
import Puppeteer, { Browser } from 'puppeteer';
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
  for (const blogInfo of blogInfos) {
    await runTask(blogInfo);
  }
}

async function runTask(blogInfo: BlogInfo) {
  const browser = await PuppeteerExtra.launch(launchOptions);
  const page = await browser.newPage();

  console.log('got info:', blogInfo);

  try {
    await blogger.signIn(page, blogInfo.account, blogInfo.password);

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
  } finally {
    try {
      await browser.close();
    } catch (error) {}
  }
}
