require('dotenv').config();
var fs = require('fs');
const puppeteer = require('puppeteer');

facebookID = process.env.PROFILE
chromium = process.env.CHROMIUM_DIR
profileDir = process.env.PROFILE_DIR
logoutId = process.env.LOGOUTID

var accounts = fs.readFileSync("account.txt", { flag: "as+" });
accounts = accounts.toString();
accounts = accounts.split("\n")

account = accounts[0]
uid = account.split("\t")[0]
pass = account.split("\t")[1]
gfa = account.split("\t")[2]
//cookies = [];
//let xs,
//  cuser,
 
//cookieSplited = gfa.split(";")
//if (cookieSplited.length > 2) {
//  cookieSplited.map((item) => {
//    getxs = item.split('xs=')
//    if (getxs.length > 1) {
//      console.log(xs)
//      xs = getxs[1];
//    }
//    getcuser = item.split('c_user=')
//    if (getcuser.length > 1) {
//      cuser = getcuser[1]
//    }
//  })
//
//  cookies = [{
//    domain: '.facebook.com',
//    name: 'c_user',
//    value: cuser
//
//  }, {
//    domain: '.facebook.com',
//    name: 'xs',
//    value: xs
//  }
//  ]
//
//}
//console.log(xs)
//console.log(cuser)

if (logoutId) {
  profileDir = profileDir + logoutId;
} else {
  profileDir = profileDir + uid
}

console.log(chromium)
console.log(profileDir);

const loginaccount = async (browser) => {

  const page = (await browser.pages())[0];

  await page.setViewport({
    width: width,
    height: height
  });

  if (cookies.length) {
    console.log("Login with cookie")
    
    cookies.forEach(async element => {
      console.log(element)
      await page.setCookie(element)
    });
    await browser.newPage()
    let pages = await browser.pages();

    await pages[1].goto('https://m.facebook.com');
    await page.waitFor(2000000);

  } else {
    await page.goto('https://gauth.apps.gbraad.nl/#main');

    await page.waitForSelector(".ui-last-child");

    gfacode = await page.evaluate(() => {
      // Class có link bài đăng trên profile
      let gfacode = document.querySelectorAll(".ui-last-child")[1].innerText;

      return gfacode

    }
    )

    if (gfacode.length > 10) {
      await page.click('.ui-icon-edit');
      await page.waitFor(1000);
      await page.click('#addButton');
      await page.waitFor(1000);
      await page.click('#keySecret');
      await page.waitFor(1000);
      await page.type('#keySecret', gfa);
      await page.waitFor(1000);
      await page.click('#addKeyButton');
      await page.waitFor(1000);
      gfacode = await page.evaluate(() => {
        // Class có link bài đăng trên profile
        let gfacode = document.querySelectorAll(".ui-last-child")[1].innerText;

        return gfacode

      }
      )
    }
    console.log(gfacode);
    await browser.newPage()
    let pages = await browser.pages();

    await pages[1].goto('https://m.facebook.com');
    await page.waitFor(2000);

    await pages[1].waitForSelector('#m_login_email');

    await pages[1].click('#m_login_email');
    await pages[1].type('#m_login_email', uid);
    await page.waitFor(1000);

    await pages[1].click('#m_login_password');
    await pages[1].type('#m_login_password', pass);

    await page.waitFor(2000);
    await pages[1].waitForSelector('[data-sigil="login_password_step_element"]');
    await pages[1].click('[data-sigil="login_password_step_element"]')

    await page.waitFor(2000);

    await pages[1].waitForSelector('#approvals_code');
    await pages[1].click('#approvals_code');

    await pages[1].type('#approvals_code', gfacode);
    await page.waitFor(2000);
    await pages[1].click('#checkpointSubmitButton-actual-button');
    await page.waitFor(2000);
    await pages[1].waitForSelector('#checkpointSubmitButton-actual-button');
    await pages[1].click('#checkpointSubmitButton-actual-button');
    await page.waitFor(10000000);
  }
}


(async () => {
  const browser = await puppeteer.launch({

    executablePath: chromium,
    headless: false,
    devtools: false,
    args: [
      `--user-data-dir=${profileDir}`
    ]
  });

  width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
  height = Math.floor(Math.random() * (800 - 600)) + 600;;

  console.log(width);
  console.log(height);
  if (logoutId) {
    const page = (await browser.pages())[0];
   // await page.goto('https://shopee.vn');
    await page.goto('http://192.168.8.1/html/home.html');
    await page.waitFor(10000000);
  } else {
    await loginaccount(browser, cookies)
  }
  await browser.close();
})();
