import { Page } from 'puppeteer';

const onboardingUrlRegExp = /^https:\/\/www.blogger.com\/onboarding/;

const selectors = {
  formOpenControl:
    'c-wiz>:first-child[role="button"], c-wiz>:first-child>[role="listbox"]',
  formOpenSelectItem:
    'c-wiz>:first-child>[role="listbox"]>:last-child>:last-child',
  titleTextInput: '[aria-label="標題"]',
  domainPrefixTextInput: '[aria-label="網址"]',
  displayNameTextInput: '[aria-label="顯示名稱"]',
  submitButton:
    'c-wiz>div>span>:nth-child(3)>:last-child>div>:nth-child(2)>:last-child:not(.RDPZE)',
  blogSelectItem: (title: string) => `[aria-label="${title}"]`,
};

async function createBlog(
  page: Page,
  title: string,
  domainPrefix: string,
  displayName: string
) {
  const url = page.url();
  const isOnboarding = onboardingUrlRegExp.test(url);

  if (!isOnboarding) {
    openForm(page);
    submitForm(page, title, domainPrefix);
  } else {
    submitForm(page, title, domainPrefix, displayName);
  }

  const blogId = getBlogId(page, title);
  return blogId;
}

async function openForm(page: Page) {
  const formOpenControl = await page.waitForSelector(
    selectors.formOpenControl,
    { visible: true }
  );

  const formOpenControlRole = await formOpenControl.evaluate((el) =>
    el.getAttribute('role')
  );

  await formOpenControl.click();

  if (formOpenControlRole === 'listbox') {
    const formOpenSelectItem = await page.waitForSelector(
      selectors.formOpenSelectItem,
      { visible: true }
    );

    await formOpenSelectItem.click();
  }
}

async function submitForm(
  page: Page,
  title: string,
  domainPrefix: string,
  displayName?: string
) {
  const titleTextInput = await page.waitForSelector(selectors.titleTextInput);
  await titleTextInput.type(title, { delay: 100 });

  const titleSubmitButton = await page.waitForSelector(selectors.submitButton);

  await titleSubmitButton.click();

  const domainPrefixTextInput = await page.waitForSelector(
    selectors.domainPrefixTextInput
  );

  await domainPrefixTextInput.type(domainPrefix, { delay: 100 });

  const domainPrefixSubmitButton = await page.waitForSelector(
    selectors.submitButton
  );

  await domainPrefixSubmitButton.click();

  if (displayName) {
    const displayNameTextInput = await page.waitForSelector(
      selectors.displayNameTextInput
    );

    await displayNameTextInput.type(displayName, { delay: 100 });

    const displayNameSubmitButton = await page.waitForSelector(
      selectors.submitButton
    );

    await displayNameSubmitButton.click();
  }

  await page.waitForNavigation();
}

async function getBlogId(page: Page, title: string) {
  const blogSelectItem = await page.waitForSelector(
    selectors.blogSelectItem(title)
  );

  const blogId = await blogSelectItem.evaluate(
    (el) => el.getAttribute('data-value') as string
  );

  return blogId;
}

export default createBlog;
