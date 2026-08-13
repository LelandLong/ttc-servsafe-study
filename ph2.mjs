import { chromium } from '/Users/admin/Claude/ttc-servsafe-study-main/node_modules/playwright/index.mjs';
const DIR='/private/tmp/claude-501/-Users-admin-Claude-ttc-servsafe-study-main/18ab06bf-6584-4e17-be9c-e20b74aefebe/scratchpad';
const USER={userId:'k17e9kk2wxe3rbarp11j4rtdyn80w5pp',gamerName:'rerun',displayName:'Rerun',firstName:'leland'};
const b=await chromium.launch();
for (const w of [390, 1180]) {
  const p=await b.newPage({viewport:{width:w,height:1000},colorScheme:'dark'});
  await p.addInitScript(u=>{localStorage.setItem('chefKitchenUser',JSON.stringify(u));localStorage.setItem('chefKitchenPersonalDevice','true');localStorage.setItem('chefKitchenLastActive',Date.now().toString());localStorage.setItem('chefKitchenTheme','dark');},USER);
  await p.goto('http://localhost:8123/index.html');
  await p.waitForTimeout(3000);
  await p.locator('.pop-frame').first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const c = document.querySelector('.pop-frame');
    if (!c) return { err: 'no .pop-frame' };
    const img = c.querySelector('.popper');
    const h = c.querySelector('h2');
    const strip = document.querySelector('.channel-strip');
    const o = { pad: getComputedStyle(c).paddingTop };
    if (img && h) {
      const ib = img.getBoundingClientRect(), hb = h.getBoundingClientRect();
      o.who = img.getAttribute('src').split('/').pop();
      o.gapBodyToHead = Math.round(hb.top - ib.bottom);
    } else { o.missing = 'img=' + !!img + ' h2=' + !!h; }
    if (strip) {
      const sb = strip.getBoundingClientRect();
      const t = strip.querySelector('.cs-title');
      o.stripH = Math.round(sb.height);
      o.titleH = t ? Math.round(t.getBoundingClientRect().height) : null;
    }
    return o;
  });
  console.log(w === 390 ? 'PHONE' : 'DESK', JSON.stringify(m));
  await p.screenshot({ path: `${DIR}/ph2-${w}.png` });
  await p.close();
}
await b.close(); console.log('DONE');
