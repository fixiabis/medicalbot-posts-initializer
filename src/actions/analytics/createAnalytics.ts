import { Page } from 'puppeteer';

const url =
  'https://analytics.google.com/analytics/web/provision/#/provision/create';

const redirectedUrlRegExp = /^https:\/\/analytics.google.com\/analytics\/web\/#\/report-home\/([^\/]+).*$|^https:\/\/analytics.google.com\/analytics\/web(?:\/provision)?\/\#\/([^\/]+)\/admin\/.*$/;

const selectors = {
  accountNameTextInput: '[name="name"]',
  accountNameSubmitButton: 'ga-wizard-step:first-child .continueButton',
  propertyTypeSubmitButton: 'ga-wizard-step:nth-child(2) .continueButton',
  websiteNameTextInput: '[name="websiteName"]',
  websiteUrlProtocolSelectControl:
    'ga-url-selector ga-dropdown button:first-child',
  websiteUrlProtocolSelectItem:
    'ga-url-selector ga-dropdown li[ga-select-menu-item]:nth-child(2)',
  websiteUrlTextInput: 'ga-url-selector input',
  industrySelectControl: 'ga-industry-selector ga-dropdown button:first-child',
  industrySelectItem:
    'ga-industry-selector ga-dropdown li[ga-select-menu-item][value="HEALTHCARE"]',
  websiteInfoSubmitButton: 'ga-wizard-step:nth-child(3) .continueButton',
  tosDpaCheckbox: '.large.ga-dialog > .tos-dpa > div > md-checkbox',
  dataSharingCoControllerTermsCheckbox:
    '.large.ga-dialog > .data-sharing-co-controller-terms > div:nth-child(4) > md-checkbox',
  confirmButton: '.large.ga-dialog > .ga-dialog-buttons > .btn.confirm-button',
  saveButton:
    '#mat-dialog-0 > email-preferences-dialog > div:nth-child(3) > .gmat-flat-button.save-button.mat-focus-indicator.mat-flat-button.mat-button-base.mat-primary',
  dismissButton:
    '#inproduct-guide-modal > .iph-dialog-dismiss-container > .iph-dialog-dismiss',
  noThanksButton:
    '#dialogContent_28 > div > div > .no-thanks-button.md-button.md-ga-theme.md-ink-ripple',
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

  const propertyTypeSubmitButton = await page.waitForSelector(
    selectors.propertyTypeSubmitButton
  );

  await propertyTypeSubmitButton.click();

  const websiteNameTextInput = await page.waitForSelector(
    selectors.websiteNameTextInput
  );

  await websiteNameTextInput.type(websiteName, { delay: 100 });

  const websiteUrlProtocolSelectControl = await page.waitForSelector(
    selectors.websiteUrlProtocolSelectControl
  );

  await websiteUrlProtocolSelectControl.click();

  const websiteUrlProtocolSelectItem = await page.waitForSelector(
    selectors.websiteUrlProtocolSelectItem
  );

  await websiteUrlProtocolSelectItem.click();

  const websiteUrlTextInput = await page.waitForSelector(
    selectors.websiteUrlTextInput
  );

  await websiteUrlTextInput.type(websiteUrl, { delay: 100 });

  const industrySelectControl = await page.waitForSelector(
    selectors.industrySelectControl
  );

  await industrySelectControl.click();

  const industrySelectItem = await page.waitForSelector(
    selectors.industrySelectItem
  );

  await industrySelectItem.click();

  const websiteInfoSubmitButton = await page.waitForSelector(
    selectors.websiteInfoSubmitButton
  );

  await websiteInfoSubmitButton.click();

  const tosDpaCheckbox = await page.waitForSelector(selectors.tosDpaCheckbox);

  await tosDpaCheckbox.click();

  const dataSharingCoControllerTermsCheckbox = await page.waitForSelector(
    selectors.dataSharingCoControllerTermsCheckbox
  );

  await dataSharingCoControllerTermsCheckbox.click();

  const confirmButton = await page.waitForSelector(selectors.confirmButton);

  await confirmButton.click();
  await page.waitForNavigation();

  try {
    await page.waitForSelector(selectors.saveButton, {
      hidden: true,
      timeout: 10000,
    });
  } catch (error) {
    const saveButton = await page.waitForSelector(selectors.saveButton, {
      visible: true,
      timeout: 10000,
    });

    await saveButton.click();

    const dismissButton = await page.waitForSelector(selectors.dismissButton);

    await dismissButton.click();

    const noThanksButton = await page.waitForSelector(selectors.noThanksButton);

    await noThanksButton.click();
  }

  const redirectedUrl = page.url();
  const analyticsId = redirectedUrl.replace(redirectedUrlRegExp, '$1$2');

  return analyticsId;
}

export default createAnalytics;
