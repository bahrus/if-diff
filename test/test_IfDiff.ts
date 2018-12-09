import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    await page.waitFor(4000);
    const textContent = await page.$eval('#equalsStatus', (c: any) => c.dataset.equals);
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing dev.html', (t: any) => {
        t.equal(textContent, '1');
        t.end();
    });

}

(async () => {
    await xt.runTests({
        path: 'demo/dev.iife.html'
    }, customTests);
})();
