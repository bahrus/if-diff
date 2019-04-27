const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    await page.waitFor(4000);
    const textContent = await page.$eval('#equalsStatus', (c) => c.dataset.equals);
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing dev.html', (t) => {
        t.equal(textContent, '1');
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'demo/dev.html'
    }, customTests);
})();
