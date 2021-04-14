const axios = require('axios').default;
shopeeUpdateSeoSanPhamDir = "http://auto.tranquoctoan.com/api_user/shopeeUpdateSeoSanPham"
var fs = require('fs');
let page
const exec = require('child_process').exec;


const puppeteer = require('puppeteer');
headersearch = {

    cookie: '_gcl_au=1.1.699808476.1607702732; SPC_IA=-1; SPC_EC=-; SPC_F=FXGW8llunAQuf5baIJM19NtcxbG2f9tj; REC_T_ID=b28c0ef6-3bca-11eb-a793-b49691844b48; SPC_U=-; _fbp=fb.1.1607702732348.1633153129; _hjid=0ecfc287-f2da-4004-826d-8ad89e4b90b8; _gcl_aw=GCL.1608656038.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; _med=cpc; _gac_UA-61914164-6=1.1608656040.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; SPC_SI=mall.pFUIKPdyxP5VnhVg50pEFlynHNuJRRuW; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _gid=GA1.2.1577912680.1609217942; csrftoken=7VQS9mkU5q5Q7WVXoz3ZpaISzMY6pmF0; cto_bundle=oonKA185cGlHMUdYYkQxRyUyQmdadTdzRjJFVk1KRHIycVBUUk1TcHloa3U2eVMwUkkyUnM5bkdvOGJwUUdERVRRZFZSRHQ0VmJaeFhBek9RbVVIMkwyY0FNTU13QXVCWTVGWXExcE1URFRTT25LMXY2UjBqeHpKT00wdXJCZG9hdlZoWjNhUFduTDZMWXJuendJRm5ocnF4TXVDQSUzRCUzRA; _ga_M32T05RVZT=GS1.1.1609303653.16.1.1609307858.0; _ga=GA1.1.802594605.1607702734; SPC_R_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="; SPC_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_R_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="',
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
    for (let i = 0; i < 2; i++) {

        page = 50 * i
        //shopeesearch = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF&limit=50&newest=50&order=desc&page_type=search&version=2"
        shopeesearch = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p&limit=50&newest=" + page + "&order=desc&page_type=search&version=2"
        shopInfo = "https://shopee.vn/api/v2/shop/get?shopid=74300615"
        productInfo = "https://shopee.vn/api/v2/item/get?itemid=6705447143&shopid=74300615"
        shopProduct = "https://shopee.vn/api/v2/search_items/?by=pop&entry_point=ShopByPDP&limit=100&match_id=19608398&newest=000&order=desc&page_type=shop"
        keywordApi = "https://shopee.vn/api/v4/search/search_hint?keyword=v%C3%AD%20n%E1%BB%AF&search_type=0&version=1"
        search_api = "https://shopee.vn/api/v2/search_items/?by=relevancy&keyword=v%C3%AD%20n%E1%BB%AF&limit=50&newest=" + page + "&order=desc&page_type=search&version=2"
        //console.log(shopeesearch)
        if (i == 0) {
            ref = "https://shopee.vn"
        }
        if (i == 1) {
            ref = "https://shopee.vn/search?keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p"
        } else {
            ref = "https://shopee.vn/search?keyword=v%C3%AD%20n%E1%BB%AF%20%C4%91%E1%BA%B9p&page=" + i
        }
        headersearch = {

            cookie: '_gcl_au=1.1.699808476.1607702732; SPC_IA=-1; SPC_EC=-; SPC_F=FXGW8llunAQuf5baIJM19NtcxbG2f9tj; REC_T_ID=b28c0ef6-3bca-11eb-a793-b49691844b48; SPC_U=-; _fbp=fb.1.1607702732348.1633153129; _hjid=0ecfc287-f2da-4004-826d-8ad89e4b90b8; _gcl_aw=GCL.1608656038.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; _med=cpc; _gac_UA-61914164-6=1.1608656040.EAIaIQobChMIi8qo2Ybi7QIVTT5gCh2--ggXEAYYAiABEgK-1_D_BwE; SPC_SI=mall.pFUIKPdyxP5VnhVg50pEFlynHNuJRRuW; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _gid=GA1.2.1577912680.1609217942; csrftoken=7VQS9mkU5q5Q7WVXoz3ZpaISzMY6pmF0; cto_bundle=oonKA185cGlHMUdYYkQxRyUyQmdadTdzRjJFVk1KRHIycVBUUk1TcHloa3U2eVMwUkkyUnM5bkdvOGJwUUdERVRRZFZSRHQ0VmJaeFhBek9RbVVIMkwyY0FNTU13QXVCWTVGWXExcE1URFRTT25LMXY2UjBqeHpKT00wdXJCZG9hdlZoWjNhUFduTDZMWXJuendJRm5ocnF4TXVDQSUzRCUzRA; _ga_M32T05RVZT=GS1.1.1609303653.16.1.1609307858.0; _ga=GA1.1.802594605.1607702734; SPC_R_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="; SPC_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_R_T_IV="JlfVIc0gll7Lnf2hf9gUZw=="; SPC_T_ID="MHYDKro2Fd4NUQJZR4w7Fo6d9p0Riyckd4IyA9QwUfZ9dHG982W1hn7Bh6ixp6C5652W0aR87Qs0OcPQ1JpOLzC7LCayCB0AgMfqsvAw21s="',
            referer: ref,
            'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

        }

        try {
            datatest = await axios.get(productInfo, {

                headers: headersearch
            })

        } catch (error) {
            console.log("Không lấy dc data")
            console.log(error)
        }
        data = datatest.data
        console.log(data.item.name)
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

        cookie: '_gcl_au=1.1.938566333.1617273793; _fbp=fb.1.1617273794307.353320297; REC_T_ID=0fb84f6d-92d7-11eb-a30a-20283e7222a6; SPC_IA=-1; SPC_F=3oYIU4cdWz7SEZecUPBGEu1wozs1HKsj; _hjid=09fcf785-f3a3-4562-9ca9-888b7492603d; G_ENABLED_IDPS=google; csrftoken=W311g2knwG7OHfuRgTkWawGGaI0b6k3r; SPC_SI=mall.h3tDsUqlOpaSzCYb0P3ZmEwsDckzEAn9; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.1003221755.1618428463; _dc_gtm_UA-61914164-6=1; SPC_U=302982579; SPC_CLIENTID=M29ZSVU0Y2RXejdTgfkwfwsxczwvbvtt; SPC_EC=jpsvV9KSkgz02w+D2U1Ockdelmb7bgTbJ5WKxVqcN6Y8vV1gvOc3DCXcQ7u/Hy8wO1HltMJWjJXImr3hiel2+rpphJXnw/7iQaOOZWjIQFnjSlMqh2px5scb2AhrZTd2/sgSIBqzHApdOrhZz324Qz4ffL79D1VesJH8Yu09EuE=; _ga=GA1.2.1419123639.1617273797; welcomePkgShown=true; _hjAbsoluteSessionInProgress=0; SPC_R_T_ID="ijQflNtKJ3LA+XbAcVyBYXx3+7eAYWg/RnJPIp0i5t+OXqR5bN02zSNcod2bI+cP99EvVGKjQwVfe0CnseNL885+/Rq2h71YtrVzMbIoW1A="; SPC_T_IV="erVZnyotLnIsPuIwtGlLgA=="; SPC_R_T_IV="erVZnyotLnIsPuIwtGlLgA=="; SPC_T_ID="ijQflNtKJ3LA+XbAcVyBYXx3+7eAYWg/RnJPIp0i5t+OXqR5bN02zSNcod2bI+cP99EvVGKjQwVfe0CnseNL885+/Rq2h71YtrVzMbIoW1A="; cto_bundle=lA6Pul9vUmtzME5CczZLV0l4MXpWSWdkbUNGQURUQVN1VHB0OG1la3NLUG5LMXZGekcySW92ZVlRWU5JNlpaNUJHZGtOTmlqN0hXeVluTVVrWCUyRkJXJTJGUEthVHQ3TTkxR0Z1Njlkakg0JTJCVTdEYzJQeGxKa0kxY3IwcGttcDBIZkV1blNHdGdic2d0dFlGQTI1OVNscm05aHZKTUElM0QlM0Q; _ga_M32T05RVZT=GS1.1.1618428459.2.1.1618428550.37',
        referer: ref,
        'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'
    
    }
    api_link = "https://banhang.shopee.vn/api/marketing/v3/pas/suggest/keyword/?"
    api_link = "https://banhang.shopee.vn/api/marketing/v3/pas/suggest/keyword/?SPC_CDS=c8f21a37-be4e-4785-8f2b-36e633f35975&SPC_CDS_VER=2&keyword=v%C3%AD+n%E1%BB%AF+c%E1%BA%A7m+tay+min&count=100&placement=0&itemid=4485827137"
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

likeApi = async () => {
    ref = "https://shopee.vn/shop/41347209/search"
    headersearch = {

        cookie: 'SPC_F=FXGW8llunAQuf5baIJM19NtcxbG2f9tj; REC_T_ID=b28c0ef6-3bca-11eb-a793-b49691844b48; _fbp=fb.1.1607702732348.1633153129; _hjid=0ecfc287-f2da-4004-826d-8ad89e4b90b8; G_ENABLED_IDPS=google; _gcl_au=1.1.820952038.1615519092; SPC_CLIENTID=RlhHVzhsbHVuQVF1ywgyfgcpmuqhjnkt; UYOMAPJWEMDGJ=; SPC_IVS=; SL_wptGlobTipTmp=1; SL_GWPT_Show_Hide_tmp=1; csrftoken=6XhtUlc2LN5Va1lAj4VASFJ3nagqUiCX; welcomePkgShown=true; SPC_SC_SA_UD=; SPC_SC_SA_TK=; SC_DFP=JSPq2FITfRxSJN7CglahERqSERR4cr5w; SPC_U=59835481; SPC_EC=8LzCCFjj03jNGJFCcCdZA3C890xf6gmr9oHOTTv54cp+4Z3FzpZ04c1aReNB3mscsIckOBVEj6Vwgxo75yUDCp30/EEeU9Mo3esR+RhLwO4QJVOZc89CMyfqh3Fi+0yJvCjvZWy9HIUfQlzHkIZBEw==; SPC_SC_UD=59835481; SPC_STK="oP6Wb/HMM0i7gOZASuRm54ek86S2HSB6aMsLlj4l27T8O5VuWgZXoRPAC1Tpcpkd3OXHIfmp3wgMP3m/4VuoC1w75efmiAFhTHACMc50uP/SMlyrkDPaupkO3tfPwZ9JTqS1eBKmz7uZF23AQ1bjY6SuraMx2cGhdkCBC3OLHro="; SPC_SC_TK=8f2e988e1bf1ea2f82a686b7de4363fe; SPC_IA=1; _med=refer; _gid=GA1.2.1088538504.1618306720; SPC_SI=mall.JLrT3oN4fvSdK5QvgWjfCkAoal0Cc9yR; root_csrftoken=6f951fd4-958e-46a0-a378-9f9e6429fc3d; _hjAbsoluteSessionInProgress=0; _ga=GA1.2.802594605.1607702734; cto_bundle=NPKUT185cGlHMUdYYkQxRyUyQmdadTdzRjJFVkVqMnREMXFpVG1Od2VtTjhnazFJUkQlMkZnUTUxMEh0Z0o2clRQaHhQJTJCNWxSM2JYSDQwcWNaJTJGZGloSThUNEFrR2NRNTdNc20yc0czWTBOeE1hTFVKbFVGRHFLWUgwMURaJTJGUTluMnJBSXV1TzV3VXNvSjBtYXpJVVVsM1h4UVozb1h3JTNEJTNE; SPC_R_T_ID="2VhsZ3fp/ApYl7H6yTpFVIrdEouZP3A07z8Fy26fvEZrLUY0QCMTQukSkbVy37lArj+T56zHceQMSwKF1eD6osuKgYao2aSm56nZ6UnUYXU="; SPC_T_IV="KTRx97TMSlLZy+ARN1zziA=="; SPC_R_T_IV="KTRx97TMSlLZy+ARN1zziA=="; SPC_T_ID="2VhsZ3fp/ApYl7H6yTpFVIrdEouZP3A07z8Fy26fvEZrLUY0QCMTQukSkbVy37lArj+T56zHceQMSwKF1eD6osuKgYao2aSm56nZ6UnUYXU="; _dc_gtm_UA-61914164-6=1; _ga_M32T05RVZT=GS1.1.1618439591.83.1.1618441123.49',
        referer: ref,
        'if-none-match-': '55b03-ff02d66557b09ab6e5cb5a4780992ba7',
        "x-csrftoken" : "6XhtUlc2LN5Va1lAj4VASFJ3nagqUiCX",
        "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.76",
        "accept-encoding": "gzip, deflate, br",
    }
    api_link = "https://banhang.shopee.vn/api/marketing/v3/pas/suggest/keyword/?"
    api_link = "https://shopee.vn/api/v0/buyer/like/shop/41347209/item/1825268282/"
    keyword = "Ví nữ cầm tay mini"
    
    productIds = [
        
    ]

    try {
        axios.post(api_link, {
            headers: headersearch
          })
          .then((response) => {
            console.log(response)
           
          })
          .catch((error) => {
           
          })
        }catch(error){
            console.log(error)
        }
        

   
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

    console.log((await page.goto('https://shopee.vn/search?keyword=v%C3%AD%20n%E1%BB%AF')).request().headers())
    await page.waitFor(10000)
    getProduct = await page.evaluate(() => {

        // Class có link bài đăng trên profile          
        let titles = document.querySelectorAll('[data-sqe="link"]');
        // check sản phẩm ads
        //document.querySelectorAll('[data-sqe="link"]')[0].children[0].children[0].children[0].children[1].children[0].dataset.sqe
        let listProductLinks = []
        titles.forEach((item) => {
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
                listProductLinks.push("")
            } else {
                listProductLinks.push(item.href)
            }

        })
        return listProductLinks
    })
    console.log(getProduct)
    console.log(getProduct.length)
}

getKeyword = 

(async () => {
   await likeApi()
   //await getKeyword()
    //await runAllTime()
    //await checkheader()
    //await danhSachSanPham()

})();