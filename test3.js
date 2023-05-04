const { firefox, chromium } = require("playwright");

(async () => {
    const browser = await firefox.launchPersistentContext('E:\\profile',{
        headless:false
    })
    const page = await browser.pages()[0];

    await page.goto('https://shopee.vn/%C3%81o-thun-tay-l%E1%BB%A1-HADES-ALTERNATIVE-TEE-%C3%A1o-thun-ch%E1%BB%AF-H-tay-ng%E1%BA%AFn-nam-n%E1%BB%AF-hades-ch%E1%BA%A5t-cotton-cao-c%E1%BA%A5p-GTM-i.168758605.17881621493?sp_atk=24853a71-2e59-4b58-b697-e9df3287f51a&xptdk=24853a71-2e59-4b58-b697-e9df3287f51a')
   
    await page.waitForTimeout(5000)

    
   let check_2= await page.$(`text=thêm vào giỏ aaaaaaaa`)
   if(check_2){
    console.log("Check 22222222222")
    await check_2.click()
   }
   
    //await page.goto('https://browserleaks.com/canvas');
    await page.waitForTimeout(999999)
})();