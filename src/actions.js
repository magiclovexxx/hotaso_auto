const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

const check_slave_die = async(slave)=>{
    let url = "http://hotaso.tranquoctoan.com/api_user/check_slave?slave=" + slave
    let check_slave = 1
    await axios.get(url, {
        timeout: 50000
    })
        .then(function (response) {
           
            check_slave = response.data
            return check_slave
        })
        .catch(function (error) {
            console.log(error);
            return check_slave
        })
        .then(function () {
            // always executed
        });
    return check_slave
}

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

    if (getProductPageTotal >= 1) {
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

                product_heart.action = "heart_product"
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
                if (danhSachSanPhamDaTuongTac.length) {
                    if (!danhSachSanPhamDaTuongTac.includes(item.productId)) {
                        danhSachSanPhamChuatuongTac.push(item)
                    }
                } else {
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
    try {
        if (danhSachSanPhamChuatuongTac.length) {
            // Click like các sản phẩm chưa tương tác
            let randomProduct = Math.floor(Math.random() * (15 - 10)) + 10;
            let clickHearts = await page.$$('[viewBox="0 0 16 16"]')
            for (let j = 1; j < randomProduct; j++) {
                if (danhSachSanPhamChuatuongTac[j]) {
                    await clickHearts[danhSachSanPhamChuatuongTac[j].vitri].click()
                    product_heart.type = "like"
                    product_heart.heart_product_id = danhSachSanPhamChuatuongTac[j].productId
                    product_heart.heart_product_image = danhSachSanPhamChuatuongTac[j].product_image
                    product_heart.heart_product_name = danhSachSanPhamChuatuongTac[j].product_name
                    product_heart.heart_product_link = danhSachSanPhamChuatuongTac[j].product_link

                    await updateAtions("heart_product", product_heart)
                    timeout = Math.floor(Math.random() * (1500 - 1000)) + 1000;
                    await page.waitForTimeout(timeout)

                }
            }
        }
    } catch (error) {

        console.log(error)
    }
}


const getproductByProductId = async (page, product, max_page) => {
    console.log("------ Tìm kiếm vị trí từ khoá trên trang ------")
    try {

        let thuHangSanPham = {
            trang: 0,
            vitri: 0
        }
        if (product.urlSearch) {
            await page.goto(urlSearch)
            await page.waitForTimeout(4000)
        }
        await page.waitForTimeout(4000)
        await page.on('response', async (resp) => {
            var url = resp.url()
            let checkUrl = url.split("search_items")

            if (checkUrl.length > 1) {

                let productInfo1 = await resp.json()
                productInfo2 = productInfo1.items
                
                productInfo2.forEach((item, index) => {
                    if ((item.itemid == product.product_id) && (item.ads_keyword == null)) {
                        // tìm vị trí sản phẩm cần click

                        thuHangSanPham = {

                            vitri: index + 1
                        }
                    }
                })

                //productForUser.product_image = productInfo2.image
            }

        });

        // console.log("Tổng số trang kết quả tìm kiếm: " + getProductPageTotal)

        console.log("Đang tìm sản phẩm trên trang: " + max_page)
        max_page = max_page - 1

        if (thuHangSanPham.vitri) {
            let productPagess = await page.url()
            productPagess = productPagess.split("page=")[1]
            let product_page2 = parseInt(productPagess)
            product_page2 = product_page2 + 1
            thuHangSanPham.trang = product_page2

            return thuHangSanPham;
        } else {
            if (max_page == 0) {
                thuHangSanPham = {

                    trang: 0,
                    vitri: 0
                }
                return thuHangSanPham;
            } else {
                next = await page.$$('.shopee-icon-button--right')
                if (next.length) {
                    await next[0].click()
                    timeout = Math.floor(Math.random() * (timemax - timemin)) + timemin;
                    await page.waitForTimeout(timeout);
                    product.urlSearch = ""
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
    check_slave_die

}