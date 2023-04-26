require('dotenv').config();
var fs = require('fs');
const shopeeApi = require('./src/shopeeApi.js')
const actionsShopee = require('./src/actions.js')
const axios = require('axios').default;
const HttpsProxyAgent = require("https-proxy-agent")
const moment = require('moment')
var FormData = require('form-data');
const { firefox, chromium } = require("playwright");

var randomMac = require('random-mac');
const proxy_check = require('proxy-check');
const exec = require('child_process').exec;
const randomUseragent = require('random-useragent');
const publicIp = require('public-ip');
var shell = require('shelljs');
const { preparePageForTests } = require('./src/bypass.js');
const bypassTest = require('./src/bypassTest.js');
var ip_address = require("ip");

slavenumber = process.env.SLAVE
account_check = process.env.ACCOUNT_CHECK
product_check = process.env.PRODUCT_CHECK
keyword_check = process.env.KEYWORD_CHECK
pending_check = process.env.PENDING

chromiumDir = process.env.CHROMIUM_DIR                     // Đường dẫn thư mục chromium sẽ khởi chạy
let profileDir = process.env.PROFILE_DIR
let extension = process.env.EXTENSION
let dcomVersion = process.env.DCOM
phobien = process.env.PHO_BIEN         //Chế độ chạy phổ biến
// Danh sách profile fb trong file .env
maxTab = process.env.MAXTAB_SHOPEE  // Số lượng tab chromium cùng mở tại 1 thời điểm trên slave
max_turn = process.env.MAX_TURN  // Số lượng keyword trên slave
headless_mode = process.env.HEADLESS_MODE     // che do chay hien thi giao dien
//disable_image = process.env.DISABLE_IMAGE     // k load ảnh
disable_css = process.env.DISABLE_CSS     // k load css
os_slave = process.env.OS     // k load css
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

if (headless_mode == "0") {
    headless_mode = true
} else {
    headless_mode = false
}

check_die = 0
console.log("headless_mode: " + headless_mode + " --- OS SLAVE:" + os_slave)

// Danh sách profile facebook trong mỗi slave
mode = process.env.MODE

if (mode === "DEV") {
    apiUrl = "http://beta.hotaso.vn"
    apiServer = "http://history.hotaso.vn:3000"
    updateActionsUrl = "https://beta.hotaso.vn"
    update_point = "http://beta.hotaso.vn"

} else {
    apiUrl = "http://api.hotaso.vn"
    apiServer = "http://history.hotaso.vn:4000"
    updateActionsUrl = "https://api.hotaso.vn"
    update_point = "http://api.hotaso.vn"
    //updateActionsUrl = "https://hotaso.tranquoctoan.com"
    maxTab = 5
}

shopee_account_update_url = apiUrl + "/api_user/shopeeAccountUpdate" // Link update account shopee status
data_shopee_url = apiUrl + "/api_user/dataShopee"     // Link shopee update thứ hạng sản phẩm
shopee_update_seo_san_pham_url = apiUrl + "/api_user/shopeeUpdateSeoSanPham"     // Link shopee update seo sản phẩm

update_actions_url = updateActionsUrl + "/api_user/updateActions"     // Update actions
update_point_url = update_point + "/api_user/update_point"     // Update actions
update_error_logs = updateActionsUrl + "/api_user/error_logs"     // Update actions

//save_history = updateActionsUrl + "/api_user/save_history"     // Update actions

update_history_url = apiServer + "/update-history"     // Update history
save_history_url = apiServer + "/save-history"     // Update history

getSlaveAccountDir = apiUrl + "/api_user/getSlaveAccount"     // Lay tai khoan shopee cho slave
getSlaveInfo = apiUrl + "/api_user/getSlaveInfo"     // Lay thong tin cau hinh slave


if (mode === "DEV") {
    timemax = 3000;
    timemin = 2000;
} else {
    timemax = 3000;
    timemin = 2000;
}
logs = 1

loginShopee = async (page, accounts) => {

    let logincheck = await page.$$('.navbar__username');

    if (!logincheck.length) {
        await page.mouse.click(10, 30)
        let timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
        await page.waitForTimeout(timeout)

        try {
            console.log(moment().format("hh:mm:ss") + " - Login acc pass")
            let ref = await page.url()
            await page.goto("https://shopee.vn/buyer/login?next=https%3A%2F%2Fshopee.vn%2F", {
                //     waitUntil: "networkidle0",
                //    timeout: 50000,
                referer: ref
            })
            let timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
            await page.waitForTimeout(timeout)
            //    await page.waitForSelector('[name="loginKey"]')

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

                // get_account_info = await (await page.waitForResponse((res) => {
                //     return (res.status() == 200 && res.url().includes('/account/login_by_password') && res.request().method() == 'GET');
                // }, { timeout: 180000 })).json();


            }
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(5000)
            let checkcode = await page.$$('[autocomplete="one-time-code"]')

            if (checkcode.length) {
                console.log("account bi khoá 1")
                return 2
            }

            let checkblock = await page.$$('form>div>div>div>div>svg>path[clip-rule="evenodd"]')

            if (checkblock.length) {
                console.log("account bị khoá 2")
                return 2
            }

            let checkblock2 = await page.$('.stardust-icon-cross-with-circle')
            if (checkblock2) {
                let checkblock3 = await page.evaluate(() => {
                    // Class có tài khoản bị cấm       
                    let titles = document.querySelector('.stardust-icon-cross-with-circle').parentElement.parentElement.children[1].textContent;
                    return titles
                })

                if (checkblock3 == "Tài khoản đã bị cấm 3") {
                    console.log("account bị khoá")
                    return 2
                }
                if (checkblock3 == "Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại") {
                    console.log("Sai thông tin đăng nhập")
                    return 3
                }
            }

            let check_account_checkpoint = await page.locator('div',{hasText: 'Xác minh tài khoản'} );
            console.log("Check checkpoint", check_account_checkpoint)
            if (check_account_checkpoint.length > 0) {
                console.log("account bị checkpoint")

                return 5
            }




        } catch (e) {
            console.log(e)
            console.log("Đăng nhập lỗi")
            await updateErrorLogs(e, slavenumber)
            return false
        }
        try {
            await page.waitForSelector('.shopee-searchbar-input');
        } catch (error) {
            console.log(error)
            console.log("Đăng nhập lỗi")
            await updateErrorLogs(error, slavenumber)
            return false
        }

        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout)
        return true

    } else {
        return true
    }
}

check_captcha = async (page, accounts) => {
    
    let check_account_checkpoint = await page.locator('div',{hasText: 'Kéo sang phải để hoàn thiện bức hình'} );
    console.log("Check captcha: " + accounts[0], check_account_checkpoint)
    if (check_account_checkpoint.length > 0) {
        console.log("Tài khoản bị yêu cầu captcha: " + accounts[0])

        accountInfo = {
            user: accounts[0],
            pass: accounts[1],
        }

        accountInfo.message = "Account bị check point"
        accountInfo.status = 6

        await axios.get(shopee_account_update_url, {
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

        console.log(" ----- KhởI đÔng lại ---- ")
        return 1
    }
}

searchKeyWord = async (page, keyword) => {
    try {
        
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout);

        let checkSearchInput = await page.locator('.shopee-searchbar-input__input');
       
        if (checkSearchInput) {
            console.log(moment().format("hh:mm:ss") + " - checkSearchInput", checkSearchInput)
            await page.click('.shopee-searchbar-input__input')
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.type('.shopee-searchbar-input__input', keyword, { delay: 100 })
            timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
            await page.waitForTimeout(timeout);
            await page.keyboard.press('Enter')
        
        } else {
            //  await page.waitForSelector('.shopee-searchbar-input')
            await page.locator('.shopee-searchbar-input').click()
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.locator('.shopee-searchbar-input').click()
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            await page.locator('.shopee-searchbar-input').click()
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitForTimeout(timeout);
            console.log(keyword)
            await page.locator('.shopee-searchbar-input').type(keyword)
            timeout = Math.floor(Math.random() * (1000 - 500)) + 500;
            await page.waitForTimeout(timeout);
            await page.keyboard.press('Enter')

        }


    } catch (error) {
        console.log(moment().format("hh:mm:ss") + " - CÓ LỖI TÌM KIẾM SẢN PHẨM")
        console.log(error)
        await updateErrorLogs(error, slavenumber)
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
        await updateErrorLogs(error, slavenumber)
    }

}

getproduct = async (page, saveProduct, limit, idShops) => {
    try {
        let thuHangSanPham
        await page.waitForSelector('[data-sqe="name"]')
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout);
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
        await updateErrorLogs(error, slavenumber)
        return false
    }

}

get_variation_enable = async (page) => {
    try {
        let variation1 = await page.evaluate(() => {

            //  tất cả variation
            let titles = document.querySelectorAll('.product-variation');
            let list_variation = []
            titles.forEach((item, index) => {
                let x = item.click()
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
    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
    }

}

// chọn thuộc tính sản phẩm
chooseVariation = async (page, product) => {
    let variation_enable
    try {
        console.log("---- Chọn ngẫu nhiên phân loại sản phẩm ----")

        let varitations = await page.$$('.product-variation')

        variation_enable = await get_variation_enable(page)
        console.log("variation enable")
        console.log(variation_enable)
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitForTimeout(timeout)

        // if (variation_enable.length > 0) {

        //     for (i = 0; i < (variation_enable.length - 1); i++) {

        //         try {

        //             await varitations[variation_enable[i]].click()
        //             timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        //             await page.waitForTimeout(timeout)
        //         } catch (error) {
        //             console.log("Click variable: " + i + " -- " + product.product_link)
        //             console.log(error.message)
        //         }

        //     }
        // }
        return 1

    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
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
        await updateErrorLogs(error, slavenumber)
    }

}


updateProxy = async (proxy, check_time) => {

    console.log(" --- Update proxy ---")
    url_proxy = apiUrl + "/api_user/update_proxy?proxy=" + proxy + "&check_time=" + check_time

    await axios.get(url_proxy, {

        timeout: 5000
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

check_point_hour = async (uid) => {
    result = 0

    check_point_hour_url = apiUrl + "/api_user/check_point_hour?uid=" + uid

    await axios.get(check_point_hour_url, {

        timeout: 5000
    },
        {
            headers: {
                Connection: 'keep-alive',
            }
        })
        .then(function (response) {

            result = response.data
        })
        .catch(function (error) {
            console.log(moment().format("hh:mm:ss") + " - Lỗi check điểm số")
            result = 1
        });
    if (mode == "DEV") {
        result = 1
    }
    console.log(moment().format("hh:mm:ss") + " - Có đủ điểm số để thao tác không: " + result);
    return result
}

updateHistory = async (product) => {
    dataupdate = product

    update = 0

    await axios.get(save_history_url, {
        data: dataupdate,
        timeout: 5000
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

updateAction = async (product9, limit) => {

    // console.log(product9)
    await axios.post(update_actions_url, {
        data: product9,
        timeout: 50000
    },
        {
            // httpsAgent: httpsAgent
        })
        .then(function (response) {
            console.log(moment().format("hh:mm:ss") + " - Update action: " + product9.action + " = " + response.data);
            console.log(response.data)
            return true
        })
        .catch(async function (error) {
            console.log(error);
            console.log(moment().format("hh:mm:ss") + " - Update action lỗi");
            await updateErrorLogs(error, product9.slave)
            limit = limit - 1
            if (limit > 0) {
                await sleep(5000)
                await updateAction(product9, limit)
            } else {
                console.log(moment().format("hh:mm:ss") + " - Lỗi mạng không thể cập nhật dữ liệu");
                return false
            }
        });
}

updatePoint = async (product9, limit) => {

    product9.cookie = "";

    await axios.get(update_point_url, {
        params: {
            data: {
                dataToServer: product9,
            }
        },
        timeout: 60000
    })
        .then(function (response) {
            console.log(moment().format("hh:mm:ss") + " - " + response.data)
            return true
        })
        .catch(async function (error) {
            console.log(error);
            console.log(moment().format("hh:mm:ss") + " - Update point lỗi");
            await updateErrorLogs(error, product9.slave)
            limit = limit - 1
            if (limit > 0) {
                await sleep(5000)
                await updatePoint(product9, limit)
            } else {
                console.log(moment().format("hh:mm:ss") + " - Lỗi mạng không thể cập nhật dữ liệu điểm số");

                return false
            }
        })
}

getShopeeLinkVerify = async (email) => {

    let url = "https://mail68.tk/api/messages/" + email + "/hfBgaLAqy7ISZQ8WHu5e"
    await axios.get(url, {

    })
        .then(function (response) {
            console.log(moment().format("hh:mm:ss") + " - " + response.data)
            return true
        })
        .catch(async function (error) {
            console.log(error);
            console.log(moment().format("hh:mm:ss") + " - Lấy link shopee verify lỗi");

        })
}

updateErrorLogs = async (error, slave) => {
    //console.log(error)
    console.log(moment().format("hh:mm:ss") + " - CậP nhật lỗi: " + error.message);
    console.log(error.stack)
    //console.log(moment().format("hh:mm:ss") + " - link CậP nhật lỗi: " + update_error_logs);
    let message = error.message
    let log = {
        logs: error.stack,
        slave: slave,
        message: message
    }
    await axios.post(update_error_logs, {
        data: log,
        timeout: 50000
    },
        {
            // httpsAgent: httpsAgent
        })
        .then(function (response) {
            console.log(response.data);
            return true
        })
        .catch(async function (error) {
            console.log(error);
            console.log(moment().format("hh:mm:ss") + " - Update error lỗi");
        });
}

updateActions = async (product9, limit) => {
    await updateAction(product9, limit)
    await updatePoint(product9, limit)

}

action_view_shop = async (page, url, product) => {

    console.log("---- View shop ----")


    // let ref = await page.url()
    // await page.goto(url, {
    //     referer: ref
    // })

    await page.keyboard.press('Home');
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitForTimeout(timeout)
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(timeout)

    try {
        await page.waitForSelector('.shopee-avatar__placeholder', {
            timeout: 60000
        })
        viewShopClick = await page.$$('.shopee-avatar__placeholder')
        if (viewShopClick.length >= 2) {
            viewShopClick[1].click()
        } else {
            viewShopClick[0].click()
        }

        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        await page.waitForSelector('.shopee-avatar__img', {
            timeout: 60000
        })

        randomDown = Math.floor(Math.random() * (5 - 2)) + 2;
        for (i = 0; i < randomDown; i++) {
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
        }

        // getProductPageTotal = await page.evaluate(() => {
        //     // Class có link bài đăng trên profile          
        //     let titles = document.querySelectorAll('.shopee-mini-page-controller__total')[0].textContent;
        //     return titles
        // })

        // random_page = Math.floor(Math.random() * getProductPageTotal);
        // for (let i = 0; i <= random_page; i++) {
        randomDown = Math.floor(Math.random() * (5 - 2)) + 2;
        for (i = 0; i < randomDown; i++) {
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            await page.keyboard.press('PageDown');
        }
        // next_page = await page.$('.shopee-button-outline.shopee-mini-page-controller__next-btn')
        // if (next_page) {
        //     await next_page.click()
        // }
        // }

        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitForTimeout(timeout)
        await page.keyboard.press('Home');
    } catch (error) {
        console.log(moment().format("hh:mm:ss") + " --> Có lỗi khi view shop")
        console.log(error)

        // await updateErrorLogs(error, slavenumber)
        return false
    }
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
        // await page.waitForSelector('.icon-arrow-right-bold')

        for (let i = 0; i <= viewRandomImages; i++) {
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)
            let nextRightButton = await page.$$('.icon-arrow-right-bold')
            if (nextRightButton.length > 1) {
                await nextRightButton[nextRightButton.length-1].click();
            }
        }
    } catch (e) {
        await updateErrorLogs(e, slavenumber)
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

action_heart_product_api = async (browser, page, product) => {

    let cookies1 = await browser.cookies()
    let refer = await page.url()
    let result = await shopeeApi.thaTimSanPham(cookies1, refer, product.shop_id, product.product_id)

    return result

}

action_add_cart = async (page, product) => {
    try {
        console.log("Thêm vào giỏ hàng")
        await page.keyboard.press('Home');
        // Check số lượng trong giỏ hàng hiện tại
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)


        // click chọn màu
        let checkVariation = await chooseVariation(page, product, 5)

        // Chọn số lượng sản phẩm
        so_luong_san_pham = await page.$('.shopee-svg-icon.icon-plus-sign')
        if (so_luong_san_pham) {
            console.log("--- Ngẫu nhiên số lượng bỏ giỏ ---")

            random_so_luong = Math.floor(Math.random() * 5);
            for (let i = 0; i < random_so_luong; i++) {
                await so_luong_san_pham.click()
                timeout = Math.floor(Math.random() * (2000 - 500)) + 500;
                await page.waitForTimeout(timeout)
            }
        }

        // click thêm vào giỏ hàng
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)
        addToCard = await page.$$('.btn-tinted')

        await page.evaluate(() => {
            check = document.querySelector('button.btn-tinted')
            if (check) {
                document.querySelector('button.btn-tinted').click()
            }
        })

        timeout = Math.floor(Math.random() * (5000 - 4000)) + 4000;
        await page.waitForTimeout(timeout)

    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
    }
}

action_report_shop = async (page, report_shop) => {
    try {
        console.log("---- Report shop ----")
        let url = "https://shopee.vn/shop/" + report_shop.shop_id + "/report/?__classic__=1"
        await page.goto(url, {
            referer: ref
        });

        // Chọn lí do report
        timeout = Math.floor(Math.random() * (2000 - 500)) + 500;
        await page.waitForTimeout(timeout)

        let li_do = await page.evaluate((xx) => {

            // Class có link bài đăng trên profile       
            let i = false
            document.querySelectorAll('.reason-text').forEach((e, index) => {
                if (e.textContent == xx) {
                    i = index
                    console.log(index)
                }
            })

            return i
        }, report_shop.report_type)

        let check_li_do = await page.$$('.reason-text')

        if (check_li_do) {
            await check_li_do[li_do].click()
        }

        timeout = Math.floor(Math.random() * (2000 - 500)) + 500;
        await page.waitForTimeout(timeout)

        // Nhập lý do report
        let report_content = report_shop.report_content.split("\n")

        random_content = Math.floor(Math.random() * (report_content.length - 1));
        let content = report_content[random_content]

        await page.type('#optional-text-input', content, { delay: 100 })
        console.log("----Nhập nội dung report ----: " + content)
        timeout = Math.floor(Math.random() * (2000 - 500)) + 500;
        await page.waitForTimeout(timeout)

        // Chọn ảnh

        const fileExitst = fs.existsSync(`./a.jpg`)
        await page.waitForSelector('input[type="file"]')
        await page.waitForTimeout(2000)

        let add_file = await page.$$('input[type=file]');
        if (add_file.length) {

            //await page.evaluate(() => document.querySelectorAll("input[type=file]")[0].click());
        }

        // await page.evaluate(() => {
        //     document.querySelectorAll("input[type=file]")[0].click()
        // })

        await page.waitForTimeout(3000)
        let fileToUpload = 'E:\\code\\hotaso_auto\\a.jpg';

        let photoField = await page.$$('input[type="file"]');
        if (photoField.length) {
            console.log(" --- Click upload file ---: " + photoField.length)
            await photoField[0].uploadFile('E:\\code\\hotaso_auto\\a.jpg');
        }

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('input[type="file"]'),
        ]);
        await fileChooser.accept(['E:\\code\\hotaso_auto\\a.jpg']);

        if (fileExitst) {
            //console.log("---- Chọn ảnh report ----")
            //await input.uploadFile(`./a.jpg`)
        }


        return 1

    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)

    }
}

action_heart_product = async (page) => {
    try {
        console.log("--- thả tim sản phẩm ---")
        await page.keyboard.press('Home');

        // click tha tim
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)

        // await page.evaluate(() => {
        //     check = document.querySelector('.justify-center>.flex.items-center>svg>path')
        //     if (check) {
        //         document.querySelector('.justify-center>.flex.items-center>svg>path').click()
        //     }
        // })
        check = await page.$('.justify-center>.flex.items-center>button>svg>path')
        if (check) {
            await check.click()
        }
        timeout = Math.floor(Math.random() * (5000 - 4000)) + 4000;
        await page.waitForTimeout(timeout)

    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
    }
}


action_follow_shop = async (page) => {
    try {
        console.log("--- Follow shop ---")
        //  await page.keyboard.press('Home');

        // click follow
        timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
        await page.waitForTimeout(timeout)

        check = await page.$('.section-seller-overview-horizontal__buttons>a')
        if (check) {
            await check.click()
        }
        timeout = Math.floor(Math.random() * (5000 - 4000)) + 4000;
        await page.waitForTimeout(timeout)

    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
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

        if (checkcart > 20) {

            let ref = await page.url()
            await page.goto('https://shopee.vn/cart/', {
                referer: ref
            })
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitForTimeout(timeout)

            await page.waitForSelector('.stardust-checkbox', {
                timeout: 60000
            })
            for (let i = 0; i < 10; i++) {

                check_product_cart = await page.locator('div',{hasText: 'Xóa'} );
                
                console.log("check btn Xóa: " + check_product_cart)

                if (check_product_cart.length > 0) {
                    await check_product_cart[0].click();
                    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                    await page.waitForTimeout(timeout)
                }

            }

        }
    } catch (error) {
        console.log(error)
        await updateErrorLogs(error, slavenumber)
    }

}

orderProduct = async (page, productInfo) => {
    console.log("---- Đặt hàng ----")
    linksp = await page.url()
    productInfo.linkNow = linksp

    fs.appendFileSync('logs.txt', "\n" + "Order: " + "\n" + JSON.stringify(productInfo, null, 4))

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

function randomInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

gen_browser = async (option) => {
    let profile_dir = option.profile_dir
    let proxy1 = option.proxy
    let headless_mode = option.headless_mode
    let network = option.network
    let user_lang = option.user_lang

    console.log("Profile chrome link: " + profile_dir)

 
    if (!fs.existsSync(`${profileDir}`)) {
        fs.mkdirSync(`${profileDir}`);
      }
      if (!fs.existsSync(`${profile_dir}`)) {
        fs.mkdirSync(`${profile_dir}`);
        fs.mkdirSync(`${profile_dir}\\extensions`);
      }

    const extensions = fs
        .readdirSync(`./firefox-extensions`)
        .filter((x) => x.endsWith(".xpi"));
    for (let i = 0; i < extensions.length; i++) {
        fs.copyFileSync(
            `./firefox-extensions/${extensions[i]}`,
            `${profile_dir}/extensions\${extensions[i]}`
        );
    }

    let proxy_2
    if (network == "proxy") {
        let proxy_pass
        try {
            proxy_pass = proxy1.proxy_password.split("\r")[0]
        } catch (error) {
            proxy_pass = proxy1.proxy_password
        }

        proxy_2 = {
            server: `${proxy1.proxy_ip}:${proxy1.proxy_port}`,
            username: proxy1.proxy_username,
            password: proxy_pass,
        }
    }
   

        var browser = await firefox.launchPersistentContext(
            `${profile_dir}`,
            {
                headless: headless_mode,
                viewport: { width: randomInt(900, 1200), height: randomInt(600, 900) },

                //   args: args,
                proxy: network == "proxy" ? proxy_2 : "",
                //   userAgent,
                //   locale,
                javaScriptEnabled: true,
            }
        );
   
        
    try {
        let cookie1 = option.cookie
        if (cookie1.length) {
            //   let cookie111 = JSON.parse(cookie1)
            //console.log(cookie111)
            // cookie111.forEach(async (item) => {
            //     await page.setCookie(item);
            // })
            cookie1.forEach(elm => delete elm.expires);
            await browser.addCookies(cookie1);
          
            console.log(moment().format("hh:mm:ss") + " - Setcookie thành công")
        }
    } catch (e) {
        console.log(" ---- Lỗi set coookie ----")
    }

    return browser
}

gen_page = async (browser) => {

    const page = await browser.pages()[0];
   
    return page
}

chan_anh = async (page) => {
    await page.setRequestInterception(true);
    console.log(" DISABLE image: " + disable_image)
    disable_image = parseInt(disable_image)
    page.on('request', (req) => {

        if (req.resourceType() === 'image' && disable_image) {
            //console.log("---- Chặn load ảnh ----")
            req.abort();
        } else {
            //console.log("---- Bỏ Chặn load ảnh ----")
            req.continue();
        }
    });
}

check_die_slave = () => {
    console.log("check slave die: ")

}



function getCookiesMap(cookiesString, url) {
    let cookies = []
    const ck_obj = cookiesString.split(";")
        .map(function (cookieString) {
            return cookieString.trim().split(/=(.+)/);
        })
        .reduce(function (acc, curr) {
            acc[curr[0]] = curr[1];
            return acc;
        }, {})
    const keys = Object.keys(ck_obj)
    for (let i = 0; i < keys.length; i++) {
        cookies.push({
            name: keys[i],
            value: ck_obj[keys[i]],
            domain: url,
            path: '/'
        })
    }
    return cookies
}

runAllTime = async () => {

    slaveInfo = []
    getDataShopee = []
    dataShopee = []
    // lấy dữ liệu từ master
    checkNetwork = 1

    // for (let a = 1; a < 100; a++) {
    //     console.log("check connection " + a);

    //     await require('dns').resolve('www.google.com', function (err) {
    //         if (err) {
    //             console.log("No connection " + a);
    //             checkNetwork = 0
    //         } else {
    //             console.log("Connected");
    //             checkNetwork = 1
    //         }
    //     });

    //     if (checkNetwork == 1) {
    //         break
    //     } else {
    //         await sleep(2000)
    //     }
    // }


    if (checkNetwork == 1) {

        // await axios.get("https://api.hotaso.vn/api_user/get_server",{
        //     timeout: 6000,
        // })
        //     .then(function (response) {
        //         host_name = response.data
        //         // cookie3 = response.headers['set-cookie']

        //         // console.log(cookie1)
        //     })
        //     .catch(async function (error) {
        //         console.log(error);
        //         await axios.get("http://api.hotaso.vn/api_user/get_server", {
        //             timeout: 60000,
        //         })
        //             .then(function (response) {
        //                 host_name = response.data
        //                 // cookie3 = response.headers['set-cookie']

        //                 // console.log(cookie1)
        //             })
        //             .catch(async function (error) {
        //                 console.log(error);

        //             })
        //     })


        // update_point = apiUrl = host_name.domain
        // updateActionsUrl = host_name.domain

        update_point = apiUrl = "https://api.hotaso.vn"
        updateActionsUrl = "https://api.hotaso.vn"
        console.log("HOST NAME : " + apiUrl)

        if (mode === "DEV") {
            apiUrl = "https://beta.hotaso.vn"
            apiServer = "https://history.hotaso.vn:3000"
            updateActionsUrl = "https://beta.hotaso.vn"
            update_point = "https://beta.hotaso.vn"

        }

        shopee_account_update_url = apiUrl + "/api_user/shopeeAccountUpdate" // Link update account shopee status
        data_shopee_url = apiUrl + "/api_user/dataShopee"     // Link shopee update thứ hạng sản phẩm
        shopee_update_seo_san_pham_url = apiUrl + "/api_user/shopeeUpdateSeoSanPham"     // Link shopee update seo sản phẩm

        update_actions_url = updateActionsUrl + "/api_user/updateActions"     // Update actions
        update_point_url = update_point + "/api_user/update_point"     // Update actions

        getSlaveAccountDir = apiUrl + "/api_user/getSlaveAccount"     // Lay tai khoan shopee cho slave
        getSlaveInfo = apiUrl + "/api_user/getSlaveInfo"     // Lay thong tin cau hinh slave

        let get_data_shopee_url = ""
        if (keyword_check) {
            keyword_check = encodeURI(keyword_check)
        }

        get_data_shopee_url = data_shopee_url + "?slave=" + slavenumber + "&token=kjdaklA190238190Adaduih2ajksdhakAhqiouOEJAK092489ahfjkwqAc92alA&product_check=" + product_check + "&account_check=" + account_check + "&keyword_check=" + keyword_check + "&mode=" + mode
        console.log(get_data_shopee_url)

        // Lấy dữ liệu từ từ khoá từ sv
        console.log(moment().format("hh:mm:ss") + " - Lấy dữ liệu ban đầu từ server")
        await axios.get(get_data_shopee_url, {
            timeout: 60000,
        })
            .then(function (response) {

                dataShopee = response.data
            })
            .catch(async function (error) {
                // handle error
                //console.log(error);
                await updateErrorLogs(error, slavenumber)
                return false
            })
            .then(function () {
                // always executed
            });
    } else {
        return false
    }

    // console.log(dataShopee.version)
    // process.exit()
    if (dataShopee.version && dataShopee.auto_update) {

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
            console.log(moment().format("hh:mm:ss") + " - Cập nhật code")
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
                    shell.exec('git stash;');
                    shell.exec('git pull https://magiclovexxx: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@github.com/magiclovexxx/hotaso_auto.git master;');
                    shell.exec('npm install;pm2 flush; pm2 start shopee.js; pm2 start restartall.js; pm2 startup; pm2 save; pm2 restart all');
                }
                return false
            }
        }
    }
    let error_code = dataShopee.code
    if (error_code == 1111) {
        console.log(moment().format("hh:mm:ss") + " - Không có dữ liệu khách hàng")
        await sleep(60000)
        return
    }
    if (error_code == 2222) {
        console.log(moment().format("hh:mm:ss") + " - Không có tài khoản clone")
        //    shell.exec('shutdown');
        await sleep(300000)
        return
    }
    if (error_code == 3333) {
        console.log(moment().format("hh:mm:ss") + " - Không có proxy")
        await sleep(300000)
        return
    }

    if (error_code == 4444) {
        console.log(moment().format("hh:mm:ss") + " - Không có proxy")
        await sleep(300000)
        return
    }

    if (!dataShopee.data) {
        console.log(moment().format("hh:mm:ss") + " - Không có dữ liệu datashopee")
        await sleep(60000)
        return
    }
    data = dataShopee.data

    shopee_point = dataShopee.shopee_point
    if (dataShopee.slave_info) {
        slaveInfo = dataShopee.slave_info
        if (slaveInfo.status == 0) {
            console.log(" SLAVE " + slaveInfo.slave_id + ": OFF")
            return;
        }
    }
    disable_image = dataShopee.disable_image

    orderStatus = 1
    console.log(moment().format("hh:mm:ss") + " - START SHOPEE")
    //data = GenDirToGetData(maxTab, accounts)

    proxy = dataShopee.proxy
    if (proxy == 0) {
        console.log(moment().format("hh:mm:ss") + " - Không có proxy")
    }
    //await sleep(5000)

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

    //let check_proxy = 0
    // if (slaveInfo.network == "proxy") {

    //     let proxy_pass = proxy.proxy_password.split("\r")[0]
    //     const proxy_1 = {
    //         host: proxy.proxy_ip,
    //         port: proxy.proxy_port,
    //         proxyAuth: proxy.proxy_username + ":" + proxy_pass
    //     };
    //     // or
    //     // const proxy = 'y0adXjeO:pAzAHCr4@54.82.74.24:5557';

    //     await proxy_check(proxy_1).then(r => {
    //         // console.log(r); // true
    //         check_proxy = "LIVE"
    //     }).catch(async e => {
    //         // console.error(e); // ECONNRESET
    //         console.log(proxy_1.host + " --- DIE ")
    //         await updateProxy(proxy.proxy_ip)
    //     });
    //     console.log("Check proxy: " + check_proxy)
    //     if (check_proxy == 0) {
    //         return false
    //     }

    // }

    // if (os_slave != "LINUX") {
    //     if (mode != "DEV") {
    //         await change_info_pc()
    //         console.log("----- Change info -----")
    //         await shell.exec('changeinfo.bat');
    //     }
    // }


    data.forEach(async (data_for_tab, index) => {   // Foreach object Chạy song song các tab chromium

        //await sleep(15000 * index)
        // Nếu có dữ liệu schedule trả về
        //key = key.split("\t")
        let subAccount = []
        let acc = data_for_tab.sub_account
        let keywords = data_for_tab.product_for_sub_account
        let axios_config

        if (keywords.length == 0) {
            console.log(moment().format("hh:mm:ss") + " - Không có dữ liệu từ khoá")
            await sleep(150000)
            return
        }

        if (data_for_tab.feed) {
            data_feed = data_for_tab.feed
            console.log(moment().format("hh:mm:ss") + " - Dữ liệu shopee feed: " + data_feed.length)
        } else {
            data_feed = false
            console.log(moment().format("hh:mm:ss") + " - Không có Dữ liệu shopee feed")
        }

        if (data_for_tab.report_shop) {
            data_report_shop = data_for_tab.report_shop
        } else {
            data_report_shop = false
        }

        let user_agent, user_lang
        console.log(moment().format("hh:mm:ss") + " - Số lượng từ khoá tab: " + index + " ---- " + keywords.length)

        subAccount[0] = acc.username
        subAccount[2] = acc.id
        try {
            subAccount[1] = acc.password.split("\r")[0]
        } catch (error) {
            subAccount[1] = acc.password
        }

        if (!acc.user_agent) {
            user_agent = randomUseragent.getRandom(function (ua) {

                return (ua.osName === 'Windows' && ua.osVersion === "10");
            });
        } else {
            user_agent = acc.user_agent
        }

        if (!acc.lang) {
            langs = ["ar", "bg", "bn", "ca", "cs", "da", "de", "el", "en-GB", "en-US", "es", "et", "fi", "fil", "fr", "gu", "he", "hi", "hr", "hu", "id", "it", "ja", "kn", "ko", "lt", "lv", "ml", "mr", "ms", "nb", "nl", "pl", "pt-BR", "pt-PT", "ro", "ru", "sk", "sl", "sr", "sv", "ta"
                , "te", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"]

            let rand = Math.floor(Math.random() * langs.length);
            user_lang = langs[rand]
            console.log("Ngôn ngữ trình duyệt: " + user_lang)

        } else {
            user_lang = acc.user_lang
        }

        let profileChrome = profileDir + subAccount[0]
        let cookie_3 = acc.cookie
        let check_cookie = cookie_3.search("shopee.vn")
        if (check_cookie > 0) {
            cookie_3 = JSON.parse(cookie_3)
        } else {
            cookie_3 = getCookiesMap(cookie_3, "shopee.vn")
        }

        //    console.log(cookie_3)

        let option1 = {
            user_agent: user_agent,
            proxy: proxy,
            profile_dir: profileChrome,
            cookie: cookie_3,
            network: slaveInfo.network,
            headless_mode: headless_mode,
            user_lang: user_lang
        }

        console.log(proxy)
        console.log("email account: " + acc.email)
        let browser = await gen_browser(option1)

       

        let page = await gen_page(browser, option1)

        //await chan_anh(page)

        try {

            try {
                console.log(moment().format("hh:mm:ss") + " - Load shopee.vn")
                let ref = await page.url()
                await page.goto('https://shopee.vn', {
                    referer: ref
                })
                await updateProxy(proxy.proxy_ip + ":OK")
                
               
            } catch (err) {
                //HERE
                console.error(err);
                await updateErrorLogs(err, slavenumber)
                await updateProxy(proxy.proxy_ip)
            }

            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;

            await page.waitForTimeout(timeout)
            cookie_3.forEach(elm => delete elm.expires);
            await browser.addCookies(cookie_3);
          
            console.log(moment().format("hh:mm:ss") + " - Setcookie thành công")

            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;

            await page.waitForTimeout(timeout)

            // login account shopee                    
            let checklogin = await loginShopee(page, subAccount)


            console.log(moment().format("hh:mm:ss") + " - index = " + index + " - check login account: " + subAccount[0] + " - " + checklogin)

            if (checklogin == 2 || checklogin == 3 || checklogin == 5) {
                console.log(moment().format("hh:mm:ss") + " - Cập nhật tài khoản lỗi")
                accountInfo = {
                    user: subAccount[0],
                    pass: subAccount[1],
                }

                if (checklogin == 2) {
                    accountInfo.message = "Account bị khoá"
                    accountInfo.status = 2
                }

                if (checklogin == 3) {
                    accountInfo.message = "Sai thông tin đăng nhập"
                    accountInfo.status = 3
                }

                if (checklogin == 5) {
                    accountInfo.message = "checkpoint"
                    accountInfo.status = 5
                }

                await axios.get(shopee_account_update_url, {
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
                await browser.close();
                console.log(" ----- KhởI đÔng lại ---- ")
                return
            }
            if (checklogin) {

                if (slaveInfo.type == "seo_top") {
                    console.log(moment().format("hh:mm:ss") + " --- Click theo sản phẩm ---")

                    if (!max_turn) {
                        max_turn = keywords.length
                    }
                    if (mode == "DEV") {
                        max_turn = 1
                    }

                    //console.log(data_feed)
                    // Chạy lần lượt max_turn lượt tìm kiếm, tương tác từ khoá
                    for (let o = 0; o < max_turn; o++) {

                        if (data_feed) {
                            for (let x = 0; x < data_feed.length; x++) {
                                data_feed_1 = data_feed[x]
                                check_point = await check_point_hour(data_feed[x].uid)
                                let productForUser1 = data_feed_1
                                productForUser1.feed_id = data_feed_1.id

                                productForUser1.username = subAccount[0]
                                productForUser1.password = subAccount[1]
                                productForUser1.clone_id = subAccount[2]
                                productForUser1.shopee_point = shopee_point
                                productForUser1.slave = slavenumber

                                if (check_point) {
                                    try {
                                        console.log(moment().format("hh:mm:ss") + " - Thao tác shopee feed")
                                        let cookie_2 = await browser.cookies()
                                        result_feed = 0
                                        check_feed = 0

                                        console.log("Feed like: " + data_feed_1.feed_like)
                                        console.log("count like: " + data_feed_1.count_like)

                                        if (Number(data_feed_1.feed_like) > Number(data_feed_1.count_like)) {
                                            console.log(moment().format("hh:mm:ss") + " - Like Feed")
                                            check_feed = await shopeeApi.likeFeed(cookie_2, data_feed_1.feed_link, proxy)
                                            if (check_feed) {
                                                if (check_feed.msg == "Success") {
                                                    console.log(moment().format("hh:mm:ss") + " - cập nhật action like feed")
                                                    //console.log(productForUser1)
                                                    productForUser1.action = "like_feed"

                                                    await updateActions(productForUser1, 10)
                                                }
                                            } else {
                                                console.log(moment().format("hh:mm:ss") + " - Có lỗi khi live feed")
                                            }
                                        }

                                        if (Number(data_feed_1.feed_comment) > Number(data_feed_1.count_comment)) {
                                            console.log(moment().format("hh:mm:ss") + " - Comment feed")

                                            check_feed = await shopeeApi.commentFeed(cookie_2, data_feed_1, proxy)
                                            if (check_feed) {
                                                if (check_feed.msg == "Success") {
                                                    console.log(moment().format("hh:mm:ss") + " - Cập nhật action comment feed")
                                                    productForUser1.action = "comment_feed"

                                                    productForUser1.feed_content = data_feed_1.feed_content
                                                    productForUser1.feed_mention = data_feed_1.feed_mention
                                                    productForUser1.feed_hashtag = data_feed_1.feed_hashtag
                                                    console.log(data_feed_1.feed_mention)
                                                    await updateActions(productForUser1, 10)
                                                }
                                            } else {
                                                console.log(moment().format("hh:mm:ss") + " - Lỗi khi comment feed ")
                                            }
                                        }
                                    } catch (error) {
                                        console.log(error)
                                        await updateErrorLogs(error, slavenumber)
                                    }
                                }
                            }
                        }

                        try {
                            // let ref = await page.url()
                            // start_check_time = Date.now()
                            // await page.goto('https://shopee.vn', {
                            //     referer: ref
                            // })

                            // if (pending_check == 1) {
                            //     await page.waitForTimeout(9999999)
                            // }
                            // stop_check_time = Date.now()
                            // check_time = stop_check_time - start_check_time
                            // //    await updateProxy(proxy.proxy_ip + ":OK", check_time)

                            // timeout = Math.floor(Math.random() * (6000 - 5000)) + 5000;
                            // await page.waitForTimeout(timeout)

                            let ax = Math.floor(Math.random() * (40 - 0)) + 0;
                            let by = Math.floor(Math.random() * (100 - 0)) + 0;

                            console.log(moment().format("hh:mm:ss") + " - Click pixel: " + ax + "x" + by)

                            await page.mouse.click(ax, by)
                            // let check_popup = await page.$$(".shopee-popup__close-btn")
                            // if(check_popup.length){


                            //     console.log(moment().format("hh:mm:ss") + " - Tắt popup")
                            //     await check_popup[0].click()
                            // }else{
                            //     check_popup = await page.$$(".home-popup__close-button")
                            //     if(check_popup.length){
                            //         await check_popup[0].click()
                            //     }
                            // }

                        } catch (err) {
                            //HERE
                            stop_check_time = Date.now()
                            check_time = stop_check_time - start_check_time
                            //hị    await updateProxy(proxy.proxy_ip, check_time)
                            console.error(err);
                            //continue
                        }

                        let productForUser                     // Mảng chứa thông tin sản phẩm, từ khoá cần tương tác
                        let check_like = 0
                        let check_follow = 0

                        let check_product_exit = "Có tồn tại"
                        let actions = []                            // Luư lịch sử thao tác
                        productForUser = keywords[o]

                        // Check actions can thao tac cua shop
                        let options
                        try {

                            options = JSON.parse(productForUser.options)
                        } catch (error) {
                            console.log(error)
                            await updateErrorLogs(error, slavenumber)
                        }

                        productForUser.username = subAccount[0]
                        productForUser.password = subAccount[1]
                        productForUser.clone_id = subAccount[2]
                        productForUser.shopee_point = shopee_point

                        // if(mode == "DEV"){
                        //     productForUser.shop_id = "406672344"
                        //     productForUser.keyword = "Quần Lót Nữ Cotton kháng khuẩn thoáng mát đính nơ duyên dáng điệu đà MITEVA QL06"
                        //     productForUser.product_name = "Quần Lót Nữ Cotton kháng khuẩn thoáng mát đính nơ duyên dáng điệu đà MITEVA QL06"
                        //     productForUser.product_id = "5983738410"
                        //     productForUser.product_link = "https://shopee.vn/Qu%E1%BA%A7n-L%C3%B3t-N%E1%BB%AF-Cotton-kh%C3%A1ng-khu%E1%BA%A9n-tho%C3%A1ng-m%C3%A1t-%C4%91%C3%ADnh-n%C6%A1-duy%C3%AAn-d%C3%A1ng-%C4%91i%E1%BB%87u-%C4%91%C3%A0-MITEVA-QL06-i.406672344.5983738410"
                        // }
                        let viTriSanPhamTrang1 = false;

                        let shopInfo3 = {
                            cover: false,
                            name: false,
                            followed: 0
                        }

                        let check_add_cart
                        page.removeAllListeners('response');
                        //await page.setRequestInterception(true);
                       

                        await page.on('response', async (resp) => {
                            let url = resp.url()
                            let productInfo1, productInfo2
                            try {
                                if (resp.url().includes('/api/v4/anti_fraud/captcha/generate') && resp.status() == 200) {

                                    console.log('Xử lý captcha');
                                    const imgCaptcha = await page.waitForXPath('//img[@draggable="false"]');
                                    if (imgCaptcha) {
                                        await imgCaptcha.screenshot({ path: 'captcha.png' });
                                        var data = new FormData();
                                        data.append('image', fs.createReadStream('captcha.png'));
                                        axios_config = {
                                            method: 'POST',
                                            url: 'https://captcha.sacuco.com/captcha/shoppe',
                                            headers: {
                                                ...data.getHeaders()
                                            },
                                            data: data
                                        };
                                        await axios(axios_config).then(async function (response) {
                                            const pixels = response.data.split(' ');
                                            if (pixels.length == 4) {
                                                const whirl_position = pixels[2] - 2;
                                                console.log('Kéo captcha: ' + whirl_position);
                                                const sliderHandle = await page.waitForXPath('//div[@style="width: 40px; height: 40px; transform: translateX(0px);"]');
                                                if (sliderHandle) {
                                                    const handle = await sliderHandle.boundingBox();
                                                    let currentPosition = handle.width / 2;
                                                    await page.mouse.move(
                                                        handle.x + currentPosition,
                                                        handle.y + handle.height / 2
                                                    );
                                                    await page.mouse.down();
                                                    while (currentPosition < whirl_position) {
                                                        currentPosition += 1;
                                                        await page.mouse.move(
                                                            handle.x + currentPosition,
                                                            handle.y + handle.height / 2
                                                        );
                                                    }
                                                    await page.waitForTimeout(1000);
                                                    page.mouse.up();
                                                }
                                            }
                                        }).catch(function (error) {
                                            console.log(error);
                                        });
                                        await page.waitForTimeout(3000)
                                    }

                                }

                                let checkUrlShop = url.split("shop/get_shop_base")


                                if (checkUrlShop.length > 1) {
                                    console.log("-- Sự kiện lấy thông tin shop --")
                                    productInfo1 = await resp.json()
                                    productInfo2 = productInfo1.data
                                    if (productForUser.shop_id == productInfo2.shopid) {
                                        shopInfo3.avatar = productInfo2.account.portrait
                                        shopInfo3.username = productInfo2.account.username
                                        shopInfo3.name = productInfo2.name
                                        shopInfo3.shop_id = productInfo2.shopid
                                        shopInfo3.followed = productInfo2.followed
                                        console.log(moment().format("hh:mm:ss") + " - Thông tin Shop ")
                                        console.log(shopInfo3)
                                    }
                                }


                                let check_add_to_cart = url.split("api/v4/cart/add_to")
                                if (check_add_to_cart.length > 1) {

                                    let check = await resp.json()
                                    if (check.error == 0) {
                                        check_add_cart = true
                                    } else {
                                        check_add_cart = false
                                    }

                                    console.log(moment().format("hh:mm:ss") + " - Kiểm tra bỏ giỏ: " + check_add_cart)
                                }

                                let checkUrlproduct = url.split("search/search_items?by=relevancy&keyword=")
                                if (checkUrlproduct.length > 1) {

                                    productInfo1 = await resp.json()

                                    // console.log(productInfo1)
                                    if (productInfo1.items) {
                                        productInfo2 = productInfo1.items

                                        console.log(moment().format("hh:mm:ss") + " - Tổng sản phẩm trên trang: " + productInfo2.length + " -- " + productInfo2[0].itemid)


                                        productInfo2.forEach((item, index) => {
                                            if (item.itemid == productForUser.product_id && (item.ads_keyword == null)) {

                                                viTriSanPhamTrang1 = index + 1
                                                url_trang_tim_kiem_san_pham = url
                                                //console.log("url_trang_tim_kiem_san_pham: " + url_trang_tim_kiem_san_pham)
                                                console.log(moment().format("hh:mm:ss") + " - Tìm thấy vị trí sản phẩm trên trang: " + viTriSanPhamTrang1 + " Keyword : " + productForUser.keyword)

                                            }
                                        })
                                    }

                                }

                                let checkSerachShop = url.split("api/v4/search/search_items?")
                                // if (checkSerachShop.length > 1) {
                                //     try {
                                //         console.log(" -- Tìm vị trí sản phẩm chưa thả tim  --")
                                //         productInfo1 = await resp.json()
                                //         productInfo2 = productInfo1.items
                                //         //danh_sach_san_pham_chua_tha_tim = []
                                //         productInfo2.forEach((item, index) => {
                                //             if (item.shopid == productForUser.shop_id && (item.item_basic.liked == false)) {
                                //                 let pr = {
                                //                     product_id: item.itemid,
                                //                     product_link: "",
                                //                     product_name: item.item_basic.name,
                                //                     product_image: item.item_basic.image,
                                //                 }
                                //                 danh_sach_san_pham_chua_tha_tim.push(pr)
                                //             }
                                //         })
                                //     } catch (error) {

                                //         console.log("---- Không có sản phẩm chưa thả tim ----")
                                //     }
                                // }


                                check_link_san_pham = url.split("item/get?itemid=" + productForUser.product_id)
                                if (check_link_san_pham.length > 1) {

                                    try {
                                        let productInfo1 = await resp.json()
                                        productInfo2 = productInfo1.data
                                        productForUser.product_image = ""
                                        productForUser.product_image = productInfo2.image
                                        productForUser.liked = productInfo2.liked


                                    } catch (error) {
                                        check_product_exit = "Không tồn tại"
                                        console.log(moment().format("hh:mm:ss") + " - Sản phẩm không tồn tại")
                                    }
                                }

                                check_like_action = url.split("https://shopee.vn/api/v4/pages/like_items")
                                if (check_like_action.length > 1) {
                                    console.log(" --- Kiểm tra hành động like ---");
                                    try {
                                        let productInfo1 = await resp.json()
                                        check_like = productInfo1

                                    } catch (error) {
                                        await updateErrorLogs(error, slavenumber)
                                        console.log("---- Like thât bại ----")
                                    }
                                }

                                check_follow_action = url.split("https://shopee.vn/api/v4/shop/follow")
                                if (check_follow_action.length > 1) {
                                    console.log(" --- Kiểm tra hành động follow ---");
                                    try {
                                        let productInfo1 = await resp.json()
                                        check_follow = productInfo1

                                    } catch (error) {
                                        await updateErrorLogs(error, slavenumber)
                                        console.log("---- follow thât bại ----")
                                    }
                                }
                            } catch (error) {
                                console.log(error)
                                await updateErrorLogs(error, slavenumber)
                            }
                        });

                        productForUser.slave = slavenumber
                        let newIp = await publicIp.v4()
                        productForUser.ip = proxy.proxy_ip;
                        productForUser.local_ip = ip_address.address()
                        console.log("Local IP: " + productForUser.local_ip);
                        console.log("Ip mới: " + proxy.proxy_ip)
                        console.log("Shop id: " + productForUser.shop_id)
                        console.log("product link: " + productForUser.product_link)
                        console.log("product name: " + productForUser.product_name)
                        console.log("product id: " + productForUser.product_id)
                        console.log("Từ khoá: " + productForUser.keyword)

                        // if (data_report_shop == 1) {
                        //     result_report = 0
                        //     check_report = 0

                        //     if (Number(data_report_shop.report_number) > Number(data_report_shop.report_count)) {
                        //         console.log(moment().format("hh:mm:ss") + " - REPORT SHOP")
                        //         check_report = await action_report_shop(page, data_report_shop)
                        //         if (check_report == 1) {
                        //             result_report = result_report + 1
                        //         }
                        //     }

                        //     console.log(moment().format("hh:mm:ss") + " - Kết quả report")
                        //     if (result_report) {
                        //         console.log("Cập nhật action:  report_shop")
                        //         productForUser.action = "report_shop"
                        //         productForUser.result = result_report
                        //         productForUser.report_id = data_report_shop.id

                        //         await updateActions(productForUser, 10)
                        //     }
                        // }
                        timeout = Math.floor(Math.random() * (6000 - 5000)) + 5000;
                        await page.waitForTimeout(timeout)

                        check_point = await check_point_hour(productForUser.uid)
                        if (check_point) {
                            console.log(moment().format("hh:mm:ss") + " - TÌM KIẾM SẢN PHẨM")
                            await searchKeyWord(page, productForUser.keyword)
                        } else {
                            break
                        }


                        cookies22 = await browser.cookies()

                        productForUser.cookie = cookies22
                        productForUser.user_agent = user_agent
                        productForUser.user_lang = user_lang
                        cookie1 = ""

                        cookies22.forEach((row, index) => {
                            cookie1 = cookie1 + row.name + "=" + row.value
                            if (index != (cookies22.length - 1)) {
                                cookie1 = cookie1 + "; "
                            }
                        })
                        let result_check = true
                        let trang_vi_tri_san_pham = false

                        try {
                            await page.waitForSelector(".shopee-search-item-result__items", {
                                timeout: 60000
                            })
                        } catch (error) {
                            console.log(moment().format("hh:mm:ss") + " - Không tìm thấy kết quả sản phẩm")
                            result_check = false
                            // await browser.close()
                            // return
                        }
                        // console.log(moment().format("hh:mm:ss") + " - Shopee search result")
                        if (result_check) {
                            console.log(moment().format("hh:mm:ss") + " - Tìm thấy kết quả sản phẩm")
                            let getProductPageTotal
                            try {
                                getProductPageTotal = await page.evaluate(() => {
                                    // Class có link bài đăng trên profile          
                                    let titles = document.querySelectorAll('.shopee-mini-page-controller__total')[0].textContent;
                                    return titles
                                })
                            } catch (error) {
                                console.log(error)
                                getProductPageTotal = 3
                            }

                            maxPage = parseInt(getProductPageTotal)
                            if (maxPage > 10 || maxPage == undefined) {
                                maxPage = 5
                            }

                            console.log(moment().format("hh:mm:ss") + " - Tổng số trang kết quả tìm kiếm: " + maxPage)


                            if (productForUser.check_index < 6) {

                                let keyword_1 = productForUser.keyword.toLowerCase()

                                //------------------------------- Tìm vị trí sản phẩm ----------------------------------//
                                try {
                                    for (let i = 1; i <= maxPage; i++) {
                                        check_btn_next = await page.$$(".shopee-button-outline.shopee-mini-page-controller__next-btn")
                                        console.log("tìm trên trang: " + i)
                                        if (check_btn_next.length) {
                                            await check_btn_next[0].click()
                                            await page.waitForTimeout(5000)
                                        }
                                        

                                        if (viTriSanPhamTrang1 != false) {
                                            productForUser.trang = i
                                            productForUser.vitri = viTriSanPhamTrang1

                                            console.log(moment().format("hh:mm:ss") + " - Update kết quả vị trí sản phẩm: " + viTriSanPhamTrang1)
                                            productForUser.cookie = ""
                                            await axios.get(shopee_update_seo_san_pham_url, {
                                                params: {
                                                    data: {
                                                        dataToServer: productForUser,
                                                    }
                                                },
                                                timeout: 5000
                                            })
                                                .then(function (response) {
                                                    console.log(moment().format("hh:mm:ss") + " - " + response.data)
                                                })
                                                .catch(function (error) {
                                                    console.log(moment().format("hh:mm:ss") + " - Cập nhật SEO Sản phẩm thất bại")
                                                })

                                            break;
                                        }

                                    }
                                } catch (error) {
                                    console.log(error)
                                }



                                if (trang_vi_tri_san_pham > 1) {
                                    pageUrl = trang_vi_tri_san_pham - 1
                                    urlSearch = "https://shopee.vn/search?keyword=" + productForUser.keyword + "&page=" + pageUrl
                                } else {

                                    urlSearch = "https://shopee.vn/search?keyword=" + productForUser.keyword
                                }
                                console.log(moment().format("hh:mm:ss") + " -  Đến trang có vị trí sản phẩm")

                                urlSearch = encodeURI(urlSearch)
                                productForUser.urlSearch = urlSearch
                                try {
                                    let ref = await page.url()
                                    await page.goto(urlSearch, {
                                        referer: ref
                                    })

                                } catch (error) {
                                    await updateErrorLogs(error, slavenumber)
                                    console.error(error);
                                }
                                timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                                await page.waitForTimeout(timeout)
                                console.log(moment().format("hh:mm:ss") + " - Vị trí sản phẩm: " + productForUser.product_name + " -- " + productForUser.product_id + ":  " + viTriSanPhamTrang1)
                                // console.log(getViTriSanPham)

                                if (viTriSanPhamTrang1 != false) {

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
                                        await productsAll[viTriSanPhamTrang1 - 1].click()
                                    } catch (error) {
                                        await updateErrorLogs(error, slavenumber)
                                        try {
                                            await page.goto(productForUser.product_link, {
                                            });

                                        } catch (err) {
                                            //HERE
                                            console.error(err);
                                            await updateErrorLogs(err, slavenumber)
                                        }
                                    }
                                }
                            }
                        }



                        // nếu ko tìm thấy vị trí sp
                        if (trang_vi_tri_san_pham == false) {
                            productForUser.trang = 0
                            productForUser.vitri = 0
                            productForUser.cookie = ""
                            await axios.get(shopee_update_seo_san_pham_url, {
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
                            //continue

                            try {
                                await page.goto(productForUser.product_link);
                            } catch (error) {
                                console.log(error.message);
                                await updateErrorLogs(error, slavenumber)
                            }
                        }

                        //if (check_product_exit === "Có tồn tại") {
                        try {
                            await page.waitForSelector('.shopee-input-quantity', {
                                timeout: 10000
                            })

                        } catch (error) {
                            console.log(moment().format("hh:mm:ss") + " - Sản phẩm không tồn tại")
                            productForUser.action = "search"
                            productForUser.product_not_exist = 1
                            await updateActions(productForUser, 10)

                            console.log(error)
                            await browser.close()
                            return
                        }



                        try {
                            let check_action
                            let check_confirm = await page.$(".shopee-alert-popup__btn")
                            if (check_confirm) {
                                await check_confirm.click()
                            }
                            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                            await page.waitForTimeout(timeout)

                            let cookie1 = ''
                            cookies22 = await browser.cookies()
                            cookies22.forEach((row, index) => {
                                cookie1 = cookie1 + row.name + "=" + row.value
                                if (index != (cookies22.length - 1)) {
                                    cookie1 = cookie1 + "; "
                                }
                            })

                            productForUser.cookie = await browser.cookies()
                            //   productForUser.cookie = cookie1

                            productForUser.action = "search"
                            await updateActions(productForUser, 10)

                            //productForUser.cookie = ""
                            // productForUser.action = "view_product"                                
                            // await updateActions(productForUser, 10)

                            console.log(moment().format("hh:mm:ss") + " -  Xem ảnh sản phẩm")
                            check_point = await check_point_hour(productForUser.uid)
                            if (check_point) {
                                await action_view_product(page)
                            } else {
                                break
                            }

                            if (options.view_review) {
                                console.log(moment().format("hh:mm:ss") + " -  Xem review")

                                check_point = await check_point_hour(productForUser.uid)
                                if (check_point) {
                                    await action_view_review(page)
                                } else {
                                    break
                                }

                                action1 = {
                                    time: new Date(),
                                    action: "view_review"
                                }
                                actions.push(action1)
                                productForUser.action = "view_review"
                                await updateActions(productForUser, 10)
                            }

                            console.log(moment().format("hh:mm:ss") + " -  Check thả tim sản phẩm: " + productForUser.liked)

                            if (options.heart_product) {
                                if (productForUser.liked == false) {

                                    check_point = await check_point_hour(productForUser.uid)
                                    if (check_point) {
                                        random_like = Math.floor(Math.random() * 4);
                                        check_like = await action_heart_product_api(browser, page, productForUser)
                                        console.log(moment().format("hh:mm:ss") + " -  thả tim sản phẩm: " + check_like.error)

                                        if (check_like.error == 0) {
                                            productForUser.action = "heart_product"
                                            await updateActions(productForUser, 10)
                                        }
                                    } else {
                                        break
                                    }
                                }
                            }

                            if (options.add_cart) {
                                check_point = await check_point_hour(productForUser.uid)
                                if (check_point) {
                                    random_add_cart = Math.floor(Math.random() * 4);

                                    await action_add_cart(page, productForUser)
                                    console.log(moment().format("hh:mm:ss") + "- Bỏ giỏ - " + productForUser.product_id + " - " + productForUser.keyword + " : " + check_add_cart)

                                    if (check_add_cart) {
                                        productForUser.action = "add_cart"
                                        await updateActions(productForUser, 10)
                                    } else {
                                        console.log(productForUser.product_link)
                                    }
                                } else {
                                    break
                                }
                            }

                            if (options.view_shop) {
                                console.log(moment().format("hh:mm:ss") + " -  Xem shop ")
                                let productLink = await page.url()

                                check_point = await check_point_hour(productForUser.uid)
                                if (check_point) {
                                    await action_view_shop(page, productLink, productForUser)
                                } else {
                                    break
                                }
                                productForUser.shopAvatar = shopInfo3.avatar
                                productForUser.shopName = shopInfo3.name
                                productForUser.shopUserName = shopInfo3.username

                                action1 = {
                                    time: new Date(),
                                    action: "view_shop"
                                }
                                actions.push(action1)
                                productForUser.action = "view_shop"
                                await updateActions(productForUser, 10)

                                // if (danh_sach_san_pham_chua_tha_tim.length > 5) {

                                //     console.log("--- Thả tim các sản phẩm của shop ---")
                                //     // console.log(danh_sach_san_pham_chua_tha_tim)
                                //     random_heart = Math.floor(Math.random() * (5 - 3)) + 3;

                                //     for (let i = 0; i <= random_heart; i++) {
                                //         let product_heart = productForUser
                                //         product_heart.product_link = ""
                                //         product_heart.keyword = ""
                                //         product_heart.id = null
                                //         product_heart.product_name = danh_sach_san_pham_chua_tha_tim[i].product_name
                                //         product_heart.product_id = danh_sach_san_pham_chua_tha_tim[i].product_id
                                //         product_heart.product_image = danh_sach_san_pham_chua_tha_tim[i].product_image

                                //         console.log("Thả tim sản phẩm: " + product_heart.product_id)
                                //         check_action = await action_heart_product(page, product_heart)

                                //         action1 = {
                                //             time: new Date(),
                                //             action: "heart_product"
                                //         }
                                //         if (check_action.error == null) {
                                //             actions.push(action1)
                                //             product_heart.action = "heart_product"
                                //             //console.log(product_heart)
                                //             await updateActions(product_heart)
                                //         }
                                //     }
                                // }
                            }

                            if (options.follow_shop) {
                                refer = await page.url()
                                shopId = parseInt(productForUser.shop_id)
                                let check1 = shopInfo3.followed
                                console.log(moment().format("hh:mm:ss") + " -  check follow shop: " + check1)

                                if (check1 == false) {
                                    check_point = await check_point_hour(productForUser.uid)
                                    if (check_point) {
                                        random_follow = Math.floor(Math.random() * 4);
                                        // check_follow = await shopeeApi.followShop(cookies22, refer, shopId)
                                        await action_follow_shop(page)

                                        if (check_follow.error == 0) {
                                            console.log(moment().format("hh:mm:ss") + " -  follow shop thành công ")
                                            productForUser.action = "follow_shop"
                                            await updateActions(productForUser, 10)
                                        }
                                        await page.waitForTimeout(1000);
                                    } else {
                                        break
                                    }
                                }
                            }
                        } catch (error) {
                            console.log(error)
                            await updateErrorLogs(error, slavenumber)
                        }
                        //   }

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
            console.log(moment().format("hh:mm:ss") + " -  ----------- Kết thúc tương tác Tab: " + index)
        } catch (error) {
            console.log(error)
            await updateErrorLogs(error, slavenumber)
        }

        await browser.close();
        if (os_slave == "LINUX") {
            console.log(moment().format("hh:mm:ss") + " PM2 restart ")
            shell.exec('pm2 restart all');
        }
    })
};



//Cron 1 phút 1 lần 

//(async () => {
if (mode === "DEV") {
    (async () => {

       

        if (os_slave == "LINUX") {
            shell.exec('pm2 flush');
            shell.exec('rm ~/.pm2/pm2.log');
            //    shell.exec('a-kill.bat');
            shell.exec('rm -rf ' + profileDir);
            
        } else {
            shell.exec('Rmdir /S /q ' + profileDir);
        }

        await runAllTime()

    })();
} else {

    (async () => {

       

        if (os_slave == "LINUX") {
            shell.exec('rm -f core.*');
            shell.exec('pm2 flush');
            shell.exec('rm ~/.pm2/pm2.log');
            //shell.exec('a-kill.bat');
            shell.exec('rm -rf ' + profileDir);
        } else {
            shell.exec('Rmdir /S /q ' + profileDir);
           
        }

        await runAllTime()


    })();
}


//})();