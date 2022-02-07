const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const HttpsProxyAgent = require('https-proxy-agent');
const md5 = require('md5');


const timViTriTrangSanPhamTheoTuKhoa = async (product, cookies, maxPage) => {
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
    for (let i = 0; i <= maxPage; i++) {

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

        let str_request = `55b03${md5(search_api)}55b03`;
        let if_none_match = `55b03-${md5(str_request)}`;

        headersearch = {
            'x-api-source': 'pc',
            'x-shopee-language': 'vi',
            'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'x-api-source': 'pc',
            'x-shopee-language': 'vi',
            'x-requested-with': 'XMLHttpRequest',
            'User-Agent': product.user_agent,
            'if-none-match-': if_none_match,
            'sec-ch-ua-platform': '"Windows"',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://shopee.vn/search?keyword=' + encodeURI(keyword),
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'cookie': cookie1

        }
        let datatest
        //console.log(search_api)
        var data

        await axios.get(search_api, {
            timeout: 5000,
            headers: headersearch
        })
            .then(function (response) {
                data = response.data
                // cookie3 = response.headers['set-cookie']
                // console.log(cookie3)
                // console.log(cookie1)
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
    console.log(" ------ Vị trí sản phẩm: vị trí: " +  viTriSanPham.vitri + " - Trang: " +  viTriSanPham.trang)    
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
        timeout: 5000,
        headers: {
            'content-type': 'application/json',
            'referer': ref,
            'cookie': cookie1
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log("--- follow shop API Thành công ---");
            //console.log(response.data);
            result = response.data
        })
        .catch(function (error) {
            console.log("--- Lỗi API follow ---");
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
    let data = { "shop_item_ids": [{ "shop_id": parseInt(shopId), "item_id": parseInt(productId) }] }
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
            console.log("--- Thả tim sản phẩm API Thành công ---");
            //console.log(response.data);
            result = response.data
        })
        .catch(function (error) {
            console.log("--- Lỗi Thả tim sản phẩm API ---");
        });
    return result

}

likeFeed = async (cookies, feed_link, proxy) => {
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

    feed_array = feed_link.split("/")
    feed_id = feed_array[feed_array.length - 1]

    //var data = JSON.stringify({ "shopid": shopId });
    let proxy_pass = proxy.proxy_password.split("\r")[0]
    var httpsAgent = new HttpsProxyAgent({host: proxy.proxy_ip, port: proxy.proxy_port, auth:  proxy.proxy_username + ":" + proxy_pass})
    // proxy_1 = {
    //     protocol: 'https',
    //     host: proxy.proxy_ip,
    //     port: proxy.proxy_port,
    //     auth: {
    //         username: proxy.proxy_username,
    //         password: proxy_pass
    //     }
    // }
    

    let url = "https://feeds.shopee.vn/api/proxy/like"
    let data = { "feed_id": feed_id }
    //data = JSON.stringify(data);
    var config = {
        method: 'post',
        url: url,
        timeout: 5000,
        headers: {
            'x-csrftoken': xtoken,
            'language': "vi",
            'user-agent': "language=vi app_type=1",
            'cookie': cookie1,
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
        },
        httpsAgent: httpsAgent,
        //proxy: false,
        data: data
    };

    await axios(config)
        .then(function (response) {
            result = response.data
            console.log("Like feed: " + feed_link + " --- " + result.msg);
        })
        .catch(function (error) {
            console.log(error);
        });
    return result

}

commentFeed = async (cookies, shopee_feed, proxy) => {

    let mentions = []
    let hashtags = []

    if (shopee_feed.mentions) {
        mentions = shopee_feed.mentions
    }

    if (shopee_feed.hashtags)
        hashtags = shopee_feed.hashtags

    let feed_content = shopee_feed.feed_content
    let feed_link = shopee_feed.feed_link
    let result
    var xtoken = csrftoken()
    let cookie1 = ""

    let proxy_pass = proxy.proxy_password.split("\r")[0]

    var httpsAgent = new HttpsProxyAgent({host: proxy.proxy_ip, port: proxy.proxy_port, auth:  proxy.proxy_username + ":" + proxy_pass})
    
    cookies.forEach(row => {
        if (row.name == "csrftoken") {
            cookie1 = cookie1 + row.name + "=" + xtoken + ";"
        } else {
            cookie1 = cookie1 + row.name + "=" + row.value + ";"
        }

    })

    let icons = ['🙏', '💖', '😊', '😘', '😇', '👍', '🌺']
    
    let random_icon = Math.floor(Math.random() * (icons.length - 1));

    let feed_array = feed_link.split("/")
    let feed_id = feed_array[feed_array.length - 1]
    let message = feed_content.split("\n")
    let random_ms = Math.floor(Math.random() * (message.length - 1));
    let message1 = message[random_ms] + " " + icons[random_icon]
    //let message1 = message[random_ms] + " " + icons[random_icon]
    // console.log("Messenger: " + message1)
    // process.exit()

    let url = "https://feeds.shopee.vn/api/proxy/comment"
    let data = { "feed_id": feed_id, "comment": message1, "mentions": mentions, "hashtags": hashtags }

    var config = {
        method: 'post',
        url: url,
        timeout: 5000,
        headers: {
            'x-csrftoken': xtoken,
            'host': "feeds.shopee.vn",
            'language': "vi",
            'user-agent': "language=vi app_type=1",
            'cookie': cookie1,
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
        },
        httpsAgent: httpsAgent,
        //proxy: false,
        data: data
    };

    await axios(config)
        .then(function (response) {
            result = response.data
            console.log("Comment feed: " + feed_link + " --- " + result.msg);
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
    likeFeed,
    commentFeed,
    followShop

}