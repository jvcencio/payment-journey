import { expect, test } from '@playwright/test';
const compare = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Compare these messages' }).click();
test('compact entry states domain audience and scope with plain scenario names', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Validate wire-address transformations during ISO 20022 migration.',
  );
  await expect(page.locator('.hero')).toContainText(
    'payments product, QA, implementation, business analysis, architecture, and technology',
  );
  await expect(page.locator('.hero')).toContainText(
    'Debtor and Creditor postal addresses',
  );
  const picker = page.getByLabel('Example scenario');
  await expect(picker).toHaveValue('D');
  expect(await picker.locator('option:checked').innerText()).toBe(
    'Building number and suite placed in Street Name',
  );
  expect(await picker.locator('option').allTextContents()).not.toContain(
    'ALIGNS',
  );
  await expect(
    page.getByRole('button', { name: /Load fictional/ }),
  ).toHaveCount(0);
  await expect(page.getByText('EVIDENCE-BACKED POLICY / 0.3')).toHaveCount(0);
  expect((await picker.boundingBox())!.y).toBeLessThan(850);
});
test('prepared fields are primary and JSON is accessible only through disclosure', async ({
  page,
}) => {
  await page.goto('./');
  const source = page.getByLabel('Source system knows');
  await expect(source).toContainText('Building number');
  await expect(source).toContainText('1200');
  await expect(source.locator('pre')).not.toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  await source
    .getByText('Show underlying test record', { exact: true })
    .click();
  await expect(source.locator('pre')).toBeVisible();
  await expect(source.locator('pre')).toContainText('address.buildingNumber');
});
test('answer precedes scope guidance changes and technical proof without default hashes', async ({
  page,
}) => {
  await page.goto('./');
  await compare(page);
  const answer = page.getByLabel('Comparison result', { exact: true });
  await expect(answer).toContainText(
    'Address data survived, but some of its meaning was degraded.',
  );
  await expect(answer).toContainText('suite / room');
  await expect(answer).not.toContainText('address.');
  await expect(page.getByLabel('Scope and coverage')).toContainText(
    'Ultimate parties, initiating parties, and agent/intermediary addresses are not yet evaluated',
  );
  const y = async (label: string) =>
    (await page.getByLabel(label, { exact: true }).boundingBox())!.y;
  expect(await y('Comparison result')).toBeLessThan(
    await y('Scope and coverage'),
  );
  expect(await y('Scope and coverage')).toBeLessThan(
    await y('Policy evaluation'),
  );
  expect(await y('Policy evaluation')).toBeLessThan(await y('What changed'));
  await expect(page.locator('#field-lineage')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('complementary')).toHaveCount(0);
  const visible = await page.locator('body').innerText();
  expect(visible).not.toMatch(/context:[a-f0-9]{32}|SHA-256|address\.townName/);
  await expect(page.getByLabel('Coverage', { exact: true })).toContainText(
    'interpreted fields',
  );
  await expect(page.getByLabel('Coverage', { exact: true })).toContainText(
    'fields outside current analysis scope',
  );
  await expect(page.getByLabel('Coverage', { exact: true })).toContainText(
    'unresolved relationships',
  );
});
test('intentional absent creditor cannot be confused with lost information', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByLabel('Example scenario').selectOption('P1');
  await compare(page);
  await expect(page.getByLabel('Source system knows')).toContainText(
    'Creditor not included in this example',
  );
  await page.locator('#field-lineage > summary').click();
  await expect(page.getByLabel('Field comparison')).toContainText(
    'Creditor not included in this example',
  );
  await expect(page.getByLabel('Field comparison')).not.toContainText(
    'No material elements interpreted',
  );
});
test('guidance and explicit cross-border choice persist across prepared and raw scenarios', async ({
  page,
}) => {
  await page.goto('./');
  await compare(page);
  await page
    .getByLabel('Evaluation Profile', { exact: true })
    .selectOption('public-address-quality');
  await page
    .getByLabel('Is this payment being evaluated as cross-border?')
    .selectOption('false');
  for (const id of ['P1', 'P3', 'A']) {
    await page.getByLabel('Example scenario').selectOption(id);
    await compare(page);
    await expect(
      page.getByLabel('Evaluation Profile', { exact: true }),
    ).toHaveValue('public-address-quality');
    await expect(
      page.getByLabel('Is this payment being evaluated as cross-border?'),
    ).toHaveValue('false');
  }
  await page
    .getByLabel('Evaluation Profile', { exact: true })
    .selectOption('none');
  await page.getByLabel('Example scenario').selectOption('D');
  await compare(page);
  await expect(
    page.getByLabel('Evaluation Profile', { exact: true }),
  ).toHaveValue('none');
});
test('raw pairs do not inherit an unchosen example cross-border assumption', async ({
  page,
}) => {
  await page.goto('./');
  await compare(page);
  await expect(page.getByLabel('Policy evaluation')).toContainText(
    'Prepared example context: cross-border',
  );
  await page.getByLabel('Example scenario').selectOption('A');
  await compare(page);
  await expect(
    page.getByLabel('Is this payment being evaluated as cross-border?'),
  ).toHaveValue('UNKNOWN');
  await expect(page.getByLabel('Policy evaluation')).toContainText(
    'not infer cross-border applicability solely from country codes',
  );
});
test('unknown and not applicable retain distinct explanations and styling', async ({
  page,
}) => {
  await page.goto('./');
  await compare(page);
  await page
    .getByLabel('Is this payment being evaluated as cross-border?')
    .selectOption('UNKNOWN');
  await expect(page.getByLabel('Minimum and quality comparison')).toContainText(
    'deliberate refusal to guess',
  );
  await page
    .getByText('What do the guidance outcomes mean?', { exact: true })
    .click();
  const unknown = page.locator('.outcome-guide [data-outcome="UNKNOWN"]'),
    na = page.locator('.outcome-guide [data-outcome="NOT_APPLICABLE"]');
  await expect(unknown).toContainText('not an application failure');
  await expect(na).toContainText('does not apply to the evaluated context');
  expect(
    await unknown.evaluate((e) => getComputedStyle(e).backgroundColor),
  ).not.toBe(await na.evaluate((e) => getComputedStyle(e).backgroundColor));
});
test('technical evidence disclosure is keyboard accessible on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await compare(page);
  const summary = page.locator('#field-lineage > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const tech = page.getByText('Show technical evidence and locators', {
    exact: true,
  });
  await tech.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('complementary')).toContainText('source/records');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
