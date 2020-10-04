import { Page } from 'puppeteer';

const settingUrl = (id: string) =>
  `https://www.blogger.com/blog/settings/${id}`;

const selectors = {
  formOpenControl: 'c-wiz>div>c-wiz>div>div:nth-child(1)>div:nth-child(6)',
  analyticsCodeTextInput: '[aria-label="Google Analytics (分析) 資源 ID"]',
  submitButton:
    '#yDmH0d>.llhEMd.iWO5td>div>.g3VIld.FFpctc.Up8vH.Whe8ub.J9Nfi.iWO5td>.XfpsVe.J9fJmf>.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.kHssdc.HvOprf.M9Bg4d',
};

async function setBlogAnalyticsCode(
  page: Page,
  id: string,
  analyticsCode: string
) {
  await page.goto(settingUrl(id));

  const formOpenControl = await page.waitForSelector(selectors.formOpenControl);

  await formOpenControl.click();

  const analyticsCodeTextInput = await page.waitForSelector(
    selectors.analyticsCodeTextInput
  );

  /** @todo 輸入框字打不進去 */
  // await analyticsCodeTextInput.type(analyticsCode, { delay: 100 });

  await analyticsCodeTextInput.evaluate(
    (el, analyticsCode) => ((el as HTMLInputElement).value = analyticsCode),
    analyticsCode
  );

  const submitButton = await page.waitForSelector(selectors.submitButton);

  await submitButton.click();
  await page.waitForSelector(selectors.submitButton, { hidden: true });
}

export default setBlogAnalyticsCode;
