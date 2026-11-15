/* Behparvar Session 4: isolated browser regression suite.
 * Runs only against a locally served static checkout. No real participant data,
 * account logins, instructor approvals, production writes, or published app changes.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const URL = process.env.BEHPARVAR_URL || 'http://127.0.0.1:4173/session4-communication-journey.html';
const ARTIFACTS = path.resolve(__dirname, '..', 'artifacts', 'session4-browser');
const STORAGE_KEY = 'bp-communication-journey-v3';
fs.mkdirSync(ARTIFACTS, { recursive: true });

async function getState(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), STORAGE_KEY);
}
async function screenshot(page, device, stage) {
  await page.screenshot({
    path: path.join(ARTIFACTS, device + '-' + stage + '.png'),
    animations: 'disabled',
    fullPage: false
  });
}
async function openFresh(browser, device, viewport, errors) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: device === 'mobile',
    hasTouch: device === 'mobile',
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', err => errors.push(err.message));
  const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert(response && response.status() === 200, device + ': local app must respond HTTP 200');
  await page.locator('#root .introgrid').waitFor({ state: 'visible' });
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'RTL document');
  assert.equal(await page.evaluate(() => window.BP_SAFAR_DATA?.stages?.length), 10, 'ten stages loaded');
  assert.equal(await page.locator('.role-card').count(), 2, 'both audience paths available');
  assert.equal(await page.locator('#start').isDisabled(), true, 'competitive start requires a role');
  assert.equal(await page.locator('#sfStartStudy').isDisabled(), true, 'study start requires a role');
  return { context, page };
}
async function check(device, viewport, browser) {
  const errors = [];
  const intro = await openFresh(browser, device, viewport, errors);
  await screenshot(intro.page, device, 'welcome');
  await intro.page.locator('.role-card[data-role="supervisors"]').click();
  assert.equal(await intro.page.locator('#sfStartStudy').isEnabled(), true);
  await intro.page.locator('#sfStartStudy').click();
  await intro.page.locator('.sf-study-shell').waitFor({ state: 'visible' });
  let state = await getState(intro.page);
  assert.equal(state?.mode, 'study', device + ': study mode persisted');
  assert.equal(state?.studyStage, 0);
  await intro.page.locator('.sf-study-pager [data-sf-study-step="1"]').first().click();
  await intro.page.waitForFunction(key => {
    const state = JSON.parse(localStorage.getItem(key) || 'null');
    return state?.studyStage === 1;
  }, STORAGE_KEY);
  state = await getState(intro.page);
  assert.equal(state.studyStage, 1, device + ': study navigation updates saved position');
  await screenshot(intro.page, device, 'study-step-2');
  const studyOverflow = await intro.page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await intro.context.close();

  // A second, isolated browser context ensures the competition test never reuses
  // the first participant's local progress or scores.
  const competitive = await openFresh(browser, device, viewport, errors);
  await competitive.page.locator('.role-card[data-role="managers"]').click();
  competitive.page.on('dialog', dialog => dialog.accept());
  await competitive.page.locator('#start').click();
  await competitive.page.locator('#sfWizardHead').waitFor({ state: 'visible' });
  state = await getState(competitive.page);
  assert.equal(state?.role, 'managers', device + ': manager track selected');
  assert.equal(state?.mode, 'competitive', device + ': competitive mode persisted');
  assert.equal(state?.stage, 0, device + ': begins at stage one');
  assert(state?.startedAt > 0, device + ': mission timer started');
  assert.equal(await competitive.page.locator('#sfNext').isEnabled(), true, 'lesson can advance');
  await competitive.page.locator('#sfNext').click();
  await competitive.page.waitForFunction(() =>
    document.querySelector('#sfWizardHead')?.dataset?.phase === 'self');
  assert.equal(await competitive.page.locator('#sfNext').isDisabled(), true,
    'self-assessment gate blocks skipping unanswered items');
  await screenshot(competitive.page, device, 'competitive-self-assessment');
  const competitionOverflow = await competitive.page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await competitive.context.close();
  assert.deepEqual(errors, [], device + ': no uncaught JavaScript errors');
  return { device, viewport, stages: 10, modeChecks: ['study', 'competitive'],
    studySavedStep: 1, assessmentGate: 'locked until answered',
    horizontalOverflowPx: { study: studyOverflow, competition: competitionOverflow },
    pageErrors: errors.length };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const device of [
      { name: 'laptop', viewport: { width: 1366, height: 768 } },
      { name: 'mobile', viewport: { width: 390, height: 844 } }
    ]) {
      results.push(await check(device.name, device.viewport, browser));
    }
    fs.writeFileSync(path.join(ARTIFACTS, 'report.json'), JSON.stringify(results, null, 2));
    console.log('PASS: Behparvar S4 public study and competitive browser regression\n' +
      JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error('FAILED:', error); process.exitCode = 1; });
