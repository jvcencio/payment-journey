import { expect, test, type Page } from '@playwright/test';
async function selectPolicy(page: Page, id: string) {
  await page.goto('/');
  await page.getByLabel('Demonstration').selectOption(id);
  await page.getByRole('button', { name: 'Evaluate explicit pair' }).click();
  await page
    .getByLabel('Evaluation Profile', { exact: true })
    .selectOption('public-address-quality');
  await page.getByLabel('Cross-border applicability').selectOption('true');
}
test('D minimum and quality judgments differ, with authority and lineage navigation', async ({
  page,
}) => {
  await selectPolicy(page, 'D');
  const minimum = page.getByRole('article', {
    name: 'DEBTOR CPMI-ADDR-001',
    exact: true,
  });
  const quality = page.getByRole('article', {
    name: 'DEBTOR PMPG-ADDR-001',
    exact: true,
  });
  await expect(minimum.locator('.outcome')).toHaveText('ALIGNS');
  await expect(quality.locator('.outcome')).toHaveText('DOES NOT ALIGN');
  await quality
    .getByText('Inspect rule, authority and evidence', { exact: true })
    .click();
  await expect(quality).toContainText('MARKET_PRACTICE');
  await expect(quality).toContainText('2026-09-04');
  await expect(quality).toContainText('1.14');
  await expect(quality).toContainText('public-address-quality@0.1.0');
  await expect(
    quality.getByRole('link', { name: 'Hybrid Postal Address', exact: true }),
  ).toHaveAttribute(
    'href',
    'https://www.swift.com/swift-resource/252602/download',
  );
  await quality
    .getByRole('button', { name: /Inspect lineage: DEBTOR address.room/ })
    .click();
  await expect(
    page.getByRole('complementary', { name: 'Selected observation evidence' }),
  ).toContainText('DEBTOR · address.room');
  await expect(
    page.getByRole('complementary', { name: 'Selected observation evidence' }),
  ).toBeFocused();
  await minimum
    .getByText('Inspect rule, authority and evidence', { exact: true })
    .click();
  await expect(minimum).toContainText('HARMONISATION_GUIDANCE');
  await expect(page.getByLabel('Policy evaluation')).toContainText(
    'Network conformance: NOT EVALUATED',
  );
});
test('profile changes do not send parsing requests, mutate lineage presentation or transmit payloads', async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const original = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function (message: unknown) {
      document.documentElement.dataset.workerRuns = String(
        Number(document.documentElement.dataset.workerRuns ?? 0) + 1,
      );
      original.call(this, message);
    };
  });
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Evaluate explicit pair' }),
  ).toBeEnabled();
  const requests: string[] = [];
  const sockets: string[] = [];
  await context.route('**/*', (route) => {
    requests.push(route.request().url());
    return route.abort();
  });
  page.on('websocket', (s) => sockets.push(s.url()));
  await page.getByLabel('Demonstration').selectOption('D');
  await page.getByRole('button', { name: 'Evaluate explicit pair' }).click();
  const group = page.getByLabel('Grouped relationship');
  await expect(group).toBeVisible();
  const before = await group.innerText();
  for (const profile of [
    'public-address-quality',
    'none',
    'public-address-quality',
  ]) {
    await page
      .getByLabel('Evaluation Profile', { exact: true })
      .selectOption(profile);
    if (profile !== 'none')
      await page.getByLabel('Cross-border applicability').selectOption('true');
    expect(await group.innerText()).toBe(before);
  }
  expect(await page.locator('html').getAttribute('data-worker-runs')).toBe('1');
  await expect(
    page.getByRole('article', { name: 'DEBTOR PMPG-ADDR-001', exact: true }),
  ).toContainText('DOES NOT ALIGN');
  await page.waitForTimeout(250);
  expect(requests).toEqual([]);
  expect(sockets).toEqual([]);
});
for (const [id, rule, outcome] of [
  ['P1', 'PMPG-HYBRID-001', 'NOT APPLICABLE'],
  ['P2', 'PMPG-HYBRID-001', 'ALIGNS'],
  ['P3', 'PMPG-HYBRID-001', 'DOES NOT ALIGN'],
  ['P4', 'PMPG-HYBRID-002', 'DOES NOT ALIGN'],
  ['P5', 'PMPG-HYBRID-003', 'DOES NOT ALIGN'],
] as const) {
  test(`${id} displays ${rule} applicability and outcome`, async ({ page }) => {
    await selectPolicy(page, id);
    await expect(
      page
        .getByRole('article', { name: `DEBTOR ${rule}`, exact: true })
        .locator('.outcome'),
    ).toHaveText(outcome);
  });
}
test('CPMI scope is explicit and narrow policy details remain usable', async ({
  page,
}) => {
  await selectPolicy(page, 'D');
  await page.getByLabel('Cross-border applicability').selectOption('UNKNOWN');
  await expect(
    page
      .getByRole('article', { name: 'DEBTOR CPMI-ADDR-001', exact: true })
      .locator('.outcome'),
  ).toHaveText('UNKNOWN');
  await page.setViewportSize({ width: 390, height: 844 });
  const quality = page.getByRole('article', {
    name: 'DEBTOR PMPG-ADDR-001',
    exact: true,
  });
  await quality
    .getByText('Inspect rule, authority and evidence', { exact: true })
    .click();
  await expect(
    quality.getByRole('link', { name: 'Hybrid Postal Address', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
