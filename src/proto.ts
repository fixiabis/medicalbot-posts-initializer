import Puppeteer from 'puppeteer';
import PuppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const options: Puppeteer.LaunchOptions = {
  headless: true,
  ignoreHTTPSErrors: true,
  defaultViewport: { width: 1366, height: 768 },
  args: ['--start-maximized', '--no-sandbox', '--disable-popup-blocking'],
};

PuppeteerExtra.use(StealthPlugin())
  .launch(options)
  .then(async (browser) => {
    const page = await browser.newPage();

    try {
      await signIn('twmedicalrobot001', '7wm3d1c41r0b07');

      const title = 'twmedicalrobot001-00-08';
      const domainPrefix = 'twmedicalrobot001-00-08';

      const blogId = await createBlog(title, domainPrefix, 'twmedicalrobot001');
      console.log(`blog id: ${blogId}`);

      const analyticsId = await createAnalytics(
        domainPrefix,
        `${domainPrefix}.blogspot.com`
      );
      console.log(`analytics id: ${analyticsId}`);

      const analyticsCode = await getAnalyticsCode(analyticsId);
      console.log(`analytics code: ${analyticsCode}`);

      await setBlogAnalyticsCode(blogId, analyticsCode);
      await browser.close();
    } catch (error) {
      console.log(error.message);
    }

    async function signIn(identifierId: string, password: string) {
      await page.goto('https://www.blogger.com/go/signin?hl=zh-TW');

      const identifierIdInput = await page.waitForSelector('#identifierId', {
        visible: true,
      });

      await identifierIdInput.type(identifierId, { delay: 100 });

      const identifierIdSubmitButton = await page.waitForSelector(
        '#identifierNext'
      );

      await identifierIdSubmitButton.click();
      await page.waitForNavigation();

      const passwordInput = await page.waitForSelector('[name="password"]', {
        visible: true,
      });

      await passwordInput.type(password, { delay: 100 });

      const submitButton = await page.waitForSelector('#passwordNext');

      await submitButton.click();
      await page.waitForNavigation();
    }

    async function createBlog(
      title: string,
      domainPrefix: string,
      displayName: string
    ) {
      const currentUrl = page.url();

      if (/^https:\/\/www.blogger.com\/onboarding/.test(currentUrl)) {
        await submitBlogCreateForm(title, domainPrefix, displayName);
      } else {
        await openBlogCreateForm();
        await submitBlogCreateForm(title, domainPrefix);
      }

      const blogOpenControlItem = await page.waitForSelector(
        `[aria-label="${title}"]`
      );

      const blogId = await blogOpenControlItem.evaluate(
        (blogOpenControlItem) =>
          blogOpenControlItem.getAttribute('data-value') as string
      );

      return blogId;
    }

    async function openBlogCreateForm() {
      const formOpenControl = await page.waitForSelector(
        'c-wiz>:first-child[role="button"], c-wiz>:first-child>[role="listbox"]',
        { visible: true }
      );

      const formOpenControlRole = await formOpenControl.evaluate(
        (buttonOrListbox) => buttonOrListbox.getAttribute('role')
      );

      await formOpenControl.click();

      if (formOpenControlRole === 'listbox') {
        const formOpenControlItem = await page.waitForSelector(
          'c-wiz>:first-child>[role="listbox"]>:last-child>:last-child',
          { visible: true }
        );

        await formOpenControlItem.click();
      }
    }

    async function submitBlogCreateForm(
      title: string,
      domainPrefix: string,
      displayName?: string
    ) {
      const submitButtonCssQuery =
        'c-wiz>div>span>:nth-child(3)>:last-child>div>:nth-child(2)>:last-child';

      const titleInput = await page.waitForSelector('[aria-label="標題"]');
      await titleInput.type(title, { delay: 100 });

      const titleSubmitButton = await page.waitForSelector(
        submitButtonCssQuery
      );

      await titleSubmitButton.click();

      const domainPrefixInput = await page.waitForSelector(
        '[aria-label="網址"]'
      );

      await domainPrefixInput.type(domainPrefix, { delay: 100 });

      const domainPrefixSubmitButton = await page.waitForSelector(
        `${submitButtonCssQuery}:not(.RDPZE)`
      );

      await domainPrefixSubmitButton.click();

      if (displayName) {
        const displayNameInput = await page.waitForSelector(
          '[aria-label="顯示名稱"]'
        );

        await displayNameInput.type(displayName, { delay: 100 });

        const displayNameSubmitButton = await page.waitForSelector(
          submitButtonCssQuery
        );

        await displayNameSubmitButton.click();
      }

      await page.waitForNavigation();
    }

    async function createAnalytics(websiteName: string, websiteUrl: string) {
      await page.goto(
        'https://analytics.google.com/analytics/web/provision/#/provision/create'
      );

      const nameInput = await page.waitForSelector('[name="name"]');

      await nameInput.type(websiteName, { delay: 100 });

      const accountNameSubmitButton = await page.waitForSelector(
        'ga-wizard-step:first-child .continueButton'
      );

      await accountNameSubmitButton.click();

      const propertyTypeSubmitButton = await page.waitForSelector(
        'ga-wizard-step:nth-child(2) .continueButton'
      );

      await propertyTypeSubmitButton.click();

      const websiteNameInput = await page.waitForSelector(
        '[name="websiteName"]'
      );

      await websiteNameInput.type(websiteName, { delay: 100 });

      const websiteUrlProtocolSelectButton = await page.waitForSelector(
        'ga-url-selector ga-dropdown button:first-child'
      );

      await websiteUrlProtocolSelectButton.click();

      const websiteUrlProtocolSelectItemButton = await page.waitForSelector(
        'ga-url-selector ga-dropdown li[ga-select-menu-item]:nth-child(2)'
      );

      await websiteUrlProtocolSelectItemButton.click();

      const websiteUrlInput = await page.waitForSelector(
        'ga-url-selector input'
      );

      await websiteUrlInput.type(websiteUrl, { delay: 100 });

      const industrySelectButton = await page.waitForSelector(
        'ga-industry-selector ga-dropdown button:first-child'
      );

      await industrySelectButton.click();

      const industrySelectItemButton = await page.waitForSelector(
        'ga-industry-selector ga-dropdown li[ga-select-menu-item][value="HEALTHCARE"]'
      );

      await industrySelectItemButton.click();

      const submitButton = await page.waitForSelector(
        'ga-wizard-step:nth-child(3) .continueButton'
      );

      await submitButton.click();

      const tosDpaCheckbox = await page.waitForSelector(
        '.large.ga-dialog > .tos-dpa > div > md-checkbox'
      );

      await tosDpaCheckbox.click();

      const dataSharingCoControllerTermsCheckbox = await page.waitForSelector(
        '.large.ga-dialog > .data-sharing-co-controller-terms > div:nth-child(4) > md-checkbox'
      );

      await dataSharingCoControllerTermsCheckbox.click();

      const confirmButton = await page.waitForSelector(
        '.large.ga-dialog > .ga-dialog-buttons > .btn.confirm-button'
      );

      await confirmButton.click();
      await page.waitForNavigation();

      try {
        await page.waitForSelector(
          '#mat-dialog-0 > email-preferences-dialog > div:nth-child(3) > .gmat-flat-button.save-button.mat-focus-indicator.mat-flat-button.mat-button-base.mat-primary',
          { hidden: true, timeout: 10000 }
        );
      } catch (error) {
        const saveButton = await page.waitForSelector(
          '#mat-dialog-0 > email-preferences-dialog > div:nth-child(3) > .gmat-flat-button.save-button.mat-focus-indicator.mat-flat-button.mat-button-base.mat-primary',
          { visible: true, timeout: 10000 }
        );

        await saveButton.click();

        const dismissButton = await page.waitForSelector(
          '#inproduct-guide-modal > .iph-dialog-dismiss-container > .iph-dialog-dismiss'
        );

        await dismissButton.click();

        const noThanksButton = await page.waitForSelector(
          '#dialogContent_28 > div > div > .no-thanks-button.md-button.md-ga-theme.md-ink-ripple'
        );

        await noThanksButton.click();
      }

      const analyticsReportUrlRegExp = /^https:\/\/analytics.google.com\/analytics\/web\/#\/report-home\/([^\/]+).*$|^https:\/\/analytics.google.com\/analytics\/web(?:\/provision)?\/\#\/([^\/]+)\/admin\/.*$/;
      const analyticsReportUrl = page.url();
      const analyticsId = analyticsReportUrl.replace(
        analyticsReportUrlRegExp,
        '$1$2'
      );

      return analyticsId;
    }

    async function getAnalyticsCode(analyticsId: string) {
      await page.goto(
        `https://analytics.google.com/analytics/web/provision/#/${analyticsId}/admin/property/settings`
      );

      const analyticsCodeView = await page.waitForSelector(
        '#admin-content-column > section > ui-view > form > :nth-child(2) > :nth-child(2) > .content.ng-binding'
      );

      const analyticsCode = await analyticsCodeView.evaluate(
        (analyticsCodeView) =>
          (analyticsCodeView as HTMLDivElement).innerText.replace(/\s*/g, '')
      );

      return analyticsCode;
    }

    async function setBlogAnalyticsCode(blogId: string, analyticsCode: string) {
      await page.goto(`https://www.blogger.com/blog/settings/${blogId}`);

      const formOpenControl = await page.waitForSelector(
        'c-wiz > div > c-wiz > div > div:nth-child(1) > div:nth-child(6)'
      );

      await formOpenControl.click();

      const analyticsCodeInput = await page.waitForSelector(
        '[aria-label="Google Analytics (分析) 資源 ID"]'
      );

      await analyticsCodeInput.press('Backspace');
      await analyticsCodeInput.type(analyticsCode, { delay: 100 });

      const submitButton = await page.waitForSelector(
        '#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.FFpctc.Up8vH.Whe8ub.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.kHssdc.HvOprf.M9Bg4d'
      );

      await submitButton.click();

      await page.waitForSelector('#yDmH0d > div.llhEMd.iWO5td', {
        hidden: true,
      });
    }
  });
