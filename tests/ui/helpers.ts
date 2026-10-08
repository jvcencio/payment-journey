import { expect, type Page } from '@playwright/test';
export async function openEvidence(page: Page) {
  const fields = page.locator('#field-lineage');
  if ((await fields.getAttribute('open')) === null)
    await fields.locator('summary').first().click();
  const technical = page.getByText('Show technical evidence and locators', {
    exact: true,
  });
  if ((await technical.locator('..').getAttribute('open')) === null)
    await technical.click();
}
export async function compareWithEvidence(page: Page) {
  await page.getByRole('button', { name: 'Compare these messages' }).click();
  await expect(page.locator('.report, [role="alert"]').first()).toBeVisible();
  if (await page.locator('.report').count()) await openEvidence(page);
}
export async function openAuthority(page: Page) {
  const summary = page.getByText('Authority details and all rule findings', {
    exact: true,
  });
  if ((await summary.locator('..').getAttribute('open')) === null)
    await summary.click();
}
