import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const source = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/source.mt103',
  'utf8',
);
const target = readFileSync(
  'fixtures/raw-pairs/a-clean-preservation/target.pacs008.xml',
  'utf8',
);

test('Fixture A shows canonical participants and inspectable evidence', async ({
  page,
}) => {
  await page.goto('/');
  const evaluate = page.getByRole('button', { name: 'Evaluate explicit pair' });
  await expect(evaluate).toBeEnabled();
  await evaluate.click();
  await expect(
    page.getByRole('heading', { name: 'The payment, side by side.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^Inspect / })).toHaveCount(10);
  await page
    .getByRole('button', {
      name: 'Inspect CREDITOR address.country 1',
      exact: true,
    })
    .click();
  const evidence = page.getByRole('complementary', {
    name: 'Selected observation evidence',
  });
  await expect(evidence).toContainText('CREDITOR · address.country');
  await expect(evidence).toContainText('EXPLICIT');
  await expect(evidence).toContainText('GB');
  await expect(evidence).toContainText('block4/:59F:');
  await expect(evidence).toContainText('/Ctry[1]');
  await page.getByText('Source unmapped evidence (6)', { exact: true }).click();
  await expect(page.getByLabel('Source coverage')).toContainText(
    ':70:FICTIONAL TEST PAYMENT ONLY',
  );
  await evaluate.click();
  await expect(page.getByRole('button', { name: /^Inspect / })).toHaveCount(10);
});

test('evaluation sends no network requests, including payload-bearing requests', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Evaluate explicit pair' }),
  ).toBeEnabled();
  const requests: string[] = [];
  const sockets: string[] = [];
  // All app/worker assets have loaded. Reject every attempted HTTP request during evaluation.
  await context.route('**/*', (route) => {
    requests.push(
      `${route.request().method()} ${route.request().url()} ${route.request().postData() ?? ''}`,
    );
    return route.abort();
  });
  page.on('websocket', (socket) => sockets.push(socket.url()));
  const marker = 'SYNTHETIC-PRIVATE-SENTINEL-7C9D';
  await page
    .getByRole('textbox', { name: 'Source artifact', exact: true })
    .fill(source.replace('FABLE PARTS TEST', marker));
  await page
    .getByRole('textbox', { name: 'Target artifact', exact: true })
    .fill(target.replace('FABLE PARTS TEST', marker));
  await page.getByRole('button', { name: 'Evaluate explicit pair' }).click();
  await expect(page.getByRole('button', { name: /^Inspect / })).toHaveCount(10);
  await expect(page.getByRole('complementary')).toContainText(marker);
  await page.waitForTimeout(250);
  expect(requests).toEqual([]);
  expect(sockets).toEqual([]);
});

test('raw XML renders as inert text without injection', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Evaluate explicit pair' }),
  ).toBeEnabled();
  const encoded =
    '&lt;img src="https://example.invalid/attack" onerror="window.__attacked=true"&gt;';
  await page
    .getByRole('textbox', { name: 'Source artifact', exact: true })
    .fill(
      source.replace(
        'FABLE PARTS TEST',
        '<img src="https://example.invalid/attack" onerror="window.__attacked=true">',
      ),
    );
  await page
    .getByRole('textbox', { name: 'Target artifact', exact: true })
    .fill(target.replace('FABLE PARTS TEST', encoded));
  await page.getByRole('button', { name: 'Evaluate explicit pair' }).click();
  await expect(page.getByRole('button', { name: /^Inspect / })).toHaveCount(10);
  await expect(page.getByRole('complementary')).toContainText('<img');
  expect(await page.locator('img').count()).toBe(0);
  expect(await page.evaluate(() => Object.hasOwn(window, '__attacked'))).toBe(
    false,
  );
});

test('wrong version, hostile XML and multiple transactions show explicit diagnostics', async ({
  page,
}) => {
  await page.goto('/');
  const input = page.getByRole('textbox', {
    name: 'Target artifact',
    exact: true,
  });
  for (const [xml, code] of [
    [
      target.replaceAll('pacs.008.001.14', 'pacs.008.001.13'),
      'UNSUPPORTED_MESSAGE_VERSION',
    ],
    ['<!DOCTYPE Document>' + target, 'UNSAFE_XML_DOCTYPE'],
    [
      target.replace('</CdtTrfTxInf>', '</CdtTrfTxInf><CdtTrfTxInf/>'),
      'UNSUPPORTED_MULTIPLE_TRANSACTIONS',
    ],
    [target.replace('</Document>', ''), 'MALFORMED_XML'],
  ]) {
    await input.fill(xml!);
    await page.getByRole('button', { name: 'Evaluate explicit pair' }).click();
    await expect(page.getByRole('alert')).toContainText(code!);
    await expect(
      page.getByRole('heading', { name: 'The payment, side by side.' }),
    ).toHaveCount(0);
  }
});

test('keyboard inspection and narrow screen layout remain usable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const evaluate = page.getByRole('button', { name: 'Evaluate explicit pair' });
  await expect(evaluate).toBeEnabled();
  await evaluate.focus();
  await page.keyboard.press('Enter');
  const button = page.getByRole('button', {
    name: 'Inspect DEBTOR address.country 1',
    exact: true,
  });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
