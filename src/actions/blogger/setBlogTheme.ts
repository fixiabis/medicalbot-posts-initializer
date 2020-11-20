import { Page } from 'puppeteer';

const themeUrl = (id: string) => `https://www.blogger.com/blog/themes/${id}`;

export const themeNames = [
  'Contempo Light',
  'Contempo Dark',
  'Contempo Pink',
  'Contempo Aqua',
  'Contempo Flamingo',
  'Soho Light',
  'Soho Dark',
  'Soho Neon',
  'Soho Pink',
  'Soho Red',
  'Emporio Porcelain',
  'Emporio Toolbox',
  'Emporio Apron',
  'Emporio Technica',
  'Emporio Flamingo',
  'Notable Light',
  'Notable Coral',
  'Notable Dracula',
  'Notable Pink',
  'Notable Antique',
  'Essential Light',
  'Simple Bold',
  'Simple Simply Simple',
  'Simple Pale',
  'Simple Dark',
  'Simple Deep',
  'Simple Literate',
  'Simple Wide',
  'Dynamic Views Classic',
  'Dynamic Views Flipcard',
  'Dynamic Views Magazine',
  'Dynamic Views Mosaic',
  'Dynamic Views Sidebar',
  'Dynamic Views Snapshot',
  'Dynamic Views Timeslide',
  'Picture Window Shade',
  'Picture Window Open',
  'Picture Window Screen',
  'Awesome Inc. Light',
  'Awesome Inc. Dark',
  'Awesome Inc. Groovy',
  'Awesome Inc. Renewable',
  'Awesome Inc. Artsy',
  'Awesome Inc. Icy',
  'Watermark Navigator',
  'Watermark Birds',
  'Watermark Flower',
  'Watermark Bubblegum',
  'Ethereal Humming Birds Two Tone',
  'Ethereal Blossoms Single Blue',
  'Ethereal Leaves Gold Simple',
  'Travel Studio',
  'Travel Flight',
  'Travel Beach',
  'Travel Road',
];

const selectors = {
  themeTitle: (themeName: string) => `[aria-label="主題版本：${themeName}"]`,
  applyButton: '[aria-label="套用這個主題"]',
};

async function setBlogTheme(page: Page, id: string, themeName: string) {
  await page.goto(themeUrl(id));

  const themeTitle = await page.waitForSelector(
    selectors.themeTitle(themeName)
  );

  await themeTitle.click();

  const applyButton = await page.waitForSelector(selectors.applyButton);

  await applyButton.click();
  await page.waitForSelector(selectors.applyButton, { hidden: true });
}

export default setBlogTheme;
