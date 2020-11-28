import { Page } from 'puppeteer';

const url = (id: string) =>
  `https://analytics.google.com/analytics/web/#/${id}/admin/streams/table/`;

const selectors = {
  tableRow:
    '#admin-content-column > section > section > streams-table > div > div > table > tbody > mat-row',
  connectedCodeOpener:
    'mdx-slider-container > web-stream-details > div > div > additional-settings > div > mat-card > mat-card-content > ga-dynamic-tagging-summary > div > slat',
  codeView:
    'mdx-slider-container > ga-dynamic-tagging-editor > div > div.editor-content > mat-card > mat-card-content > mat-card > div.content > div.tag',
};

async function getCode(page: Page, id: string) {
  await page.goto(url(id));

  const tableRow = await page.waitForSelector(selectors.tableRow);

  await tableRow.click();

  const connectedCodeOpener = await page.waitForSelector(
    selectors.connectedCodeOpener
  );

  await connectedCodeOpener.click();

  const codeView = await page.waitForSelector(selectors.codeView);

  const code = await codeView.evaluate((el) =>
    (el as HTMLDivElement).innerText.replace(/\s*/g, '')
  );

  return code;
}

export default getCode;
