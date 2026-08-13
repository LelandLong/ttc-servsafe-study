// Offline verification for the Italy trip (Sept 1-17): can a signed-in student
// who has opened the app once on wifi still read the emergency contacts with no
// signal at all?
//
// Usage:
//   node scripts/verify-offline.mjs                 # against production
//   BASE=http://localhost:8123 node scripts/verify-offline.mjs
//   NEGATIVE_CONTROL=1 node scripts/verify-offline.mjs   # see note below
//
// NEGATIVE CONTROL — the point of this file.
// A check that has never been shown to FAIL is not evidence. Before trusting a
// green run, prove this script can go red: copy the site, delete the
// `navigator.serviceWorker.register` call from index.html, serve that copy, and
// point BASE at it. Expected result is RESULT: FAIL with
// "net::ERR_INTERNET_DISCONNECTED". Verified as failing on 2026-08-13; re-verify
// if the script is ever substantially rewritten.
//
// Requires: npx playwright install chromium

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'https://lelandlong.github.io/ttc-servsafe-study';
// Any account with privateAccess/isProf. Not a secret — it is a user id, and the
// pages it unlocks are itinerary-level. Never paste query RESULTS into a log.
const USER = {
  userId: process.env.CK_USER_ID || 'k17e9kk2wxe3rbarp11j4rtdyn80w5pp',
  gamerName: 'rerun', displayName: 'Rerun', firstName: 'leland'
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.addInitScript((u) => {
  localStorage.setItem('chefKitchenUser', JSON.stringify(u));
  localStorage.setItem('chefKitchenPersonalDevice', 'true');
  localStorage.setItem('chefKitchenLastActive', Date.now().toString());
}, USER);

// 1. The one online visit the trip guidance depends on ("open it on wifi").
await page.goto(BASE + '/index.html');
await page.waitForTimeout(6000); // precache + private-page prefetch

const sw = await page.evaluate(() => navigator.serviceWorker.controller ? 'controlled' : 'NO SW');
const swCaches = await page.evaluate(async () => (await caches.keys()).filter(k => k.startsWith('chef-kitchen-')).length);
const prefetched = await page.evaluate(() => {
  const c = JSON.parse(localStorage.getItem('chefKitchenPrivatePages') || 'null');
  return c ? Object.keys(c.pages).length : 0;
});
console.log(`online visit  — service worker: ${sw} | shell caches: ${swCaches} | pages prefetched: ${prefetched}`);

// 2. The basement in Ferrara: no signal, app reopened from scratch.
await ctx.setOffline(true);
let bootOk = false, emergencyOk = false, policyOk = false, note = '';
try {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(4000);
  bootOk = (await page.getByText("Chef's Kitchen").count()) > 0;
  if (bootOk && await page.getByText('Trip Essentials').count()) {
    await page.getByText('Trip Essentials').first().click();
    await page.waitForTimeout(2000);
    const frame = page.frameLocator('#pp-overlay iframe');
    emergencyOk = (await frame.getByText('463-274-2241').count().catch(() => 0)) > 0;
    policyOk = (await frame.getByText('CC013309-D-E-20477977').count().catch(() => 0)) > 0;
  }
} catch (e) {
  note = e.message.split('\n')[0];
}

console.log(`offline reopen — shell boots: ${bootOk} | IMG emergency number: ${emergencyOk} | policy reference: ${policyOk}`);
if (note) console.log('navigation error:', note);

const pass = bootOk && emergencyOk && policyOk;
console.log(pass ? 'RESULT: PASS' : 'RESULT: FAIL');
await browser.close();
process.exit(pass ? 0 : 1);
