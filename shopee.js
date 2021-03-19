require('dotenv').config();
var fs = require('fs');
const axios = require('axios').default;
const puppeteer = require('puppeteer');
var cron = require('node-cron');
var randomMac = require('random-mac');

const exec = require('child_process').exec;
const { spawn } = require('child_process');
const randomUseragent = require('random-useragent');
const publicIp = require('public-ip');

slavenumber = process.env.SLAVE
clickAds = process.env.CLICKADS
typeClick = process.env.TYPECLICK
clickSanPham = process.env.CLICK_SAN_PHAM
lienQuan = process.env.LIEN_QUAN
chromiumDir = process.env.CHROMIUM_DIR                     // Đường dẫn thư mục chromium sẽ khởi chạy
let profileDir = process.env.PROFILE_DIR
let extension = process.env.EXTENSION
let dcomVersion = process.env.DCOM
phobien = process.env.PHO_BIEN         //Chế độ chạy phổ biến
// Danh sách profile fb trong file .env
maxTab = process.env.MAXTAB_SHOPEE                           // Số lượng tab chromium cùng mở tại 1 thời điểm trên slave
// Danh sách profile facebook trong mỗi slave
mode = process.env.MODE

if (mode === "DEV") {
    apiUrl = "http://hotaso.tranquoctoan.com"
} else {
    apiUrl = "http://hotaso.vn"
}


linkShopeeUpdate = apiUrl + "/api_user/shopeeupdate"     // Link shopee update thứ hạng sản phẩm
linkShopeeAccountUpdate = apiUrl + "/api_user/shopeeAccountUpdate" // Link update account shopee status
linkShopeeUpdateAds = apiUrl + "/api_user/shopeeUpdateAds" // Link update shopee ads index
dataShopeeDir = apiUrl + "/api_user/dataShopee"     // Link shopee update thứ hạng sản phẩm
shopeeUpdateSeoSanPhamDir = apiUrl + "/api_user/shopeeUpdateSeoSanPham"     // Link shopee update seo sản phẩm
updateActionsDir = apiUrl + "/api_user/updateActions"     // Update actions
checkActionsDir = apiUrl + "/api_user/checkActions"     // check actions
getShopActionsDir = apiUrl + "/api_user/getShopActions"     // check actions
getSlaveAccountDir = apiUrl + "/api_user/getSlaveAccount"     // check actions

if (mode === "DEV") {
    timemax = 5000;
    timemin = 3000;
} else {
    timemax = 5000;
    timemin = 3000;
}
logs = 1
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
    if ((savedid.length + maxTab) >= (listAccounts.length - 1)) {  // reset file saveid về trống khi số lượng đã bằng với số lượng tk của trường PROFILE trong file .ENV
        savedid = [];
        fs.writeFileSync('saveidshopee.txt', savedid.toString())
    }
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
        fs.writeFileSync('saveidshopee.txt', savedid.toString())
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
        loginclass = await page.$$('.navbar__link--account');
        if (loginclass.length) {
            await loginclass[1].click()
        } else {
            console.log("Không tìm thấy nút login")
            return 0
        }

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
        timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000;
        await page.waitFor(timeout)
        const loginbutton = await page.$$('div>button:nth-child(4)');
        if (loginbutton.length) {
            await loginbutton[0].click()
        }
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitFor(15000)
        checkcode = await page.$$('[autocomplete="one-time-code"]')

        var AllAccounts = fs.readFileSync("shopee.txt", { flag: "as+" });
        if (AllAccounts) {
            AllAccounts = AllAccounts.toString();
            AllAccounts = AllAccounts.split("\n")
        } else {
            AllAccounts = []
        }

        if (checkcode.length) {
            // Xoá account trong shopee.txt
            accountText = accounts[0] + "\t" + accounts[1]
            indexAccount = AllAccounts.indexOf(accountText)
            AllAccounts.splice(indexAccount, 1)

            AllAccounts.forEach((acc, index) => {
                if (index == 0 && acc != "") {
                    fs.writeFileSync("shopee.txt", acc + "\n")
                } else if (acc != "" && index == (AllAccounts.length - 1)) {
                    fs.appendFileSync('shopee.txt', acc)
                }
                else if (acc != "") {
                    fs.appendFileSync('shopee.txt', acc + "\n")
                }
            })
            console.log("account bi hỏi mã")
            fs.appendFileSync('accountBlock.txt', 'Account bi hỏi mã' + "\n")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n")

            return false
        }

        checkblock = await page.$('[role="alert"]')
        if (checkblock) {
            console.log("account bị block")
            accountText = accounts[0] + "\t" + accounts[1]
            indexAccount = AllAccounts.indexOf(accountText)
            AllAccounts.splice(indexAccount, 1)

            AllAccounts.forEach((acc, index) => {
                if (index == 0 && acc != "") {
                    fs.writeFileSync("shopee.txt", acc + "\n")
                } else if (acc != "" && index == (AllAccounts.length - 1)) {
                    fs.appendFileSync('shopee.txt', acc)
                }
                else if (acc != "") {
                    fs.appendFileSync('shopee.txt', acc + "\n")
                }
            })
            fs.appendFileSync('accountBlock.txt', 'Account bị khoá' + "\n")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n")
            await deleteProfile(accounts[0])
            return false
        }

        try {
            await page.waitForSelector('.shopee-searchbar-input');
        } catch (error) {
            accountText = accounts[0] + "\t" + accounts[1]
            indexAccount = AllAccounts.indexOf(accountText)

            AllAccounts.splice(indexAccount, 1)
            AllAccounts.forEach((acc, index) => {
                if (index == 0 && acc != "") {
                    fs.writeFileSync("shopee.txt", acc + "\n")
                } else if (acc != "" && index == (AllAccounts.length - 1)) {
                    fs.appendFileSync('shopee.txt', acc)
                }
                else if (acc != "") {
                    fs.appendFileSync('shopee.txt', acc + "\n")
                }
            })
            console.log("account bị block")
            fs.appendFileSync('accountBlock.txt', 'Account bi khoá' + "\n")
            fs.appendFileSync('accountBlock.txt', accounts[0] + "\t" + accounts[1] + "\n")
            await deleteProfile(accounts[0])
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
            if ((index < 45) && (index > 4)) {
                idShops.forEach((shop, index2) => {
                    productIds = item.includes(shop.fullname)
                    if (productIds == true) {
                        if (!saveProduct.includes(productIds[1])) {
                            productIds2 = item.split(shop.fullname + ".")
                            productId = productIds2[1]
                            productIndex = index;
                            thuHangSanPham = {
                                sanpham: getProduct[productIndex],
                                id: productId,
                                shopId: shop.fullname,
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

getproductByProductId = async (page, product) => {
    try {
        let thuHangSanPham
        // Next dến trang có vị trí cũ của sản phẩm
        product_page = product.product_page
        product_index = product.product_index

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

        getProduct = []
        // Lấy vị trí sản phẩm theo id sản phẩm
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
        let page_link = await page.url()
        product_page2 = page_link.split("&page=")[1]
        if (product_page2 == undefined) {
            product_page2 = 0
        }

        let productIds

        getProduct.forEach((item, index) => {
            if ((index < 45) && (index > 4)) {
                productIds = item.split(product.product_id)
                if (productIds.length == 2) {
                    productId = product.id
                    productIndex = index;
                    thuHangSanPham = {
                        id : product.id,
                        sanpham: product.product_name,
                        product_id: product.product_id,
                        shopId: product.shop_id,
                        trang: product_page2,
                        vitri: productIndex
                    }
                    return true
                }
            }
        })
        if (product.max_page == 0 || product.max_page == null) {
            product.max_page = 3
        }
        if (thuHangSanPham) {
            return thuHangSanPham;
        } else {
            if (product_page2 == product.max_page) {
                thuHangSanPham = {
                    id : product.id,
                    sanpham: product.product_name,
                    product_id: product.product_id,
                    shopId: product.shop_id,
                    trang: "Not",
                    vitri: "Not"
                }
                return thuHangSanPham;
            }
            next = await page.$$('.shopee-icon-button--right')
            if (next.length) {
                await next[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout);
                return await getproductByProductId(page, product)
            }
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

getproductByOldIndex = async (page, product) => {
    try {
        console.log("------ Tìm sản phẩm theo vị trí cũ ------")
        let thuHangSanPham
        // Next dến trang có vị trí cũ của sản phẩm
        product_page = product.product_page
        product_index = product.product_index
        check_page = Math.floor(product_page / 5)

        if (check_page > 1)
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

        getProduct = []
        // Lấy vị trí sản phẩm theo id sản phẩm
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
        let page_link = await page.url()
        product_page2 = page_link.split("&page=")[1]
        if (product_page2 == undefined) {
            product_page2 = 0
        }

        let productIds

        getProduct.forEach((item, index) => {
            if ((index < 45) && (index > 4)) {
                productIds = item.split(product.product_id)
                if (productIds.length == 2) {
                    productId = product.id
                    productIndex = index;
                    thuHangSanPham = {
                        sanpham: product.product_name,
                        id: productId,
                        shopId: product.shop_id,
                        trang: product_page2,
                        vitri: productIndex
                    }
                    return true
                }
            }
        })

        if (thuHangSanPham) {
            return thuHangSanPham;
        } else {
            if (product_page2 == 99) {
                thuHangSanPham = {
                    sanpham: product.product_name,
                    id: productId,
                    shopId: product.shop_id,
                    trang: "Not",
                    vitri: "Not"
                }
                return thuHangSanPham;
            }

        }

    } catch (error) {
        console.log(error)
        return false
    }
}

getproductAds = async (page, idShops, limit) => {
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
        // tìm vị trí sản phẩm ads có id shop
        let productIds
        for (let i = 0; i <= 4; i++) {
            idShops.forEach((shop) => {
                productIds = getProduct[i].includes(shop)
                if (productIds == true) {
                    productIndexs.push(i)
                }
            })
        }

        for (let i = 45; i <= 49; i++) {
            idShops.forEach((shop) => {
                if (getProduct[i]) {
                    productIds = getProduct[i].includes(shop)
                    if (productIds == true) {
                        productIndexs.push(i)
                    }
                }
            })
        }
        if (limit == 0) {
            return productIndexs
        } else {
            limit -= 1;
            next = await page.$$('.shopee-icon-button--right')
            if (next.length) {
                await next[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout);
                return await getproductAds(page, idShops, limit)
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

getproductAdsDaLoaiTru = async (page, idShops) => {
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
        // tìm vị trí sản phẩm ads có id shop
        let productIds
        for (let i = 0; i <= 4; i++) {
            checkshop = 0
            idShops.forEach((shop) => {
                productIds = 0
                productIds = getProduct[i].includes(shop)
                if (productIds == true) {
                    checkshop = 1
                }
            })
            if (checkshop == 0) {
                productIndexs.push(i)
            }
        }
        productIds = 0

        for (let i = 45; i <= 49; i++) {
            checkshop = 0
            idShops.forEach((shop) => {
                productIds = 0
                if (getProduct[i]) {
                    productIds = getProduct[i].includes(shop)
                    if (productIds == true) {
                        checkshop = 1
                    }
                }
            })
            if (checkshop == 0) {
                productIndexs.push(i)
            }
        }


        return productIndexs
    } catch (error) {
        console.log(error)
        return false
    }
}

getproductAdsClickShop = async (page, idShops, limit) => {
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
        // tìm vị trí sản phẩm có id shop cần click
        let productIds
        for (let i = 0; i <= 4; i++) {
            idShops.forEach((shop) => {
                if (getProduct[i]) {
                    productIds = getProduct[i].includes(shop)
                    if (productIds == true) {
                        productIndexs.push(i)
                    }
                }
            })
        }

        for (let i = 45; i <= 49; i++) {
            idShops.forEach((shop) => {
                if (getProduct[i]) {
                    productIds = getProduct[i].includes(shop)
                    if (productIds == true) {
                        productIndexs.push(i)
                    }
                }
            })
        }

        if (productIndexs.length) {
            return productIndexs;
        }


        if (limit == 0) {
            console.log("Đây là trang tìm kiếm cuối cùng")
            return false
        } else {
            limit -= 1;
            next = await page.$$('.shopee-icon-button--right')
            if (next.length) {
                await next[0].click()
                timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                await page.waitFor(timeout);
                return await getproductAds(page, idShops, limit)
            } else {
                console.log("Đây là trang kết quả cuối cùng")
                return false
            }
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

getproductAdsLienQuan = async (page, idShops) => {
    try {
        xxx = await page.waitForSelector('[data-sqe="link"]')
        console.log("Tổng số sản phẩm tương tự" + xxx.length)
        listProductAdsIndex = await page.evaluate((shops) => {
            // Class có link bài đăng trên profile          
            let titles = document.querySelectorAll('[data-sqe="link"]');

            listProductAds = []
            if (titles.length) {
                titles.forEach((item, index) => {
                    if (index > 23) {
                        if (item.children[0].children[0].children[3]) {
                            // xác định vị trí ads
                            if (item.children[0].children[0].children[3].children[0]) {
                                checkShop = 0
                                //Loại trừ shop
                                shops.forEach((shop) => {
                                    if (item.href.includes(shop) == true) {
                                        checkShop++
                                    }
                                })
                                if (checkShop == 0) {
                                    listProductAds.push(index)
                                }
                            }
                        }
                    }
                })

            }
            return listProductAds
        }, idShops)

        return listProductAdsIndex
    } catch (error) {
        console.log(error)
        return false
    }
}

// chọn thuộc tính sản phẩm
chooseVariation = async (page, limit) => {
    try {
        console.log("---- Chọn ngẫu nhiên phân loại sản phẩm ----")
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
            varitation = Math.floor(Math.random() * (varitations.length - 1))
            if (varitations[varitation]) {
                await varitations[varitation].click()
            }
        }

        checkSelected = await page.$$('.product-variation--selected')

        if (checkSelected.length) {
            return true
        } else {
            chooseVariation(page, limit)
        }
    } catch (error) {
        fs.appendFileSync('error.txt', "\n" + "chooseVariation error")
        fs.appendFileSync('error.txt', error.toString() + "\n")
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
                if (allmedia[randomDown2]) {
                    await allmedia[randomDown2].click()
                }
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
        if (allRview[randomReview1]) {
            await allRview[randomReview1].click()
        }
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
                if (allmedia[randomDown2]) {
                    await allmedia[randomDown2].click()
                }
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


checkAtions = async (action, product) => {
    datacheck = product
    datacheck.action = action

    try {
        let datatest = await axios.get(checkActionsDir, {
            params: {
                data: {
                    dataToServer: datacheck,
                }
            }
        })
        checkAtion = datatest.data
        console.log(checkAtion)
        console.log("check action: " + action + ":" + checkAtion)
    } catch (error) {
        console.log(error)
        //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
    }

    return checkAtion
}

updateAtions = async (action, product) => {
    dataupdate = product
    dataupdate.action = action
    
    update = 0
    try {
        let datatest = await axios.get(updateActionsDir, {
            params: {
                data: {
                    dataToServer: dataupdate,
                }
            }
        })
        update = datatest.data
        console.log(update)
        console.log("update action: " + action + ":" + update)
    } catch (error) {
        console.log(error)
        //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
    }

    return update
}

viewShop = async (page, url) => {
    console.log("---- View shop ----")
    await page.goto(url)
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitFor(timeout)
    viewShopClick = await page.$$('.shopee-avatar__placeholder')
    viewShopClick[1].click()
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitFor(timeout)

    randomDown = Math.floor(Math.random() * (5 - 3)) + 3;
    for (i = 0; i < randomDown; i++) {
        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
        await page.waitFor(timeout)
        await page.keyboard.press('PageDown');
    }
    timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    await page.waitFor(timeout)
    await page.keyboard.press('Home');
}

heartProduct = async (page) => {

}

heartShop = async (page) => {

}

followShop = async (page) => {

}



actionShopee = async (page, options, product) => {
    await page.waitForSelector('.product-briefing')
    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
    await page.waitFor(timeout)
    await page.click('.product-briefing>div>div>div');

    // xem ngẫu nhiên n ảnh sản phẩm
    console.log("---- Xem ảnh sản phẩm ----")
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

    if (options.heart_product) {
        check1 = await checkAtions("heart_product", product)
        if (!check1) {
            console.log("Thả tim sản phẩm: " + options.heart_product)
            heartClick = await page.$$('.justify-center>.flex.items-center>svg')
            if (heartClick.length) {
                await heartClick[0].click()
                await updateAtions("heart_product", product)
            }
        }

    }

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
    console.log(options)
    if (options.view_review) {
        console.log("---- Xem review ----")
        await viewReview(page)
        await updateAtions("view_review",product)
        await page.waitFor(timeout)
    }

    await page.keyboard.press('Home');

    if (options.add_cart) {
        console.log("Chọn màu sản phẩm và thêm vào giỏ hàng")
        // click chọn màu
        let checkVariation = chooseVariation(page, 5)
        if (checkVariation) {

            // click thêm vào giỏ hàng
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await page.waitFor(timeout)
            addToCard = await page.$$('.btn-tinted')
            await addToCard[0].click()
            console.log("Thêm vào giỏ hàng")
            timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
            await updateAtions("add_cart", product)
            await page.waitFor(timeout)

        } else {
            console.log("Không chọn được mẫu mã")
            return false
        }
    }

}

removeCart = async (page) => {
    // check đầy giỏ hàng
    console.log("---- Xoá sản phẩm khỏi giỏ hàng ----")
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
            checkcart2 = await page.$$('.btn.btn-solid-primary.btn--m.btn--inline.shopee-alert-popup__btn')
            if (checkcart2.length) {
                await checkcart2.click()
            } else {
                break
            }
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
        }
    }
}

orderProduct = async (page, productInfo) => {
    console.log("---- Đặt hàng ----")
    linksp = await page.url()
    productInfo.linkNow = linksp

    fs.appendFileSync('logs.txt', "\n" + "Order: " + "\n" + JSON.stringify(productInfo, null, 4))
    // check đầy giỏ hàng
    // await page.goto("https://shopee.vn/")    
    // await page.waitFor(29999)
    // await page.goto("https://shopee.vn/V%C3%AD-n%E1%BB%AF-mini-cao-c%E1%BA%A5p-ng%E1%BA%AFn-cute-nh%E1%BB%8F-g%E1%BB%8Dn-b%E1%BB%8F-t%C3%BAi-th%E1%BB%9Di-trang-gi%C3%A1-r%E1%BA%BB-VD70-i.19608398.1406593363")
    // await chooseVariation(page)
    // timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000;
    // await page.waitFor(timeout)
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
        await page.waitFor(timeout)
        buttonBy2 = await page.$$('.shopee-button-solid--primary')
        if (buttonBy2.length) {
            await buttonBy2[0].click()
        } else {
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (2500 - 2000)) + 2000;
            await page.waitFor(timeout)
            buttonBy2 = await page.$$('.shopee-button-solid--primary')
            if (buttonBy2.length) {
                await buttonBy2[0].click()
            } else {
                console.log("Không tìm thấy nút mua hàng")
            }

        }
        timeout = Math.floor(Math.random() * (3500 - 3000)) + 3000;
        await page.waitFor(timeout)

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
            await page.waitFor(timeout)

            await page.click('[placeholder="Số điện thoại"]')    // Nhập comment 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            phone = "XXXXXXXX".replace(/X/g, function () {
                return "0123456789".charAt(Math.floor(Math.random() * 10))
            });
            phone = "09" + phone
            await page.type('[placeholder="Số điện thoại"]', phone, { delay: 100 })    // Nhập SDT 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            address = await page.$$('.address-modal__form_input')
            await address[2].click()    // Click Tỉnh thành phố 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            // Chọn ngẫu nhiên tỉnh
            tinhThanhPho = await page.$$(".select-with-status__dropdown-item")
            tinhThanhPho[Math.floor(Math.random() * 63)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            await address[3].click()      // Click Quận 
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            quanHuyen = await page.$$(".select-with-status__dropdown-item")
            quanHuyen[Math.floor(Math.random() * quanHuyen.length)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)

            await address[4].click()      // Click Phường                
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            phuongXa = await page.$$(".select-with-status__dropdown-item")
            phuongXa[Math.floor(Math.random() * phuongXa.length)].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)

            //Nhập địa chỉ
            fullAddress = "Số" + Math.floor(Math.random() * (1000)) + " " + address[address.length]
            await page.type('[placeholder="Toà nhà, Tên Đường..."]', fullAddress)
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            // click hoan thanh
            btnHoanThanh = await page.$$('.btn--s.btn--inline')
            btnHoanThanh[0].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
        }
        timeout = Math.floor(Math.random() * (3500 - 2000)) + 2000;
        await page.waitFor(timeout)
        // Chon don vi van chuyen
        console.log("Chon don vi van chuyen")
        await page.evaluate(() => {
            document.querySelectorAll('.checkout-shop-order-group')[0].children[1].children[1].children[2].click()
        }
        )
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout)
        // Chọn giao hàng các ngày trong tuần
        //Tất cả các ngày trong tuầnPhù hợp với địa chỉ nhà riêng, luôn có người nhận hàng

        clicktime = await page.$$('.stardust-dropdown__item-body--open>.stardust-radio>.stardust-radio__content .stardust-radio__label')
        if (clicktime.length) {
            await clicktime[0].click()
            timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
            await page.waitFor(timeout)
            // click hoanf thanh
            click2 = await page.$$('.logistics-selection-modal__submit-btn')
            click2[0].click()

        }
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (3500 - 2000)) + 2000;
        await page.waitFor(timeout)
        // chon phuong thuc thanh toan khi nhan hangf
        console.log("Chon phương thức thanh toán")
        btnThanhToan = await page.$$('.product-variation')
        if (btnThanhToan.length) {
            btnThanhToan[2].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
        }

        // Click dat hang
        console.log("Click đặt hàng")
        btnThanhToan = await page.$$('.stardust-button--primary.stardust-button--large')
        btnThanhToan[0].click()
        timeout = Math.floor(Math.random() * (5500 - 5000)) + 5000;
        await page.waitFor(timeout)
        //huy don hang
        btnHuyDon = await page.$$('.shopee-button-outline--primary')

        if (btnHuyDon.length) {
            console.log("Click huỷ đơn hàng")
            btnHuyDon[1].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            console.log("Chọn lý do huỷ đơn")
            btnOptHuyDon = await page.$$('.stardust-radio')
            randomOptionHuyDon = Math.floor(Math.random() * (btnOptHuyDon.length - 1))
            btnOptHuyDon[randomOptionHuyDon].click()

            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
            btnHuyDonHang = await page.$$('.shopee-alert-popup>div>.shopee-button-solid.shopee-button-solid--primary')
            btnHuyDonHang[0].click()
            timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
            await page.waitFor(timeout)
        } else {
            console.log("Không tìm thấy nút huỷ đơn")
        }
    } catch (error) {
        fs.appendFileSync('error.txt', "Order error" + "\n")
        fs.appendFileSync('error.txt', error.toString() + "\n")
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
    userAgent = randomUseragent.getRandom(function (ua) {
        return (ua.osName === 'Windows' && ua.osVersion >= 6 && ua.osVersion != 98);
    });
    await page.setUserAgent(userAgent)
    console.log(userAgent)
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

function generateRandom(min, max, num1, limit) {
    var rtn = Math.floor(Math.random() * (max - min)) + min;
    let check = 0
    num1.forEach(element => {
        if (element == rtn) {
            check++
        }
    });
    if (limit == 0) {
        console.log("Vui lòng thêm số lượng click lớn")
        return false
    } else if (check != 0) {
        limit--
        return generateRandom(min, max, num1, limit)
    } else {
        return rtn
    }
}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

disconnectDcomV2 = async () => {
    const disDcom =  await exec('%Windir%\system32\rasdial /disconnect');
    disDcom.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    disDcom.stderr.on('data', (data) => {
        console.error(data);
    });

}

connectDcomV2 = async () => {
    await sleep(5000)
    const disDcom =  await exec('%Windir%\system32\rasdial "MTN Data"');
    disDcom.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    disDcom.stderr.on('data', (data) => {
        console.error(data);
    });

}

deleteProfile = async (profile) => {
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
        netword: currentNet,
        mac: macAndress
    }
    //commandLineChange = "tmac -n "+netName + " -m " + macAndress + " -re -s"
    // console.log(commandLineChange);

    console.log(commandLineChange)
    console.log("change mac")
    param = " " + commandLineChange.netword + " " + commandLineChange.mac
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

runAllTime = async () => {

    // lấy dữ liệu từ master
    checkNetwork = 0
    require('dns').resolve('www.google.com', function(err) {
        if (err) {
          
           checkNetwork = 0
          
        } else {
           console.log("Connected");
           checkNetwork = 1
           
        }
      });
      
      if(checkNetwork == 0){
        console.log("No connection");
        if (mode != "DEV") {
            await connectDcomV2()
            await sleep(10000)
        
          }    
      }

      if(checkNetwork == 0){
        console.log("No connection");
        if (mode != "DEV") {
            // Đổi MAC
            await genRandomMac()
            await sleep(10000)
        } 
      }

    try {
        //console.log("IP cũ: "+ await publicIp.v4());
        let linkgetdataShopeeDir = ""
        let checkDcomOff
        linkgetdataShopeeDir = dataShopeeDir + "?slave=" + slavenumber + "&token=kjdaklA190238190Adaduih2ajksdhakAhqiouOEJAK092489ahfjkwqAc92alA&click_ads=" + clickAds + "&type_click=" + typeClick + "&lien_quan=" + lienQuan + "&san_pham=" + clickSanPham
        console.log(linkgetdataShopeeDir)
        getDataShopee = await axios.get(linkgetdataShopeeDir)

        dataShopee = getDataShopee.data

        keywords = []

        if (clickSanPham == 1) {
            keywords = products = dataShopee.products
        } else {
            dataShopee.keywords.forEach(item => {
                if (item.username) {
                    keyword = item.username.split("\r")[0]
                    keywords.push(keyword)
                }
            })
        }

    } catch (error) {
        console.log(error)
    }

    try {
        orderStatus = 1
        console.log("----------- START SHOPEE ---------------")
        //data = GenDirToGetData(maxTab, accounts)
        data=0
        getSlaveAccountDir = getSlaveAccountDir+"?slave="+slavenumber+"&max_tab="+maxTab
        try {
            let datatest = await axios.get(getSlaveAccountDir, {
               
            })
            data = datatest.data
            console.log(data)
        } catch (error) {
            console.log(error)
            //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
        }
       // console.log("IP trước khi đổi MAC: "+await publicIp.v4());
        

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

            data.forEach(async (acc, index) => {   // Foreach object Chạy song song các tab chromium

                // Nếu có dữ liệu schedule trả về
                //key = key.split("\t")
                key = []
                key[0] = acc.username
                key[1] = acc.password.split("\r")[0]

                if (phobien == 1) {
                    let profileChrome = profileDir + key[0]
                    const browser = await puppeteer.launch({
                        executablePath: chromiumDir,
                        headless: false,
                        devtools: false,
                        args: [
                            `--user-data-dir=${profileChrome}`      // load profile chromium
                        ]
                    });

                    const page = (await browser.pages())[0];
                    userAgent = randomUseragent.getRandom(function (ua) {
                        return (ua.osName === 'Windows' && ua.osVersion > 6 && ua.osVersion != 98);
                    });

                    await page.setUserAgent(userAgent)

                    // Random kích cỡ màn hình
                    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
                    height = Math.floor(Math.random() * (800 - 600)) + 600;;

                    await page.setViewport({
                        width: width,
                        height: height
                    });

                    try {
                        //console.log("IP cũ: "+await publicIp.v4());
                        if ((index == 0) && (mode !== "DEV")) {
                            // đổi ip
                            console.log("Đổi ip mạng")
                            if (dcomVersion == "V2") {
                               // await changeIpDcomV2()
                            } else {
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
                        }
                       // console.log("IP mới: "+await publicIp.v4());
                        //  timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
                        await page.waitFor(10000)
                        try {
                            await page.goto("https://shopee.vn")
                        } catch (error) {
                            console.log("Mạng chậm không kết nối dc")
                            return false
                        }

                        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                        await page.waitFor(timeout)

                        // login account shopee                    
                        checklogin = await loginShopee(page, key)

                        if (checklogin) {
                            console.log("---------- san pham pho bien ----------")

                            populateClick(page, listcategories)

                            // lấy danh sách product đã lưu
                            var saveProduct = fs.readFileSync("saveProduct.txt", { flag: "as+" });
                            saveProduct = saveProduct.toString();
                            saveProduct = saveProduct.split("\n")

                            // danh sách product không nằm trong file saveproduct.txt

                            //lấy danh sách product thuộc các id shop của cùng 1 người dùng                   
                            productInfo = await getproduct(page, saveProduct, 10, idShopsfull)

                            if (productInfo) {
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
                                    timeout = Math.floor(Math.random() * (5000 - 3000)) + 3000
                                    await page.waitFor(timeout)
                                    productLink = await page.url()
                                    await actionShopee(page)
                                    await page.waitFor(1000);

                                    if (productInfo.randomOrder >= 1) {
                                        randomOrder = Math.floor(Math.random() * (productInfo.randomOrder + 1))
                                        if (randomOrder % productInfo.randomOrder == 0) {
                                            //    await orderProduct(page, productInfo)
                                        }
                                    }

                                    if (lienQuan != 1) {
                                        await viewShop(page, productLink)
                                    }
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

                    console.log("----------- CLICK ALL SẢN PHẨM ---------------")

                    let profileChrome = profileDir + key[0]
                    console.log("Profile chrome link: " + profileChrome)
                    const browser = await puppeteer.launch({
                        executablePath: chromiumDir,
                        headless: false,
                        devtools: false,
                        args: [
                            `--user-data-dir=${profileChrome}`      // load profile chromium
                        ]
                    });

                    const page = (await browser.pages())[0];
                    userAgent = randomUseragent.getRandom(function (ua) {

                        return (ua.osName === 'Windows' && ua.osVersion >= 6 && ua.osVersion != 98);
                    });
                    await page.setUserAgent(userAgent)
                    console.log(userAgent)
                    // Random kích cỡ màn hình
                    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
                    height = Math.floor(Math.random() * (800 - 600)) + 600;;

                    await page.setViewport({
                        width: width,
                        height: height
                    });

                    try {
                       // console.log("IP cũ: "+await publicIp.v4());
                        if ((index == 0) && (mode !== "DEV")) {
                            // đổi ip
                            console.log("Đổi ip mạng")
                            if (dcomVersion == "V2") {
                               // await changeIpDcomV2()
                            } 
                        }
                       // newIpAdress = await publicIp.v4()
                       // console.log("IP mới: "+ newIpAdress);
                        //  timeout = Math.floor(Math.random() * (7000 - 5000)) + 5000;
                        await page.waitFor(5000)
                        await page.goto("https://shopee.vn")
                        timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
                        await page.waitFor(timeout)

                        // login account shopee                    
                        checklogin = await loginShopee(page, key)
                        if (checklogin) {
                            if (clickSanPham == 1) {
                                console.log("----- Click theo sản phẩm -----")

                                // Server trả về dữ liệu sắp xếp theo số lượng lượt tìm kiếm từ nhỏ đến lớn
                                // server check tài khoản còn tiền để sử dụng không

                                // Chọn 1 từ khoá có số lượng tìm kiếm thấp nhất
                                if (index < products.length) {
                                    product = products[index];
                                } else {
                                    product = products[0];
                                }

                                // Check actions can thao tac cua shop
                                shopInfo = []
                                try {
                                    let datatest = await axios.get(getShopActionsDir, {
                                        params: {
                                            data: {
                                                dataToServer: product,
                                            }
                                        }
                                    })
                                    shopInfo = datatest.data

                                } catch (error) {
                                    console.log("Không gửi được dữ liệu thứ hạng mới đến server")
                                    console.log(error)
                                }
                                console.log("Shop info")

                                console.log(shopInfo)
                                console.log(product)


                                if (shopInfo) {
                                    options = JSON.parse(shopInfo.options)
                                    //    console.log("options add cart: "+ options.add_cart)
                                    //    process.exit()
                                    product.username = key[0]
                                    product.password = key[1]
                                    product.slave = slavenumber
                                    //product.ip  = newIpAdress
                                    await searchKeyWord(page, product.keyword)
                                    await updateAtions("search", product)
                                    // Check vị trí sản phẩm theo page, index
                                    // search lần đầu , search lần 2, 
                                    productInfo = await getproductByProductId(page, product)
                                    // if(product.product_page == null || product.product_page == "Not"){
                                    //     productInfo = await getproductByProductId(page, product)
                                    // }else{
                                    //     productInfo = await getproductByOldIndex(page, product)
                                    // }
                                    console.log(productInfo)

                                    today = new Date().toLocaleString();
                                    productInfo.keyword = product.keyword
                                    productInfo.time = today
                                    productInfo.user = key[0]
                                    //productInfo.pass = key[1]

                                    try {
                                        let datatest = await axios.get(shopeeUpdateSeoSanPhamDir, {
                                            params: {
                                                data: {
                                                    dataToServer: productInfo,
                                                }
                                            }
                                        })
                                        console.log("Cập nhật thứ hạng sp: " + datatest.data)
                                        // console.log(datatest.data)
                                    } catch (error) {
                                        console.log("Không gửi được dữ liệu thứ hạng mới đến server")
                                        console.log(error)
                                    }
                                    if ((productInfo.vitri != "Not")) {
                                        products = await page.$$('[data-sqe="link"]')

                                        if (productInfo.vitri > 4 && productInfo.vitri < 45) {
                                            products[productInfo.vitri].click()
                                            await updateAtions("view_product", product)
                                            await actionShopee(page, options, product)
                                            productLink = await page.url()

                                            if (options.order) {
                                                console.log("Đặt hàng: " + options.follow_shop)
                                                if (productInfo.randomOrder >= 1) {
                                                    // Đặt hàng
                                                    randomOrder = Math.floor(Math.random() * (productInfo.randomOrder + 1))
                                                    if (randomOrder % productInfo.randomOrder == 0) {
                                                        //    await orderProduct(page, productInfo)
                                                    }
                                                }
                                            }

                                            console.log("Option view shop: " + options.view_shop)
                                            if (options.view_shop) {
                                                await viewShop(page, productLink)
                                                await updateAtions("view_shop", product)

                                                if (options.follow_shop) {
                                                    check1 = await checkAtions("follow_shop", product)
                                                    if (!check1) {
                                                        console.log("follow shop: " + options.follow_shop)
                                                        followClick = await page.$$('.shopee-button-outline.shopee-button-outline--complement.shopee-button-outline--fill ')
                                                        if (followClick.length) {

                                                            await followClick[0].click()
                                                        }
                                                        await updateAtions("follow_shop",product)
                                                    }
                                                }
                                            }
                                            await page.waitFor(1000);
                                            await removeCart(page)
                                        }
                                    } else {
                                        console.log("Không tìm thấy sản phẩm")
                                    }
                                }

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