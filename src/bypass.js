const preparePageForTests = async (page) => {
    // Pass the Webdriver Test.
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false
        });
    });

};

module.exports = { preparePageForTests };
