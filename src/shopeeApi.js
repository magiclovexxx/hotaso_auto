const axios = require('axios').default;
const HttpsProxyAgent = require('https-proxy-agent');
const md5 = require('md5');




followShop = async (cookies, ref, shopId) => {
    try {
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
                console.log("--- follow shop API ---");
                console.log(response.data);
                result = response.data
            })
            .catch(function (error) {
                console.log("--- Lỗi API follow ---");
                console.log(error)
            });
    } catch (error) {
        console.log(error)
    }

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
            console.log(response.data);
            result = response.data
        })
        .catch(function (error) {
            console.log(error)
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
    feed_link = decodeURIComponent(feed_link)


    feed_array = feed_link.split("/")
    feed_id = feed_array[feed_array.length - 1]

    //var data = JSON.stringify({ "shopid": shopId });
    let proxy_pass = proxy.proxy_password.split("\r")[0]
    var httpsAgent = new HttpsProxyAgent({ host: proxy.proxy_ip, port: proxy.proxy_port, auth: proxy.proxy_username + ":" + proxy_pass })
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

    if (shopee_feed.feed_mention) {
        mentions = shopee_feed.feed_mention
    }

    if (shopee_feed.feed_hashtag) {
        hashtags = shopee_feed.feed_hashtag
    }

    let feed_content = shopee_feed.feed_content
    let feed_link = shopee_feed.feed_link
    let result
    var xtoken = csrftoken()
    let cookie1 = ""

    let proxy_pass = proxy.proxy_password.split("\r")[0]

    var httpsAgent = new HttpsProxyAgent({ host: proxy.proxy_ip, port: proxy.proxy_port, auth: proxy.proxy_username + ":" + proxy_pass })

    cookies.forEach(row => {
        if (row.name == "csrftoken") {
            cookie1 = cookie1 + row.name + "=" + xtoken + ";"
        } else {
            cookie1 = cookie1 + row.name + "=" + row.value + ";"
        }

    })

    let icons = ['🙏', '💖', '😊', '😘', '😇', '👍', '🌺', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛', '🤑', '😎', '🤓', '🧐',
        '🤠', '🥳', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤗', '🤥', '😳', '😞', '😟', '😤', '😠', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😮', '😮', '😓',
        '😯', '😦', '😧', '😢', '🤤', '🤩', '😵', '😵', '🥴', '😲', '🤐', '😷', '🤕', '🤒', '🤧', '😶', '😴', '😺',
        '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙌', '👏', '🙏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌']

    let so_luong_icon = Math.floor(Math.random() * 5)

    feed_link = decodeURIComponent(feed_link)
    let feed_array = feed_link.split("/")
    let feed_id = feed_array[feed_array.length - 1]
    let message = feed_content

    for (let a = 0; a < so_luong_icon; a++) {
        let random_icon = Math.floor(Math.random() * (icons.length - 1));
        message = message + " " + icons[random_icon]
    }

    if (mentions.length > 0) {
        for (let b = 0; b < mentions.length; b++) {
            message += " @" + mentions[b]
        }
    }
    let hashtags_1 = []
    if (hashtags.length > 0) {
        for (let c = 0; c < hashtags.length; c++) {

            let xx = hashtags[c]
            xx = xx.split('#');
            if (xx.length > 1) {
                xx = xx[1]
            } else {
                xx = xx[0]
            }

            //xx = xx.split("\r")
            //xx = xx[0]

            let ht = {
                "tag": xx
            }

            hashtags_1.push(ht)
        }
    }


    let url = "https://feeds.shopee.vn/api/proxy/comment"
    let data = { "feed_id": feed_id, "comment": message, "mentions": [], "hashtags": hashtags_1 }
    console.log(data)

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

    thaTimSanPham,
    layDanhSachSanPhamCuaShop,
    likeFeed,
    commentFeed,
    followShop

}