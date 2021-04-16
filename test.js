const axios = require('axios').default;
shopeeUpdateSeoSanPhamDir = "http://auto.tranquoctoan.com/api_user/shopeeUpdateSeoSanPham"
var fs = require('fs');
let page
const exec = require('child_process').exec;


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
function csrftoken() {
    karakter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    PanjangKarakter = karakter.length;
    acakString = '';
    for (let i = 0; i < 32; i++) {
        PanjangKarakter = PanjangKarakter-1
        acakString += karakter[Math.floor(Math.random() * (PanjangKarakter ))];
        
        
    }
    return acakString;
}

followShop = async () => {
    var xtoken = csrftoken()
  cookie1 =  [
    {
      name: 'SPC_T_ID',
      value: '"BaUN/9IVWzGIC8Ztn78vYC84v9FUUE80sZ2VO2BcDcL1tiqJsfRfsBmUa2mITjPY4GSDk5aqTf+yP68oDZsSbBhc8T5obtIILrMqhD9B2sk="',
      domain: 'shopee.vn',
      path: '/',
      expires: 2249273881.574535,
      size: 118,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_T_IV',
      value: '"tPHLjnD8CBhfVN5W02todQ=="',
      domain: 'shopee.vn',
      path: '/',
      expires: 2249273881.574458,
      size: 34,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_R_T_ID',
      value: '"BaUN/9IVWzGIC8Ztn78vYC84v9FUUE80sZ2VO2BcDcL1tiqJsfRfsBmUa2mITjPY4GSDk5aqTf+yP68oDZsSbBhc8T5obtIILrMqhD9B2sk="',
      domain: '.shopee.vn',
      path: '/',
      expires: 2249273881.574378,
      size: 120,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_ga',
      value: 'GA1.2.1204780930.1616738570',
      domain: '.shopee.vn',
      path: '/',
      expires: 1681625872,
      size: 30,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_dc_gtm_UA-61914164-6',
      value: '1',
      domain: '.shopee.vn',
      path: '/',
      expires: 1618553932,
      size: 22,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_ga_M32T05RVZT',
      value: 'GS1.1.1618551542.18.1.1618553872.60',
      domain: '.shopee.vn',
      path: '/',
      expires: 1681625872,
      size: 49,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_R_T_IV',
      value: '"tPHLjnD8CBhfVN5W02todQ=="',
      domain: '.shopee.vn',
      path: '/',
      expires: 2249273881.574497,
      size: 36,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_gid',
      value: 'GA1.2.1298794536.1618547381',
      domain: '.shopee.vn',
      path: '/',
      expires: 1618640272,
      size: 31,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_SI',
      value: 'mall.vwEOlhEmLgrqgTRv7fLdmUCRlHQ9tNee',
      domain: '.shopee.vn',
      path: '/',
      expires: 1618640281.840121,
      size: 43,
      httpOnly: true,
      secure: true,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_gcl_au',
      value: '1.1.504149764.1616738566',
      domain: '.shopee.vn',
      path: '/',
      expires: 1624514565,
      size: 31,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_CLIENTID',
      value: 'YTFMUTlhNWNOcHY5xsgleersomlxljso',
      domain: '.shopee.vn',
      path: '/',
      expires: 2247458591.241191,
      size: 44,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_U',
      value: '402152443',
      domain: '.shopee.vn',
      path: '/',
      expires: 2249273881.840065,
      size: 14,
      httpOnly: false,
      secure: true,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'G_ENABLED_IDPS',
      value: 'google',
      domain: '.shopee.vn',
      path: '/',
      expires: 253402257600,
      size: 20,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_hjid',
      value: 'e0320224-78fb-43b4-8e4d-ec886fa9624a',
      domain: '.shopee.vn',
      path: '/',
      expires: 1648274570,
      size: 41,
      httpOnly: false,
      secure: false,
      session: false,
      sameSite: 'Lax',
      priority: 'Medium'
    },
    {
      name: 'AMP_TOKEN',
      value: '%24NOT_FOUND',
      domain: '.shopee.vn',
      path: '/',
      expires: 1618555143,
      size: 21,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_hjAbsoluteSessionInProgress',
      value: '0',
      domain: '.shopee.vn',
      path: '/',
      expires: 1618555681,
      size: 29,
      httpOnly: false,
      secure: false,
      session: false,
      sameSite: 'Lax',
      priority: 'Medium'
    },
    {
      name: 'REC_T_ID',
      value: 'e2857f9f-8df8-11eb-95de-3c15fb3af340',
      domain: '.shopee.vn',
      path: '/',
      expires: 2247458566.284116,
      size: 44,
      httpOnly: true,
      secure: true,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'SPC_F',
      value: 'a1LQ9a5cNpv9aEc9EpEjGk7orGX3rb8G',
      domain: '.shopee.vn',
      path: '/',
      expires: 2247458566.345423,
      size: 37,
      httpOnly: false,
      secure: true,
      session: false,
      priority: 'Medium'
    },
    {
      name: '_fbp',
      value: 'fb.1.1616738566487.1237170206',
      domain: '.shopee.vn',
      path: '/',
      expires: 1626329881,
      size: 33,
      httpOnly: false,
      secure: false,
      session: false,
      sameSite: 'Lax',
      priority: 'Medium'
    },
    {
      name: 'SPC_EC',
      value: 'NWLrzeji6n+5mzzCUEsr8Vj4I9etaEA4VwZ8RIF6ifr+bV728CAEqxdtTHy7eSB85LA1u1D/IulIhkqIFxp6BKviLKQkqmdQXeM8DpTCWW7WRh1+LTb1PhfMY4dcxbkJ7LsgxLCb3Fklhd8E+KurvfarnA0hLIVNJlRDYPAdIio=',
      domain: '.shopee.vn',
      path: '/',
      expires: 2249273881.839826,
      size: 178,
      httpOnly: true,
      secure: true,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'cto_bundle',
      value: 't_-XJV9vTHZjbDluMVYxUWF2OHA3aGZMWERud0thY0NhVGkwU3h6Nmd1QzZCNmc4aTduNCUyQjR0Q0xDNkJDcjJDcXVVeXRabjR3aXo2MEVEaE9Rc1lmekpqbm5lQmN0V2ZLM09jSUU3ZyUyRkFGaiUyQkdYdndha25HNUt2dVpkSkk5S1Riem5vWm0xRzhoMk0zREglMkZSYkIxa1plQiUyQmxnJTNEJTNE',
      domain: '.shopee.vn',
      path: '/',
      expires: 1652565652,
      size: 238,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    },
    {
      name: 'csrftoken',
      value: 'JqojUzxMEkCCxQGztZkn1OzlSLiyENc2',
      domain: 'shopee.vn',
      path: '/',
      expires: -1,
      size: 41,
      httpOnly: false,
      secure: false,
      session: true,
      priority: 'Medium'
    },
    {
      name: 'SPC_IA',
      value: '-1',
      domain: 'shopee.vn',
      path: '/',
      expires: 2249028615.939693,
      size: 8,
      httpOnly: false,
      secure: false,
      session: false,
      priority: 'Medium'
    }
  ]

      cookie2 = ""
      cookie1.forEach(row =>{
          if(row.name == "csrftoken"){
            cookie2 = cookie2 + row.name + "=" + xtoken + ";"
          }else{
            cookie2 = cookie2 + row.name + "=" + row.value + ";"
          }
        
    }) 
    //cookie2 = 'SPC_T_ID="ARVJPTtdpN98LavTgYpEmk11y8Cdpd99CXCt1rv3ec9AcL1Nz4WChIVI00TICvaXC+s/RSKufz+hTRTWGvr9tJTwaGYTgvhFS1E2e1bDzDA="; SPC_T_IV="bktTGXRnUbjNE0GoNIQxew=="; SPC_R_T_ID="ARVJPTtdpN98LavTgYpEmk11y8Cdpd99CXCt1rv3ec9AcL1Nz4WChIVI00TICvaXC+s/RSKufz+hTRTWGvr9tJTwaGYTgvhFS1E2e1bDzDA="; _ga=GA1.2.448962567.1617101190; _ga_M32T05RVZT=GS1.1.1618552008.15.1.1618554550.56; _dc_gtm_UA-61914164-6=1; cto_bundle=XFQXJV9KWGJFeFlrckk1YUNIMnhFck53WG9yR08zUnQ3VkpRNFRpb1NodVZmYjlzZHhVTlAxOUt3R2FwOUhjMERNbWwzZkd0bGtMRjdTSGdqMW9WSG4yVVElMkZhMkNZb3poTmpaJTJCMlJSaG4xVzhzSHpmOGxqTlJtbVY5WGJ5bVc1SFEwbkRNUEtjUHNXcVhLSVQ3VnBybXU2VnF3JTNEJTNE; _gcl_au=1.1.915858285.1617101187; SPC_CLIENTID=amVQRFpRZjhYbDREhreufiayayhjlolm; SPC_U=402722075; G_ENABLED_IDPS=google; _hjid=6b491a45-742a-4f0f-891c-48f67d46c465; SPC_EC=zCCCs6rcg5dKQMBACML8hsHS4aOwwA5cGNfas/8PuWopgYkQ3jjvbfHGLx1tzXzXCFahKxM775oaflEJIJXJ1dxbvZXOaTHlgP2HRKCRi1T3tyLLZPQxfNqPe0piWRil7o86Ljz5dqlf9E27iN6vfWEAszPgEW6j6lXupynd2ZM=; _fbp=fb.1.1617101187405.1989365948; SPC_F=jePDZQf8Xl4DDT0zlaqlDWn1ZAZNrtyY; SPC_R_T_IV="bktTGXRnUbjNE0GoNIQxew=="; _gid=GA1.2.836391838.1618547592; SPC_SI=mall.GHzJyQHnvtFmlDjIGeq6mAtgftfQ5slI; _hjAbsoluteSessionInProgress=1; AMP_TOKEN=%24NOT_FOUND; REC_T_ID=2f38675c-9145-11eb-bb45-f898ef6c80fb; csrftoken=SvAbTOlXDB4petEkKHiRqjp6aXJuMSOf; SPC_IA=-1'
    
    ref = "https://shopee.vn/shop/19608398/search"

console.log(xtoken)
//var data = JSON.stringify({"shopid":397564304});
var url = "https://shopee.vn/api/v0/buyer/like/shop/19608398/item/1406642221/"
var config = {
  method: 'post',
  url: url,
  headers: { 
    'x-csrftoken': xtoken,
    'referer': ref, 
    'cookie': cookie2
  },
};

console.log(config)

axios(config)
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});

        

   
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
   await followShop()
   //await getKeyword()
    //await runAllTime()
    //await checkheader()
    //await danhSachSanPham()

})();