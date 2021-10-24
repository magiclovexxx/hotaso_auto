require('dotenv').config();
const axios = require('axios').default;
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const https = require('https');

mode = process.env.MODE


// lấy id các danh mục sản phẩm
get_categories = async () => {

  let param = [
    // `--user-data-dir=${profile_dir}`,      // load profile chromium
    '--disable-gpu',
    '--no-sandbox',
    '--lang=en-US',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
  ]

  const browser = await puppeteer.launch({
    //executablePath: chromiumDir,
    headless: true,
    args: param

  });
  let categories_id = []
  try {
    const page = await browser.newPage();
    await page.goto('https://shopee.vn/');
    await page.waitForTimeout(3000)
    await page.mouse.click(10, 30)
    // for (i = 0; i < 10; i++) {
    //   timeout = Math.floor(Math.random() * (3000 - 2000)) + 2000;
    //   await page.waitForTimeout(timeout)
    //   await page.keyboard.press('PageDown');
    // }
    // console.log("--- Start get category ---")
    // let categories_id = await page.evaluate(() => {
    //   cate = []
    //   links = document.querySelectorAll('footer a')
    //   links.forEach(e => {

    //     x = e.href.split(".")
    //     if (x.length == 4) {
    //       links.forEach(f => {
    //         xx = f.href.split(".")
    //         if (xx.length == 3) {
    //           xxx = f.href.includes(x[2])
    //           if (xxx) {
    //             parent_name = f.textContent
    //           }

    //         }
    //       })

    //       category = {
    //         category_id: 0,
    //         parent_id: 0,
    //         category_name: ""
    //       }

    //       category.category_id = x[3]
    //       category.parent_id = x[2]
    //       category.category_name = e.textContent + " - " + parent_name
    //       cate.push(category)
    //       console.log(category)
    //     }
    //   })
    //   //console.log(cate)

    //   return cate
    // })

    let cookies1 = await page.cookies()
    let data = {
      cookie: "",
      categories: []
    }
    data.cookie = cookies1
    data.categories = categories_id
    console.log("Tổng số category: " + categories_id.length)
    await browser.close();
  } catch (error) {

  }


  return data

}

// lấy id shop các sản phẩm trong 100 trang
//https://shopee.vn/api/v4/search/search_items?by=relevancy&limit=60&match_id=11035568&newest=0&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2

get_product_with_location = async (cookies, category) => {
  console.log("Lấy danh sách sản phẩm theo địa điểm: ")

  let product3 = []
  let location = ["Hà Nội", "TP. Hồ Chí Minh", "An Giang", "Bà Rịa-Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tây", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hậu Giang", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lào Cai", "Lạng Sơn", "Lâm Đồng", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên – Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"]
  if (mode == "DEV") {
    location = ["Hà Nội"]
  }

  // lần lượt từng tỉnh
  for (let i = 0; i < location.length; i++) {

    let pros = await get_product(cookies, location[i], category)
    product3 = product3.concat(pros)
  }

  console.log("location 3: " + product3.length)
  return product3

}

get_product_with_category = async (cookies) => {

  //let location = ["Hà Nội", "TP. Hồ Chí Minh", "An Giang", "Bà Rịa-Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tây", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hậu Giang", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lào Cai", "Lạng Sơn", "Lâm Đồng", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên – Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"]

  /*   */

  let products = []
  let categories = [{ category_id: '11036760', parent_id: '11036670', category_name: 'Đèn' }]

  // lần lượt từng danh mục
  for (let i = 0; i < categories.length; i++) {


    let pros = await get_product_with_location(cookies, categories[i])
    products = products.concat(pros)
    console.log(categories[i].category_name)
    console.log(pros.length)
  }

  return products

}



get_product = async (cookies, loc, category) => {
  console.log("Lấy danh sách sản phẩm")

  let category_id = category.category_id
  let category_name = category.category_name
  let cookie1 = ""
  let product1 = []
  let shopids = []
  cookies.forEach((row, index) => {
    cookie1 = cookie1 + row.name + "=" + row.value
    if (index != (cookies.length - 1)) {
      cookie1 = cookie1 + "; "
    }

  })
  let max = 100
  if (mode == "DEV") {
    max = 5
  }
  for (let i = 1; i < max; i++) {
    let newest = 60 * i;

    let get_item_api = "https://shopee.vn/api/v4/search/search_items?by=relevancy&limit=60&locations=" + loc + "&match_id=" + category_id + "&newest=" + newest + "&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2"
    get_item_api = "https://shopee.vn/api/v4/search/search_items?by=sales&limit=60&locations=" + loc + "&match_id=" + category_id + "&newest=" + newest + "&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2"

    get_item_api = encodeURI(get_item_api)

    ref = "https://shopee.vn/%C3%81o-Kho%C3%A1c-cat.11035567.11035568?locations=" + loc + "&page=" + i
    ref = encodeURI(ref)
    headersearch = {
      'x-api-source': 'pc',
      'x-shopee-language': 'vi',
      'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
      referer: ref,
      'cookie': cookie1
    }

    await axios.get(get_item_api, {
      headers: headersearch
    })
      .then(async function (response) {
        let data = response.data

        //console.log(data.items.length)
        try {
          if (data.items.length) {
            let item2 = data.items
            for (let a = 0; a < item2.length; a++) {

              //item2.forEach(async (s) => {
              s = item2[a];
              let pro = {
                product_id: 0,
                shop_id: 0,
                category_id: "",
                category_name: ""
              }

              if (shopids.includes(s.shopid) == false) {
                //console.log(shopids)
                pro.product_id = s.itemid
                pro.shop_id = s.shopid
                pro.category_id = category_id
                pro.category_name = category_name

                shopids.push(s.shopid)
                product1.push(pro)

                let phones = await get_shop_phone(cookies, product1)

                product1 = []
              }
            }
            //})
          }
        } catch (error) {

        }

        // cookie3 = response.headers['set-cookie']
        // console.log(cookie3)
        // console.log(cookie1)
      })
      .catch(function (error) {
        //console.log(error);

        console.log(" ---------- Lỗi khi lấy thông tin sản phẩm -- Hoặc hết trang ----------");

      })

  }

  return product1
}


get_shop_phone = async (cookies, product) => {

  cookie1 = ""

  cookies.forEach((row, index) => {
    cookie1 = cookie1 + row.name + "=" + row.value
    if (index != (cookies.length - 1)) {
      cookie1 = cookie1 + "; "
    }

  })

  ref = "https://shopee.vn/"

  headersearch = {
    'x-api-source': 'pc',
    'x-shopee-language': 'vi',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    referer: ref,
    'cookie': cookie1

  }

  shop_phone = []

  // chạy 100 trang kết quả
  for (let i = 0; i < product.length; i++) {
    //for (let i = 1; i < 2; i++) {
    let shop_id = product[i].shop_id
    let category_id = product[i].category_id
    let category_name = product[i].category_name

    let get_item_api = "https://shopee.vn/api/v4/product/get_shop_info?shopid=" + shop_id

    await axios.get(get_item_api, {
      headers: headersearch
    })
      .then(async function (response) {
        data = response.data
        if (data) {
          try {
            let shop_username = data.data.account.username

            if (shop_username) {

              ref = "https://shopee.vn/"

              headersearch = {
                'x-api-source': 'pc',
                'x-shopee-language': 'vi',
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
                referer: ref,
                'cookie': cookie1

              }

              let get_shop_api = "https://shopee.vn/api/v4/shop/get_shop_detail?sort_sold_out=0&username=" + shop_username
              await axios.get(get_shop_api, {
                headers: headersearch
              })
                .then(async function (response) {
                  data = response.data
                  if (data) {
                    try {
                      let description = data.data.description
                      if (description) {
                        let s = data.data
                        //console.log(description)
                        let regexp_phone = /(:?\+[Il]* ?)?[\d()–-][\d ()\-|.|?"–OОli_|]{6,20}[\dOОli|]\d/gim
                        let regexp_email = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm

                        let phones = description.match(regexp_phone);
                        let email = description.match(regexp_email);
                        //console.log(phones)


                        if (phones || email) {

                          console.log("Tìm thấy thông tin shop: " + shop_username + " -- " + shop_id + " -- " + category_name)
                          let shop_info = {
                            shop_id: 0,
                            shop_username: "",
                            cover: "",
                            follower_count: "",
                            rating_start: "",
                            location: "",
                            item_count: 0,
                            name: "",
                            phone: [],
                            email: [],
                            category_id: "",
                            category_name: ""

                          }

                          shop_info.shop_id = shop_id
                          shop_info.shop_username = shop_username
                          shop_info.cover = s.cover
                          shop_info.follower_count = s.follower_count
                          shop_info.location = s.shop_location
                          shop_info.rating_start = s.rating_star
                          shop_info.item_count = s.item_count

                          if (phones) {
                            shop_info.phone = phones
                          }
                          if (email) {
                            shop_info.email = email
                          }

                          shop_info.category_id = category_id
                          shop_info.category_name = category_name

                          shop_phone.push(shop_info)
                          const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                          await axios.post("https://beta.hotaso.vn/api_user/data_shop", {
                            data: shop_phone,
                            timeout: 50000
                          },
                            {
                              headers: {
                                Connection: 'keep-alive',
                                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
                              },
                              httpsAgent: httpsAgent
                            })
                            .then(function (response) {
                              console.log("Lưu thông tin shop ok: " + response.data);
                            })
                            .catch(function (error) {
                              console.log(error);
                            });
                          shop_phone = []

                        }
                      }

                    } catch (error) {
                      console.log("--- Lỗi khi quét thông tin ---")
                    }
                  }
                })
                .catch(function (error) {
                  console.log("--- Lỗi khi lấy thông tin chi tiết của shop ---")
                })
            }

          } catch (error) {
            console.log("Không thấy username của shop")
          }
        }
      })
      .catch(function (error) {
        //console.log(error);
        console.log(" ---------- Lỗi khi lấy thong tin shop ----------");
      })
  }


  return shop_phone
}


get_product_phone = async (cookies, product) => {

  cookie1 = ""
  product_id = product.product_id
  shop_id = product.shop_id

  cookies.forEach((row, index) => {
    cookie1 = cookie1 + row.name + "=" + row.value
    if (index != (cookies.length - 1)) {
      cookie1 = cookie1 + "; "
    }

  })

  headersearch = {
    'x-api-source': 'pc',
    'x-shopee-language': 'vi',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    referer: ref,
    'cookie': cookie1

  }

  shop_phone = []
  shop_username.forEach(async (item) => {

    // chạy 100 trang kết quả
    let max = 100
    if (mode == "DEV") {
      max = 2
    }
    for (let i = 0; i < max; i++) {

      let get_item_api = "https://shopee.vn/api/v2/item/get?itemid=" + product_id + "&shopid=" + shop_id

      await axios.get(get_item_api, {
        headers: headersearch
      })
        .then(function (response) {
          data = response.data
          if (data) {
            try {
              let description = data.data.description

              let regexp = /<(.*?)>/g;

              let phones = description.matchAll(regexp);

              if (phones) {
                shop_phone.push(phones)
              }

            } catch (error) {
              console.log("Không thấy username của shop")
            }
          }
        })
        .catch(function (error) {

          console.log(" ---------- Lỗi khi lấy thông tin sản phẩm ----------");

        })
    }
  })

  return shop_username
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

  let data = await get_categories()
  categories = data.categories
  //console.log(categories)
  //const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  //await axios.post("https://beta.hotaso.vn/api_user/shopee_categories", {
  //  data: categories,
  //  timeout: 500000
  //},
  //  {
  //    headers: {
  //      Connection: 'keep-alive',
  //      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
  //    },
  //    httpsAgent: httpsAgent
  //  })
  //  .then(function (response) {
  //    console.log("Lưu categories: " + response.data);
  //  })
  //  .catch(function (error) {
  //    console.log(error);
  //  });
  //process.exit()
  //categories = [data.categories[0]]
  // lần lượt từng danh mục

  let max_count = categories.length
  if (mode == "DEV") {
    max_count = 1
  }

  let category
  await axios.get("https://beta.hotaso.vn/api_user/get_shopee_categories")
    .then(function (response) {
      category = response.data
      // cookie3 = response.headers['set-cookie']

      // console.log(cookie1)
    })
    .catch(function (error) {
      console.log(error);

    })

  let pros = await get_product_with_location(data.cookie, category)

  //let phones = await get_shop_phone(data.cookie, pros)


  //console.log(phones)
  console.log("Tổng số shop cần quét: " + pros.length)
  console.log("Tổng số shop có thông tin: " + phones.length)



  //let shop_username = await get_shop_username(shop_ids, data.cookie)

})();