const axios = require('axios').default;
shopeeUpdateSeoSanPhamDir = "http://auto.tranquoctoan.com/api_user/shopeeUpdateSeoSanPham"
var fs = require('fs');
let page
const exec = require('child_process').exec;
var shell = require('shelljs');


const puppeteer = require('puppeteer');
headersearch = {

    cookie: '_gcl_au=1.1.699808476.1607702732; SPC_IA=-1; SPC_EC=-; SPC_F=FXGW8llunAQuf5baIJM19NtcxbG2f9tj; REC_T_ID=b28c0ef6-3bca-11eb-a793-b49691844b48; SPC_U=-; _fbp=fb.1.1607702732348.1633153129; _hjid=0ecfc287-f2da-4004-826d-8ad89e4b90b8; _gcl_aw=GCL.1608656038.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; _med=cpc; _gac_UA-61914164-6=1.1608656040.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; SPC_SI=mall.pFUIKPdyxP5VnhVg50pEFlynHNuJRRuW; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _gid=GA1.2.1577912680.1609217942; csrftoken=hoi5IadKlRLfriDALQFEEUQTfaGFLIWO; cto_bundle=oonKA185cGlHMUdYYkQxRyUyQmdadTdzRjJFVk1KRHIycVBUUk1TcHloa3U2eVMwUkkyUnM5bkdvOGJwUUdERVRRZFZSRHQ0VmJaeFhBek9RbVVIMkwyY0FNTU13QXVCWTVGWXExcE1URFRTT25LMXY2UjBqeHpKT00wdXJCZG9hdlZoWjNhUFduTDZMWXJuendJRm5ocnF4TXVDQSUzRCUzRA; _ga_M32T05RVZT=GS1.1.1609303653.16.1.1609307858.0; _ga=GA1.1.802594605.1607702734; SPC_R_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="; SPC_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_R_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="',
    referer: 'https://shopee.vn/',
    'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

}

runAllTime = async () => {
    productInfo = {
        sanpham: 'VD64',
        id: '22',
        shopId: '19608398',
        trang: '2',
        vitri: 26,
        keyword: 'ví nữ đẹp',
        time: '12/30/2020, 10:16:59 AM',
        user: '0965966078'
    }

    // try {
    //     let datatest = await axios.get(shopeeUpdateSeoSanPhamDir, {
    //         params: {
    //             data: {
    //                 dataToServer: productInfo,
    //             }
    //         }
    //     })
    //     console.log(datatest.data)
    // } catch (error) {
    //     console.log("Không gửi được dữ liệu thứ hạng mới đến server")
    //     console.log(error)

    // }
    for (let i = 0; i < 10; i++) {

        page = 50 * i
        //shopeesearch = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF&limit=50&newest=50&order=desc&page_type=search&version=2"
        shopeesearch = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p&limit=50&newest=" + page + "&order=desc&page_type=search&version=2"
        shopInfo = "https://shopee.vn/api/v2/shop/get?shopid=74300615"
        productInfo = "https://shopee.vn/api/v2/item/get?itemid=6705447143&shopid=74300615"
        shopProduct = "https://shopee.vn/api/v2/search_items/?by=pop&entry_point=ShopByPDP&limit=100&match_id=19608398&newest=000&order=desc&page_type=shop"
        keywordApi = "https://shopee.vn/api/v4/search/search_hint?keyword=v%C3%AD%20n%E1%BB%AF&search_type=0&version=1"
        search_api = "https://shopee.vn/api/v2/search_items/?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF&limit=50&newest=" + page + "&order=desc&page_type=search&version=2"
        productOfShop = "https://shopee.vn/api/v4/search/search_items?by=pop&entry_point=ShopBySearch&limit=100&match_id=19608398&newest=" + 100 * i + "&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2"
        //console.log(shopeesearch)

        if (i == 0) {
            ref = "https://shopee.vn"
        }
        if (i == 1) {
            ref = "https://shopee.vn/search?keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p"
        } else {
            ref = "https://shopee.vn/search?keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p&page=" + i
        }

        ref_productOfShop = "https://shopee.vn/shop/19608398/search"
        //ref_productOfShop = "https://shopee.vn/shop/19608398/search?page=1&sortBy=pop"

        headersearch = {

            //cookie: '_gcl_au=1.1.699808476.1607702732; SPC_IA=-1; SPC_EC=-; SPC_F=FXGW8llunAQuf5baIJM19NtcxbG2f9tj; REC_T_ID=b28c0ef6-3bca-11eb-a793-b49691844b48; SPC_U=-; _fbp=fb.1.1607702732348.1633153129; _hjid=0ecfc287-f2da-4004-826d-8ad89e4b90b8; _gcl_aw=GCL.1608656038.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; _med=cpc; _gac_UA-61914164-6=1.1608656040.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; SPC_SI=mall.pFUIKPdyxP5VnhVg50pEFlynHNuJRRuW; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _gid=GA1.2.1577912680.1609217942; csrftoken=7VQS9mkU5q5Q7WVXoz3ZpaISzMY6pmF0; cto_bundle=oonKA185cGlHMUdYYkQxRyUyQmdadTdzRjJFVk1KRHIycVBUUk1TcHloa3U2eVMwUkkyUnM5bkdvOGJwUUdERVRRZFZSRHQ0VmJaeFhBek9RbVVIMkwyY0FNTU13QXVCWTVGWXExcE1URFRTT25LMXY2UjBqeHpKT00wdXJCZG9hdlZoWjNhUFduTDZMWXJuendJRm5ocnF4TXVDQSUzRCUzRA; _ga_M32T05RVZT=GS1.1.1609303653.16.1.1609307858.0; _ga=GA1.1.802594605.1607702734; SPC_R_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="; SPC_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_R_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="',
            referer: ref_productOfShop,
            //'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

        }

        try {
            datatest = await axios.get(productOfShop, {

                headers: headersearch
            })

        } catch (error) {
            console.log("Không lấy dc data")
            console.log(error)
        }
        data = datatest.data
        console.log(data.items.length)
        console.log(data.items[0].item_basic.name)
        //console.log("Trang: " + i)

        // fs.appendFileSync('check.txt', "Trang: " + i + "\n", { flag: "as+" })


        // datatest.data.items.forEach(element => {
        //     fs.appendFileSync('check.txt', i + " - " + element.item_basic.itemid + " - " + element.item_basic.name + "\n", { flag: "as+" })
        //     // console.log(element.item_basic.name)    
        // });


        if (data.items != undefined) {
            //console.log(i + " --- " +datatest.data.items.length)
            //console.log(datatest.data.items[0].itemid)
        } else {
            console.log("Không lấy dc dữ liệu")
        }


    }

}
danhSachSanPham = async () => {
    LinkdanhSachSanPhamChuaTuongTac = "https://hotaso.tranquoctoan.com/api_user/danhSachSanPhamChuaTuongTac"
    user = "thientran_eh"
    productIds = [

    ]

    let dataCheck1 = {
        account: user,
        shop_id: "",
        action: "like"
    }
    try {
        let datatest = await axios.get(LinkdanhSachSanPhamChuaTuongTac, {
            params: {
                data: {
                    dataToServer: dataCheck1,
                }
            }
        })

        danhSachSanPhamDaTuongTac = datatest.data
        //console.log(danhSachSanPhamDaTuongTac)

    } catch (error) {
        console.log(error)
        //console.log("Không gửi được dữ liệu thứ hạng mới đến master")
    }

    let danhSachSanPhamChuatuongTac = []
    // Danh sách sản phẩm chưa tương tác
    productIds.forEach((item) => {
        if (!danhSachSanPhamDaTuongTac.includes(item)) {
            danhSachSanPhamChuatuongTac.push(item)
        }
    })

    console.log("--- Danh sách sp chưa tương tác ---")
    console.log(danhSachSanPhamChuatuongTac)
}

getKeyword = async () => {
    ref = "https://banhang.shopee.vn/portal/marketing/pas/new?pid=4485827137"
    headersearch = {

        cookie: '_gcl_au=1.1.1838237052.1616882918; REC_T_ID=55a0d16e-8f48-11eb-86d3-20283e72226f; SPC_F=6YbNzEMKUy9Wj8a9mXMVM0ZM7Cakrm1F; _fbp=fb.1.1616882918567.1296196276; _hjid=9a1c69f6-2611-4da5-87ef-8660cb95e7d7; G_ENABLED_IDPS=google; SPC_CLIENTID=NlliTnpFTUtVeTlXjevkwsaxelwxhzpy; SPC_U=402722075; SPC_EC=hgOdLojDT1rCbQsD5+FNs0Hidrxvh9/qv0CgpR9qI8q6sLZvQOqWjG9BytZ8KfnoAlhcG8hUer8uz9piWBDK22eRBHcWZ3fyuiPe/cGEaEPhcnVzXlgQN+v9tIDrFI0ejoUHA/J20Kuodo8alRX1LAoMzQoXE2plxaqBQEedk7M=; SPC_SI=mall.7h2sdi7iHfPrq4KOabwChv16LEIIdNYS; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.2057661171.1619929891; _hjAbsoluteSessionInProgress=0; SPC_R_T_ID="j2I2LCZEIQKsbMocBnPHb/XnqD5Vsd7z0i7LFf2e7yT8XqQB7rlR+aMsqHJMgyduLK2t2LLFrjddcpTdnVKXAYBl0sogmPahX5Rl4ATqnlY="; SPC_R_T_IV="FrQcYvob1rNMJZ94aDxg1g=="; _ga_M32T05RVZT=GS1.1.1619929890.13.1.1619930488.60; _ga=GA1.2.396764398.1616882920; _dc_gtm_UA-61914164-6=1; cto_bundle=o81AjV95enFIeG9TN21NTkRQM0J5WmtFMEhBeFcwcnpJYiUyRmFOa1pLTTE1MElHcTkzR0hIWlhxakR1RUpwWXBFJTJCYlV3UWd4cVZDJTJCYXROSFEwMVlNemtGJTJCNUpjWWRuS0U1TXRUNVQwRWglMkZ2akp1dU4wb2ZEQ0NDZHAwVzdnZ2I5RGdQb1NzdUYwSFpqcWE3V3dXOFNJRFdzSlN3JTNEJTNE; SPC_CDS=7ce17eb4-d278-4809-8f04-4d6c148f5494; SPC_SC_UD=402722075; SPC_STK="XRd0X9d729phRuk5I4htatE+/wxvAazTj+Vw/6ZqaLTPE+elqnhNf/WSmD4sfeuBrauILVcY2cD1+Kb2xRLnwb/PRPzoNhrhhURaNMpHQpBmCcuP5emH8Z2a6yZeIaBPOL+Gernig27CTeL/CdGEEC4cpDtc9IgYuFEHbr294rngKDYSpFMoZuU4k4RAel3X"; SPC_SC_TK=e603748bae6be3d15248dd940bac47ba; SC_DFP=p2qwpyRvIX3hAo7lg7LePxOi0RYcjD1r',
        referer: ref,
        'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

    }
    api_link = "https://banhang.shopee.vn/api/marketing/v3/pas/suggest/keyword/?"
    api_link = "https://banhang.shopee.vn/api/marketing/v3/pas/suggest/keyword/?SPC_CDS=7ce17eb4-d278-4809-8f04-4d6c148f5494&SPC_CDS_VER=2&keyword=v%C3%AD+n%E1%BB%AF+c%E1%BA%A7m+tay+min&count=100&placement=0&itemid=3347555187"
    keyword = "Ví nữ cầm tay mini"

    productIds = [

    ]

    try {
        datatest = await axios.get(api_link, {

            headers: headersearch
        })
        datatest = datatest.data
        console.log(datatest)
    } catch (error) {
        console.log("Không lấy dc data")
        console.log(error)
    }


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

disconnectDcomV2 = async () => {
    const disDcom = await exec('shutdown /r /t 300');
    disDcom.stdout.on('data', (data) => {
        // do whatever you want here with data
        console.log(data)
    });
    disDcom.stderr.on('data', (data) => {
        console.error(data);
    });

}

disconnect = async () => {
    runadmin('disconnect.bat')

}


checkheader = async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    // page.on('request', req => {
    //     console.log(req.headers());
    // });

    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;

    await page.setViewport({
        width: width,
        height: height
    });
    await page.on('response', async (resp) => {
        var url = resp.url()
        if (url == "https://shopee.vn/api/v2/item/get?itemid=6420096356&shopid=42137125") {
            console.log("value: " + url);
            console.log(await resp.json())
        }

    });
    await page.goto('https://shopee.vn/Bo-m%E1%BA%A1ch-ch%E1%BB%A7-huananzhi-X79-Luxury-X79-4D-8D-X99-gaming-TF-X99-T8-X99-T8D-X99-F8D-socket-2011-i.42137125.6420096356')
    await page.waitForTimeout(10000)

}

dataupdate = {
    "id": "12023",
    "uid": "524",
    "type": null,
    "product_link": "https://shopee.vn/Balo-nam-n%E1%BB%AF-th%E1%BB%9Di-trang-Cao-C%E1%BA%A5p-%C4%91%E1%BA%B9p-ch%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-ki%E1%BB%83u-H%C3%A0n-Qu%E1%BB%91c-Ulzzang-unisex-%C4%91i-ch%C6%A1i-%C4%91i-h%E1%BB%8Dc-%C4%91i-du-l%E1%BB%8Bch-Local-Brand-BA02-i.37072054.6488812348", "product_name": "Balo nam nữ thời trang Cao Cấp đẹp chống nước kiểu Hàn Quốc Ulzzang unisex đi chơi đi học đi du lịch Local Brand BA02", "product_id": "6488812348", "product_image": "https://cf.shopee.vn/file/bbfe92f815c4cde4e80f04c00837089b", "product_sku": "BA02", "shop_id": "37072054", "keyword": "balo hàn quốc", "keyword_search": null, "max_page": "0", "actions": null, "click_product": null, "accounts": null, "total_product_search": "80", "total_product_order": "0", "total_product_view_product": "39", "total_product_add_cart": "42", "total_product_view_review": "44", "total_product_view_shop": "58", "total_product_heart_product": "36", "total_product_follow_shop": "8", "product_point": "705", "all_request": "209", "check_index": "3", "product_slug": null, "product_code": null, "status": "1", "product_page": null, "product_index": null, "update_time": "2021-06-03 19:59:25", "created": "2021-05-21 12:26:50", "username": "tuepham_394", "password": "kqtk4594KQ", "shopee_point": { "heart_product": "5", "follow_shop": "20", "heart_shop": "5", "add_cart": "10", "view_product": "5", "search": "5", "view_shop": "5", "order": "5", "view_review": "5" }, "slave": "DEV", "ip": "27.72.105.18", "cookie": [{ "name": "_gali", "value": "modal", "domain": ".shopee.vn", "path": "/", "expires": 1622732719, "size": 10, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "_dc_gtm_UA-61914164-6", "value": "1", "domain": ".shopee.vn", "path": "/", "expires": 1622732744, "size": 22, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "_ga", "value": "GA1.2.673794116.1622719191", "domain": ".shopee.vn", "path": "/", "expires": 1685804684, "size": 29, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "csrftoken", "value": "2KOcZP6YtZPN4YCGea75hsfMEVTZaqGD", "domain": "shopee.vn", "path": "/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "priority": "Medium" }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1622732683.2.0.1622732683.60", "domain": ".shopee.vn", "path": "/", "expires": 1685804684, "size": 48, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "_hjid", "value": "5eaf4eb3-16d8-4408-91a1-671360c17eb1", "domain": ".shopee.vn", "path": "/", "expires": 1654255191, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "priority": "Medium" }, { "name": "SPC_T_ID", "domain": "shopee.vn", "path": "/", "expires": 2253452681.466769, "size": 118, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_T_IV", "domain": "shopee.vn", "path": "/", "expires": 2253452681.466686, "size": 34, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_R_T_ID", "domain": ".shopee.vn", "path": "/", "expires": 2253452681.466609, "size": 120, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "/", "expires": 1622736284, "size": 21, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "_gcl_au", "value": "1.1.1081229326.1622719188", "domain": ".shopee.vn", "path": "/", "expires": 1630495188, "size": 32, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_U", "value": "402151988", "domain": ".shopee.vn", "path": "/", "expires": 2253452683.37112, "size": 14, "httpOnly": false, "secure": true, "session": false, "priority": "Medium" }, { "name": "SPC_CLIENTID", "value": "T1hSNTNFMVBJaWdnhcszmvizhssuyrrw", "domain": ".shopee.vn", "path": "/", "expires": 2253439215.2735, "size": 44, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "priority": "Medium" }, { "name": "SPC_R_T_IV", "domain": ".shopee.vn", "path": "/", "expires": 2253452681.466724, "size": 36, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_SI", "value": "mall.TsKtfu405JgmESzmumjADBrBifLj65i8", "domain": ".shopee.vn", "path": "/", "expires": 1622819082.918804, "size": 43, "httpOnly": true, "secure": true, "session": false, "priority": "Medium" }, { "name": "SPC_F", "value": "OXR53E1PIigg3Q4s6Manzf4PnEdGRcvs", "domain": ".shopee.vn", "path": "/", "expires": 2253439189.291, "size": 37, "httpOnly": false, "secure": true, "session": false, "priority": "Medium" }, { "name": "_gid", "value": "GA1.2.112136046.1622719192", "domain": ".shopee.vn", "path": "/", "expires": 1622819084, "size": 30, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_IA", "value": "-1", "domain": "shopee.vn", "path": "/", "expires": 2253439215.2732, "size": 8, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "REC_T_ID", "value": "9b6a980c-c45d-11eb-b925-b49691a0dcc4", "domain": "shopee.vn", "path": "/", "expires": 2253439189.2391, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameSite": "None", "priority": "Medium" }, { "name": "_fbp", "value": "fb.1.1622719189209.298622244", "domain": ".shopee.vn", "path": "/", "expires": 1630508692, "size": 32, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "/", "expires": 1622734484, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "priority": "Medium" }, { "name": "REC_T_ID", "value": "9b69dd41-c45d-11eb-ac44-2cea7f8c1ce3", "domain": ".shopee.vn", "path": "/", "expires": 2253439189.2908, "size": 44, "httpOnly": true, "secure": true, "session": false, "priority": "Medium" }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "priority": "Medium" }, { "name": "SPC_EC", "value": "Si32a01ZKWNtyq1YpNerstrHADtt3dj4af081LZEfSNI25dDjQF35xWbtYs+h6zmAmWgOdSROv98AEIlfvZgNYPnH6VAkEITDPwj862PNtlxwYi1lwPwkOkMCdehp2RwBrBYCc3qvZpvkMfg973JCIry0FiDtSwBtpZ6oYW12KI=", "domain": ".shopee.vn", "path": "/", "expires": 2253452683.37105, "size": 178, "httpOnly": true, "secure": true, "session": false, "priority": "Medium" }], "user_agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240", "action": "search"
}


test_post = async () => {

    axios.post('https://hotaso.tranquoctoan.com/api_user/updateActions', {
        data: dataupdate
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}


test_update_all = async () => {
    productForUser = {
        "id":"10659","uid":"441","username":"damhoi470","options":'{\\"add_cart\\":1,\\"order\\":1,\\"view_shop\\":1,\\"view_review\\":1,\\"heart_product\\":1,\\"follow_shop\\":1}',"product_link":"https://shopee.vn/G%E1%BA%B7m-N%C6%B0%E1%BB%9Bu-Cho-B%C3%A9-H%C3%ACnh-H%C6%B0%C6%A1u-Kh%E1%BB%89-Chu%E1%BB%91i-H%C3%A0ng-H%C3%A0n-Qu%E1%BB%91c-H%C3%A0ng-Ch%C3%ADnh-H%C3%A3ng-Check-QR-Gi%E1%BA%A3m-%C4%90au-Ng%E1%BB%A9a-L%E1%BB%A3i-Khi-M%E1%BB%8Dc-R%C4%83ng-i.38183220.9149824698","product_name":"Gặm Nướu Cho Bé Hình Hươu, Khỉ, Chuối, Hàng Hàn Quốc, Hàng Chính Hãng, Check QR, Giảm Đau, Ngứa Lợi Khi Mọc Răng","product_id":"9149824698","product_image":"bfa79d26e30235f6b1617a0f316be7c9","product_sku":"9149824698","shop_id":"38183220","keyword":"gặm nướu ange","check_index":"3","total_product_search":"164","total_product_order":"0","total_product_view_product":"155","total_product_add_cart":"124","total_product_view_review":"135","total_product_view_shop":"158","total_product_heart_product":"122","total_product_follow_shop":"112","product_point":"3525","password":"Mrnqoxeftjr","shopee_point":{"heart_product":"15","follow_shop":"30","heart_shop":"5","add_cart":"30","view_shop":"15","order":"50","view_review":"15","view_product":"15","search":"15"},"slave":"2029","ip":"27.72.105.18","cookie":[{"name":"_gali","value":"modal","domain":".shopee.vn","path":"/","expires":1623521393,"size":10,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_ga","value":"GA1.2.861813194.1622890106","domain":".shopee.vn","path":"/","expires":1686593359,"size":29,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_hjid","value":"94a9ebdf-00a7-43f1-8e4c-6ac054940d20","domain":".shopee.vn","path":"/","expires":1654426107,"size":41,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_T_ID","value":'\\"+qzfvKEO1GQkdyDurjxGWjlyZO7cRBXNv05urobypPkxZERU4Caz1LMvDAyYXhPXLg+JReeD2ItsDrWmcHhc7i4LHek6KoDcRFxv8UJcUsA=\\"',"domain":"shopee.vn","path":"/","expires":2254241356.185936,"size":118,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_R_T_ID","value":'\\"+qzfvKEO1GQkdyDurjxGWjlyZO7cRBXNv05urobypPkxZERU4Caz1LMvDAyYXhPXLg+JReeD2ItsDrWmcHhc7i4LHek6KoDcRFxv8UJcUsA=\\"',"domain":".shopee.vn","path":"/","expires":2254241356.185661,"size":120,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"welcomePkgShown","value":"true","domain":"shopee.vn","path":"/","expires":-1,"size":19,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_R_T_IV","value":'\\"lvFf1BsBVYuQETm0B2juZg==\\"',"domain":".shopee.vn","path":"/","expires":2254241356.185868,"size":36,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_SI","value":"mall.aaQzGt3iXZuwgpoTSgn4VcggCjL1xlcE","domain":".shopee.vn","path":"/","expires":1623607756.536037,"size":43,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_F","value":"RjcPzvwrjANgRqen5OAjzOQwjYIovsTR","domain":".shopee.vn","path":"/","expires":2253610104.078,"size":37,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_gid","value":"GA1.2.1658033375.1623521315","domain":".shopee.vn","path":"/","expires":1623607759,"size":31,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"REC_T_ID","value":"8d04bd44-c5eb-11eb-a8c4-b49691a1005a","domain":"shopee.vn","path":"/","expires":2253610103.8947,"size":44,"httpOnly":true,"secure":true,"session":false,"sameSite":"None","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"G_ENABLED_IDPS","value":"google","domain":".shopee.vn","path":"/","expires":253402257600,"size":20,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"cto_bundle","value":"ve8b5V9MQ1NiSEViWGtxdzJVUjV4V2pDcGpNb0pYZ1BHbWFJJTJCMW5pRWM3NUtkOE02NDRtblJaMU8wM3hybHM5MkxHSk4lMkI3VkdRRDJ1elVVRFB4JTJGUmxrdk4ydjdXNGNnNk9MWnhvSkxKcXJVdzYwOTNYWkxyb3N1QVRWNm5oSkF0MUVONkpoZmw5U0NqdFBMUFdqeGpwYmU2bUElM0QlM0Q","domain":".shopee.vn","path":"/","expires":1657278067,"size":233,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_U","value":"449038969","domain":".shopee.vn","path":"/","expires":2254241360.869035,"size":14,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_CLIENTID","value":"UmpjUHp2d3JqQU5notthsttcaouljhig","domain":".shopee.vn","path":"/","expires":2253610152.5015,"size":44,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"AMP_TOKEN","value":"%24NOT_FOUND","domain":".shopee.vn","path":"/","expires":1623524914,"size":21,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_gcl_au","value":"1.1.996322038.1622890102","domain":".shopee.vn","path":"/","expires":1630666101,"size":31,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_IA","value":"-1","domain":"shopee.vn","path":"/","expires":2254241338.587285,"size":8,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_ga_M32T05RVZT","value":"GS1.1.1623521313.8.1.1623521359.14","domain":".shopee.vn","path":"/","expires":1686593359,"size":48,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"csrftoken","value":"hdMSfMKpqbO5DPEooxOZQpVD8wNDYkJb","domain":"shopee.vn","path":"/","expires":-1,"size":41,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_EC","value":"T9gPLvHiRFJX1a2jq8GqxQzJs8dWEr8fwKGDUnZ/PCwzBV7nZygnr4f29SoFJeAcy9eUC/WO7Rkro/MNZp6yyjWRbJLa0MFb8TEK3+YJpsglkqEx+m/dCOez7AgmewYMNP4uULhf6FXUy+XbxKnAvLEjvmELZcHFeUtF1YAV9ds=","domain":".shopee.vn","path":"/","expires":2254241360.868834,"size":178,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_fbp","value":"fb.1.1622890103617.407024356","domain":".shopee.vn","path":"/","expires":1631297382,"size":32,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_hjAbsoluteSessionInProgress","value":"0","domain":".shopee.vn","path":"/","expires":1623523160,"size":29,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"REC_T_ID","value":"8d2065ee-c5eb-11eb-8d14-2cea7f904aca","domain":".shopee.vn","path":"/","expires":2253610104.2893,"size":44,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_T_IV","value":'\\"lvFf1BsBVYuQETm0B2juZg==\\"',"domain":"shopee.vn","path":"/","expires":2254241356.185802,"size":34,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_PC_HYBRID_ID","value":"81","domain":"shopee.vn","path":"/","expires":-1,"size":18,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443}],"user_agent":"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240","action":"follow_shop","liked":true,"shopAvatar":"8b462bb4b358601d14845ac8593e491f","shopName":"KIDS-SHOP Tổng kho hàng MẸ &BÉ","shopUserName":"tit201611"}

    await axios.post("https://hotaso.tranquoctoan.com/api_user/updateActions", {
        data: productForUser,
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

(async () => {
    //shell.exec('Taskkill /F /IM Chrome.exe');
    day = new Date
    day = Date.parse(day)
    console.log(day)
    await test_update_all()
    //await test_post()
    //await disconnect()
    //await getKeyword()
    //await runAllTime()
    // await checkheader()
    // await disconnectDcomV2()

})();