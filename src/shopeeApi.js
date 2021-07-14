const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');


const timViTriTrangSanPhamTheoTuKhoa = async (product,cookies, maxPage) => {
    // lay cookie
    cookie1 = ""
    cookies.forEach((row, index) => {
        cookie1 = cookie1 + row.name + "=" + row.value
        if (index != (cookies.length - 1)) {
            cookie1 = cookie1 + "; "
        }

    })

    let keyword = product.keyword.toLowerCase()
    let productId = product.product_id
    let viTriSanPham = {
        trang: 0,
        vitri: 0
    }
    console.log("Id sản phẩm: " + productId)
    let productIndex = 0
    for (let i = 1; i <= maxPage; i++) {

        viTriSanPham = {
            trang: false,
            vitri: false
        }
        maxproduct = 50 * (i - 1)
        search_api = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=" + keyword + "&limit=50&newest=" + maxproduct + "&order=desc&page_type=search&version=2"
        search_api = encodeURI(search_api)
        //console.log(shopeesearch)
        if (i == 1) {
            ref = "https://shopee.vn"
        }
        if (i == 2) {
            ref = "https://shopee.vn/search?keyword=" + keyword

        } else {
            ref = "https://shopee.vn/search?keyword=" + keyword + "page=" + i
        }

        ref = encodeURI(ref)

        headersearch = {
            referer: ref,
            'cookie': cookie1

        }
        let datatest
        //console.log(search_api)
        var data

        await axios.get(search_api, {
            headers: headersearch
        })
            .then(function (response) {
                data = response.data
            })
            .catch(function (error) {
                console.log(error);
                viTriSanPham.vitri = "err"
                viTriSanPham.trang = "err"
                console.log(" ---------- Lỗi khi lấy check vị trí sản phẩm ----------");
                return viTriSanPham
            })

        checkProduct = 0
        try {
            if (data.items.length > 0) {
                console.log("Trang: " + i + "  --  " + productId + "  -- Tong san pham tren trang: " + data.items.length)
                let itemid3 = ""
                itemid3 = data.items[0].item_basic.itemid

                //console.log("----" + itemid3)

                data.items.forEach((item, index) => {

                    if (item.item_basic.itemid == productId && item.ads_keyword == null) {
                        viTriSanPham = {
                            trang: i,
                            vitri: index + 1
                        }
                    }
                });
            }
        } catch (error) {
            viTriSanPham.vitri = "err"
            viTriSanPham.trang = "err"
            console.log(" ---------- Lỗi khi lấy check vị trí sản phẩm ----------");
            console.log(error)
            
        }

        if (viTriSanPham.trang > 0 || viTriSanPham.vitri == "err") {
            break;
        }

    }
    console.log(" ------ Vị trí sản phẩm check được ------")
    console.log(viTriSanPham)
    return viTriSanPham

}

followShop = async (cookies, ref, shopId) => {
    let cookie1 = ""
    let result
    cookies.forEach((row, index) => {
        cookie1 = cookie1 + row.name + "=" + row.value
        if (index != (cookies.length - 1)) {
            cookie1 = cookie1 + "; "
        }

    })

    var data = JSON.stringify({ "shopid": shopId });

    var config = {
        method: 'post',
        url: 'https://shopee.vn/api/v4/shop/follow',
        headers: {
            'content-type': 'application/json',
            'referer': ref,
            'cookie': cookie1
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log(response.data);
            result = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
    return result

}

function csrftoken() {
    karakter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    PanjangKarakter = karakter.length;
    acakString = '';
    for (let i = 0; i < 32; i++) {
        PanjangKarakter = PanjangKarakter - 1
        acakString += karakter[Math.floor(Math.random() * (PanjangKarakter))];


    }
    return acakString;
}

thaTimSanPham = async (cookies, ref, shopId, productId) => {
    let result
    var xtoken = csrftoken()
    let cookie1 = ""

    cookies.forEach(row => {
        if (row.name == "csrftoken") {
            cookie1 = cookie1 + row.name + "=" + xtoken + ";"
        } else {
            cookie1 = cookie1 + row.name + "=" + row.value + ";"
        }

    })
    // console.log (cookie1) 
    // console.log ( "--" + shopId) 
    // console.log ("--" + productId) 
    // console.log ("--" + ref) 

    //var data = JSON.stringify({ "shopid": shopId });
    let url = "https://shopee.vn/api/v4/pages/like_items"
    let data= {"shop_item_ids":[{"shop_id":parseInt(shopId),"item_id":parseInt(productId)}]}
    //data = JSON.stringify(data);
    var config = {
        method: 'post',
        url: url,
        timeout: 5000,
        headers: {
            'x-csrftoken': xtoken,
            'referer': ref,
            'cookie': cookie1
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log(response.data);
            result = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
    return result

}

const layDanhSachSanPhamCuaShop = async (shop) => {

}


const timViTriSanPham = async (product) => {

}



module.exports = {

    timViTriTrangSanPhamTheoTuKhoa,
    thaTimSanPham,
    layDanhSachSanPhamCuaShop,
    followShop

}