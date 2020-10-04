import { Page } from 'puppeteer';

const url = 'https://www.blogger.com/go/signin?hl=zh-TW';

const selectors = {
  identifierIdTextInput: '#identifierId',
  identifierIdSubmitButton: '#identifierNext',
  passwordTextInput: '[name="password"]',
  passwordSubmitButton: '#passwordNext',
};

async function signIn(page: Page, identifierId: string, password: string) {
  await page.goto(url);

  const identifierIdTextInput = await page.waitForSelector(
    selectors.identifierIdTextInput,
    {
      visible: true,
    }
  );

  await identifierIdTextInput.type(identifierId, { delay: 100 });

  const identifierIdSubmitButton = await page.waitForSelector(
    selectors.identifierIdSubmitButton
  );

  await identifierIdSubmitButton.click();
  await page.waitForNavigation();

  const passwordTextInput = await page.waitForSelector(
    selectors.passwordTextInput,
    {
      visible: true,
    }
  );

  await passwordTextInput.type(password, { delay: 100 });

  const passwordSubmitButton = await page.waitForSelector(
    selectors.passwordSubmitButton
  );

  await passwordSubmitButton.click();
  await page.waitForNavigation();
}

export default signIn;
