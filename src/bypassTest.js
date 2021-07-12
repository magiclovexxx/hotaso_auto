const runBypassTest = (page) => {
    page.evaluate(() => {
        // WebDriver Test
        if (navigator.webdriver) {
            console.log('[Bypass][Failed] webdriver');
        } else {
            console.log('[Bypass][Success] webdriver');
        }

    });
};

module.exports = { runBypassTest };
