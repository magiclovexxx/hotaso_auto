const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

const thaTimCacSanPhamCuaShop = async (page, product_heart) => {
// Lấy tổng số trang sản phẩm của shop
let getProductPageTotal
try {
    getProductPageTotal = await page.evaluate(() => {
        // Class có link bài đăng trên profile          
        let titles = document.querySelectorAll('.shopee-mini-page-controller__total')[0].textContent;
        return titles
    })
} catch {
    getProductPageTotal = 1
}

if (getProductPageTotal >= 1 ) {
    for (let i = 1; i <= getProductPageTotal; i++) {
        let getProductList = []
        danhSachSanPhamChuatuongTac = []
        try {
            getProductList = await page.evaluate(() => {
                //  
                let titles = document.querySelectorAll('[data-sqe="link"]');
                let imagess = document.querySelectorAll('img[width="invalid-value"]')
                let product_names = document.querySelectorAll('[data-sqe="name"]');

                listProductLinks = []
                titles.forEach((item, index) => {
                    let productids = item.href.split(".")
                    let productId = {
                        productId: productids[productids.length - 1],
                        vitri: index,
                        product_name: product_names[index].textContent,
                        product_image: "", //imagess[index].src,
                        product_link: item.href
                    }
                    listProductLinks.push(productId)
                })
                return listProductLinks
            })

            //console.log(" ---- Danh sách sản phẩm của shop ----")
            //console.log(getProductList)
            //console.log(getProductList.length)

            // Lấy danh sách các sản phẩm đã like
          
            product_heart.action= "heart_product"
            //console.log("Link: " + LinkdanhSachSanPhamChuaTuongTac)
            let datatest = await axios.get(LinkdanhSachSanPhamChuaTuongTac, {
                params: {
                    data: {
                        dataToServer: product_heart,
                    }
                }
            })

            danhSachSanPhamDaTuongTac = datatest.data
            console.log(" ---- Danh sách sản phẩm đã tương tác ----")
            console.log(danhSachSanPhamDaTuongTac.length)
        } catch (error) {
            console.log(error)
            //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
        }
        
        // Danh sách sản phẩm chưa tương tác
        //console.log(" ---- Danh sách sản phẩm ----")
        //console.log(getProductList)
        getProductList.forEach((item) => {
            if(danhSachSanPhamDaTuongTac.length){
                if (!danhSachSanPhamDaTuongTac.includes(item.productId)) {
                    danhSachSanPhamChuatuongTac.push(item)
                }
            }else{
                danhSachSanPhamChuatuongTac.push(item)
            }
            
        })

        console.log(" ---- Danh sách sản phẩm chưa tương tác ----")
        console.log(danhSachSanPhamChuatuongTac.length)
        if (danhSachSanPhamChuatuongTac.length > 2) {
            break;
        } else {
            clickNext = await page.$('.shopee-svg-icon.icon-arrow-right')
            if (clickNext) {
                await clickNext.click()
            }
        }
    }
}
try{
    if (danhSachSanPhamChuatuongTac.length) {
        // Click like các sản phẩm chưa tương tác
        let randomProduct = Math.floor(Math.random() * (15 - 10)) + 10;
        let clickHearts = await page.$$('[viewBox="0 0 16 16"]')
        for (let j = 1; j<randomProduct; j++ ){
            if (danhSachSanPhamChuatuongTac[j]) {
                await clickHearts[danhSachSanPhamChuatuongTac[j].vitri].click()
                product_heart.type = "like"
                product_heart.heart_product_id = danhSachSanPhamChuatuongTac[j].productId
                product_heart.heart_product_image = danhSachSanPhamChuatuongTac[j].product_image
                product_heart.heart_product_name = danhSachSanPhamChuatuongTac[j].product_name
                product_heart.heart_product_link = danhSachSanPhamChuatuongTac[j].product_link

                await updateAtions("heart_product", product_heart)
                timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
                await page.waitFor(timeout)
                
            }
        }    
    }
}catch(error){

    console.log(error)
} 
}


const getproductByProductId = async (page, product, max_page) => {
    console.log("------ Tìm kiếm vị trí từ khoá trên trang ------")
    try {
        let thuHangSanPham

        await page.waitForSelector('[data-sqe="name"]')
        let timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);
        await page.keyboard.press('PageDown');
        timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        await page.waitFor(timeout);

        if (phobien) {
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitFor(timeout);
            await page.keyboard.press('PageDown');
            timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
            await page.waitFor(timeout);
        }

        let getProduct = []
        // Lấy vị trí sản phẩm theo id sản phẩm
        getProduct = await page.evaluate(() => {

            // Class có link bài đăng trên profile          
            let titles = document.querySelectorAll('[data-sqe="link"]');
            // check sản phẩm ads
            //document.querySelectorAll('[data-sqe="link"]')[0].children[0].children[0].children[0].children[1].children[0].dataset.sqe
            let listProductLinks = []
            titles.forEach((item) => {
                let prod
                let checkads2 = 0
                let checkAds = item.children[0].children[0].children[0].children
                //console.log(checkAds.length)
                checkAds.forEach(item2 => {
                    if ((item2.children.length)) {
                        if ((item2.children[0].dataset.sqe == "ad")) {
                            checkads2 = 1
                        }
                    }
                })

                if (checkads2 == 1) {
                    prod = {
                        ads: 1,
                    }
                } else {
                    prod = {
                        ads: 0,
                    }
                }
                prod.link = item.href

                listProductLinks.push(prod)
            })
            return listProductLinks
        })

        let getProductPageTotal = await page.evaluate(() => {

            // Lấy tổng số trang kết quả tìm kiếm          
            let titles = document.querySelectorAll('.shopee-mini-page-controller__total');
            return titles[0].textContent
        })

        getProductPageTotal = parseInt(getProductPageTotal)
        // console.log("Tổng số trang kết quả tìm kiếm: " + getProductPageTotal)
        let productIndex = 0
        let productId

        // tìm vị trí sản phẩm cần click
        let productPagess = await page.url()
        productPagess = productPagess.split("page=")[1]
        let product_page2 = parseInt(productPagess)
        product_page2 = product_page2 +1
        let productIds
        //console.log(getProduct)
        getProduct.forEach((item, index) => {

            productIds = item.link.split(product.product_id)
            if (productIds.length == 2 && item.ads == 0) {
                productId = product.id
                productIndex = index;
                thuHangSanPham = {
                    id: product.id,
                    sanpham: product.product_name,
                    product_id: product.product_id,
                    keyword: product.keyword,
                    shopId: product.shop_id,
                    trang: product_page2,
                    vitri: productIndex
                }
                return true
            }

            if (productIds.length == 2 && item.ads == 1) {
                productId = product.id
                productIndex = index;
                thuHangSanPham = {
                    id: product.id,
                    sanpham: product.product_name,
                    product_id: product.product_id,
                    shopId: product.shop_id,
                    keyword: product.keyword,
                    trang: product_page2,
                    vitri: "ads"
                }
                return true
            }

        })

        console.log("Đang tìm sản phẩm trên trang: " + max_page)
        max_page = max_page - 1

        if (thuHangSanPham) {
            return thuHangSanPham;
        } else {
            if (max_page == 0) {
                thuHangSanPham = {
                    id: product.id,
                    sanpham: product.product_name,
                    product_id: product.product_id,
                    shopId: product.shop_id,
                    keyword: product.keyword,
                    trang: "Not",
                    vitri: "Not"
                }
                return thuHangSanPham;
            } else {
                next = await page.$$('.shopee-icon-button--right')
                if (next.length) {
                    await next[0].click()
                    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                    await page.waitFor(timeout);
                    return await getproductByProductId(page, product, max_page)
                }
            }
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {

    thaTimCacSanPhamCuaShop,
    getproductByProductId,

}