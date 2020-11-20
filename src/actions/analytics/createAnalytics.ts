import { Page } from 'puppeteer';

const url =
  'https://analytics.google.com/analytics/web/provision/#/provision/create';

const redirectedUrlRegExp = /^https:\/\/analytics.google.com\/analytics\/web\/#\/report-home\/([^\/]+).*$|^https:\/\/analytics.google.com\/analytics\/web(?:\/provision)?\/\#\/([^\/]+)\/admin\/.*$/;

const selectors = {
  accountNameTextInput: '[name="name"]',
  accountNameSubmitButton: '#cdk-step-content-0-0 > div > button',
  websiteNameTextInput: '#name',
  websiteNameSubmitButton: '#cdk-step-content-0-1 > div > div > button',
  industrySelectControl:
    '#cdk-step-content-0-2 > div > ga-business-info > gmat-card > div.card-body > industry-selector > searchable-select > button',
  industrySelectItem:
    '#mat-menu-panel-3 > div > div > div > button:nth-child(11)',
  businessSizeRadioItem: '#mat-radio-2 > label',
  intendedUseCheckboxItem: '#mat-checkbox-2 > label',
  submitButton:
    '#cdk-step-content-0-2 > div > button.gmat-button.step-button.mat-focus-indicator.mat-flat-button.mat-button-base.mat-primary.ng-star-inserted',
  tosDpaCheckbox: '.large.ga-dialog > .tos-dpa > div > md-checkbox',
  dataSharingCoControllerTermsCheckbox:
    '.large.ga-dialog > .data-sharing-co-controller-terms > div:nth-child(4) > md-checkbox',
  confirmButton: '.large.ga-dialog > .ga-dialog-buttons > .btn.confirm-button',
};

async function createAnalytics(
  page: Page,
  accountName: string,
  websiteName: string,
  websiteUrl: string
) {
  await page.goto(url);

  const accountNameTextInput = await page.waitForSelector(
    selectors.accountNameTextInput
  );

  await accountNameTextInput.type(accountName, { delay: 100 });

  const accountNameSubmitButton = await page.waitForSelector(
    selectors.accountNameSubmitButton
  );

  await accountNameSubmitButton.click();

  const websiteNameTextInput = await page.waitForSelector(
    selectors.websiteNameTextInput
  );

  await websiteNameTextInput.type(websiteName, { delay: 100 });

  const websiteNameSubmitButton = await page.waitForSelector(
    selectors.websiteNameSubmitButton
  );

  await websiteNameSubmitButton.click();

  await new Promise((delay) => setTimeout(delay, 2000));

  const industrySelectControl = await page.waitForSelector(
    selectors.industrySelectControl
  );

  await industrySelectControl.click();

  const industrySelectItem = await page.waitForSelector(
    selectors.industrySelectItem
  );

  await industrySelectItem.click();

  const businessSizeRadioItem = await page.waitForSelector(
    selectors.businessSizeRadioItem
  );

  await businessSizeRadioItem.click();

  const intendedUseCheckboxItem = await page.waitForSelector(
    selectors.intendedUseCheckboxItem
  );

  await intendedUseCheckboxItem.click();

  const submitButton = await page.waitForSelector(selectors.submitButton);

  await submitButton.click();

  const tosDpaCheckbox = await page.waitForSelector(selectors.tosDpaCheckbox);

  await tosDpaCheckbox.click();

  const dataSharingCoControllerTermsCheckbox = await page.waitForSelector(
    selectors.dataSharingCoControllerTermsCheckbox
  );

  await dataSharingCoControllerTermsCheckbox.click();

  const confirmButton = await page.waitForSelector(selectors.confirmButton);

  await confirmButton.click();
  await page.waitForNavigation();

  const redirectedUrl = page.url();
  const analyticsId = redirectedUrl.replace(redirectedUrlRegExp, '$1$2');

  return analyticsId;
}

export default createAnalytics;
