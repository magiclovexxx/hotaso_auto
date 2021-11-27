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

const { preparePageForTests } = require('./src/bypass');
const bypassTest = require('./src/bypassTest');

checkauto = async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    await preparePageForTests(page);
    // page.on('request', req => {
    //     console.log(req.headers());
    // });

    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;

    await page.setViewport({
        width: width,
        height: height
    });

    await page.goto('https://shopee.vn/')
    bypassTest.runBypassTest(page);
    await page.waitForTimeout(10000000)

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
proxy3g = async () => {

    axios.get('http://192.168.1.24:10000/api/v1/dongles/all', {
        data: dataupdate
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}

update_actions = async () => {
    dataupdate = {
        "id": "21265",
        "admin": "1",
        "type": null,
        "pid": null,
        "fullname": "Tràn Toản",
        "email": "magic.loveptit@gmail.com",
        "phone": "0855934999",
        "password": "fgpl2740FG",
        "server": "https://hotaso.vn",
        "avatar": "uploads/user1/70964335_911266199242049_1777414121721954304_n.jpg",
        "package_id": "10",
        "maximum_account": "1",
        "maximum_likes": "50",
        "check_shop_product": "1",
        "maximum_seedings": "100",
        "maximum_post": "5",
        "agency_discount": "0",
        "agency_money": "",
        "expiration_date": "2025-01-28",
        "reset_key": "fcf0e1252e0b6d8868577eb741d292cb",
        "history_id": null,
        "total_sub_account_point": "0",
        "total_point": "1002500000",
        "now_point": "3972015",
        "sub_point": "998528000",
        "total_add_cart": "55001",
        "total_view_shop": "54725",
        "total_order": "1",
        "total_view_product": "57187",
        "total_heart_product": "45332",
        "total_follow_shop": "32213",
        "total_view_review": "55296",
        "total_search": "59984",
        "timezone": "Asia/Ho_Chi_Minh",
        "status": "1",
        "changed": "2021-07-15 12:33:19",
        "update_time": "2021-08-14 07:08:24",
        "created": "2021-06-14 21:19:59",
        "uid": "9",
        "shop_name": "LiDishop",
        "username": "thientran_eh",
        "shop_id": "32598950",
        "shop_avatar": "http://cf.shopee.vn/file/b4cf0e56f375caf3ce3d34a90cfa7ae5",
        "he_so_traffic": "1",
        "traffic_hien_tai": "1",
        "check_product": "1",
        "click_option": null,
        "options": '{\\"add_cart\\":1,\\"order\\":1,\\"view_shop\\":1,\\"view_review\\":1,\\"heart_product\\":1,\\"follow_shop\\":1}',
        "product_link": "https://shopee.vn/s%E1%BB%AFa-t%E1%BA%AFm-tr%E1%BA%AFng-JW-in-shower-white-Tone-up-BOdy-Cream-i.32598950.7050670841",
        "product_name": "sữa tắm trắng JW in shower white Tone up BOdy Cream",
        "product_id": "7050670841",
        "product_image": "https://cf.shopee.vn/file/2e1f86d806bd497b6050a385f0901255",
        "product_sku": "hq",
        "keyword": "sữa tắm trắng JW in shower",
        "keyword_search": null,
        "max_page": "0",
        "actions": null,
        "click_product": null,
        "accounts": null,
        "total_product_search": "1298",
        "total_product_order": "0",
        "total_product_view_product": "1431",
        "total_product_add_cart": "1268",
        "total_product_view_review": "1344",
        "total_product_view_shop": "1191",
        "total_product_heart_product": "692",
        "total_product_follow_shop": "794",
        "product_point": "8805",
        "all_request": "893",
        "check_index": "0",
        "product_traffic": "1",
        "product_traffic_hien_tai": "0",
        "product_slug": null,
        "product_code": null,
        "product_page": null,
        "product_index": null,
        "shopee_point": {
            "heart_product": "15",
            "follow_shop": "30",
            "heart_shop": "5",
            "add_cart": "30",
            "view_shop": "15",
            "order": "50",
            "view_review": "15",
            "view_product": "15",
            "search": "15"
        },
        "slave": "6578",
        "ip": "103.90.231.112",
        "cookie": [{
            "name": "_gali",
            "value": "modal",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628900102,
            "size": 10,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_T_IV",
            "value": '\\"o0N6N0za6qAxWPhOgornZQ==\\"',
            "domain": "shopee.vn",
            "path": "/",
            "expires": 2259620070.654796,
            "size": 34,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_R_T_ID",
            "value": '\\"ilMADN1jYoa5LOeG5R3m+lKe6T7dQn13H3c2M6Z89VnDWc9ofK7nt2j1NFx3wPAGWPUu2jyIkV1/SFXMU5MY7Pw/QWZeCezwnSfKKaEdXyw=\\"',
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620070.654748,
            "size": 120,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_ga",
            "value": "GA1.2.1013453745.1628900042",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1691972070,
            "size": 30,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "csrftoken",
            "value": "Yoa2UqZzZSet6U1RXk83vh69ovph2Cdo",
            "domain": "shopee.vn",
            "path": "/",
            "expires": -1,
            "size": 41,
            "httpOnly": false,
            "secure": false,
            "session": true,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_ga_M32T05RVZT",
            "value": "GS1.1.1628900041.1.1.1628900070.31",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1691972070,
            "size": 48,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_ST",
            "value": '\\".Yk1EV1JMbVJIOUFEVml4YZDIKP2afJJWEsYFleNwTFokwfMRLCZ5ImhrIO9OFD873WuK2XOEV9hGSIsvINkthwkvo62oql66nVIKkkF5e9+g6w7J4hte3ypKxycAX+junopPJycXVRL7kTnCskh+rfy15rLjCzq1fWuubfvO4+2eQQqQndftTa8ciHBQheQLlhoN1z2DqxTbjuNnisimsQ==\\"',
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620062.782093,
            "size": 225,
            "httpOnly": true,
            "secure": true,
            "session": false,
            "sameSite": "None",
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "G_ENABLED_IDPS",
            "value": "google",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 253402257600,
            "size": 20,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_dc_gtm_UA-61914164-6",
            "value": "1",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628900102,
            "size": 22,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_F",
            "value": "2NVUHq5bl58v3eaxXhAoBB3n93th5XzN",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620039.889362,
            "size": 37,
            "httpOnly": false,
            "secure": true,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_gid",
            "value": "GA1.2.1346046930.1628900042",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628986470,
            "size": 31,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_SI",
            "value": "mall.cIeO3Hlts93ueq9E6bnGQAgnPphAs4xu",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628986470.654879,
            "size": 43,
            "httpOnly": true,
            "secure": true,
            "session": false,
            "sameSite": "None",
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_hjFirstSeen",
            "value": "1",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628901841,
            "size": 13,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameSite": "Lax",
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_T_ID",
            "value": '\\"ilMADN1jYoa5LOeG5R3m+lKe6T7dQn13H3c2M6Z89VnDWc9ofK7nt2j1NFx3wPAGWPUu2jyIkV1/SFXMU5MY7Pw/QWZeCezwnSfKKaEdXyw=\\"',
            "domain": "shopee.vn",
            "path": "/",
            "expires": 2259620070.654852,
            "size": 118,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_hjid",
            "value": "7513630f-3b88-4b6e-9a55-4d88d237d474",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1660436041,
            "size": 41,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameSite": "Lax",
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_EC",
            "value": "Z0RCa3kxOE1BdmdWdkhqd7wCP57Q23c9jdhbWV+FixhW8b7oX68FRmEKrWll58QA8/KZhwAlF9D3F64UG1e1Q0ozgP1FyWBn5SPEbwZS3hhGMI+0jxfMRAhSTpV72Lm6s7iTZ2PGoUkUIYEV8Fpqjwg6qmSpfIzRURAkBBan0e8=",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620070.530479,
            "size": 178,
            "httpOnly": true,
            "secure": true,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_R_T_IV",
            "value": '\\"o0N6N0za6qAxWPhOgornZQ==\\"',
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620070.654823,
            "size": 36,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "welcomePkgShown",
            "value": "true",
            "domain": "shopee.vn",
            "path": "/",
            "expires": -1,
            "size": 19,
            "httpOnly": false,
            "secure": false,
            "session": true,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_gcl_au",
            "value": "1.1.135820513.1628900040",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1636676039,
            "size": 31,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "AMP_TOKEN",
            "value": "%24NOT_FOUND",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628903642,
            "size": 21,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "REC_T_ID",
            "value": "85e60af9-fc94-11eb-bef3-1409dcf03002",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620039.889287,
            "size": 44,
            "httpOnly": true,
            "secure": true,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_hjAbsoluteSessionInProgress",
            "value": "0",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1628901870,
            "size": 29,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameSite": "Lax",
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_IA",
            "value": "-1",
            "domain": "shopee.vn",
            "path": "/",
            "expires": 2259620062.781855,
            "size": 8,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "_fbp",
            "value": "fb.1.1628900040479.348325753",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 1636676078,
            "size": 32,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_CLIENTID",
            "value": "Mk5WVUhxNWJsNTh2srytlqvgzymhspds",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620062.782308,
            "size": 44,
            "httpOnly": false,
            "secure": false,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }, {
            "name": "SPC_U",
            "value": "402152443",
            "domain": ".shopee.vn",
            "path": "/",
            "expires": 2259620070.530571,
            "size": 14,
            "httpOnly": false,
            "secure": true,
            "session": false,
            "sameParty": false,
            "sourceScheme": "Secure",
            "sourcePort": 443
        }],
        "user_agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240",
        "action": "feed",
        "result":3,
        "feed_id":11,
        "local_ip": "192.168.1.14"
    }

    data_feed = {
        id: '11',
        uid: '9',
        shop_id: null,
        feed_link: 'https://feeds.shopee.vn/universal-link/share/AIoYtHLpBQCGOCsBAAAAAA==',
        feed_name: 'BL164',
        feed_like: '20000',
        feed_time: '10',
        feed_comment: '5000',
        feed_content: '   Sản phẩm tuyệt vời, giao hàng nhanh :))))\r\n' +
          'Ví đẹp,cầm chắc tay,màu đẹp nhiều ngăng đựng được nhiều thứ,shipper giao hàng nhanh,thân thiện đáng tiền nên mua thử.Sẽ ủng hộ(ảnh vid mang tính chất nhận xu)\r\n' +
          'Giao hàng ổn, đủ hàng, giá rẻ, gói cũng rất cẩn thận, đã mua nhiều lần. Sau sẽ ủng hộ tiếp\r\n' +
          'Sp ổn, chỗ đựng thẻ hơi nhỏ k đựng vừa. Dnjdkfmf ndjdnbdjdnd jdkdndbhd\r\n' +
          'Sản phẩm chất lượng oke, giao hàng nhanh, nói chung là okeeee\r\n' +
          'Túi siêu chất lượng xinh lắm ạ đóng gói cẩn thận nên mua nha....\r\n' +
          'Ví đẹp, chất lượng ok so với giá nhưng bị mất form nhìn ọp ẹp lắm\r\n' +
          'Giá rẻ.màu xih.dungg \r\n' +
          'ok.sẽ ủng hộ shop anannsjsmsnkskmsns\r\n' +
          'Ví y hình. Chất mềm, cầm thích tay luôn. Sẽ ủng hộ shop tiếp nhé\r\n' +
          'Giá hợp lý, đc n ng tin dùng lên mua thử, đã nhận đủ hàng\r\n' +
          'Giá hợp lý, đc n ng tin dùng lên mua thử, đã nhận đủ hàng\r\n' +
          'Ví nhỏ hơn mình tưởng ko đựng vừa đt với giá tiền này thì hơi thất vọng xíu... da mềm\r\n' +
          'Shop đóng gói cẩn thận  tuy nhiên có 1 bóp bị dơ và mình ko lau đi đc. Bù lại các bóp khác thì đẹp và dễ thương. Hy vọng lần sau đặt ko bị v nữa\r\n' +
          '\r\n' +
          '\r\n' +
          '\r\n',
        count_like: '487',
        count_comment: '490',
        status: '1',
        update_time: '2021-11-28 03:27:41',
        created: '2021-11-25 15:48:59',
        feed_id: '11',
        username: 'maigiangpntf',
        password: 'Jctimgabxpa',
        shopee_point: {
          heart_product: '15',
          follow_shop: '30',
          heart_shop: '15',
          add_cart: '30',
          view_shop: '15',
          order: '50',
          view_review: '15',
          view_product: '15',
          search: '15',
          feed_like: 20,
          feed_comment: 20
        },
        slave: '6578',
        action: 'like_feed',
        cookie: ''
      }
    axios.get('https://beta.hotaso.vn/api_user/update_point', {
        params: {
            data: {
                dataToServer: data_feed,
            }
        },
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

}


test_update_all = async () => {
    let proxy
    productForUser = {
        "id": "10659", "uid": "441", "username": "damhoi470", "options": '{\\"add_cart\\":1,\\"order\\":1,\\"view_shop\\":1,\\"view_review\\":1,\\"heart_product\\":1,\\"follow_shop\\":1}', "product_link": "https://shopee.vn/G%E1%BA%B7m-N%C6%B0%E1%BB%9Bu-Cho-B%C3%A9-H%C3%ACnh-H%C6%B0%C6%A1u-Kh%E1%BB%89-Chu%E1%BB%91i-H%C3%A0ng-H%C3%A0n-Qu%E1%BB%91c-H%C3%A0ng-Ch%C3%ADnh-H%C3%A3ng-Check-QR-Gi%E1%BA%A3m-%C4%90au-Ng%E1%BB%A9a-L%E1%BB%A3i-Khi-M%E1%BB%8Dc-R%C4%83ng-i.38183220.9149824698", "product_name": "Gặm Nướu Cho Bé Hình Hươu, Khỉ, Chuối, Hàng Hàn Quốc, Hàng Chính Hãng, Check QR, Giảm Đau, Ngứa Lợi Khi Mọc Răng", "product_id": "9149824698", "product_image": "bfa79d26e30235f6b1617a0f316be7c9", "product_sku": "9149824698", "shop_id": "38183220", "keyword": "gặm nướu ange", "check_index": "3", "total_product_search": "164", "total_product_order": "0", "total_product_view_product": "155", "total_product_add_cart": "124", "total_product_view_review": "135", "total_product_view_shop": "158", "total_product_heart_product": "122", "total_product_follow_shop": "112", "product_point": "3525", "password": "Mrnqoxeftjr", "shopee_point": { "heart_product": "15", "follow_shop": "30", "heart_shop": "5", "add_cart": "30", "view_shop": "15", "order": "50", "view_review": "15", "view_product": "15", "search": "15" }, "slave": "2029", "ip": "27.72.105.18", "cookie": [{ "name": "_gali", "value": "modal", "domain": ".shopee.vn", "path": "/", "expires": 1623521393, "size": 10, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga", "value": "GA1.2.861813194.1622890106", "domain": ".shopee.vn", "path": "/", "expires": 1686593359, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjid", "value": "94a9ebdf-00a7-43f1-8e4c-6ac054940d20", "domain": ".shopee.vn", "path": "/", "expires": 1654426107, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": '\\"+qzfvKEO1GQkdyDurjxGWjlyZO7cRBXNv05urobypPkxZERU4Caz1LMvDAyYXhPXLg+JReeD2ItsDrWmcHhc7i4LHek6KoDcRFxv8UJcUsA=\\"', "domain": "shopee.vn", "path": "/", "expires": 2254241356.185936, "size": 118, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_ID", "value": '\\"+qzfvKEO1GQkdyDurjxGWjlyZO7cRBXNv05urobypPkxZERU4Caz1LMvDAyYXhPXLg+JReeD2ItsDrWmcHhc7i4LHek6KoDcRFxv8UJcUsA=\\"', "domain": ".shopee.vn", "path": "/", "expires": 2254241356.185661, "size": 120, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_IV", "value": '\\"lvFf1BsBVYuQETm0B2juZg==\\"', "domain": ".shopee.vn", "path": "/", "expires": 2254241356.185868, "size": 36, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_SI", "value": "mall.aaQzGt3iXZuwgpoTSgn4VcggCjL1xlcE", "domain": ".shopee.vn", "path": "/", "expires": 1623607756.536037, "size": 43, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_F", "value": "RjcPzvwrjANgRqen5OAjzOQwjYIovsTR", "domain": ".shopee.vn", "path": "/", "expires": 2253610104.078, "size": 37, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gid", "value": "GA1.2.1658033375.1623521315", "domain": ".shopee.vn", "path": "/", "expires": 1623607759, "size": 31, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "8d04bd44-c5eb-11eb-a8c4-b49691a1005a", "domain": "shopee.vn", "path": "/", "expires": 2253610103.8947, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameSite": "None", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "cto_bundle", "value": "ve8b5V9MQ1NiSEViWGtxdzJVUjV4V2pDcGpNb0pYZ1BHbWFJJTJCMW5pRWM3NUtkOE02NDRtblJaMU8wM3hybHM5MkxHSk4lMkI3VkdRRDJ1elVVRFB4JTJGUmxrdk4ydjdXNGNnNk9MWnhvSkxKcXJVdzYwOTNYWkxyb3N1QVRWNm5oSkF0MUVONkpoZmw5U0NqdFBMUFdqeGpwYmU2bUElM0QlM0Q", "domain": ".shopee.vn", "path": "/", "expires": 1657278067, "size": 233, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_U", "value": "449038969", "domain": ".shopee.vn", "path": "/", "expires": 2254241360.869035, "size": 14, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_CLIENTID", "value": "UmpjUHp2d3JqQU5notthsttcaouljhig", "domain": ".shopee.vn", "path": "/", "expires": 2253610152.5015, "size": 44, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "/", "expires": 1623524914, "size": 21, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gcl_au", "value": "1.1.996322038.1622890102", "domain": ".shopee.vn", "path": "/", "expires": 1630666101, "size": 31, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_IA", "value": "-1", "domain": "shopee.vn", "path": "/", "expires": 2254241338.587285, "size": 8, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1623521313.8.1.1623521359.14", "domain": ".shopee.vn", "path": "/", "expires": 1686593359, "size": 48, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "csrftoken", "value": "hdMSfMKpqbO5DPEooxOZQpVD8wNDYkJb", "domain": "shopee.vn", "path": "/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_EC", "value": "T9gPLvHiRFJX1a2jq8GqxQzJs8dWEr8fwKGDUnZ/PCwzBV7nZygnr4f29SoFJeAcy9eUC/WO7Rkro/MNZp6yyjWRbJLa0MFb8TEK3+YJpsglkqEx+m/dCOez7AgmewYMNP4uULhf6FXUy+XbxKnAvLEjvmELZcHFeUtF1YAV9ds=", "domain": ".shopee.vn", "path": "/", "expires": 2254241360.868834, "size": 178, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_fbp", "value": "fb.1.1622890103617.407024356", "domain": ".shopee.vn", "path": "/", "expires": 1631297382, "size": 32, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "/", "expires": 1623523160, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "8d2065ee-c5eb-11eb-8d14-2cea7f904aca", "domain": ".shopee.vn", "path": "/", "expires": 2253610104.2893, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": '\\"lvFf1BsBVYuQETm0B2juZg==\\"', "domain": "shopee.vn", "path": "/", "expires": 2254241356.185802, "size": 34, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_PC_HYBRID_ID", "value": "81", "domain": "shopee.vn", "path": "/", "expires": -1, "size": 18, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }], "user_agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240", "action": "follow_shop", "liked": true, "shopAvatar": "8b462bb4b358601d14845ac8593e491f", "shopName": "KIDS-SHOP Tổng kho hàng MẸ &BÉ", "shopUserName": "tit201611"
    }

    await axios.post("https://hotaso.tranquoctoan.com/api_user/update", {
        data: productForUser,
        timeout: 50000
    },
        {
            headers: {
                Connection: 'keep-alive',
            }
        })
        .then(function (response) {
            //console.log(response.data);
            proxy = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
    return proxy
}

pptr = async () => {

    cookie_33 = [{
        "name": "_gali",
        "domain": ".shopee.vn",
        "value": "modal",
    },

    {
        "name": "cto_bundle",
        "domain": ".shopee.vn",
        "value": "7aUIo19PRE54aVE2NDRSS0pYN00lMkY2ejVuY1lwdk5EVmVyMllWbW5icjMwNVZjNEM0Y0o3dCUyRkhLVnB4JTJCZUJiVmp2WXVBYU11SkdzdEEyZkp1bHIlMkIlMkJVbkJ4NUl6TkluUFpMTVI3aEtMS3h5RG15UXU0WmtRRjVybGRJUk16TlNVNSUyRktWJTJGeTAlMkYyWHFiN2pTVHBKcE9CYXlUa09wNTQ3enNXNXMyR0JCNmZwRWQlMkJGSkElM0Q",
    },

    {
        "name": "_hjAbsoluteSessionInProgress",
        "domain": ".shopee.vn",
        "value": "0",
        "domain": ".shopee.vn",
        "domain": ".shopee.vn",
    },

    {
        "name": "_ga",
        "domain": ".shopee.vn",
        "value": "GA1.2.1533697554.1625934215",
    },

    {
        "name": "SPC_R_T_ID",
        "domain": ".shopee.vn",
        "value": "\"3xLtcMfGCle2BOHTJiidlSKSuKGu2bqfJ8x25Rk8abTEGm7WzePaJKMROWWdp2JHkGHr9YjGoBq30DNv7j0XYyc6iTPoKSChWj+8Pgw0dc8=\"",
    },

    {
        "name": "SPC_PC_HYBRID_ID",
        "domain": ".shopee.vn",
        "value": "15",
    },

    {
        "name": "_dc_gtm_UA-61914164-6",
        "domain": ".shopee.vn",
        "value": "1",
    },

    {
        "name": "_ga_M32T05RVZT",
        "domain": ".shopee.vn",
        "value": "GS1.1.1628638798.38.1.1628638852.6",
    },

    {
        "name": "csrftoken",
        "domain": ".shopee.vn",
        "value": "NYPFxwpnfqNNaQTiadBg5ytijblYmBQT",
    },

    {
        "name": "SPC_ST",
        "domain": ".shopee.vn",
        "value": "\".QWk4SWVjajMzZjU1RG5rTtQqCFQ9NwIltAGtu\/+ztgm4iFONd89NmMN5NrIjgxznXAmVAFd4zCfzWvJIQ+112v24V9No8qpAd9V8mdnrFAnkS8OzQtHWjP73zKi8WJnehliRcAI90i+jSZNezlPNcTI+loAnfWFvQYVqZS87yS4gUalF3dWAQBmAdiTx8IuU49ErUzfww3w73SU7TD5YTw==\"",
    },

    {
        "name": "welcomePkgShown",
        "domain": ".shopee.vn",
        "value": "true",
    },

    {
        "name": "SPC_R_T_IV",
        "domain": ".shopee.vn",
        "value": "\"OEGe2jMLQx883GxJOb97wA==\"",
    },

    {
        "name": "SPC_F",
        "domain": ".shopee.vn",
        "value": "tmVe59G0A0R61BB6E5wFWUbjForCDu3M",
    },

    {
        "name": "_gid",
        "domain": ".shopee.vn",
        "value": "GA1.2.95106939.1628638843",
    },

    {
        "name": "SPC_SI",
        "domain": ".shopee.vn",
        "value": "bfftocsg6.gQkpa4ZAXmj99NXdZzv6X74HmtqvWGKj",
    },

    {
        "name": "_med",
        "domain": ".shopee.vn",
        "value": "affiliates",
    },

    {
        "name": "_gcl_au",
        "domain": ".shopee.vn",
        "value": "1.1.1992316284.1625934205",
    },

    {
        "name": "AMP_TOKEN",
        "domain": ".shopee.vn",
        "value": "%24NOT_FOUND",
    },

    {
        "name": "REC_T_ID",
        "domain": ".shopee.vn",
        "value": "292efe6f-e19b-11eb-a44d-9440c9318890",
    },

    {
        "name": "SPC_U",
        "domain": ".shopee.vn",
        "value": "484530834",
    },

    {
        "name": "SPC_CLIENTID",
        "domain": ".shopee.vn",
        "value": "dG1WZTU5RzBBMFI2hbjlwqvqqsatgnmp",
    },

    {
        "name": "SPC_IA",
        "domain": ".shopee.vn",
        "value": "-1",
    },

    {
        "name": "REC_T_ID",
        "domain": ".shopee.vn",
        "value": "29302738-e19b-11eb-b3c2-48df37dd8e7c",
    },

    {
        "name": "SPC_T_ID",
        "domain": ".shopee.vn",
        "value": "\"3xLtcMfGCle2BOHTJiidlSKSuKGu2bqfJ8x25Rk8abTEGm7WzePaJKMROWWdp2JHkGHr9YjGoBq30DNv7j0XYyc6iTPoKSChWj+8Pgw0dc8=\"",
    },

    {
        "name": "_hjid",
        "domain": ".shopee.vn",
        "value": "e889bff3-1df4-481f-ad29-4febc75c5ca7",
    },

    {
        "name": "SPC_T_IV",
        "domain": ".shopee.vn",
        "value": "\"OEGe2jMLQx883GxJOb97wA==\"",
    },

    {
        "name": "_fbp",
        "domain": ".shopee.vn",
        "value": "fb.1.1625934205704.369403815",
    },

    {
        "name": "SPC_EC",
        "domain": ".shopee.vn",
        "value": "YW5ZeDc5YmcweXJDS0I4SUGz7jafO8uG0CKFnNqo7koRso3rr9kwSmbMLwBoDFO3JUQUaSZwYSoGS7H8EA9SGxyt1r2SV35kfypHh4sA3YRxlBFNomiCsihlydcb1S3cGfmPYe61SH0R8LTjIXT6tTgt234qA2jZOZzmJ1utQm8=",
    },

    {
        "name": "G_ENABLED_IDPS",
        "domain": ".shopee.vn",
        "value": "google",
        "domain": ".shopee.vn",

    }]
    //'--proxy-server=103.90.230.170:9043'
    let param = []
    // proxy1 = "27.72.105.18:4000"
    // let proxy_for_slave = "--proxy-server=" + proxy1
    // param.push(proxy_for_slave)
    // param.push('--ignore-certificate-errors')
    // data = ["1", "2", "3"]
    // data.forEach(async () => {
    //     console.log(param)
    //     const browser = await puppeteer.launch({
    //         //executablePath: chromiumDir,
    //         headless: false,
    //         devtools: false,
    //         args: param
    //     });

    //     const page = await browser.newPage();
    //     await page.authenticate({ username: "admin", password: "123456@" });
    //     await page.goto('https://shopee.vn');
    //     //await page.screenshot({ path: 'example.png' });

    //     await page.waitForTimeout(999999)
    //     await browser.close();
    // })

    const browser = await puppeteer.launch({
        //executablePath: chromiumDir,
        headless: false,
        devtools: false,
        // args: param
    });

    const page = await browser.newPage();
    cookie_33.forEach(async (item1) => {
        await page.setCookie(item1)
    })

    await page.waitForTimeout(4999)

    await page.goto('https://shopee.vn');
    //await page.screenshot({ path: 'example.png' });

    await page.waitForTimeout(999999)
    await browser.close();


}


thaTimSanPham = async (cookies, ref, shopId, productId) => {
    let result
    var xtoken = csrftoken()
    //cookie1 = 'SPC_F=ftkXrd3LRV3FoRfZ5kcoHwSY5d78Xm6L; REC_T_ID=81ad8fec-79c1-11ea-81e4-20283e97f834; SPC_SI=mall.1xkmF9uXdEws4WyH7FPyXoHeIY0TbjJt; SPC_PC_HYBRID_ID=66; _gcl_au=1.1.1464149860.1624597291; _med=affiliates; csrftoken=jLBs3EDU2Lh54KCi8IjFoizbJBAnutT6; SPC_SSN=o; SPC_WSS=o; _fbp=fb.1.1624597292289.991604540; SL_wptGlobTipTmp=1; SL_GWPT_Show_Hide_tmp=1; welcomePkgShown=true; UYOMAPJWEMDGJ=; SPC_IVS=; _hjid=4763d07d-dc65-4599-8c64-77cb6add498d; _hjFirstSeen=1; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.1633265567.1624597296; _dc_gtm_UA-61914164-6=1; _hjAbsoluteSessionInProgress=1; G_ENABLED_IDPS=google; SC_DFP=vhcQV1Kja5h6PutoG1wpm1cIkzqdfXRZ; SPC_U=59835481; SPC_CLIENTID=ZnRrWHJkM0xSVjNGlnxugxgagofdvdin; SPC_SC_UD=59835481; SPC_STK="aBhqJOuxdqRxrOtEg3OcFnFw8HVWMvbU3tSIZMc0hSUlEk5ACoimwPYdnZpOiOtFT4ArO64NBGtx7jP56EWXzp1Mth/v99GxgYxQ2deUuHbQ1C1MaXL19P9v1wL83BSQpvP5kNXDrRjKVBk6X4hMIuqqM9huOUQrI9LwKh0v49Y="; SPC_SC_TK=c7bf72b5582e63b682aab455718cd8eb; _ga=GA1.2.387551122.1586368264; SPC_EC=yb/Jm+hS3Gp+U5fALu+JiJuCm17uzZ43jUub19grMvPJupOkhYn0RMhH4GUFi7dpIYjpwB6Jv1AhHVOCc7kjOK4maI4eSawFb6MbjcQKDYBqTl2uYZLiVm3Ffzz21a0qKPSXpk0nsMvCmxZfDjV95g==; SPC_IA=1; cto_bundle=BeLR519xUk0wWEZpSzRNMjZBa3JqSGRzWnIlMkJLdHpIZUM1a251akVDRDFiMWNyazdQSllrUmwzRVRpd3glMkZPUGpyYU5FZXFvSWhIcnRmU3YzWW92azVrdk5hcGNReUJTNjBjTTNZbzVMSmp1c1FrZFlyRzJraVNQREo4SFglMkZLd1A1Mkh3JTJCTWswN0lNanhINTczbExoTElpd0l5ZyUzRCUzRA; _ga_M32T05RVZT=GS1.1.1624597294.1.1.1624597344.10; SPC_R_T_ID="1Uev1oQRBrfYKk4ZoEBd3SSWgCB874O+K6jOjSOY/rnBoBTL5zozBuRXQmtHICtFolyh9dFS/GLdvVayh+yQ3cfq1ukXZccgUV7jR28/1no="; SPC_T_IV="PoVo2NceWhk9z+OxGtb/Kw=="; SPC_R_T_IV="PoVo2NceWhk9z+OxGtb/Kw=="; SPC_T_ID="1Uev1oQRBrfYKk4ZoEBd3SSWgCB874O+K6jOjSOY/rnBoBTL5zozBuRXQmtHICtFolyh9dFS/GLdvVayh+yQ3cfq1ukXZccgUV7jR28/1no="'
    //
    cookie1 = '_gcl_au=1.1.1880724062.1627141003; REC_T_ID=f261e43a-ec94-11eb-bc0f-b49691a2b3aa; REC_T_ID=f26170ff-ec94-11eb-82be-9440c931b85c; SPC_F=mXnr4TPTC79iQWzukyiNoD3NaVtEULSU; _fbp=fb.1.1627141003294.1183923169; _hjid=c0bd8288-4e81-4d69-b3a7-33198455bfe4; G_ENABLED_IDPS=google; SPC_CLIENTID=bVhucjRUUFRDNzlpaewngkxelfbkgsuw; _med=affiliates; _fbc=fb.1.1627683302997.IwAR3q8MHWygEu5ianXinpgTiocjWMC9CD0-hib93hpPmIoNG9bwueyWZ1EKY?utm_source=an_17171860000; SC_DFP=1fE8Ls3L8j4m3Sq6iIRsLsURswD3FChg; SPC_SI=bfftocsg6.7hap0rPMyvI9ToWOyth107ni9beLtGBC; SL_wptGlobTipTmp=1; SL_GWPT_Show_Hide_tmp=1; csrftoken=5wxfs5HMZtK6VeaImZSE43Ec71bbhpz0; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.2023455834.1629399925; welcomePkgShown=true; _hjAbsoluteSessionInProgress=0; SPC_ST=".Z1VXeG1kRGc4STNXRllUVz7KKNeMlnezM1b6exe8K2Q1x4tI+BSr9eFHZcNwfZImgUJQxNNLQv6Q8U0x3GAmZXteYGW+T31pIuewmSwnbCjsdSo7F7LvDBLr9h9IaJHfAU+NhYJXhkAquOxhf6fzUVsurjbnwwi+QsWyquUJmOBxR/O3nzOuysHLiAlADlBC"; SPC_U=59835481; SPC_EC=YUNsRWFlWFVOblJCUmxNNreBw/lWRo2sf6+mqo3BsclvpQhbtXipjDIi+GlkZPSH0CG2X+YY+93gyf6N2Nuoa34mpPm6veKarbV7egsH/nTdU+1AwTkr1NBbhLNegriJ+UqixpRPcBmLmxkjfXUoxQ==; SPC_IA=1; _ga_M32T05RVZT=GS1.1.1629399924.16.1.1629399983.1; _ga=GA1.2.178787463.1627141005; cto_bundle=iddt2194T1ElMkZBSXc5YlhyWHd1eENBajU3eGo1NDhEM0VoUVhMWHJQcTZodHNQMDclMkJGOVFDdG1EU2VmJTJGM3Z3djN5UWVrRWJMVWcyenkyc3M5SHdjYjZlMmhrN1RJRnZNaUhlSDVNNnc5RFZaJTJGSGp0RGxqeTZtQ3dEdlpLWFY4VHlIYzZkTFBVb2g5VFpXUnZPaUc3QmdXRHJDZyUzRCUzRA; SPC_R_T_ID="UrJs9kdp9WKEgjYU0honzt8mCcwNWiObVOv3qv5hCTTKNz8I4kYA/8Ol4JcvFAq9uEDbQ4T/iSyfJoC9vTGorLRxTQc2t5TAh5zdpoS8PEM="; SPC_T_IV="VmA60YXwFa7gb2lCVd5Y5g=="; SPC_R_T_IV="VmA60YXwFa7gb2lCVd5Y5g=="; SPC_T_ID="UrJs9kdp9WKEgjYU0honzt8mCcwNWiObVOv3qv5hCTTKNz8I4kYA/8Ol4JcvFAq9uEDbQ4T/iSyfJoC9vTGorLRxTQc2t5TAh5zdpoS8PEM="'
    productId = 2302298723
    shopId = 138376383
    ref = 'https://shopee.vn/V%C3%AD-n%E1%BB%AF-%C4%91%E1%BA%B9p-gi%C3%A1-r%E1%BA%BB-c%E1%BA%A7m-tay-d%C3%A1ng-d%C3%A0i-MADLEY-nhi%E1%BB%81u-ng%C4%83n-cao-c%E1%BA%A5p-%C4%91%E1%BA%B9p-gi%C3%A1-r%E1%BA%BB-VD359-i.19608398.6544978139'
    //var data = JSON.stringify({ "shopid": shopId });
    url = "https://shopee.vn/api/v4/pages/like_items"
    data = { "shop_item_ids": [{ "shop_id": shopId, "item_id": productId }] }

    var config = {
        method: 'post',
        url: url,
        timeout: 5000,
        headers: {
            // 'x-csrftoken': xtoken,
            //    'referer': ref,
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


likeFeed = async (cookies, feed_link) => {
    cookies = [{ "name": "SPC_R_T_IV", "value": "orH\/uU4nFUrSbFTBfLJRZQ==", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0324, "size": 34, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_ID", "value": "ixE4\/dndXwK2KwmboLv2f6NVuxiEvL60FMOVaNMcAFNij4\/HyWYhvKnLJ+KZ09TXsodnupI6FsrDnP8fNaD9tXpVBwaaTemdXVvsfgsdEEk=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0323, "size": 118, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "\"kabYaaAdpK4+HVb8rcwDvA==\"", "domain": "shopee.vn", "path": "\/", "expires": 2267892676.7678, "size": 34, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_dc_gtm_UA-61914164-6", "value": "1", "domain": ".shopee.vn", "path": "\/", "expires": 1637172736, "size": 22, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "cto_bundle", "value": "KAhqQl9UdFF3QXYlMkJOVHlycFgwWDMxb24zWVRyeVdRYUp5b2hWTERxemNjWVl6VU9sWVlQZ1pvUEVRb3BmTWR0NElZYmpRbTFlb1hndFlQSHR5d0llUU1PeGJXN0s5dmVjMU1JZmJ0VnlsVXU0TTRucVolMkZPTjZwZ0FMcDZ6Wk1HSWZUQVhHekluNzdsUDNhMGE4VmkyaFNRaVRCVk9OTjdVJTJGQjlsMjlXWE1WNmk1SjQlM0Q", "domain": ".shopee.vn", "path": "\/", "expires": 1671336667, "size": 257, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga", "value": "GA1.2.335968157.1628895657", "domain": ".shopee.vn", "path": "\/", "expires": 1700244634, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "orH\/uU4nFUrSbFTBfLJRZQ==", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0325, "size": 32, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSessionUser_868286", "value": "eyJpZCI6ImYyMjA2N2Y4LWQyZWYtNTc4Yi1hNmY5LTFmMDkzY2NkOGRjYiIsImNyZWF0ZWQiOjE2MzcxNzI1NTI0MjUsImV4aXN0aW5nIjp0cnVlfQ==", "domain": ".shopee.vn", "path": "\/", "expires": 1668708665, "size": 137, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "ixE4\/dndXwK2KwmboLv2f6NVuxiEvL60FMOVaNMcAFNij4\/HyWYhvKnLJ+KZ09TXsodnupI6FsrDnP8fNaD9tXpVBwaaTemdXVvsfgsdEEk=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0325, "size": 116, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1637172550.136.1.1637172676.60", "domain": ".shopee.vn", "path": "\/", "expires": 1700244676, "size": 50, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "csrftoken", "value": "YaZmUBQb9zs0S8s0eHvelXiSCFTHxN6c", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_ST", "value": "\".OVA3WWdqSE5ka0FiQjJiep8cWxTydSdA+5SIQeKjLqTwqJrorx5sCy0wrcU3izkzPaAWMdcTkFAkTin8WNEZyKo2HOJLvngblB8MFr5RGciXo+5d5hM66shSyh8cgF59nX0hiB0GvhkUj6JnqWcyrl9CgFmHs3ObSrMqww1QfX2vJZ4Uz5oYSTxE\/cnW2SbiaTi7ZwYN8l9FspUBlXEVnQ==\"", "domain": ".shopee.vn", "path": "\/", "expires": 2267762914.5281, "size": 225, "httpOnly": true, "secure": true, "session": false, "sameSite": "None", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gcl_au", "value": "1.1.1528175714.1636690467", "domain": ".shopee.vn", "path": "\/", "expires": 1644466466, "size": 32, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "\/", "expires": 1637176153, "size": 21, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "\/", "expires": 1637174508, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "47ae3e1d-fc8a-11eb-a271-2cea7f8a68f0", "domain": ".shopee.vn", "path": "\/", "expires": 2259615640.4016, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_CLIENTID", "value": "OE9yWkhFa09oaWxaukakzuaojapluojf", "domain": ".shopee.vn", "path": "\/", "expires": 2259615690.5784, "size": 44, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_U", "value": "501658048", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0326, "size": 14, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "\/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_QPWSDCXHZQA", "value": "51752a42-eaa1-43fa-beb3-5538d746487f", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 48, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_F", "value": "8OrZHEkOhilZ1ecKaKVwZMu7m0NCvezq", "domain": ".shopee.vn", "path": "\/", "expires": 2259615640.4018, "size": 37, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gid", "value": "GA1.2.905691751.1636824035", "domain": ".shopee.vn", "path": "\/", "expires": 1637259034, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_SI", "value": "bfftocsg6.qFnf0apDEgrJR9IeEXLySOh39Q0lD4Uv", "domain": ".shopee.vn", "path": "\/", "expires": 1637259130.0325, "size": 48, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSession_868286", "value": "eyJpZCI6ImE0OWU5NjI2LTEzZWQtNDMyYy05MDgwLTFmZDYzY2JmYjUwNiIsImNyZWF0ZWQiOjE2MzcxNzI1NTI0NzB9", "domain": ".shopee.vn", "path": "\/", "expires": 1637174508, "size": 109, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_fbp", "value": "fb.1.1628895644862.1366285770", "domain": ".shopee.vn", "path": "\/", "expires": 1644948677, "size": 33, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_EC", "value": "anRRSkpyU0VJVXRoM2tiZ4Bt2qGGhOk2kIGhpGogBMMLJ5A+lHQoon+obXqs8TsTr8Zcmc1LzrfPKHto8nJ0fA6xWfl\/OfsbLZlKLY7KZtBURZW9FrOiPbjiHPwAYM7a+W44SHQ7QZemuYfGL0RHNK2H1Xwn8oDRr064KsoBLSU=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0326, "size": 178, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "shopee_webUnique_ccd", "value": "4tZ8Nm7Tot%2FeIQXYn3DaPQ%3D%3D%7CC4Ila15buU%2BfPzeyR7xi%2BX3B5q%2BXQyLKycCgZXywilodJeionC2mFjXRcJnMzS%2B2XZVeS1sV2i83mVqg5fE%3D%7CLxdfovRgazQfqmGs%7C03%7C3", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 175, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "\"PTpq3foQkJjBuNH6AR6x1u7xicE2WJkj8VR0zOe87jlaOKhKrT3vmY6FqY0FHSRNcSFr63iGjdBljY6O0PmWLEdvZGAFfgxQF7AzMfQUpOk=\"", "domain": "shopee.vn", "path": "\/", "expires": 2267892676.7679, "size": 118, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjid", "value": "15544db2-c78e-4c65-b3e9-d2e9d3df2b56", "domain": ".shopee.vn", "path": "\/", "expires": 1660431657, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_IA", "value": "1", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 7, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }]
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
    console.log("Feed ID: " + feed_id)
    //var data = JSON.stringify({ "shopid": shopId });
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

commentFeed = async (cookies, feed_link, feed_content) => {
    let result
    var xtoken = csrftoken()
    let cookie1 = ""
    cookies = [{ "name": "SPC_R_T_IV", "value": "orH\/uU4nFUrSbFTBfLJRZQ==", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0324, "size": 34, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_ID", "value": "ixE4\/dndXwK2KwmboLv2f6NVuxiEvL60FMOVaNMcAFNij4\/HyWYhvKnLJ+KZ09TXsodnupI6FsrDnP8fNaD9tXpVBwaaTemdXVvsfgsdEEk=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0323, "size": 118, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "\"kabYaaAdpK4+HVb8rcwDvA==\"", "domain": "shopee.vn", "path": "\/", "expires": 2267892676.7678, "size": 34, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_dc_gtm_UA-61914164-6", "value": "1", "domain": ".shopee.vn", "path": "\/", "expires": 1637172736, "size": 22, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "cto_bundle", "value": "KAhqQl9UdFF3QXYlMkJOVHlycFgwWDMxb24zWVRyeVdRYUp5b2hWTERxemNjWVl6VU9sWVlQZ1pvUEVRb3BmTWR0NElZYmpRbTFlb1hndFlQSHR5d0llUU1PeGJXN0s5dmVjMU1JZmJ0VnlsVXU0TTRucVolMkZPTjZwZ0FMcDZ6Wk1HSWZUQVhHekluNzdsUDNhMGE4VmkyaFNRaVRCVk9OTjdVJTJGQjlsMjlXWE1WNmk1SjQlM0Q", "domain": ".shopee.vn", "path": "\/", "expires": 1671336667, "size": 257, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga", "value": "GA1.2.335968157.1628895657", "domain": ".shopee.vn", "path": "\/", "expires": 1700244634, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "orH\/uU4nFUrSbFTBfLJRZQ==", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0325, "size": 32, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSessionUser_868286", "value": "eyJpZCI6ImYyMjA2N2Y4LWQyZWYtNTc4Yi1hNmY5LTFmMDkzY2NkOGRjYiIsImNyZWF0ZWQiOjE2MzcxNzI1NTI0MjUsImV4aXN0aW5nIjp0cnVlfQ==", "domain": ".shopee.vn", "path": "\/", "expires": 1668708665, "size": 137, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "ixE4\/dndXwK2KwmboLv2f6NVuxiEvL60FMOVaNMcAFNij4\/HyWYhvKnLJ+KZ09TXsodnupI6FsrDnP8fNaD9tXpVBwaaTemdXVvsfgsdEEk=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0325, "size": 116, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1637172550.136.1.1637172676.60", "domain": ".shopee.vn", "path": "\/", "expires": 1700244676, "size": 50, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "csrftoken", "value": "YaZmUBQb9zs0S8s0eHvelXiSCFTHxN6c", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_ST", "value": "\".OVA3WWdqSE5ka0FiQjJiep8cWxTydSdA+5SIQeKjLqTwqJrorx5sCy0wrcU3izkzPaAWMdcTkFAkTin8WNEZyKo2HOJLvngblB8MFr5RGciXo+5d5hM66shSyh8cgF59nX0hiB0GvhkUj6JnqWcyrl9CgFmHs3ObSrMqww1QfX2vJZ4Uz5oYSTxE\/cnW2SbiaTi7ZwYN8l9FspUBlXEVnQ==\"", "domain": ".shopee.vn", "path": "\/", "expires": 2267762914.5281, "size": 225, "httpOnly": true, "secure": true, "session": false, "sameSite": "None", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gcl_au", "value": "1.1.1528175714.1636690467", "domain": ".shopee.vn", "path": "\/", "expires": 1644466466, "size": 32, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "\/", "expires": 1637176153, "size": 21, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "\/", "expires": 1637174508, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "47ae3e1d-fc8a-11eb-a271-2cea7f8a68f0", "domain": ".shopee.vn", "path": "\/", "expires": 2259615640.4016, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_CLIENTID", "value": "OE9yWkhFa09oaWxaukakzuaojapluojf", "domain": ".shopee.vn", "path": "\/", "expires": 2259615690.5784, "size": 44, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_U", "value": "501658048", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0326, "size": 14, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "\/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_QPWSDCXHZQA", "value": "51752a42-eaa1-43fa-beb3-5538d746487f", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 48, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_F", "value": "8OrZHEkOhilZ1ecKaKVwZMu7m0NCvezq", "domain": ".shopee.vn", "path": "\/", "expires": 2259615640.4018, "size": 37, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gid", "value": "GA1.2.905691751.1636824035", "domain": ".shopee.vn", "path": "\/", "expires": 1637259034, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_SI", "value": "bfftocsg6.qFnf0apDEgrJR9IeEXLySOh39Q0lD4Uv", "domain": ".shopee.vn", "path": "\/", "expires": 1637259130.0325, "size": 48, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSession_868286", "value": "eyJpZCI6ImE0OWU5NjI2LTEzZWQtNDMyYy05MDgwLTFmZDYzY2JmYjUwNiIsImNyZWF0ZWQiOjE2MzcxNzI1NTI0NzB9", "domain": ".shopee.vn", "path": "\/", "expires": 1637174508, "size": 109, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_fbp", "value": "fb.1.1628895644862.1366285770", "domain": ".shopee.vn", "path": "\/", "expires": 1644948677, "size": 33, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_EC", "value": "anRRSkpyU0VJVXRoM2tiZ4Bt2qGGhOk2kIGhpGogBMMLJ5A+lHQoon+obXqs8TsTr8Zcmc1LzrfPKHto8nJ0fA6xWfl\/OfsbLZlKLY7KZtBURZW9FrOiPbjiHPwAYM7a+W44SHQ7QZemuYfGL0RHNK2H1Xwn8oDRr064KsoBLSU=", "domain": ".shopee.vn", "path": "\/", "expires": 2267892730.0326, "size": 178, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "shopee_webUnique_ccd", "value": "4tZ8Nm7Tot%2FeIQXYn3DaPQ%3D%3D%7CC4Ila15buU%2BfPzeyR7xi%2BX3B5q%2BXQyLKycCgZXywilodJeionC2mFjXRcJnMzS%2B2XZVeS1sV2i83mVqg5fE%3D%7CLxdfovRgazQfqmGs%7C03%7C3", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 175, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "\"PTpq3foQkJjBuNH6AR6x1u7xicE2WJkj8VR0zOe87jlaOKhKrT3vmY6FqY0FHSRNcSFr63iGjdBljY6O0PmWLEdvZGAFfgxQF7AzMfQUpOk=\"", "domain": "shopee.vn", "path": "\/", "expires": 2267892676.7679, "size": 118, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjid", "value": "15544db2-c78e-4c65-b3e9-d2e9d3df2b56", "domain": ".shopee.vn", "path": "\/", "expires": 1660431657, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_IA", "value": "1", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 7, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }]
    feed_content = ["đẹp quá", "chất quá", "ngon quá"]

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
    let message = feed_content
    let random_ms = Math.floor(Math.random() * (message.length - 1));
    console.log(message[random_ms])
    console.log(icons[random_icon])

    let message1 = message[random_ms] + " " + icons[random_icon]
    
    console.log(message1)
    process.exit()
    let url = "https://feeds.shopee.vn/api/proxy/comment"
    let data = { "feed_id": feed_id, "comment": message1, "mentions": [], "hashtags": [] }

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

(async () => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
    //shell.exec('Taskkill /F /IM Chrome.exe');
    day = new Date
    day = Date.parse(day)

    //await likeFeed("", "https://feeds.shopee.vn/share/AQzaE-zeBQCGOCsBAAAAAA==")
    //await commentFeed("", "https://feeds.shopee.vn/share/AQzaE-zeBQCGOCsBAAAAAA==")
    //await checkauto()
    //await test_update_all()
    // proxy = await proxy3g()
    // console.log(proxy)
    //await pptr()
    await update_actions()
    //await thaTimSanPham()
    //await test_post()
    //await disconnect()
    //await getKeyword()
    //await runAllTime()
    // await checkheader()
    // await disconnectDcomV2()

})();