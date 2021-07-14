require('dotenv').config();
var fs = require('fs');
const shopeeApi = require('./src/shopeeApi.js')
const actionsShopee = require('./src/actions.js')
const axios = require('axios').default;

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

var cron = require('node-cron');
var randomMac = require('random-mac');

const exec = require('child_process').exec;
const { spawn } = require('child_process');
const randomUseragent = require('random-useragent');
const publicIp = require('public-ip');
const { isBuffer } = require('util');
var shell = require('shelljs');
const { preparePageForTests } = require('./src/bypass');
const bypassTest = require('./src/bypassTest');

slavenumber = process.env.SLAVE
clickAds = process.env.CLICKADS
typeClick = process.env.TYPECLICK
clickSanPham = process.env.CLICK_SAN_PHAM
lienQuan = process.env.LIEN_QUAN

account_check = process.env.ACCOUNT_CHECK
product_check = process.env.PRODUCT_CHECK
keyword_check = process.env.KEYWORD_CHECK

chromiumDir = process.env.CHROMIUM_DIR                     // Đường dẫn thư mục chromium sẽ khởi chạy
let profileDir = process.env.PROFILE_DIR
let extension = process.env.EXTENSION
let dcomVersion = process.env.DCOM
phobien = process.env.PHO_BIEN         //Chế độ chạy phổ biến
// Danh sách profile fb trong file .env
maxTab = process.env.MAXTAB_SHOPEE  // Số lượng tab chromium cùng mở tại 1 thời điểm trên slave
max_turn = process.env.MAX_TURN  // Số lượng keyword trên slave
headless_mode = process.env.HEADLESS_MODE     // che do chay hien thi giao dien
disable_image = process.env.DISABLE_IMAGE     // k load ảnh
disable_css = process.env.DISABLE_CSS     // k load css
os_slave = process.env.OS     // k load css
disable_image = 0

if (headless_mode == "0") {
    headless_mode = true
} else {
    headless_mode = false
}

console.log("headless_mode: " + headless_mode)

// Danh sách profile facebook trong mỗi slave
mode = process.env.MODE

if (mode === "DEV") {
    apiUrl = "http://hotaso.tranquoctoan.com"
    apiServer = "http://history.hotaso.vn:3000"
    updateActionsUrl = "https://hotaso.tranquoctoan.com"

} else {
    apiUrl = "http://hotaso.vn"
    apiServer = "http://history.hotaso.vn:4000"
    updateActionsUrl = "https://db.hotaso.vn"

    //updateActionsUrl = "https://hotaso.tranquoctoan.com"
    maxTab = 5
}

linkShopeeUpdate = apiUrl + "/api_user/shopeeupdate"     // Link shopee update thứ hạng sản phẩm
linkShopeeAccountUpdate = apiUrl + "/api_user/shopeeAccountUpdate" // Link update account shopee status
linkShopeeUpdateAds = apiUrl + "/api_user/shopeeUpdateAds" // Link update shopee ads index
dataShopeeDir = apiUrl + "/api_user/dataShopee"     // Link shopee update thứ hạng sản phẩm
shopeeUpdateSeoSanPhamDir = apiUrl + "/api_user/shopeeUpdateSeoSanPham"     // Link shopee update seo sản phẩm
updateHistory = apiUrl + "/check_die_slave_url"     // Check die slave
updateActionsDir = updateActionsUrl + "/api_user/updateActions"     // Update actions
update_action_all = updateActionsUrl + "/api_user/update_action_all"     // Update actions
//save_history = updateActionsUrl + "/api_user/save_history"     // Update actions

updateHistory = apiServer + "/update-history"     // Update history
updateHistoryAll = apiServer + "/update-history-all"     // Update history
saveHistory = apiServer + "/save-history"     // Update history

//checkActionsDir = apiUrl + "/api_user/checkActions"     // check actions
checkActionsDir = apiServer + "/check-action"     // check actions
getShopActionsDir = apiUrl + "/api_user/getShopActions"     // check actions
getSlaveAccountDir = apiUrl + "/api_user/getSlaveAccount"     // Lay tai khoan shopee cho slave
getSlaveInfo = apiUrl + "/api_user/getSlaveInfo"     // Lay thong tin cau hinh slave
LinkdanhSachSanPhamChuaTuongTac = apiUrl + "/api_user/danhSachSanPhamChuaTuongTac"     // Lay thong tin cau hinh slave

if (mode === "DEV") {
    timemax = 3000;
    timemin = 2000;
} else {
    timemax = 4000;
    timemin = 3000;
}
logs = 1

loginShopee = async (page, accounts) => {

    //await page.goto("https://shopee.vn")
    // await page.waitForTimeout(3000)
    // try {
    //     await page.waitForSelector('.navbar__username')
    // } catch (error) {
    //     console.log(" Không tìm thấy class check login")
    // }
    let logincheck = await page.$$('.navbar__username');

    if (!logincheck.length) {
        await page.mouse.click(10, 30)
        let timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
        await page.waitForTimeout(timeout)


        try {
            let ref = await page.url()
            await page.goto("https://shopee.vn/buyer/login?next=https%3A%2F%2Fshopee.vn%2F", {
                waitUntil: "networkidle0",
                timeout: 30000,
                referer: ref
            })

            await page.waitForSelector('[name="loginKey"]')

            await page.click('[name="loginKey"]')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.type('[name="loginKey"]', accounts[0], { delay: 100 })    // Nhập comment 
            await page.click('[name="password"]')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.type('[name="password"]', accounts[1], { delay: 200 })    // Nhập comment 
            await page.click('[name="password"]')
            timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000;
            await page.waitForTimeout(timeout)
            const loginbutton = await page.$$('div>button:nth-child(4)');
            if (loginbutton.length) {
                await loginbutton[0].click()
            }
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(15000)
            let checkcode = await page.$$('[autocomplete="one-time-code"]')

            if (checkcode.length) {
                console.log("account bi khoá")
                return 2
            }

            let checkblock = await page.$('[role="alert"]')

            if (checkblock) {
                console.log("account bị khoá")
                return 2
            }

            let checkblock2 = await page.$('.stardust-icon-cross-with-circle')
            if (checkblock2) {
                let checkblock3 = await page.evaluate(() => {
                    // Class có tài khoản bị cấm       
                    let titles = document.querySelector('.stardust-icon-cross-with-circle').parentElement.parentElement.children[1].textContent;
                    return titles
                })

                if (checkblock3 == "Tài khoản đã bị cấm") {
                    console.log("account bị khoá")
                    return 2
                }
            }
        } catch (e) {
            console.log(e)
            console.log("Đăng nhập lỗi")
            return false
        }
        try {
            await page.waitForSelector('.shopee-searchbar-input');
        } catch (error) {
            console.log(error)
            console.log("Đăng nhập lỗi")
            return false
        }

        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout)
        return true

    } else {
        return true
    }
}


searchKeyWord = async (page, keyword) => {
    try {

        await page.waitForSelector('.shopee-searchbar-input__input')

        let checkSearchInput = await page.$$('.shopee-searchbar-input__input');
        if (checkSearchInput.length) {
            await page.click('.shopee-searchbar-input__input')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.type('.shopee-searchbar-input__input', keyword, { delay: 100 })
            timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
            await page.waitForTimeout(timeout);
            await page.keyboard.press('Enter')
        } else {
            //  await page.waitForSelector('.shopee-searchbar-input')
            await page.click('.shopee-searchbar-input')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.click('.shopee-searchbar-input')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.click('.shopee-searchbar-input')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            console.log(keyword)
            await page.type('.shopee-searchbar-input', keyword, { delay: 100 })
            timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
            await page.waitForTimeout(timeout);
            await page.keyboard.press('Enter')

        }
    } catch (error) {
        console.log(error)
        return false
    }
    return true

}

populateClick = async (page, listcategories) => {

    try {
        timeout = Math.floor(Math.random() * (2000 - 1100)) + 1100;
        await page.waitForTimeout(timeout);

        timeout = Math.floor(Math.random() * (2000 - 1100)) + 1100;
        await page.waitForTimeout(timeout);
        checkpopup = await page.$$('.shopee-popup__close-btn')
        if (checkpopup.length) {
            await page.click('.shopee-popup__close-btn')
        }

        timeout = Math.floor(Math.random() * (3000 - 2100)) + 2100;
        await page.waitForTimeout(timeout);

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
        await page.waitForTimeout(timeout);

        if (randomcategory.pages) {

            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.keyboard.press('PageDown');
            await page.waitForTimeout(timeout);
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.keyboard.press('PageDown');
            await page.waitForTimeout(timeout);

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
    } catch (error) {
        console.log(error)
    }

}

getproduct = async (page, saveProduct, limit, idShops) => {
    try {
        let thuHangSanPham
        await page.waitForSelector('[data-sqe="name"]')
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(3000);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        if (phobien) {
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout);
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout);
        }
        let getProduct = []
        getProduct = await page.evaluate(() => {

            //  
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
            if ((index < 45) && (index > 4)) {
                idShops.forEach((shop, index2) => {
                    productIds = item.includes(shop.shop_id)
                    if (productIds == true) {
                        if (!saveProduct.includes(productIds[1])) {
                            productIds2 = item.split(shop.shop_id + ".")
                            productId = productIds2[1]
                            productIndex = index;
                            thuHangSanPham = {
                                sanpham: getProduct[productIndex],
                                id: productId,
                                shopId: shop.shop_id,
                                trang: (shop.pages - limit),
                                vitri: productIndex,
                            }
                            if (shop.twofa) {
                                thuHangSanPham.randomOrder = shop.twofa
                            } else {
                                thuHangSanPham.randomOrder = 0
                            }
                        }
                        return true
                    }
                })
            }
        })

        if (thuHangSanPham) {
            console.log("---------- vi tri cac san pham cua shop ----------")
            console.log(thuHangSanPham)
            return thuHangSanPham;
        }
        //     if(!xxx){
        //         if(shop.pages && limit>shop.pages){
        //             limit=shop.pages
        //         }           
        //     }
        //    xxx = 1

        if (limit == 0) {
            return false
        } else {
            limit -= 1;
            next = await page.$$('.shopee-icon-button--right')
            if (next.length) {
                await next[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitForTimeout(timeout);
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

get_variation_enable = async (page) => {

    let variation1 = await page.evaluate(() => {

        //  tất cả variation
        let titles = document.querySelectorAll('.product-variation');
        let list_variation = []
        titles.forEach((item, index) => {
            let x = item.textContent
            list_variation.push(x)
        })
        return list_variation
    })

    // variation disable
    let variation_disable = await page.evaluate(() => {
        let titles_disable = document.querySelectorAll('.product-variation--disabled');
        let list_variation_disable = []
        titles_disable.forEach((item) => {
            let x = item.textContent
            list_variation_disable.push(x)
        })

        return list_variation_disable
    })

    list_variation_enable = []
    variation1.forEach((item2, index) => {
        if (!variation_disable.includes(item2)) {
            list_variation_enable.push(index)
        }

    })

    return list_variation_enable
}

// chọn thuộc tính sản phẩm
chooseVariation = async (page, limit) => {
    let variation_enable
    try {
        console.log("---- Chọn ngẫu nhiên phân loại sản phẩm ----")
        let checkSelected = []
        limit -= 1

        let varitations = await page.$$('.product-variation')
        if (!varitations.length) {
            return true
        }
        variation_enable = await get_variation_enable(page)
        console.log("variation enable")
        console.log(variation_enable)
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout)

        if (variation_enable.length > 0) {

            for (i = 0; i < (variation_enable.length - 1); i++) {                               

                try {
                    await varitations[variation_enable[i]].click()
                    timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                    await page.waitForTimeout(timeout)
                } catch (error) {
                    console.log(error)
                }

            }
        }
        return 1

    } catch (error) {
        console.log(error)

    }

}

action_view_review = async (page) => {
    try {
        timeout = Math.floor(Math.random() * (4000 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        allRview = await page.$$('.product-rating-overview__filter')
        //console.log(allRview.length)
        if (allRview.length > 2) {
            randomReview1 = timeout = Math.floor(Math.random() * (3 - 1)) + 1;
            // click vào ngẫu nhiên 
            await allRview[randomReview1].click()
            // lướt xuống xem
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');

            // xem ngẫu nhiên n ảnh
            allmedia = await page.$$(".shopee-rating-media-list-image__content--blur")

            if (allmedia.length > 3) {

                randomDown = Math.floor(Math.random() * (3 - 1)) + 1;
                for (i = 1; i < randomDown; i++) {

                    randomDown2 = Math.floor(Math.random() * (3 - 1)) + 1;
                    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                    await page.waitForTimeout(timeout)
                    if (allmedia[randomDown2]) {
                        await allmedia[randomDown2].click()
                    }
                }
            }

            // lên đầu phần review
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageUp');
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageUp');

            randomReview1 = timeout = Math.floor(Math.random() * (allRview.length - 1)) + 1;
            // click vào ngẫu nhiên lần 2
            if (allRview[randomReview1]) {
                await allRview[randomReview1].click()
            }
            // lướt xuống xem
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)

            allmedia = await page.$$(".shopee-rating-media-list-image__content--blur")

            if (allmedia.length > 3) {
                randomDown = Math.floor(Math.random() * (3 - 1)) + 1;
                for (i = 0; i < randomDown; i++) {
                    randomDown2 = Math.floor(Math.random() * (3 - 1)) + 1;
                    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                    await page.waitForTimeout(timeout)
                    if (allmedia[randomDown2]) {
                        await allmedia[randomDown2].click()
                    }
                }
            }

            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitForTimeout(timeout)
            //click xem sản phẩm khác của shop
            clickNext = await page.$$('.carousel-arrow--next')

            if (clickNext.length) {
                clickNext[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitForTimeout(timeout)
                //clickNext[0].click()
            }

        }
    } catch (error) {
        console.log(error)
    }

}

checkAtions = async (action, product) => {
    datacheck = product
    datacheck.action = action

    await axios.get(checkActionsDir, {
        params: {
            data: datacheck
        },
        timeout: 50000
    })
        .then(function (response) {
            console.log(response.data);
            console.log("check action: " + action + ":" + response.data)
            return checkAtion
        })
        .catch(function (error) {
            console.log(error);
            return 0
        })
        .then(function () {
            // always executed
        });

}

updateHistory = async (product) => {
    dataupdate = product

    update = 0
    //datatest = 

    await axios.get(saveHistory, {
        data: dataupdate,
        timeout: 50000
    },
        {
            headers: {
                Connection: 'keep-alive',
            }
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}

updateActions = async (product9) => {

    update = 0
    //datatest = 

    await axios.post(updateActionsDir, {
        data: product9,
        timeout: 50000
    },
        {
            headers: {
                Connection: 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            }
        })
        .then(function (response) {
            console.log("Update action: " + product9.action + " = " + response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

    await axios.get(saveHistory, {
        data: product9,
        timeout: 50000
    },
        {
            headers: {
                Connection: 'keep-alive',
            }
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });


}

action_view_shop = async (page, url, product) => {

    console.log("---- View shop ----")


    let ref = await page.url()
    await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000,
        referer: ref
    })


    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitForTimeout(timeout)
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(timeout)

    try {
        await page.waitForSelector('.shopee-avatar__placeholder')
        viewShopClick = await page.$$('.shopee-avatar__placeholder')
        if (viewShopClick.length >= 2) {
            viewShopClick[1].click()
        } else {
            viewShopClick[0].click()
        }
    } catch (error) {
        console.log(error)
        return false
    }
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitForTimeout(timeout)

    randomDown = Math.floor(Math.random() * (5 - 2)) + 3;
    for (i = 0; i < randomDown; i++) {
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        await page.keyboard.press('PageDown');
    }
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitForTimeout(timeout)
    await page.keyboard.press('Home');
}

likeProductOfShop = async (page, url) => {
    console.log("---- like some product of shop----")

    // Click tất cả sản phẩm

    // Lấy danh sách sản phẩm đã like của shop 

    // Lấy danh sách các sản phẩm đang có trên trang - bắt api

    //so sánh lấy ra danh sách sản phẩm chưa like

    // Like ngẫu nhiên 5 10 sản phẩm

    // Trường hợp đã like nhiều sp trên trang đầu
    // Lấy số trang tối đa

    // Next sang trang sau like tiếp


    let ref = await page.url()
    await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000,
        referer: ref
    })

    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitForTimeout(timeout)
    viewShopClick = await page.$$('.shopee-avatar__placeholder')
    if (viewShopClick.length >= 2) {
        viewShopClick[1].click()
    } else {
        viewShopClick[0].click()
    }

}

action_view_product = async (page) => {
    try {
        await page.waitForSelector('.product-briefing')
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)
        await page.click('.product-briefing>div>div>div');

        // xem ngẫu nhiên n ảnh sản phẩm
        let viewRandomImages = Math.floor(Math.random() * (6 - 4)) + 4;
        let checkvideo = await page.$$('video')
        if (checkvideo.length) {
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
        }
        await page.waitForSelector('.icon-arrow-right-bold')

        for (let i = 0; i <= viewRandomImages; i++) {
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            let nextRightButton = await page.$$('.icon-arrow-right-bold')
            if (nextRightButton.length >= 2) {
                await nextRightButton[1].click();
            }
        }
    } catch (e) {
        //console.log(e)
    }
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitForTimeout(timeout)
    // click tắt ảnh sản phẩm    
    await page.mouse.click(10, 30)

    // kéo xuống đọc sản phẩm
    for (let i = 0; i <= 6; i++) {
        timeout = Math.floor(Math.random() * (6000 - 4000)) + 4000;
        await page.waitForTimeout(timeout)
        await page.keyboard.press('PageDown');
    }

    return true
}

action_heart_product = async (page, product) => {
    console.log("Thả tim sản phẩm: ")
    let cookies1 = await page.cookies()
    let refer = await page.url()
    let result = await shopeeApi.thaTimSanPham(cookies1, refer, product.shop_id, product.product_id)

    return result

}

action_add_cart = async (page) => {
    console.log("Thêm vào giỏ hàng")
    await page.keyboard.press('Home');
    // Check số lượng trong giỏ hàng hiện tại

    let checkcart = typeof 123
    checkcart = await page.evaluate(() => {

        // Số sản phẩm trong giỏ hàng       
        let title
        let titles = document.querySelector('.shopee-cart-number-badge')
        if (titles) {
            title = titles.innerText;
        }

        return title
    })
    console.log(" Số sản phẩm trong giỏ hàng: " + checkcart)
    console.log("Chọn màu sản phẩm và thêm vào giỏ hàng")
    // click chọn màu
    let checkVariation = await chooseVariation(page, 5)

    // click thêm vào giỏ hàng
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitForTimeout(timeout)
    addToCard = await page.$$('.btn-tinted')

    if (addToCard.length) {
        try {
            await addToCard[0].click()

            await page.waitForTimeout(5000)

            let checkcart2 = typeof 123
            checkcart2 = await page.evaluate(() => {

                // Số sản phẩm trong giỏ hàng       
                let title
                let titles = document.querySelector('.shopee-cart-number-badge')
                if (titles) {
                    title = titles.innerText;
                }

                return title
            })

            if (checkcart2 > checkcart) {
                return true
            } else {
                console.log("Có lỗi khi bỏ giỏ: ")
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }

    } else {
        return false
    }

}

removeCart = async (page) => {
    try {
        // check đầy giỏ hàng

        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)
        await page.keyboard.press('Home');
        let checkcart = typeof 123
        checkcart = await page.evaluate(() => {

            // Số sản phẩm trong giỏ hàng       
            let title
            let titles = document.querySelector('.shopee-cart-number-badge')
            if (titles) {
                title = titles.innerText;
            }

            return title
        })

        console.log("---- Xoá sản phẩm khỏi giỏ hàng ---- : " + checkcart)
        let carts = Math.floor(Math.random() * (50 - 35)) + 35;

        if (checkcart > 10) {

            let ref = await page.url()
            await page.goto('https://shopee.vn/cart/', {
                waitUntil: "networkidle0",
                timeout: 30000,
                referer: ref
            })
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            let button_del = await page.evaluate(() => {

                // Số sản phẩm trong giỏ hàng       
                let button_del_list = []
                let titles = document.querySelectorAll('button')

                titles.forEach((item, index) => {
                    let text1 = item.textContent;
                    let check = text1.split("Xó");
                    if (check.length == 2) {
                        button_del_list.push(index)
                    }
                })

                return button_del_list
            })
            console.log("Danh sách vị trí các nút xoá sản phẩm")
            console.log(button_del)
            let buttons = await page.$$("button")
            for (let i = 1; i < (button_del.length - 3); i++) {
                await buttons[button_del[i]].click()
                timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
                await page.waitForTimeout(timeout)
            }
        }
    } catch (error) {
        console.log(error)
    }

}

orderProduct = async (page, productInfo) => {
    console.log("---- Đặt hàng ----")
    linksp = await page.url()
    productInfo.linkNow = linksp

    fs.appendFileSync('logs.txt', "\n" + "Order: " + "\n" + JSON.stringify(productInfo, null, 4))
    // check đầy giỏ hàng
    // await page.goto("https://shopee.vn/")    
    // await page.waitForTimeout(29999)
    // await page.goto("https://shopee.vn/V%C3%AD-n%E1%BB%AF-mini-cao-c%E1%BA%A5p-ng%E1%BA%AFn-cute-nh%E1%BB%8F-g%E1%BB%8Dn-b%E1%BB%8F-t%C3%BAi-th%E1%BB%9Di-trang-gi%C3%A1-r%E1%BA%BB-VD70-i.19608398.1406593363")
    // await chooseVariation(page)
    // timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000;
    // await page.waitForTimeout(timeout)
    buttonBye = await page.$$('.btn-solid-primary.btn--l')
    if (buttonBye.length) {
        console.log("Click nút mua ngay")
        await buttonBye[0].click()

    } else {
        console.log("Không thấy nút mua hàng")
        return
    }
    try {
        timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000;
        await page.waitForTimeout(timeout)
        buttonBy2 = await page.$$('.shopee-button-solid--primary')
        if (buttonBy2.length) {
            await buttonBy2[0].click()
        } else {
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (2500 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            buttonBy2 = await page.$$('.shopee-button-solid--primary')
            if (buttonBy2.length) {
                await buttonBy2[0].click()
            } else {
                console.log("Không tìm thấy nút mua hàng")
            }

        }
        timeout = Math.floor(Math.random() * (3500 - 3000)) + 3000;
        await page.waitForTimeout(timeout)

        checkAddress = await page.$$('[placeholder="Họ & Tên"]')
        console.log(checkAddress.length)
        if (checkAddress.length) {
            console.log("Cài đặt địa chỉ")
            fullnames = ["Đặng Tuấn Anh", "Hoàng Đức Anh", "Lưu Trang Anh", "Phạm Hoàng Anh", "Phạm Thị Hiền Anh", "Phạm Khắc Việt Anh", "Đỗ Hoàng Gia Bảo", "Trần Thị Minh Châu", "Tăng Phương Chi", "Gan Feng Du", "Phạm Tiến Dũng", "Nguyễn Thái Dương", "Trần An Dương", "Mạc Trung Đức", "Vũ Hương Giang", "Nguyễn Thị Ngân Hà", "Nguyễn Lê Hiếu", "Phạm Xuân Hòa", "Khoa Minh Hoàng", "Nguyễn Hữu Hiệp Hoàng", "Nguyễn Mạnh Hùng", "Nguyễn Vũ Gia Hưng", "Trần Tuấn Hưng", "Phạm Gia Minh", "Đỗ Hoàng Mỹ", "Đỗ Quang Ngọc", "Đàm Yến Nhi", "Đoàn Hoàng Sơn", "Nguyễn Công Thành", "Bùi Phương Thảo", "Nguyễn Hương Thảo", "Tô Diệu Thảo", "Vũ Phương Thảo", "Đặng Huyền Thi", "Đặng Thành Trung", "Trịnh Thiên Trường", "Lê Khánh Vy", "Phạm Vũ Ngọc Diệp", "Trần Đức Dương", "Nguyễn Quốc Huy", "Phạm Bảo Liên", "Đinh Thùy Linh", "Nguyễn Thùy Linh", "Đỗ Hà Linh", "Vũ Thùy Linh", "Đỗ Thùy Linh", "Hoàng Nhật Mai", "Nguyễn Trọng Minh", "Ngô Gia Minh", "Mai Hoàng Minh", "Đỗ Hải Nam", "Trần Bảo Ngân", "Trần Kim Ngân", "Đỗ Minh Ngọc", "Bùi Khánh Ngọc", "Trần Uyên Nhi", "Phạm Đặng Gia Như", "Lê Tất Hoàng Phát", "Đào Tuấn Phong", "Nguyễn Phú Hải Phong", "Trần Trung Phong", "Bùi Thành Tài", "Đặng Thanh Thảo", "Nguyễn Trường Thịnh", "Dương Phúc Thịnh", "Nguyễn Minh Thư", "Bùi Trung Minh Trí", "Hoàng Quốc Trung", "Vũ Hữu Minh Tường", "Lê Thị Phương Vy", "Họ và tên học sinh", "Nguyễn Hùng Anh", "Nguyễn Ngọc Anh", "Mai Tùng Bách", "Nguyễn Trần Bình", "Vũ Điệp Chi", "Phạm Văn Đạt", "Hoàng An Đông", "Vũ Trung Đức", "Phí Vũ Trí Đức", "Đặng Gia Hân", "Lưu Ngọc Hiền", "Phạm Ngọc Hiếu", "Phạm Sỹ Hiếu", "Phạm Phương Hoa", "Vũ Đức Huy", "Vũ Thanh Huyền", "Phạm Thu Huyền", "Nguyễn Tuấn Hưng", "Trần Đức Hưng", "Nguyễn Tiến Hưng", "Lê Nguyễn Diệu Hương", "Nguyễn Hữu Ngọc Khánh", "Bùi Nam Khánh", "Đinh Ngọc Khánh", "Hồ Nguyễn Minh Khuê", "Phạm Vũ Diệp Lam", "Đinh Hoàng Tùng Lâm", "Lê Quang Long", "Phạm Thị Phương Mai", "Lê Trần Tuấn Minh", "Nguyễn Thị Bích Ngọc", "Lê Trung Nguyên", "Lê Quỳnh Nhi", "Nguyễn Tuyết Anh Nhi", "Đinh Phú Sang", "Đào Duy Thái", "Vũ Minh Thư", "Hä vµ tªn", "Hà Duy Anh ", "Đồng Đức Anh ", "Vũ Ngân Anh ", "Trần Mai Quỳnh Anh", "Nguyễn Thị Tùng Chi", "Phạm Quang Dũng", "Nguyễn Tùng Dương", "Phạm Đức Đạt ", "Nguyễn Hải Đông ", "Nguyễn Duy Đức", "Nguyễn Vũ Minh Đức", "Trịnh Việt Đức", "Lưu Hương Giang", "Quản Gia Hân ", "Nguyễn Trọng Hiếu ", "Nguyễn Quang Hùng", "Trần Gia Huy", "Đặng Vũ Huy", "Phạm Ngọc Huyền", "Trần Ngọc Khánh", "Bùi Đức Kiên ", "Bùi Hải Lâm ", "Dương Khánh Linh", "Trần Huy Hoàng Linh", "Trần Nhật Long", "Trần Đức Lương", "Nguyễn Đức Minh", "Đoàn Hải Minh", "Mai Xuân Minh ", "Bùi Xuân Nam ", "Bùi Khánh Ngọc ", "Mai Phương Ngọc ", "Nguyễn Yến Nhi ", "Đinh Ngọc Quỳnh Như", "Nguyễn Minh Phương", "Nguyễn Minh Quân ", "Nguyễn Thúy Quỳnh ", "Lê Thị Minh Tâm ", "Hoàng Đức Thành", "Nguyễn Đức Thiện", "Phạm Thị Thu Trang", "", "", "Họ và tên", "Lương Thị Thúy An", "Bùi Quỳnh Anh", "Phạm Phương Anh", "Phạm Hoàng Bách", "Đoàn Việt Bách", "Trần Lê Gia Bảo", "Bùi Ngọc Chi", "Ng Hoàng Kim Cương", "Hoàng Trung Dũng", "Phạm Anh Duy", "Bùi Công Duy", "Bùi Nhật Dương", "Đỗ Duy Đoàn", "Đỗ Duy Hải", "Lương Bảo Hân", "Đỗ Gia Hân", "", "Phạm Minh Hiển", "Nguyễn Đức Hiếu", "Phạm Gia Huy", "Nguyễn Minh Huyền", "Bùi Công Khanh", "Nguyễn Hoàng Lâm", "Văn Tiến Long", "Hoàng Hải Minh", "Nguyễn Tuấn Minh", "Đỗ Trần Nam", "Trần Đức Nam", "Nguyễn Bảo Nam", "Trần Vũ Hà Ngân", "Phạm Trần Lan Nhi", "Nguyễn Đăng Phong", "Bùi An Phú", "Đỗ Đức Phúc", "Nguyễn Hồng Phúc", "Bùi Đàm Mai Phương", "Phạm Minh Phương", "Nguyễn Hữu Thành", "Lại Hương Thảo", "Nguyễn Quang Thiện", "Bùi Quang Tín", "Lê Vi Phương Trinh", "Vũ Hiểu Trung", "Nguyễn Hoàng Vy", "Vũ Hải Hà An", "Phạm Thế An", "Nguyễn Tô Lân Anh", "Trần Hoàng Anh", "Phạm Trúc Anh", "Nguyễn Thùy Anh", "Nguyễn Thảo Anh", "Đoàn Duy Bảo", "Lê Thùy Chi", "Trần Việt Cường", "Dương Minh Dũng", "Lê Sỹ Dũng", "Nguyễn Thế Duy", "Nguyễn Ngọc Hà", "Nguyễn Đức Gia Hòa", "Đào Thanh Huy", "Đào Nguyên Gia Huy", "Ng Hữu Bình Hưng", "Lê Hoàng Hưng", "Đoàn Vĩnh Hưng", "Đặng Hữu Khánh", "Bùi Nam Khánh", "Vũ Thiện Khiêm", "Đoàn Bá Khuyến", "Trần Phương Linh", "Vũ Tú Linh", "Đỗ Vũ Ngọc Linh", "Hoàng Phương Linh", "Hoàng Lê Minh Long", "Ng Thị Ngọc Lương", "Nguyễn Như Mai", "Hoàng Duy Minh", "Vũ Đặng Khánh My", "Vũ Ngọc Hiếu Ngân", "Hà Huy Tùng Nguyên", "Phạm Bá Phú", "Hoàng Thế Quang", "Trần Bảo Thy", "Quản Hữu Toàn", "Nguyễn Việt Trinh", "Đỗ Phúc Hiếu Tuệ", "Phạm Duy Tùng", "Vũ Đặng Hoàng Vũ", "Đào Thảo", "Đỗ Đức ", "Nguyễn Minh", "Nguyễn P Phương", "Phạm Nhật", "Phạm Tuệ", "Vũ Minh ", "Vũ Minh ", "Nguyễn Thanh", "Đặng Nhật Minh", "Nguyễn Anh", "Nguyễn Ngân", "Nguyễn Phạm Hải", "Vũ Trọng ", "Nguyễn Tiến ", "Ngô Kim", "Bùi Lam", "An Gia ", "Đoàn Phạm Ngọc", "Nguyễn Hoàng", "Trương Hồng ", "Phạm Xuân", "Vũ Hoàng", "Dương Gia ", "Hà Trần Thảo", "Nguyễn Quỳnh", "Bùi Thảo", "Phạm Hải Đức ", "Nguyễn Việt ", "Đỗ Phạm Hoàng ", "Nguyễn Hào", "Nguyễn Thế", "Vũ Anh", "Phùng Phương", "Đoàn Thu", "Lê Khánh Hà", "Dương Khoa ", "Lương Ngọc Anh", "Nguyễn Ngọc Diệp Anh", "Bùi Ngọc Phương Anh", "Đồng Mai Phương Anh", "Nguyễn Dương Quang Anh", "Phạm Đức Anh", "Nguyễn Hoàng Duy", "Trần Hồng Dương", "Nguyễn Hoàng Gia", "Phạm Vân Hà", "Lưu Hoàng Hải", "Phạm Dương Hằng", "Vũ Quốc Huy", "Nguyễn Duy Hưng", "Trần Duy Hưng", "Trần Khánh Linh", "Phạm Quang Minh", "Phạm Hà My", "Lê My", "Trần Tiến Nam", "Nguyễn Song Thành Nam", "Nguyễn Hà Ngân", "Vũ Minh Ngọc", "Nguyễn Vũ Bảo Ngọc", "Nguyễn Thiên Ngọc", "Nguyễn Yến Nhi", "Nguyễn Minh Phượng", "Nguyễn Hải Sơn", "Nguyễn Đoàn Đức Thành", "Nguyễn Dương Thành", "Đào Hồng Thiện", "Nguyễn Ngọc Hà Trang", "Phạm Nguyễn Minh Trí", "Phạm Hoàng Việt", "Mạc Nguyễn Hà Vy", "Đặng Quốc Việt", "Hoàng Văn Bảo", "Lưu Thanh Tuấn", "Hoàng Thị Thanh Mai", "Nguyễn Quỳnh Hoa", "Cao Thị Xuân Dung", "Đỗ Hồng Việt", "Phạm Thị Thu Hương", "Bùi Thị Vân Thiện", "Nguyễn Thị Thu Hiền", "Nguyễn Thị Trà My", "Trần Thị Thúy", "Trần Trọng Dũng", "Mạc Văn Việt", "Bùi Thị Thu Hương", "Nguyễn Văn Đạm", "Lê Thị Hợi", "Phạm Văn Cường", "Khoa Năng Tùng", "Nguyễn Hữu Hòa", "Nguyễn Vân Long", "Nguyễn Thị Dương", "Tô Thị Mai", "Phạm Duy", "Bùi Phạm Vân Anh", "Đỗ Quang Minh", "Nguyễn Thị Thu Hằng", "Cao Thị Phương Thảo", "Nguyễn Thị Việt Yên", "Bùi Văn Quân", "Nguyễn Thị Hương", "Tô Sỹ Ngọc", "Vũ Duy Phương", "Phạm Thị Thanh Thùy", "Nguyễn Thị Mai", "Trịnh Đình Minh", "Đinh Thúy Hằng", "Phạm  Ngọc Thạch", "Trần Diệu Lê", "Nguyễn Thế Tài", "Phạm văn Nam", "Đinh Trọng Hiệp", "Nguyễn Mạnh Hùng", "Đỗ Văn Tấn", "Vũ Văn Thắng", "Đỗ Trọng Đức", "Hoàng Đại Thắng", "Nguyễn Văn Chung", "Ngô Văn Hiệp", "Mai Văn Bình", "Đỗ Mạnh Huy", "Trần Đức Trung", "Trần Hoài Phương", "Đỗ Văn Phương", "Bùi Mạnh Hùng", "Trần Anh Thi", "Phạm  Gia Mạnh", "Lê Tất Thế", "Đào Hồng Cẩm", "Nguyễn Văn Phúc", "Trần Trung Dũng", "Bùi Đình Hùng", "Đặng Văn Toán", "Nguyễn Văn Trường ", "Dương Văn Hà", "Nguyễn Quốc Tú", "Bùi Trung Huấn", "Hoàng Tiến Dũng", "Vũ Hữu Thiện", "Lê Hữu Kông", "Họ tên bố(mẹ)", "Nguyễn Mạnh Hùng", "Phạm Thị Bích Ngọc", "Nguyễn Thúy Hảo", "Trần Thị Hường", "Phạm Thị Phượng", "Nguyễn Thị Bích Thúy", "Vũ Thị Văn Thường", "Đoàn Thị Thu Huyền", "Vũ Thị Kim Chung", "Nguyễn Thu Hương", "Nguyễn Thị Hương", "Vũ Thị Hưng", "Nguyễn Thị Hường", "Vũ Thị Phương Mai", "Nguyễn Thị Thắm", "Đoàn Thị Hương", "Phạm Thu Hương", "Ngô Thị Minh Phương", "Nguyễn Thị Hằng Nga", "Nguyễn Diệu Hương", "Nguyễn Thu Hoài", "Nguyễn Thị Lý", "Hoàng Thị Hương", "Trần Thanh Diệp", "Nguyễn Quỳnh Giang", "Vũ Thị Thu Hương", "Hoàng Thị Bích Ngọc", "Trần Thị Thanh Tâm", "Nguyễn Thị Phương", "Trần Diễm Thùy Dương", "Phạm Thị Kim Phúc", "Trần Thị Hảo", "Bùi Thị Kim Oanh", "Phạm Ánh Tuyết", "Đặng Thùy Vân", "Nguyễn Bích Thủy", "Vũ Thế Hưng", "Hä tªn bè", "Hà Quang Phong", "Đồng Thanh Phương", "Vũ Đức Nghĩa", "Trần Đức Hoàn", "Nguyễn Thanh Tùng", "Phạm Hồng Sơn", "Nguyễn Mạnh Dũng", "Phạm Văn Công", "Nguyễn Hồng Nam ", "Nguyễn Duy Hùng", "Nguyễn Bình Minh", "Trịnh Xuân Cường", "Lưu Văn Tuấn", "Quản Văn Tạo ", "Nguyễn Thị Linh", "Nguyễn Quang Thắng", "Trần Thanh Tùng", "Đặng Hưng Thịnh ", "Phạm Đức Thắng", "Trân Thành", "Bùi Thanh Tùng", "Bùi Trường Sơn", "Dương Thế Tùng", "Trân Tăng Xuân", "Đào Xuân Mạnh", "Trần  Hoàn", "Nguyễn Đức Thuân", "Đoàn Thế Hưng", "Mai Xuân Khải", "Bùi Bình Minh", "Bùi Văn Đạt", "Mai Ngọc Tấn", "Nguyễn Khanh Hoài", "Đinh Văn Điễn", "Nguyễn Đức Tiến", "Nguyễn Văn Hùng", "Nguyễn Anh Tuấn", "Lê Bình Nguyên", "Hoàng Quang Hưng", "Đỗ Quốc Thắng", "Phạm Mạnh Hùng", "Vũ hải Thanh", "Phạm Thế Anh", "Ng. Thị Mai Hương", "Trần Đoàn Viện ", "Phạm Hữu Nguyên", "Ng Bảo Long", "Ng Thiết Dân", "Đoàn bảo Thanh", "Lê Văn Thông", "Trần Ngoc Vinh", "Dương Việt Cường", "Lê Sỹ Trị", "Nguyễn Thế Đức", "Ng Kim Hoằng", "Nguyễn Thế Huy", "Đào Thanh Tuấn", "Đào Ng Gia Huy - ", "Ng Hữu Trọng", "", "Đoàn Hữu Phong - ", "Đặng Hữu Trung", "Bùi Trọng Nghĩa", "Vũ Quang Hợp", "Đoàn Văn Trung", "Trần Trọng Tâm", "Vũ Văn Thắng", "Đỗ Hoài Sơn", "Hoàng Trung Quân", "Hoàng  Lê Hưng", "Nguyễn Thế Kiên", "Nguyễn  Khắc Hải - ", "Hoàng Duy Thành ", "Đặng T Vân  Anh", "Vũ văn Trọng", "Hà Huy Tùng- NV", "Phạm Duy Quảng- ", "Hoàng Văn Tình", "Trần Mạnh", "Quản Hữu Hiệp", "Ng Phó Màu-", "Đỗ Hoài Sơn", "Phạm Ngọc Long - ", "Vũ Hồng Thắng", "Đào Văn Thuyết", "Đỗ Mạnh Đức", "Nguyễn Trung Nghĩa", "Nguyễn Xuân Thứ", "Phạm Quang Huy", "Phạm Trung Thái", "Vũ Mạnh Toàn", "Vũ Việt Thắng ", "Nguyễn Văn Thắng", "Đặng Hồng Sơn", "Nguyễn Văn Kỳ", "Nguyễn Hoàng Chương", "Nguyễn Xuân Trí", "Vũ Đức Thiện", "Nguyễn Tiến Dũng", "Ngô Minh Tuân", "Bùi Xuân Trường", "An Sơn Hà", "Đoàn Ngọc Lâm", "Nguyễn Văn Tá", "Trương  Tuấn Lợi", "Phạm Quang Huy", "Vũ Việt Hà", "Dương Anh Sơn", "Hà Văn Thắng", "Nguyễn Bá Sơn", "Bùi Đức Thìn", "Phạm Hải Nam", "Nguyễn Việt Phương", "Đỗ Văn Tú", "Nguyễn Ngọc Hà", "Nguyễn Hải Đăng", "Vũ Đức Trọng", "Phùng Ngọc Luyến", "Đoàn Huy Quân", "Lê Mạnh Hùng", "Dương Anh Tuấn", "Trần Hữu Sơn", "Trần Huy Quân", "Tô Thành Thủy", "Lê Minh Phương", "Hoàng T Thu Thủy", "Đỗ Mạnh Thắng", "Vũ Bá Thắng", "Trần Khánh", "Vũ Nhân Hảo", "Trần Nghị", "Ng. Đình Tuyến", "Lương Hồng Hải", "Phạm Xuân Hùng", "Vũ Quốc Dũng", "Trần Quốc An", "Lê Xuân Hưng", "Ng. Văn Dũng ", "Lê Minh Sơn", "Lã Tuấn Dũng", "Phạm Văn Tuân", "Nguyễn Minh Vũ", "Nguyễn Văn Hóa", "Phạm Thanh Tùng", "Phạm Khâm Thiêm", "Ng.Mạnh Hồng", "Cao Ngọc", "Hoàng Gia Vịnh", "Ng.Đăng Hoàng", "Đào Thiện Trị", "Ng.Đại Thắng", "Phạm Bích Ngọc", "LươngNgọc Thắng", "Ng.Hồng Quang", "Ng.Trung Thành", "Đỗ Văn Hiền", "Ng.Hoàng Chiến"]
            address = ["Ngõ 53 Đức Giang", "Ngõ 218", "Ngõ 51", "Ngõ 74", "Ngõ 369", "Võ Văn Kiệt", "Ngách 638/84", "Ngõ 36", "CầU Chui Gia Lâm", "Ngách 638/60", "Ngõ 71", "Ngách 466/76", "Ngách 97/17", "Ngách 638/50", "Trang Hạ", "Yên Thường", "Trang Liệt 1", "Đê Phương Trạch", "Ngõ 192", "Ngách 638/10", "Ngách 466/99", "Ngách 638/162", "Ngõ 69", "Ngõ 287", "Đức Giang", "Ngách 7/20", "422/11/8", "Ngách 466/41", "Ngách 97/27", "Ngách 638/37", "Ngách 466/91", "Ngõ 49 Đức Giang", "Ngõ 623", "Ngách 466/71", "Ngách 4/3 Ô Cách", "Đường Cn4", "Phố Ngọa Long", "Thanh Lâm", "Phan Đăng Lưu", "Ngõ 81 Đức Giang", "422/14/18", "Quốc Lộ 5", "Ngõ 266a", "Ngách 466/20", "Ngách 638/72", "Ngõ 2 Ô Cách", "Ngách 466/79", "Ngách 987/20", "Ngách 638/63", "Ngõ 466", "Ngách 466/49", "Ngách 466/73", "Ngõ 296", "Võ Nguyên Giáp", "Vân Trì", "QuốC Lộ 23", "Ngõ 18", "Ngõ 28", "Ngách 466/81", "Ngõ 53/81", "Ngách 638/27", "Ngách 97/31", "Ngõ 42", "Ngõ 294", "Ngách 97/23", "Ngách 638/90", "Ngách 466/82", "Ngõ 67 Đức Giang", "Ngách 638/46", "Ngách 638/61", "Hẻm 53/81/30", "Duong Duc Giang", "Ngõ 64", "Ngách 167/37", "Ngõ 138", "Ngàch 17/20", "Ngõ 302", "Ngõ 975", "Ngõ 167", "Ngõ 185", "Ngõ 255", "Ngõ 261", "Ngách 885/32", "Ngõ 256", "Ngách 254/115", "Ngõ 87", "Ngách 225/36", "Ngõ 267", "Ngách 885/22", "Ngách 254/113", "Ngõ 85", "Ngõ 197", "Võ Văn KiệT", "Thượng Cát", "Phố Nhổn", "Ngõ 18 Chùa Thông", "Ngách 638/44", "Ngõ 66", "Ngách 1/36", "Ngõ 30", "Ngô Gia Tự", "Ngo 528 Ngo Gia Tu", "Tô Hiệu", "Đê Tả Sông Hồng", "Cầu Vĩnh Tuy", "Lĩnh Nam", "Ngõ Gốc Đề", "Lê Lợi", "Trần Hưng Đạo", "Nguyễn Viết Xuân", "Đặng Tiến Đông", "Tố Hữu", "Đại Lộ Thăng Long", "Chu Văn An", "Cầu Đào Xuyên", "Đường Đa Tốn", "Ô Cách", "Cho Diem Go", "Ngo 47 Duc Giang", "Ngo 486 Ngo Gia Tu", "Nguyễn Cao Luyện", "Quốc Lộ 1a", "Đê Đuống", "Cầu Vượt Đông Xép", "Đồng Kỵ", "Phố Đốc Ngữ", "Phố Nguyễn Thái Học", "Văn Tiến Dũng", "Ngô Gia Tự", "Cầu", "Đường Đi Sông Nhuệ", "Đường Xã Nhị Khê", "Nguyễn Khoái", "Cầu Vượt Đại Đình", "Thiên Đức", "Phố Quang Trung", "Ngô Gia Tự", "Đường Đê Sông Nhuệ", "Cầu Bắc Hưng Hải", "Nguyễn Trãi", "Đường Cao Tốc Pháp Vân - Cầu Giẽ", "Đại Lộ Thăng Long - Đường Đô Thị", "Ngách 68/8", "Phố Trưng Nhị", "Ngõ 195", "Phố Hoàng Văn Thụ", "Ngõ 6", "Phố Lương Văn Can", "Ngách 75/31", "Phố Ngô Quyền", "Ngõ 75", "Ngõ 242", "Phố Tô Hiệu", "Ngõ 68", "Phố Hoàng Diệu", "Ngõ 10", "Ngõ 16", "Phú Minh", "Ngõ 186 Tân Phong", "Đường Cn6", "Ngõ 8", "422/11", "Ngo 775", "Ngách 466/93", "Hẻm 53/103/25", "Ngõ 73", "17b Hẻm 486/14/10", "Ngách 466/80", "Ngõ 9", "Hẻm 638/50/1", "Hẻm 422/14/12a", "Hẻm 638/6/2", "Hẻm 99/47/40", "Hẻm 165/2/3", "422/14/10", "Ngõ 638", "422/14/4", "Ngõ 4 Ô Cách", "Ngách 53/49", "Ngách 7/32", "Ngõ 46", "486/30/4", "Ngách 638/48", "422/14/20", "Ngách 466/95", "Ngách 49/1", "Ngõ 667 Nguyễn Văn Cừ", "486/30", "Ngõ 40", "Ngách 75/36", "Ngõ 81", "Phố Hà Cầu", "Tổ Dân Phố 9", "Ngõ 103", "Lê Lai", "Ngõ 63", "Ngõ 134", "Phố Văn Fhú", "Phố Cầu AM", "Ngõ 33", "Phố Trưng Trắc", "Ngõ 39", "Ngõ 62", "Ngõ 5", "Đường Tiếp Giápkđt Văn Phú", "Ngách 75/36", "Ngõ 81", "Phố Hà Cầu", "Tổ Dân Phố 9", "Ngõ 103", "Lê Lai", "Ngõ 63", "Ngõ 134", "Phố Văn Fhú", "Phố Cầu AM", "Ngõ 33", "Phố Trưng Trắc", "Ngõ 39", "Ngõ 62", "Ngõ 5", "Đường Tiếp Giápkđt Văn Phú", "Phố VạN PhúC", "Ngõ 37", "Ngõ 20", "Phố Tản Đà", "Phố Văn Phú", "Ngõ 2", "Văn Trì", "Đường Cn2", "Đường Cầu Diễn", "Ngách 638/118", "Ngách 466/94", "Ngách 466/65", "Ngõ 529", "Ngõ 408 Ngô Gia Tự", "Ngõ 42 Ô Cách", "Ngõ 725", "Ngõ 36", "Ngách 638/84", "Duong Duc Giang", "Hẻm 53/81/30", "Ngách 638/61", "Ngách 638/46", "Ngõ 67 Đức Giang", "Ngách 466/82", "Ngách 638/90", "Ngách 97/23", "Ngõ 294", "Ngõ 42", "Ngách 97/31", "Ngách 638/27", "Ngõ 53/81", "Ngách 466/81", "Ngõ 28", "Ngõ 18", "Lê Quý Đôn", "Phan Bội Châu", "Ngõ 12", "Ngách 75/22", "Phố Hoàng Hoa Thám", "Phố Bà Triệu", "Bùi Bằng Đoàn", "Đường Cn4", "Ngách 4/3 Ô Cách", "Ngách 466/71", "Ngõ 623", "Ngõ 49 Đức Giang", "Ngách 466/91", "Ngách 638/37", "Ngách 97/27", "Ngách 466/41", "422/11/8", "Ngách 7/20", "Đức Giang", "Ngõ 287", "Ngõ 69", "Ngách 638/162", "Ngách 466/99", "Ngách 638/10", "Ngõ 192", "Đê Phương Trạch", "Ngách 638/50", "Ngách 97/17", "Ngách 466/76", "Ngõ 71", "Ngách 638/60", "CầU Chui Gia Lâm", "Ngách 638/43", "Ngách 41/7", "Ngách 638/39", "Ngõ Cầu Đơ 3", "Đinh Tiên Hoàng", "Phố Đoàn Trần Nghịêp", "Trần Đăng Ninh", "Cầu Đại Thành", "Ngõ Nguyễn Thị Minh Khai", "Đường Quang Trung", "Ngõ 147", "Phố Lụa", "Phố Le Hong Phong", "Đường Lý Thường Kiệt", "Ngõ 19", "Ngõ 23", "Phố Bế Văn Đàn", "Đường Số 7", "Ngõ Chùa Hưng Ký", "Phú Minh", "Phố Nguyên Xá", "Ngách 466/87", "Ngách 466/85", "Ngách 638/92", "Ngõ 59", "Ngõ 435", "Cầu Phù Đổng", "Ngõ 55", "Ngõ 97", "Ngách 638/45", "Ngách 44/19", "Ngách 638/88", "Ngách 466/67", "Ngõ 30", "Ngách 1/36", "Ngõ 66", "Ngách 638/44", "Rai_64_Bv_018", "Cầu Đồng Quang", "Ngõ 18 Chùa Thông", "Liên Mạc", "Phố Nhổn", "Thượng Cát", "Võ Văn KiệT", "Ngõ 197", "Ngõ 85", "Ngách 254/113", "Ngách 885/22", "Ngõ 185", "Ngõ 167", "Ngõ 975", "Ngõ 302", "Võ Văn Kiệt", "QuốC Lộ 23", "Vân Trì", "Cầu Nhật Tân", "Võ Nguyên Giáp", "Ngõ 296", "Ngõ 179", "Ngõ Hòa Bình 7", "75", "Ngõ 208", "Ngõ 173", "Ngõ 99", "Ngách 107/33", "Phố Mai Dộng", "Ngõ 289", "Ngách 5", "Trung Hòa", "Trang Liệt 1", "Yên Thường", "Bà La", "Trang Hạ", "Nguyễn Văn Cừ", "Đại Đình", "Dương Lôi", "Trung Hòa", "Đường Cao Tốc Hà Nội - Bắc Giang", "Nội Trì", "Cầu Vượt Tiên Sơn", "Tân Hưng", "Đường Cao Tốc Hà Nội - Bắc Giang", "CầU Khả Lễ", "Phố 8-3", "Phố Yên Sở", "Ngõ Hòa Bình 6", "Ngõ 228", "Cầu Vượt Đường Sắt", "Cầu Cà Lồ", "Quốc Lộ 18", "Cầu Đào Xá", "CầU ĐạI PhúC", "Nguyễn Đăng Đạo", "Mạc Đĩnh Chi", "Trần Lựu", "Trần Hưng Đạo", "Đường Cao Tốc Hà Nội - Bắc Giang", "Cầu Đáp Cầu", "Dt291", "Đường 35", "Quốc Lộ 3", "Ngõ 201", "Ngõ 249", "Ngõ 267", "Ngách 225/36", "Ngõ 87", "Ngách 254/115", "Ngõ 256", "Ngách 885/32", "Ngõ 261", "Ngõ 255", "Ngàch 17/20", "Ngõ 138", "Ngách 167/37", "Ngõ 64", "Ngõ Hòa Bình 2", "Ngõ 279", "Ngõ Hòa Bình 5", "Ngõ 139", "Ngõ 161a", "Ngõ 225", "Cấm Đổ Rác", "Đường Kênh Xả", "Ngách 254/92", "Ngõ 169", "Phố Yên Duyên", "Ngách 293/57", "Ngõ 51", "Ngách 156/17", "Ngõ 13", "Ngách 225/35", "Ngách 12", "Ngõ 254", "Ngõ 31", "Ngõ Hòa Bình 3", "Ngách 885/23", "Ngõ 72", "Ngõ 195a", "Ngõ 124", "Ngõ 56", "Phố Quảng Khánh", "Ngõ 254d", "Ngách 225/28", "Ngõ 95", "Ngách 885/85", "Ngách 102/700", "Ngách 885/17", "Ngõ Hòa Bình 4", "Ngõ 107", "Ngách 293/63", "Ngõ 183a", "Phố Minh Khai", "Ngõ 146", "Ngõ 283", "Ngõ 193", "Ngõ 885", "Ngõ Hòa Bình 1", "Đường Trong", "Ngõ 275", "Phố Sở Thượng", "Phố Vĩnh Hưng", "Ngõ 295", "Cầu Kênh Xả", "Ngõ 145", "Đào Xuyên", "Ngõ 221", "Ngõ 17", "Ngõ 105", "Ngõ 126", "Ngõ 313", "Ngõ 259", "Phố Dông Thiên", "Ngõ 266", "Ngõ 29", "Ngõ 281", "Đông Thiên", "Ngõ 393", "Ngõ 200", "Ngõ 88", "Ngõ 369", "Ngõ 74", "Ngõ 51", "Ngõ 218", "ĐườNg TỉNh 421b", "Ngõ 53 Đức Giang", "Ngách 466/73", "Ngách 466/49", "Ngõ 466", "Ngách 638/63", "Ngách 987/20", "Ngách 466/79", "Ngõ 2 Ô Cách", "Ngách 638/72", "Ngách 466/20", "Ngõ 266a", "Quốc Lộ 5", "422/14/18", "Ngõ 81 Đức Giang", "Phan Đăng Lưu", "Ngách 49/4", "Ngõ 240", "422/14/8", "Hẻm 53/81/3", "Rai_64_Px_013", "Dt73", "Thanh Lâm", "Phố Ngọa Long", "Ngo Thi Nham", "Đường Phú Hà", "Phố Chùa Thông", "Phố Cầu Trì", "Phan Đình Phùng"]
            fullname = fullnames[Math.floor(Math.random() * (fullnames.length - 1))]
            fullname2 = "XXXX".replace(/X/g, function () {
                return "abcdefghikl".charAt(Math.floor(Math.random() * 10))
            });
            fullname = fullname2 + " " + fullname
            await page.type('[placeholder="Họ & Tên"]', fullname, { delay: 100 })    // Nhập Tên 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)

            await page.click('[placeholder="Số điện thoại"]')    // Nhập comment 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            phone = "XXXXXXXX".replace(/X/g, function () {
                return "0123456789".charAt(Math.floor(Math.random() * 10))
            });
            phone = "09" + phone
            await page.type('[placeholder="Số điện thoại"]', phone, { delay: 100 })    // Nhập SDT 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            address = await page.$$('.address-modal__form_input')
            await address[2].click()    // Click Tỉnh thành phố 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            // Chọn ngẫu nhiên tỉnh
            tinhThanhPho = await page.$$(".select-with-status__dropdown-item")
            tinhThanhPho[Math.floor(Math.random() * 63)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            await address[3].click()      // Click Quận 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            quanHuyen = await page.$$(".select-with-status__dropdown-item")
            quanHuyen[Math.floor(Math.random() * quanHuyen.length)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)

            await address[4].click()      // Click Phường                
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            phuongXa = await page.$$(".select-with-status__dropdown-item")
            phuongXa[Math.floor(Math.random() * phuongXa.length)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)

            //Nhập địa chỉ
            fullAddress = "Số" + Math.floor(Math.random() * (1000)) + " " + address[address.length]
            await page.type('[placeholder="Toà nhà, Tên Đường..."]', fullAddress)
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            // click hoan thanh
            btnHoanThanh = await page.$$('.btn--s.btn--inline')
            btnHoanThanh[0].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
        }
        timeout = Math.floor(Math.random() * (3500 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        // Chon don vi van chuyen
        console.log("Chon don vi van chuyen")
        await page.evaluate(() => {
            document.querySelectorAll('.checkout-shop-order-group')[0].children[1].children[1].children[2].click()
        }
        )
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout)
        // Chọn giao hàng các ngày trong tuần
        //Tất cả các ngày trong tuầnPhù hợp với địa chỉ nhà riêng, luôn có người nhận hàng

        clicktime = await page.$$('.stardust-dropdown__item-body--open>.stardust-radio>.stardust-radio__content .stardust-radio__label')
        if (clicktime.length) {
            await clicktime[0].click()
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            // click hoanf thanh
            click2 = await page.$$('.logistics-selection-modal__submit-btn')
            click2[0].click()

        }
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (3500 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        // chon phuong thuc thanh toan khi nhan hangf
        console.log("Chon phương thức thanh toán")
        btnThanhToan = await page.$$('.product-variation')
        if (btnThanhToan.length) {
            btnThanhToan[2].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
        }

        // Click dat hang
        console.log("Click đặt hàng")
        btnThanhToan = await page.$$('.stardust-button--primary.stardust-button--large')
        btnThanhToan[0].click()
        timeout = Math.floor(Math.random() * (5500 - 5000)) + 5000;
        await page.waitForTimeout(timeout)
        //huy don hang
        btnHuyDon = await page.$$('.shopee-button-outline--primary')

        if (btnHuyDon.length) {
            console.log("Click huỷ đơn hàng")
            btnHuyDon[1].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            console.log("Chọn lý do huỷ đơn")
            btnOptHuyDon = await page.$$('.stardust-radio')
            randomOptionHuyDon = Math.floor(Math.random() * (btnOptHuyDon.length - 1))
            btnOptHuyDon[randomOptionHuyDon].click()

            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
            btnHuyDonHang = await page.$$('.shopee-alert-popup>div>.shopee-button-solid.shopee-button-solid--primary')
            btnHuyDonHang[0].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitForTimeout(timeout)
        } else {
            console.log("Không tìm thấy nút huỷ đơn")
        }
    } catch (error) {
        fs.appendFileSync('error.txt', "Order error" + "\n")
        fs.appendFileSync('error.txt', error.toString() + "\n")
    }

}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

disconnectDcomV2 = async () => {
    // disconnect dcom
    console.log('disconnect card mang')
    const disDcom = await exec('netsh interface set interface name=Cellular disable');
    disDcom.stdout.on('data', (data) => {
        // do whatever you want here with data
        //console.log(data);
    });
    disDcom.stderr.on('data', (data) => {
        console.error(data);
    });

}

change_info_pc = async () => {
    console.log(" ---- Change info -----")
    let change_info = await exec('changeinfo.bat');
    change_info.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    change_info.stderr.on('data', (data) => {
        console.error(data);
    });
}

connectDcomV2 = async () => {
    const connectdcom1 = await exec('connect.bat /');
    connectdcom1.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    connectdcom1.stderr.on('data', (data) => {
        console.error(data);
    });
}

restart = async () => {

    const connectdcom1 = await exec('shutdown /r /t 3600');
    connectdcom1.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    connectdcom1.stderr.on('data', (data) => {
        console.error(data);
    });

}

deleteProfile = async (profile) => {
    console.log(" ----  Xoá profile ----")
    // Xoá profile block
    deleteDir = profileDir + profile
    cmdDelete = 'Rmdir /S /q ' + deleteDir
    console.log(cmdDelete)
    let deleteProfile = exec(cmdDelete);
    deleteProfile.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    deleteProfile.stderr.on('data', (data) => {
        console.error(data);
    });
}

genRandomMac = async () => {
    const os = require('os');
    keyRandomMac2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    keyRandomMac = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    let commandLineChange = ""
    let macAndress = ""

    macAndress = "XX:XX:XX:XX:XX:XX".replace(/X/g, function () {
        return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
    });

    macAndress = randomMac()
    netName = os.networkInterfaces()
    // netName = Object.keys(netName).forEach(key => {
    //    // console.log(netName)
    //     console.log(netName[key])
    //     //ipAddress = netName[key][1].address
    //     if (ipAddress.split("192.168").length > 1) {
    //         currentNet = key

    //     }

    // })
    currentNet = "Cellular"
    commandLineChange = {
        network: currentNet,
        mac: macAndress
    }
    //commandLineChange = "tmac -n "+netName + " -m " + macAndress + " -re -s"
    // console.log(commandLineChange);

    console.log(commandLineChange)
    console.log("change mac")
    param = " " + commandLineChange.network + " " + commandLineChange.mac
    console.log(param)
    const changeMac = exec('changemac.bat' + param + ' /');
    changeMac.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    changeMac.stderr.on('data', (data) => {
        console.error(data);
    });

    return commandLineChange
}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


gen_browser = async (option) => {
    let profile_dir = option.profile_dir
    let proxy1 = option.proxy
    let headless_mode = option.headless_mode
    let network = option.network

    console.log("Profile chrome link: " + profile_dir)

    let param = [
        `--user-data-dir=${profile_dir}`,      // load profile chromium
        '--disable-gpu',
        '--no-sandbox',
        '--lang=en-US',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
    ]

    if (network == "proxy") {
        //'--proxy-server=103.90.230.170:9043'

        let proxy_for_slave = "--proxy-server=" + proxy1.proxy_ip + ":" + proxy1.proxy_port
        param.push(proxy_for_slave)
        param.push('--ignore-certificate-errors')
    }

    const browser = await puppeteer.launch({
        //executablePath: chromiumDir,
        headless: headless_mode,
        devtools: false,
        args: param
    });

    return browser
}

gen_page = async (browser, option) => {

    const page = (await browser.pages())[0];
    await preparePageForTests(page);

    let user_agent1 = option.user_agent
    let proxy1 = option.proxy
    let cookie1 = option.cookie
    let network = option.network

    await page.setUserAgent(user_agent1)

    // Random kích cỡ màn hình
    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;

    await page.setViewport({
        width: 1280,
        height: 800
    });

    if (network == "proxy") {
        let proxy_pass = proxy1.proxy_password.split("\r")[0]
        console.log(" proxxy ip: " + proxy1.proxy_ip + ":" + proxy1.proxy_port + ":" + proxy1.proxy_username + ":" + proxy_pass)
        await page.authenticate({ username: proxy1.proxy_username, password: proxy_pass });
    }

    try {
        if (cookie1.length) {
            let cookie111 = JSON.parse(cookie1)
            //console.log(cookie111)
            cookie111.forEach(async (item) => {
                await page.setCookie(item);
            })
        }
    } catch (e) {
        console.log(" ---- Lỗi set coookie ----")
    }

    if (disable_css == 1 || disable_image == 1) {
        await page.setRequestInterception(true);

        // --- Chặn load css --- /
        if (disable_image == 1) {
            page.on('request', (req) => {
                if (req.resourceType() === 'image') {
                    req.abort();
                } else {
                    req.continue();
                }

            });
        }
    }
    return page
}

runAllTime = async () => {
    slaveInfo = []
    getDataShopee = []
    dataShopee = []
    // lấy dữ liệu từ master
    checkNetwork = 0

    checkNetwork = 0
    for (let a = 1; a < 100; a++) {
        console.log("check connection " + a);

        await require('dns').resolve('www.google.com', function (err) {
            if (err) {
                console.log("No connection " + a);
                checkNetwork = 0
            } else {
                console.log("Connected");
                checkNetwork = 1
            }
        });

        if (checkNetwork == 1) {
            break
        } else {
            await sleep(2000)
        }
    }


    if (checkNetwork == 1) {

        console.log("connected");

        let linkgetdataShopeeDir = ""
        if (keyword_check) {
            keyword_check = encodeURI(keyword_check)
        }
        linkgetdataShopeeDir = dataShopeeDir + "?slave=" + slavenumber + "&token=kjdaklA190238190Adaduih2ajksdhakAhqiouOEJAK092489ahfjkwqAc92alA&product_check=" + product_check + "&account_check=" + account_check + "&keyword_check=" + keyword_check
        console.log(linkgetdataShopeeDir)

        // Lấy dữ liệu từ từ khoá từ sv
        await axios.get(linkgetdataShopeeDir)
            .then(function (response) {

                dataShopee = response.data
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false
            })
            .then(function () {
                // always executed
            });

    } else {
        return false
    }

    shopee_point = dataShopee.shopee_point
    slaveInfo = dataShopee.slave_info
    //console.log(dataShopee)
    orderStatus = 1
    console.log("----------- START SHOPEE ---------------")
    //data = GenDirToGetData(maxTab, accounts)

    data = dataShopee.data

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
    if (newVersion !== checkVersion && dataShopee.version !== undefined) {
        console.log("Cập nhật code");
        // Update version mới vào file version.txt
        //fs.writeFileSync('version.txt', newVersion)
        if (mode !== "DEV") {
            if (os_slave != "LINUX") {
                const myShellScript = exec('update.sh /');
                myShellScript.stdout.on('data', (data) => {
                    // do whatever you want here with data
                });
                myShellScript.stderr.on('data', (data) => {
                    console.error(data);
                });
            } else {
                shell.exec('git stash; git pull origin master; npm install; pm2 start shopee.js; pm2 start restartall.js; pm2 startup; pm2 save; pm2 restart all');
            }

            return false
        }
    }

    await sleep(5000)

    if (slaveInfo.network == "dcom") {
        console.log("--- Đổi IP DCOM ---")
        if (mode != "DEV") {
            // Đổi MAC
            //await disconnectDcomV2()
            await genRandomMac()
            checkNetwork = 0
            await sleep(10000)
        }

    }

    if (slaveInfo.network == "proxy" && os_slave != "LINUX") {
        if (mode != "DEV") {
            //await change_info_pc()
            console.log("----- Change info -----")
            await shell.exec('changeinfo.bat');
        }
    }

    for (let a = 1; a < 100; a++) {
        console.log("check connection " + a);

        await require('dns').resolve('www.google.com', function (err) {
            if (err) {
                console.log("No connection " + a);
                checkNetwork = 0
            } else {
                console.log("Connected");
                checkNetwork = 1
            }
        });

        if (checkNetwork == 1) {
            break
        } else {
            await sleep(2000)
        }
    }

    data.forEach(async (data_for_tab, index) => {   // Foreach object Chạy song song các tab chromium

        await sleep(15000 * index)
        // Nếu có dữ liệu schedule trả về
        //key = key.split("\t")
        let subAccount = []
        let acc = data_for_tab.sub_account
        let keywords = data_for_tab.product_for_sub_account

        let user_agent
        console.log("Số lượng từ khoá tab: " + index + " ---- " + keywords.length)

        subAccount[0] = acc.username
        subAccount[1] = acc.password.split("\r")[0]

        if (!acc.user_agent) {
            user_agent = randomUseragent.getRandom(function (ua) {

                return (ua.osName === 'Windows' && ua.osVersion === "10");
            });
        } else {
            user_agent = acc.user_agent
        }

        let profileChrome = profileDir + subAccount[0]

        let option1 = {
            user_agent: user_agent,
            proxy: dataShopee.proxy,
            profile_dir: profileChrome,
            cookie: acc.cookie,
            network: slaveInfo.network,
            headless_mode: headless_mode
        }

        let browser = await gen_browser(option1)
        let page = await gen_page(browser, option1)

        if ((index == 0) && (mode !== "DEV")) {
            // đổi ip
            //console.log("Đổi ip mạng")
            if (dcomVersion == "V2") {
                // await changeIpDcomV2()
            }
        }
        try {
            await page.waitForTimeout(5000)
            try {

                let ref = await page.url()
                await page.goto('https://shopee.vn')
                bypassTest.runBypassTest(page);
            } catch (err) {
                //HERE
                console.error(err);

            }


            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)

            // login account shopee                    
            let checklogin = await loginShopee(page, subAccount)
            console.log("index = " + index + " --- check login account: " + subAccount[0] + " --- " + checklogin)

            if (checklogin == 2) {
                console.log("------ Cập nhật tk bị khoá -----------")
                accountInfo = {
                    user: subAccount[0],
                    pass: subAccount[1],
                    status: 0,
                    message: "Account bị khoá"
                }

                await axios.get(linkShopeeAccountUpdate, {
                    params: {
                        data: {
                            dataToServer: accountInfo,
                        }
                    },
                    timeout: 5000
                })
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log("Không cập nhật được trạng thái tài khoản")
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            }
            if (checklogin) {

                if (clickSanPham == 1 && slaveInfo.type == "seo_top") {
                    console.log("----- Click theo sản phẩm -----")

                    if (!max_turn) {
                        max_turn = keywords.length
                    }
                    if (mode == "DEV") {
                        max_turn = 1
                    }

                    // Chạy lần lượt max_turn lượt tìm kiếm, tương tác từ khoá
                    for (let o = 0; o < max_turn; o++) {

                        try {
                            let ref = await page.url()
                            await page.goto('https://shopee.vn', {
                                waitUntil: "networkidle0",
                                timeout: 30000,
                                referer: ref
                            })
                        } catch (err) {
                            //HERE
                            console.error(err);
                        }

                        let productForUser                     // Mảng chứa thông tin sản phẩm, từ khoá cần tương tác
                        let check_product_exit = "Có tồn tại"
                        let actions = []                            // Luư lịch sử thao tác
                        productForUser = keywords[o]

                        // Check actions can thao tac cua shop

                        let options = JSON.parse(productForUser.options)
                        productForUser.username = subAccount[0]
                        productForUser.password = subAccount[1]
                        productForUser.shopee_point = shopee_point


                        // if(mode == "DEV"){
                        //     productForUser.shop_id = "406672344"
                        //     productForUser.keyword = "Quần Lót Nữ Cotton kháng khuẩn thoáng mát đính nơ duyên dáng điệu đà MITEVA QL06"
                        //     productForUser.product_name = "Quần Lót Nữ Cotton kháng khuẩn thoáng mát đính nơ duyên dáng điệu đà MITEVA QL06"
                        //     productForUser.product_id = "5983738410"
                        //     productForUser.product_link = "https://shopee.vn/Qu%E1%BA%A7n-L%C3%B3t-N%E1%BB%AF-Cotton-kh%C3%A1ng-khu%E1%BA%A9n-tho%C3%A1ng-m%C3%A1t-%C4%91%C3%ADnh-n%C6%A1-duy%C3%AAn-d%C3%A1ng-%C4%91i%E1%BB%87u-%C4%91%C3%A0-MITEVA-QL06-i.406672344.5983738410"
                        // }
                        let viTriSanPhamTrang1 = false;
                        let url_trang_tim_kiem_san_pham = "";
                        let getViTriSanPham = {
                            trang: false,
                            vitri: false
                        };
                        let shopInfo3 = {
                            cover: false,
                            name: false
                        }
                        
                        let check_add_cart
                        page.removeAllListeners('response');

                        await page.on('response', async (resp) => {
                            let url = resp.url()
                            let productInfo1, productInfo2

                            let checkUrlproduct = url.split("search/search_items?by=relevancy&keyword=")

                            let check_add_to_cart = url.split("api/v4/cart/add_to")

                            let checkUrlShop = url.split("api/v4/shop/get_shop_detail?username=")

                            if (checkUrlShop.length > 1) {
                                console.log("-- Sự kiện lấy thông tin shop --")
                                productInfo1 = await resp.json()
                                productInfo2 = productInfo1.data
                                if (productForUser.shop_id == productInfo2.shopid) {
                                    console.log("Thông tin shop cover: " + productInfo2.cover);
                                    shopInfo3.avatar = productInfo2.account.portrait
                                    shopInfo3.username = productInfo2.account.username
                                    shopInfo3.name = productInfo2.name
                                    shopInfo3.shop_id = productInfo2.shopid
                                    shopInfo3.followed = productInfo2.followed
                                    console.log("----- Shop info ------")
                                    console.log(shopInfo3)
                                }
                            }

                            if (check_add_to_cart.length > 1) {
                                console.log("---- Sự kiện bỏ giỏ  ----")
                                let check = await resp.json()
                                if (check.error == 0) {
                                    check_add_cart = true
                                } else {
                                    check_add_cart = false
                                }
                            }

                            if (checkUrlproduct.length > 1) {
                                console.log(" -- Tìm vị trí sản phẩm trên trang  --")
                                productInfo1 = await resp.json()
                                productInfo2 = productInfo1.items

                                productInfo2.forEach((item, index) => {
                                    if (item.itemid == productForUser.product_id && (item.ads_keyword == null)) {

                                        viTriSanPhamTrang1 = index + 1
                                        url_trang_tim_kiem_san_pham = url
                                        //console.log("url_trang_tim_kiem_san_pham: " + url_trang_tim_kiem_san_pham)
                                        console.log(" -- Tìm thấy vị trí sản phẩm trên trang: " + viTriSanPhamTrang1)
                                    }
                                })

                            }
                            check_link_san_pham = url.split("item/get?itemid=" + productForUser.product_id)
                            if (check_link_san_pham.length > 1) {
                                console.log(" --- Lấy thông tin sản phẩm ---");
                                try {
                                    let productInfo1 = await resp.json()
                                    productInfo2 = productInfo1.item
                                    console.log("Ảnh sản phẩm: " + productInfo2.image)
                                    productForUser.product_image = ""
                                    productForUser.product_image = productInfo2.image
                                    productForUser.liked = productInfo2.liked
                                } catch (error) {
                                    check_product_exit = "Không tồn tại"
                                    console.log("---- Sản phẩm không tồn tại ----")
                                }
                            }

                        });

                        productForUser.slave = slavenumber
                        let newIp = await publicIp.v4()
                        productForUser.ip = newIp;
                        console.log("Ip mới: " + newIp)
                        console.log("Shop id: " + productForUser.shop_id)
                        console.log("Shop option: ")
                        console.log(options)
                        console.log("product link: " + productForUser.product_link)
                        console.log("product name: " + productForUser.product_name)
                        console.log("product id: " + productForUser.product_id)
                        console.log("Từ khoá: " + productForUser.keyword)

                        await searchKeyWord(page, productForUser.keyword)

                        cookies22 = await page.cookies()
                        productForUser.cookie = cookies22
                        productForUser.user_agent = user_agent
                        cookie1 = ""

                        cookies22.forEach((row, index) => {
                            cookie1 = cookie1 + row.name + "=" + row.value
                            if (index != (cookies22.length - 1)) {
                                cookie1 = cookie1 + "; "
                            }
                        })

                        console.log(" --- tìm kiếm ----")
                        let action1 = {
                            time: new Date(),
                            action: "search"
                        }
                        actions.push(action1)
                        productForUser.action = "search"
                        await updateActions(productForUser)
                        productForUser.cookie = ""

                        await page.waitForTimeout(5000)

                        let getProductPageTotal
                        try {
                            getProductPageTotal = await page.evaluate(() => {
                                // Class có link bài đăng trên profile          
                                let titles = document.querySelectorAll('.shopee-mini-page-controller__total')[0].textContent;
                                return titles
                            })
                        } catch {
                            getProductPageTotal = 2
                        }

                        maxPage = parseInt(getProductPageTotal)
                        console.log("Tổng số trang kết quả tìm kiếm: " + maxPage)

                        if (productForUser.check_index < 6) {
                            getViTriSanPham = await shopeeApi.timViTriTrangSanPhamTheoTuKhoa(productForUser, cookies22, maxPage)

                            pageUrl = getViTriSanPham.trang - 1
                            console.log(" --- Đến trang trước trang có vị trí sản phẩm 1 trang ---- ")
                            urlSearch = "https://shopee.vn/search?keyword=" + productForUser.keyword + "&page=" + pageUrl
                            urlSearch = encodeURI(urlSearch)
                            productForUser.urlSearch = urlSearch
                            try {

                                let ref = await page.url()
                                await page.goto(urlSearch, {
                                    waitUntil: "networkidle0",
                                    timeout: 30000,
                                    referer: ref
                                })

                            } catch (err) {
                                //HERE
                                console.error(err);
                            }
                            await page.waitForTimeout(5000)
                            console.log("Vị trí sản phẩm: " + productForUser.product_name + " -- " + productForUser.product_id)
                            console.log(getViTriSanPham)

                            if (viTriSanPhamTrang1 != false) {

                                productForUser.trang = parseInt(pageUrl)
                                productForUser.vitri = viTriSanPhamTrang1
                                console.log("vi_tri_trang_san_pham: " + productForUser.trang)

                                console.log("Update seo sản phẩm")
                                productForUser.cookie = ""
                                await axios.get(shopeeUpdateSeoSanPhamDir, {
                                    params: {
                                        data: {
                                            dataToServer: productForUser,
                                        }
                                    },
                                    timeout: 5000
                                })
                                    .then(function (response) {
                                        console.log(response.data)
                                    })
                                    .catch(function (error) {
                                        console.log(error);

                                    })

                                today = new Date().toLocaleString();
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);
                                timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
                                await page.keyboard.press('PageDown');
                                await page.waitForTimeout(timeout);

                                let productsAll = await page.$$('[data-sqe="link"]')
                                try {
                                    productsAll[productForUser.vitri - 1].click()
                                } catch (error) {
                                    try {
                                        await page.goto(productForUser.product_link, {
                                            waitUntil: "networkidle0",
                                            timeout: 30000
                                        });

                                    } catch (err) {
                                        //HERE
                                        console.error(err);
                                    }
                                }
                            }
                        }


                        // nếu ko tìm thấy vị trí sp
                        if (getViTriSanPham.trang == false || productForUser.check_index < 6) {
                            productForUser.trang = 0
                            productForUser.vitri = 0
                            productForUser.cookie = ""
                            await axios.get(shopeeUpdateSeoSanPhamDir, {
                                params: {
                                    data: {
                                        dataToServer: productForUser,
                                    }
                                },
                                timeout: 5000
                            })
                                .then(function (response) {
                                    console.log(response.data)
                                })
                                .catch(function (error) {
                                    console.log(error);

                                })

                            try {
                                await page.goto(productForUser.product_link, {
                                    waitUntil: "networkidle0",
                                    timeout: 30000
                                });

                            } catch (error) {
                                console.log(error.message);
                            }

                        }

                        // nếu lỗi khi tìm vị trí sp 
                        if (getViTriSanPham.trang == "err" || productForUser.check_index > 5) {
                            try {
                                await page.goto(productForUser.product_link, {
                                    waitUntil: "networkidle0",
                                    timeout: 30000
                                });

                            } catch (error) {
                                console.log(error.message);
                            }

                        }

                        console.log(" Check product ton tai: " + check_product_exit)
                        if (check_product_exit === "Có tồn tại") {
                            try {
                                let check_action
                                timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                                await page.waitForTimeout(timeout)

                                console.log("---- Xem ảnh sản phẩm ----")
                                await action_view_product(page)

                                action1 = {
                                    time: new Date(),
                                    action: "view_product"
                                }
                                actions.push(action1)
                                productForUser.action = "view_product"
                                await updateActions(productForUser)

                                if (options.heart_product) {
                                    if (productForUser.liked == false) {
                                        console.log("---- Thả tim sản phẩm ----")
                                        check_action = await action_heart_product(page, productForUser)

                                        action1 = {
                                            time: new Date(),
                                            action: "heart_product"
                                        }
                                        if (check_action.error == null) {
                                            actions.push(action1)
                                            productForUser.action = "heart_product"
                                            await updateActions(productForUser)
                                        }
                                    }
                                }

                                if (options.view_review) {
                                    console.log("---- Xem review ----")
                                    await action_view_review(page)
                                    action1 = {
                                        time: new Date(),
                                        action: "view_review"
                                    }
                                    actions.push(action1)
                                    productForUser.action = "view_review"
                                    await updateActions(productForUser)
                                }

                                if (options.add_cart) {
                                    await action_add_cart(page)
                                    console.log("---- Bỏ giỏ ---- " + productForUser.product_id + " -- " + productForUser.keyword + " : " + check_add_cart)

                                    if (check_add_cart) {
                                        action1 = {
                                            time: new Date(),
                                            action: "add_cart"
                                        }
                                        actions.push(action1)
                                        productForUser.action = "add_cart"
                                        await updateActions(productForUser)
                                    } else {
                                        console.log(productForUser.product_link)
                                    }

                                }

                                if (options.view_shop) {
                                    let productLink = await page.url()
                                    await action_view_shop(page, productLink, productForUser)
                                    productForUser.shopAvatar = shopInfo3.avatar
                                    productForUser.shopName = shopInfo3.name
                                    productForUser.shopUserName = shopInfo3.username

                                    action1 = {
                                        time: new Date(),
                                        action: "view_shop"
                                    }
                                    actions.push(action1)
                                    productForUser.action = "view_shop"
                                    await updateActions(productForUser)
                                }

                                if (options.follow_shop) {
                                    refer = await page.url()
                                    shopId = parseInt(productForUser.shop_id)
                                    check1 = shopInfo3.followed
                                    console.log("check follow shop: " + check1)
                                    if (check1 == false) {
                                        check_action = await shopeeApi.followShop(cookies22, refer, shopId)
                                        console.log(check_action)
                                        // if (check_action.data.follow_successful) {
                                        let action1 = {
                                            time: new Date(),
                                            action: "follow_shop"
                                        }
                                        actions.push(action1)
                                        productForUser.action = "follow_shop"
                                        await updateActions(productForUser)
                                        // }
                                        await page.waitForTimeout(1000);

                                    }
                                }

                            } catch (error) {
                                console.log(error)
                            }
                            //console.log(" update all")
                            productForUser.actions = actions

                            // await updateHistory(productForUser)

                        }

                        //productLink = await page.url()

                        // if (options.order) {
                        //     console.log("Đặt hàng: " + options.follow_shop)
                        //     if (productForUser.randomOrder >= 1) {
                        //         // Đặt hàng
                        //         randomOrder = Math.floor(Math.random() * (productForUser.randomOrder + 1))
                        //         if (randomOrder % productForUser.randomOrder == 0) {
                        //             //    await orderProduct(page, productInfo)
                        //         }
                        //     }
                        // }


                    }
                    await removeCart(page)
                    await page.waitForTimeout(1000);
                }
            }

            console.log("----------- Kết thúc tương tác ---------------" + index)

        } catch (error) {
            console.log(error)

        }

        await browser.close();

    })

};

//setInterval(check_die_slave, 600000, slavenumber);

//Cron 1 phút 1 lần 

//(async () => {
if (mode === "DEV") {
    (async () => {

        if (os_slave == "LINUX") {
            shell.exec('rm -rf ' + profileDir);
        } else {
            shell.exec('Rmdir /S /q ' + profileDir);
        }
        await sleep(5000)

        await runAllTime()

    })();
} else {

    (async () => {

        if (os_slave == "LINUX") {
            shell.exec('rm -rf ' + profileDir);
        } else {
            shell.exec('Rmdir /S /q ' + profileDir);
        }
        await sleep(5000)

        await runAllTime()


    })();
}


//})();