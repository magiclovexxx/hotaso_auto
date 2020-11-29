require('dotenv').config();
var fs = require('fs');
const axios = require('axios').default;
const puppeteer = require('puppeteer');
var cron = require('node-cron');

const exec = require('child_process').exec;
linkShopeeUpdate = "http://auto.tranquoctoan.com/api_user/shopeeupdate"     // Link shopee update thứ hạng sản phẩm
linkShopeeAccountUpdate = "http://auto.tranquoctoan.com/api_user/shopeeAccountUpdate" // Link update account shopee status
linkShopeeUpdateAds = "http://auto.tranquoctoan.com/api_user/shopeeUpdateAds" // Link update shopee ads index
dataShopeeDir = "http://auto.tranquoctoan.com/api_user/dataShopee"     // Link shopee update thứ hạng sản phẩm
slavenumber = process.env.SLAVE
clickAds = process.env.CLICKADS
typeClick = process.env.TYPECLICK

chromiumDir = process.env.CHROMIUM_DIR                     // Đường dẫn thư mục chromium sẽ khởi chạy
let profileDir = process.env.PROFILE_DIR
let extension = process.env.EXTENSION
phobien = process.env.PHO_BIEN         //Chế độ chạy phổ biến
// Danh sách profile fb trong file .env
maxTab = process.env.MAXTAB_SHOPEE                           // Số lượng tab chromium cùng mở tại 1 thời điểm trên slave
// Danh sách profile facebook trong mỗi slave
mode = process.env.MODE
if (mode === "DEV") {
    timemax = 5000;
    timemin = 3000;
} else {
    timemax = 5000;
    timemin = 3000;
}

// Lấy ngẫu nhiên số lượng = maxtab profile để gửi đến master lấy dữ liệu schedule về thao tác
function GenDirToGetData(maxTab, listAccounts) {
    // Lấy id profile đã tương tác trước đó
    maxid = []
    checkLogoutId = []

    var blockAccounts = fs.readFileSync("accountBlock.txt", { flag: "as+" });

    if (blockAccounts) {
        blockAccounts = blockAccounts.toString();
        blockAccounts = blockAccounts.split("\n")
    } else {
        blockAccounts = []
    }

    var savedid = fs.readFileSync("saveidshopee.txt", { flag: "as+" });
    if (savedid) {
        savedid = savedid.toString();
        savedid = savedid.split("\n");
    } else {
        savedid = []
    }

    randomId = typeof 123      // Ép kiểu dữ liệu về dạng số
    maxTab = parseInt(maxTab); // Ép kiểu dữ liệu về int
    idnotsave = [];
    idCanUser = [];
    // mảng
    if ((savedid.length + maxTab) >= (listAccounts.length - 1)) {  // reset file saveid về trống khi số lượng đã bằng với số lượng tk của trường PROFILE trong file .ENV
        savedid = [];
        fs.writeFileSync('saveidshopee.txt', savedid.toString())
    }
    let accountnNotBlock = []
    // lấy các profile chưa có trong file block account
    listAccounts.forEach(item => {
        // Tìm các id profile trong file .ENV
        if (!blockAccounts.includes(item)) {
            // Tìm id đó trong file saveid. nếu chưa có thì lưu vào mảng id chưa tương tác idnotsave[]
            accountnNotBlock.push(item);
        }
    })

    // lấy các profile chưa có trong file savedid
    accountnNotBlock.forEach(item => {
        // Tìm các id profile trong file .ENV
        if (!savedid.includes(item)) {

            idnotsave.push(item);
        }
    })

    if (idnotsave.length != 0) {

        randomId = Math.floor(Math.random() * (idnotsave.length - 1));           // Lấy ngẫu nhiêu 1 id trong mảng id chưa tương tác bên trên
        if ((randomId + maxTab) >= idnotsave.length) {
            randomId = idnotsave.length - maxTab;                         // Nếu số random + maxtab lớn hơn tổng số id trong mảng idnotsave sẽ lấy các giá trị cuối mảng
        }

        for (let a = randomId; a < (randomId + maxTab); a++) {           // Lưu các id vừa lấy để gửi lên server trong mảng idnotsave lưu vào mảng maxid.
            maxid.push(idnotsave[a])
        }

        maxid.forEach(item => {
            savedid.push(item);                                            // Update lại vào file saveid
            fs.appendFileSync('saveidshopee.txt', item + "\n")
        })

        return maxid;

    } else {
        savedid = [];
        fs.writeFileSync('saveidshopee.txt', savedid)
        return false
    }
}

loginShopee = async (page, accounts) => {

    //await page.goto("https://shopee.vn")
    // await page.waitFor(3000)

    const logincheck = await page.$$('.shopee-avatar');

    if (!logincheck.length) {

        await page.mouse.click(10, 30)
        timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;

        await page.waitFor(timeout)

        const loginclass = await page.$$('.navbar__link--account');
        await loginclass[1].click()
        timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000;
        await page.waitFor(timeout)

        await page.click('[name="loginKey"]')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        await page.type('[name="loginKey"]', accounts[0], { delay: 100 })    // Nhập comment 
        await page.click('[name="password"]')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        await page.type('[name="password"]', accounts[1], { delay: 200 })    // Nhập comment 
        await page.click('[name="password"]')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        const loginbutton = await page.$$('div>button:nth-child(4)');
        await loginbutton[0].click()
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitFor(15000)
        checkcode = await page.$$('[autocomplete="one-time-code"]')

        if (checkcode.length) {
            console.log("account bi hỏi mã")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n" + "\n")

            return false
        }

        checkblock = await page.$('[role="alert"]')
        if (checkblock) {
            console.log("account bi block")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n")

            return false
        }

        try {
            await page.waitForSelector('.shopee-searchbar-input');
        } catch (error) {
            console.log("account bi block")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n")

            return false
        }

        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)

        return true

    } else {
        return true
    }
}


searchKeyWord = async (page, keyword) => {
    timeout = Math.floor(Math.random() * (2000 - 100)) + 500;
    await page.waitFor(timeout);
    const checkSearchInput = await page.$$('.shopee-searchbar-input__input');

    if (checkSearchInput.length) {
        await page.click('.shopee-searchbar-input__input')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        console.log(keyword)
        await page.type('.shopee-searchbar-input__input', keyword, { delay: 100 })
        timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
        await page.waitFor(timeout);
        await page.keyboard.press('Enter')
    } else {
        //  await page.waitForSelector('.shopee-searchbar-input')
        await page.click('.shopee-searchbar-input')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.click('.shopee-searchbar-input')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.click('.shopee-searchbar-input')
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        console.log(keyword)
        await page.type('.shopee-searchbar-input', keyword, { delay: 100 })
        timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
        await page.waitFor(timeout);
        await page.keyboard.press('Enter')
        await page.waitForNavigation()

    }
}

populateClick = async (page, listcategories) => {
    timeout = Math.floor(Math.random() * (2000 - 1100)) + 1100;
    await page.waitFor(timeout);

    timeout = Math.floor(Math.random() * (2000 - 1100)) + 1100;
    await page.waitFor(timeout);
    checkpopup = await page.$$('.shopee-popup__close-btn')
    if (checkpopup.length) {
        await page.click('.shopee-popup__close-btn')
    }

    timeout = Math.floor(Math.random() * (3000 - 2100)) + 2100;
    await page.waitFor(timeout);

    randomidcategory = Math.floor(Math.random() * (listcategories.length - 1))
    randomcategory = listcategories[randomidcategory]

    // category chính
    let categoryId = await page.evaluate((xx) => {

        // Class có link bài đăng trên profile       
        let titles = document.querySelectorAll('.home-category-list__category-grid');
        let idcategory
        titles.forEach((item, index) => {
            if (item.href == xx.password) {
                idcategory = index
                return true
            }

        })
        return idcategory
    }, randomcategory)

    console.log(categoryId)

    checkCategory = await page.$$('.home-category-list__category-grid');
    await checkCategory[categoryId].click()
    timeout = Math.floor(Math.random() * (3000 - 2100)) + 2100;
    await page.waitFor(timeout);

    if (randomcategory.pages) {

        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.keyboard.press('PageDown');
        await page.waitFor(timeout);
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.keyboard.press('PageDown');
        await page.waitFor(timeout);

        let categoryChildId = await page.evaluate((xx) => {

            // Class có link bài đăng trên profile       
            let titles = document.querySelectorAll('.shopee-category-list__sub-category');
            let idcategorychild
            titles.forEach((item, index) => {
                if (item.href == xx.pages) {
                    idcategorychild = index
                    return true
                }

            })
            return idcategorychild
        }, randomcategory)

        checkCategoryChild = await page.$$('.shopee-category-list__sub-category');
        await checkCategoryChild[categoryChildId].click()

    }



}

getproduct = async (page, saveProduct, limit, idShops) => {
    try {
        let thuHangSanPham
        await page.waitForSelector('[data-sqe="name"]')
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        await page.waitFor(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        await page.waitFor(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        if (phobien) {
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitFor(timeout);
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitFor(timeout);
        }
        console.log(limit)
        getProduct = []
        getProduct = await page.evaluate(() => {

            // Class có link bài đăng trên profile          
            let titles = document.querySelectorAll('[data-sqe="link"]');
            listProductLinks = []
            titles.forEach((item) => {
                listProductLinks.push(item.href)
            })
            return listProductLinks
        })

        let productIndex = 0
        let productId

        // tìm vị trí sản phẩm có tên cần click
        let productIds


        getProduct.forEach((item, index) => {
            idShops.forEach((shop, index2) => {

                productIds = item.split(shop + ".")
                if (productIds.length == 2) {
                    if (!saveProduct.includes(productIds[1])) {
                        productId = productIds[1]
                        productIndex = index;
                        thuHangSanPham = {
                            sanpham: getProduct[productIndex],
                            id: productId,
                            shopId: shop,
                            trang: limit,
                            vitri: productIndex
                        }
                    }
                    return true
                }
            })
            /*    if (productIndex > 4 && productIndex < 45) {
                    return true
                }
            */

        })

        if (thuHangSanPham) {
            return thuHangSanPham;
        }

        if (limit == 0) {
            return false
        } else {
            limit -= 1;
            next = await page.$$('.shopee-icon-button--right')
            if (next.length) {
                await next[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout);
                return await getproduct(page, saveProduct, limit, idShops)
            } else {
                console.log("Đây là trang tìm kiếm cuối cùng")
                return false
            }
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

getproductAds = async (page, idShops) => {
    try {
        await page.waitForSelector('[data-sqe="name"]')
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        await page.waitFor(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        await page.waitFor(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout);
        getProduct = []

        getProduct = await page.evaluate(() => {
            // Class có link bài đăng trên profile          
            let titles = document.querySelectorAll('[data-sqe="link"]');
            listProductLinks = []
            titles.forEach((item) => {
                listProductLinks.push(item.href)
            })
            return listProductLinks
        })

        productIndexs = []
        // tìm vị trí sản phẩm có tên cần click
        let productIds
        for (let i = 0; i <= 4; i++) {
            idShops.forEach((shop, index2) => {
                productIds = getProduct[i].split(shop + ".")
                if (productIds.length == 2) {
                    productIndexs.push(i)
                }
            })
        }

        for (let i = 45; i <= 49; i++) {
            idShops.forEach((shop, index2) => {
                productIds = getProduct[i].split(shop + ".")
                if (productIds.length == 2) {
                    productIndexs.push(i)
                }
            })
        }

        return productIndexs
    } catch (error) {
        console.log(error)
        return false
    }
}

// chọn thuộc tính sản phẩm
chooseVariation = async (page, limit) => {
    let checkSelected = []
    limit -= 1

    checkvaritations = await page.$$('.flex.flex-column>.flex.items-center>.flex.items-center')

    if (checkvaritations.length == 4) {
        lengthvarirations = await page.evaluate(() => {

            varitations1 = document.querySelectorAll('.flex.flex-column>.flex.items-center>.flex.items-center')[2].children.length
            varitations2 = document.querySelectorAll('.flex.flex-column>.flex.items-center>.flex.items-center')[2].children.length
            variationslengt = {
                varitations1: varitations1,
                varitations2: varitations2
            }
            return variationslengt
        })
    }

    if (limit == 0) return false

    varitations = await page.$$('.product-variation')
    if (!varitations.length) {
        return true
    }
    timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
    await page.waitFor(timeout)

    for (i = 0; i < varitations.length; i++) {
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        varitation = Math.floor(Math.random() * ((varitations.length - 1) - 0)) + 0;
        await varitations[varitation].click()
    }

    checkSelected = await page.$$('.product-variation--selected')

    if (checkSelected.length) {
        return true
    } else {
        chooseVariation(page, limit)
    }
}

viewReview = async (page) => {
    timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
    await page.waitFor(timeout)
    allRview = await page.$$('.product-rating-overview__filter')
    console.log(allRview.length)
    if (allRview.length > 1) {
        randomReview1 = timeout = Math.floor(Math.random() * (allRview.length - 1)) + 1;
        // click vào ngẫu nhiên 
        await allRview[randomReview1].click()
        // lướt xuống xem
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');

        // xem ngẫu nhiên n ảnh
        allmedia = await page.$$(".shopee-rating-media-list-image__content--blur")

        if (allmedia.length > 2) {
            randomDown = Math.floor(Math.random() * (allmedia.length - 1)) + 1;
            for (i = 0; i < randomDown; i++) {
                randomDown2 = Math.floor(Math.random() * (allmedia.length - 1)) + 1;
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout)
                await allmedia[randomDown2].click()
            }
        }

        // lên đầu phần review
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        await page.keyboard.press('PageUp');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        await page.keyboard.press('PageUp');

        randomReview1 = timeout = Math.floor(Math.random() * (allRview.length - 1)) + 1;
        // click vào ngẫu nhiên lần 2
        await allRview[randomReview1].click()
        // lướt xuống xem
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)

        allmedia = await page.$$(".shopee-rating-media-list-image__content--blur")

        if (allmedia.length > 2) {
            randomDown = Math.floor(Math.random() * (allmedia.length - 1)) + 1;
            for (i = 0; i < randomDown; i++) {
                randomDown2 = Math.floor(Math.random() * (allmedia.length - 1)) + 1;
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout)
                await allmedia[randomDown2].click()
            }
        }

        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        //click xem sản phẩm khác của shop
        clickNext = await page.$$('.carousel-arrow--next')

        if (clickNext.length) {
            clickNext[0].click()
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitFor(timeout)
            clickNext[0].click()
        }

    }
}


viewShop = async (page) => {
    viewShopClick = await page.$$('.shopee-avatar__placeholder')
    viewShopClick[1].click()
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)

    randomDown = Math.floor(Math.random() * (5 - 3)) + 3;
    for (i = 0; i < randomDown; i++) {
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
    }

    getProductShop = await page.$$('.shop-search-result-view__item')
    randomProduct = Math.floor(Math.random() * (getProductShop.length - 1)) + 1;
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)
    await getProductShop[randomProduct].click()
    randomDown = Math.floor(Math.random() * (4 - 2)) + 2;

    for (i = 0; i < randomDown; i++) {
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
    }

    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)
    await page.keyboard.press('Home');

    // Click xem phaan loai sản phẩm và chọn 
    let checkVariation = chooseVariation(page, 5)
    if (checkVariation) {

        // click thêm vào giỏ hàng
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        addToCard = await page.$$('.btn-tinted')
        await addToCard[0].click()
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)

    }
}


actionShopee = async (page) => {
    await page.waitForSelector('.product-briefing')
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)
    await page.click('.product-briefing>div>div>div');

    // xem ngẫu nhiên n ảnh sản phẩm
    viewRandomImages = Math.floor(Math.random() * (10 - 6)) + 6;
    checkvideo = await page.$$('video')
    if (checkvideo.length) {
        timeout = Math.floor(Math.random() * (25000 - 15000)) + 20000;
        await page.waitFor(timeout)
    }
    for (let i = 0; i <= viewRandomImages; i++) {
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        nextRightButton = await page.$$('.icon-arrow-right-bold')
        await nextRightButton[1].click();
    }

    // click tắt ảnh sản phẩm    
    await page.mouse.click(10, 30)

    // lướt đọc sản phẩm
    viewRandomImages = Math.floor(Math.random() * (10 - 6)) + 6;
    for (let i = 0; i <= viewRandomImages; i++) {
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
        // đến phần review thì dừng lại
        goToRview = await page.$$('.product-rating-overview__filter')
        if (goToRview.length) {

            break;
        }

    }
    await viewReview(page)

    await page.waitFor(timeout)
    await page.keyboard.press('Home');

    // click chọn màu
    let checkVariation = chooseVariation(page, 5)
    if (checkVariation) {

        // click thêm vào giỏ hàng
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)
        addToCard = await page.$$('.btn-tinted')
        await addToCard[0].click()
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitFor(timeout)

        await viewShop(page)

    } else {
        console.log("Không chọn được mẫu mã")
        return false
    }
}

removeCart = async (page) => {
    // check đầy giỏ hàng

    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)
    await page.keyboard.press('Home');
    checkcart = typeof 123
    checkcart = await page.evaluate(() => {

        // Class có link bài đăng trên profile       
        let titles = document.querySelector('.shopee-cart-number-badge').innerText;
        return titles
    })

    carts = Math.floor(Math.random() * (50 - 35)) + 35;

    if (checkcart > 4) {
        await page.goto('https://shopee.vn/cart/')
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitFor(timeout)
        await page.waitForSelector('.cart-item__action')
        actionDeletes = await page.$$('.cart-item__action')

        for (let i = actionDeletes.length; i > 2; i--) {
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            await actionDeletes[i - 1].click();
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            await page.click('.btn.btn-solid-primary.btn--m.btn--inline.shopee-alert-popup__btn')
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
        }

    }
}


checkDcomconnect = async (profileDir) => {
    profileDirTest = profileDir + "test"
    const browser = await puppeteer.launch({
        executablePath: chromiumDir,
        headless: false,
        devtools: false,
        args: [
            `--user-data-dir=${profileDirTest}`      // load profile chromium
        ]
    });

    const page = (await browser.pages())[0];

    // Random kích cỡ màn hình
    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;

    await page.setViewport({
        width: width,
        height: height
    });

    // Check dcom off 
    try {
        await page.goto("http://192.168.8.1/html/home.html")
    } catch (error) {
        browser.close()
        return false
    }

    // turn on dcom
    checkDcomOff = await page.$$(".mobile_connect_btn_on")
    if (!checkDcomOff.length) {
        await page.click("#mobile_connect_btn")
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitFor(timeout)
        browser.close()
        return true
    }

    if (!checkDcomOff.length) {

        // turn on dcom
        checkDcomOff = await page.$$("#connect_btn")
        // checkDcomOff = await page.waitForSelector("#connect_btn")

        if (checkDcomOff.length) {
            await page.click("#connect_btn")
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitFor(timeout)
            browser.close()
            return true
        } else {
            browser.close()
            return false
        }
    }
}

function generateRandom(min, max, num1) {
    var rtn = Math.floor(Math.random() * (max - min)) + min;

    num1.forEach(element => {
        if (rtn == element) {
            return generateRandom(min, max, num1)
        }
    });
    return rtn
}

runAllTime = async () => {

    // lấy dữ liệu từ master
    try {
        let linkgetdataShopeeDir = ""
        let checkDcomOff
        linkgetdataShopeeDir = dataShopeeDir + "?slave=" + slavenumber + "&token=kjdaklA190238190Adaduih2ajksdhakAhqiouOEJAK092489ahfjkwqAc92alA&click_ads=" + clickAds + "&type_click=" + typeClick

        getDataShopee = await axios.get(linkgetdataShopeeDir)

        if (getDataShopee.data.shops == undefined) {

            checkDcomOff = await checkDcomconnect(profileDir)
            console.log("Kết nối lại dcom: " + checkDcomOff);

            if (checkDcomOff) {
                getDataShopee = await axios.get(linkgetdataShopeeDir);
            }
        }

        if (checkDcomOff == false) {
            console.log("Không thể kểt nối mạng")
            return false
        }

        idShops = []
        dataShopee = getDataShopee.data
        dataShopee.shops.forEach(item => {
            idShop = item.fullname.split("\r")[0]
            idShops.push(item.fullname)
        })

        keywords = []
        dataShopee.keywords.forEach(item => {
            keyword = item.username.split("\r")[0]
            keywords.push(keyword)
        })

        if(typeClick == 1){
            indexClickShopee = dataShopee.soLuongAdsClick[0].twofa
        }
        
        //accounts = []
        //dataShopee.accounts.forEach(item => {
        //    let account = item.username + "\t" + item.password
        //    account = account.split("\r")[0]
        //    accounts.push(account)
        //})

        var accounts = fs.readFileSync("shopee.txt");
        if (accounts) {
            accounts = accounts.toString();
            accounts = accounts.split("\n")
        } else {
            accounts = []
        }

        listProducts = []
        dataShopee.products.forEach(item => {
            product = item.fullname
            listProducts.push(product)
        })

        listcategories = dataShopee.categories
    } catch (error) {
        console.log(error)
    }


    try {
        console.log("----------- START SHOPEE ---------------")
        data = GenDirToGetData(maxTab, accounts)
        
        if (data) {

            // get version hien tai trong file version.txt
            var checkVersion = fs.readFileSync("version.txt", { flag: "as+" });

            if (checkVersion) {
                checkVersion = checkVersion.toString();

            } else {
                checkVersion = ""
            }

            console.log("Version hiện tai: " + checkVersion);
            newVersion = dataShopee.version;
            console.log("Version server: " + dataShopee.version);

            // if (0) {
            if (newVersion !== checkVersion) {

                console.log("Cập nhật code");
                // Update version mới vào file version.txt
                fs.writeFileSync('version.txt', newVersion)

                const myShellScript = exec('update.sh /');
                myShellScript.stdout.on('data', (data) => {
                    // do whatever you want here with data
                });
                myShellScript.stderr.on('data', (data) => {
                    console.error(data);
                });
                return false
            }
            data.forEach(async (key, index) => {   // Foreach object Chạy song song các tab chromium

                // Nếu có dữ liệu schedule trả về
                key = key.split("\t")
                let profileChrome = profileDir + key[0]        // Link profile chromium của từng tài khoản facebook

                if (clickAds == 1) {
                    console.log("----- START CLICK ADS -----")
                 //   extension = __dirname + "\\extension\\autoshopee\\1.7.5_0"
                    extension = ""
                    if(extension){
                        extension = __dirname + "\\extension\\autoshopee\\1.7.5_0"
                        argsChrome = [
                            `--user-data-dir=${profileChrome}`,      // load profile chromium
                            `--disable-extensions-except=${extension}`,
                            `--load-extension=${extension}`
                        ]
                    }else{
                        argsChrome = [
                            `--user-data-dir=${profileChrome}`,      // load profile chromium
            
                        ]
                    }
                    
                    const browser = await puppeteer.launch({
                        executablePath: chromiumDir,
                        headless: false,
                        devtools: false,
                        args: argsChrome
                    });
                    const page = (await browser.pages())[0];

                    // Random kích cỡ màn hình
                    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
                    height = Math.floor(Math.random() * (800 - 600)) + 600;;

                    await page.setViewport({
                        width: width,
                        height: height
                    });

                    try {
                        if ((index == 0) && (mode !== "DEV")) {
                            // đổi ip
                            console.log("Đổi ip mạng")
                            await page.goto("http://192.168.8.1/html/home.html")
                            //  timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                            //   await page.waitFor(timeout)
                            checkDcom = await page.$$(".mobile_connect_btn_on")

                            //   process.exit()
                            if (checkDcom.length) {
                                await page.click("#mobile_connect_btn")
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.waitFor(timeout)

                                // turn on dcom
                                checkDcomOff = await page.$$(".mobile_connect_btn_on")
                                if (!checkDcomOff.length) {
                                    await page.click("#mobile_connect_btn")
                                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                    await page.waitFor(timeout)
                                }
                            }

                            if (!checkDcom.length) {
                                console.log("DCOM V2")
                                checkDcomOff = await page.$$("#disconnect_btn")
                                await page.click("#disconnect_btn")
                                timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                                await page.waitFor(timeout)

                                // turn on dcom
                                //checkDcomOff = await page.$$("#connect_btn")
                                checkDcomOff = await page.waitForSelector("#connect_btn")
                                await page.click("#connect_btn")
                                timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                await page.waitFor(timeout)
                            }
                        }
                        //  timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
                        await page.waitFor(10000)
                        await page.goto("https://shopee.vn", {timeout: 55000})
                        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                        await page.waitFor(timeout)

                        // login account shopee                    
                        checklogin = await loginShopee(page, key)
                        if (checklogin) {

                            if(!keywords.length){
                                console.log("Không có từ khoá")
                                await browser.close();
                                return false
                            }
                            // lấy ngẫu nhiên keyword để tìm kiếm
                            randomkey = Math.floor(Math.random() * (keywords.length - 1));
                            await searchKeyWord(page, keywords[randomkey])

                            // lấy danh sách product đã lưu
                            var saveProduct = fs.readFileSync("saveProduct.txt", { flag: "as+" });
                            saveProduct = saveProduct.toString();
                            saveProduct = saveProduct.split("\n")

                            // danh sách product không nằm trong file saveproduct.txt
                            today = new Date().toLocaleString();

                            if (typeClick == 1) {
                                
                                // random vị trí ads
                                adsIndex = indexClickShopee;
                                console.log("adsIndex: " + adsIndex)
                                //Xác định trang của ads
                                pageAds =Math.floor (adsIndex / 10)
                                pageAds2 = adsIndex % 10
                                if(pageAds > 0){
                                    pageUrl = await page.url()
                                    // Đi đến trang có vị trí ads cần click
                                    pageUrlAds = pageUrl + "&page=" + pageAds
                                    await page.goto(pageUrlAds, {timeout: 25000})
                                }
                                
                                timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000;
                                await page.waitFor(timeout)
                                // Lấy mảng vị trí các sp trong phần ads thuộc các shop
                                productIndexs = await getproductAds(page, idShops)
                                console.log("typeclick = 1: " + productIndexs.length)
                                // Tạo ngẫu nhiên 1 vị trí sp trong ads không thuộc các shop 
                                indexClick = generateRandom(0, pageAds2, productIndexs)
                                if (indexClick > 4) {
                                    indexClick = indexClick + 40
                                }
                                products = await page.$$('[data-sqe="link"]')
                                console.log("Index Click: " + indexClick)
                                products[indexClick].click()
                                timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000;
                                await page.waitFor(timeout)
                                let checkvariationAds = chooseVariation(page, 5)
                                timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000
                                await page.waitFor(timeout)
                                await page.keyboard.press('PageDown');
                                timeout = Math.floor(Math.random() * (30000 - 20000)) + 20000
                                await page.waitFor(timeout)
                                await page.keyboard.press('PageDown');
                                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                                await page.waitFor(timeout)
                                await page.keyboard.press('PageDown');
                                timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000
                                await page.waitFor(timeout)

                            } else {
                                productInfo = await getproduct(page, saveProduct, 6, idShops)
                                if (productInfo) {
                                    if (productInfo.vitri < 4 || productInfo.vitri >= 45) {
                                        products = await page.$$('[data-sqe="link"]')
                                        products[productInfo.vitri].click()
                                        timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000
                                        await page.waitFor(timeout)
                                        let checkvariationAds = chooseVariation(page, 5)
                                        timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000
                                        await page.waitFor(timeout)
                                        await page.keyboard.press('PageDown');
                                        timeout = Math.floor(Math.random() * (30000 - 20000)) + 20000
                                        await page.waitFor(timeout)
                                        await page.keyboard.press('PageDown');
                                        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                                        await page.waitFor(timeout)
                                        await page.keyboard.press('PageDown');
                                        timeout = Math.floor(Math.random() * (10000 - 5000)) + 5000
                                        await page.waitFor(timeout)
                                    }
                                }
                            }

                            await browser.close();
                        }
                    } catch (error) {
                        console.log(error)

                    }

                    await browser.close();
                    console.log("----------- STOP CLICK ADS ---------------")

                } else
                    if (phobien == 1) {

                        const browser = await puppeteer.launch({
                            executablePath: chromiumDir,
                            headless: false,
                            devtools: false,
                            args: [
                                `--user-data-dir=${profileChrome}`      // load profile chromium
                            ]
                        });

                        const page = (await browser.pages())[0];

                        // Random kích cỡ màn hình
                        width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
                        height = Math.floor(Math.random() * (800 - 600)) + 600;;

                        await page.setViewport({
                            width: width,
                            height: height
                        });

                        try {
                            if ((index == 0) && (mode !== "DEV")) {
                                // đổi ip
                                console.log("Đổi ip mạng")
                                await page.goto("http://192.168.8.1/html/home.html")
                                timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                                await page.waitFor(timeout)

                                // turn off dcom
                                checkDcom = await page.$$(".mobile_connect_btn_on")

                                if (checkDcom.length) {
                                    await page.click("#mobile_connect_btn")
                                    timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                    await page.waitFor(timeout)

                                    // turn on dcom
                                    checkDcomOff = await page.$$(".mobile_connect_btn_on")
                                    if (!checkDcomOff.length) {
                                        await page.click("#mobile_connect_btn")
                                        timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                        await page.waitFor(timeout)
                                    }
                                }

                                if (!checkDcom.length) {
                                    console.log("DCOM V2")
                                    checkDcomOff = await page.$$("#disconnect_btn")
                                    await page.click("#disconnect_btn")
                                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                                    await page.waitFor(timeout)

                                    // turn on dcom
                                    //checkDcomOff = await page.$$("#connect_btn")
                                    checkDcomOff = await page.waitForSelector("#connect_btn")

                                    await page.click("#connect_btn")
                                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                    await page.waitFor(timeout)

                                }

                            }

                            //  timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
                            await page.waitFor(10000)
                            try {
                                await page.goto("https://shopee.vn", {timeout: 55000})
                            } catch (error) {
                                console.log("Mạng chậm không kết nối dc")
                                return false
                            }

                            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                            await page.waitFor(timeout)

                            // login account shopee                    
                            checklogin = await loginShopee(page, key)

                            if (checklogin) {
                                console.log("san pham pho bien")

                                populateClick(page, listcategories)

                                // lấy danh sách product đã lưu
                                var saveProduct = fs.readFileSync("saveProduct.txt", { flag: "as+" });
                                saveProduct = saveProduct.toString();
                                saveProduct = saveProduct.split("\n")

                                // danh sách product không nằm trong file saveproduct.txt

                                //lấy danh sách product thuộc các id shop của cùng 1 người dùng                   

                                productInfo = await getproduct(page, saveProduct, 6, idShops)

                                if (productInfo) {
                                    //  console.log(productInfo)
                                    fs.appendFileSync('saveProduct.txt', productInfo.id + "\n")

                                    var today = new Date().toLocaleString();
                                    productInfo.keyword = "Sản phẩm phổ biến"
                                    productInfo.time = today
                                    productInfo.user = key[0]
                                    productInfo.pass = key[1]
                                    // lưu thứ hạng sản phẩm theo từ khoá vào file
                                    fs.appendFileSync('thuhang.txt', "\n" + JSON.stringify(productInfo, null, 4))

                                    try {
                                        let datatest = await axios.get(linkShopeeUpdate, {
                                            params: {
                                                data: {
                                                    dataToServer: productInfo,
                                                }
                                            }
                                        })
                                        console.log(datatest.data)
                                    } catch (error) {
                                        console.log(error)
                                        //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
                                    }

                                    products = await page.$$('[data-sqe="link"]')

                                    if (productInfo.vitri > 4 && productInfo.vitri < 45) {
                                        products[productInfo.vitri].click()
                                        await actionShopee(page)
                                        await page.waitFor(1000);
                                        await removeCart(page)
                                    }


                                } else {
                                    // nếu đã check hết product sẽ xoá file saveProduct.txt                                
                                    saveProduct = [];
                                    fs.writeFileSync('saveProduct.txt', saveProduct)
                                    fs.appendFileSync('thuhang.txt', "\n" + "K có kết quả: ")
                                }
                                await browser.close();
                            } else {
                                accountInfo = {
                                    user: key[0],
                                    pass: key[1],
                                    status: 0,
                                    message: "Account bị khoá"
                                }
                                try {
                                    let datatest = await axios.get(linkShopeeAccountUpdate, {
                                        params: {
                                            data: {
                                                dataToServer: accountInfo,
                                            }
                                        }
                                    })
                                    console.log(datatest.data)
                                } catch (error) {
                                    console.log(error)
                                    //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
                                }
                            }

                        } catch (error) {
                            console.log(error)
                            await browser.close();
                        }
                        await browser.close();
                        console.log("----------- STOP PHO BIEN---------------")
                    } else {

                        const browser = await puppeteer.launch({
                            executablePath: chromiumDir,
                            headless: false,
                            devtools: false,
                            args: [
                                `--user-data-dir=${profileChrome}`      // load profile chromium
                            ]
                        });

                        const page = (await browser.pages())[0];

                        // Random kích cỡ màn hình
                        width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
                        height = Math.floor(Math.random() * (800 - 600)) + 600;;

                        await page.setViewport({
                            width: width,
                            height: height
                        });

                        try {
                            if ((index == 0) && (mode !== "DEV")) {
                                // đổi ip
                                console.log("Đổi ip mạng")
                                await page.goto("http://192.168.8.1/html/home.html")
                                //  timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                                //   await page.waitFor(timeout)
                                checkDcom = await page.$$(".mobile_connect_btn_on")

                                //   process.exit()
                                if (checkDcom.length) {
                                    await page.click("#mobile_connect_btn")
                                    timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                    await page.waitFor(timeout)

                                    // turn on dcom
                                    checkDcomOff = await page.$$(".mobile_connect_btn_on")
                                    if (!checkDcomOff.length) {
                                        await page.click("#mobile_connect_btn")
                                        timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                        await page.waitFor(timeout)
                                    }
                                }

                                if (!checkDcom.length) {
                                    console.log("DCOM V2")
                                    checkDcomOff = await page.$$("#disconnect_btn")
                                    await page.click("#disconnect_btn")
                                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                                    await page.waitFor(timeout)

                                    // turn on dcom
                                    //checkDcomOff = await page.$$("#connect_btn")
                                    checkDcomOff = await page.waitForSelector("#connect_btn")

                                    await page.click("#connect_btn")
                                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
                                    await page.waitFor(timeout)

                                }

                            }
                            //  timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
                            await page.waitFor(10000)
                            await page.goto("https://shopee.vn", {timeout: 55000})
                            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                            await page.waitFor(timeout)

                            // login account shopee                    
                            checklogin = await loginShopee(page, key)
                            if (checklogin) {

                                // Lấy danh sách keyword đã tìm kiếm
                                var saveKeyword = fs.readFileSync("saveKeyword.txt", { flag: "as+" });
                                saveKeyword = saveKeyword.toString();
                                saveKeyword = saveKeyword.split("\n")
                                if (saveKeyword.length >= keywords.length) {
                                    saveKeyword = [];
                                    fs.writeFileSync('saveKeyword.txt', saveKeyword)
                                }

                                // danh sách keyword không nằm trong file savekeyword.txt
                                let keywordNotSave = []
                                keywords.forEach(item => {
                                    if (!saveKeyword.includes(item)) {             // Tìm id đó trong file saveid. nếu chưa có thì lưu vào mảng id chưa tương tác idnotsave[]
                                        keywordNotSave.push(item);
                                    }
                                })
                                // lấy ngẫu nhiên keyword để tìm kiếm
                                randomkey = Math.floor(Math.random() * (keywordNotSave.length - 1));

                                // lưu keyword sẽ tìm vào file saveKeyword.txt
                                fs.appendFileSync('saveKeyword.txt', keywordNotSave[randomkey] + "\n")
                                // tìm kiếm theo keyword
                                await searchKeyWord(page, keywordNotSave[randomkey])

                                // lấy danh sách product đã lưu
                                var saveProduct = fs.readFileSync("saveProduct.txt", { flag: "as+" });
                                saveProduct = saveProduct.toString();
                                saveProduct = saveProduct.split("\n")

                                // danh sách product không nằm trong file saveproduct.txt

                                productInfo = await getproduct(page, saveProduct, 6, idShops)

                                if (productInfo) {
                                    today = new Date().toLocaleString();
                                    console.log(productInfo)
                                    fs.appendFileSync('saveProduct.txt', productInfo.id + "\n")
                                    productInfo.keyword = keywordNotSave[randomkey]
                                    productInfo.time = today
                                    productInfo.user = key[0]
                                    productInfo.pass = key[1]
                                    // lưu thứ hạng sản phẩm theo từ khoá vào file
                                    fs.appendFileSync('thuhang.txt', "\n" + JSON.stringify(productInfo, null, 4))

                                    try {
                                        let datatest = await axios.get(linkShopeeUpdate, {
                                            params: {
                                                data: {
                                                    dataToServer: productInfo,
                                                }
                                            }
                                        })
                                        console.log(datatest.data)
                                    } catch (error) {
                                        console.log("Không gửi được dữ liệu thứ hạng mới đến")

                                    }

                                    products = await page.$$('[data-sqe="link"]')

                                    if (productInfo.vitri > 4 && productInfo.vitri < 45) {
                                        products[productInfo.vitri].click()
                                        await actionShopee(page)
                                        await page.waitFor(1000);
                                        await removeCart(page)
                                    }

                                } else {
                                    // nếu đã check hết product sẽ xoá file saveProduct.txt                                
                                    saveProduct = [];
                                    fs.writeFileSync('saveProduct.txt', saveProduct)
                                    fs.appendFileSync('thuhang.txt', "\n" + "K có kết quả: ")
                                }

                                await browser.close();
                            }
                        } catch (error) {
                            console.log(error)

                        }

                        await browser.close();
                        console.log("----------- STOP ---------------")
                    }
            })
        }

    } catch (error) {
        console.log(error)
        return false
    }
    //}
};

//Cron 1 phút 1 lần 

//(async () => {
if (mode === "DEV") {
    (async () => {
        await runAllTime()

    })();
} else {

    (async () => {
        await runAllTime()

    })();
}


//})();