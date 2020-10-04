import { Page } from 'puppeteer';

const url = (id: string) =>
  `https://analytics.google.com/analytics/web/provision/#/${id}/admin/property/settings`;

const selectors = {
  codeView:
    '#admin-content-column>section>ui-view>form>:nth-child(2)>:nth-child(2)>.content.ng-binding',
};

async function getCode(page: Page, id: string) {
  await page.goto(url(id));

  const codeView = await page.waitForSelector(selectors.codeView);

  const code = await codeView.evaluate((el) =>
    (el as HTMLDivElement).innerText.replace(/\s*/g, '')
  );

  return code;
}

export default getCode;
