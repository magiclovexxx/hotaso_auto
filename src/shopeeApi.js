const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');


const timViTriTrangSanPhamTheoTuKhoa = async (product, maxPage) => {
    // lay cookie

    
    keyword = product.keyword
    productId = product.product_id
   let productIndex = false
    for (let i = 0; i < maxPage; i++) {
        console.log("Trang: " + i)
        maxproduct = 50 * i
        search_api = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword="+keyword+"&limit=50&newest=" + maxproduct + "&order=desc&page_type=search&version=2"
        search_api = encodeURI(search_api)
        //console.log(shopeesearch)
        if (i == 0) {
            ref = "https://shopee.vn"
        }
        if (i == 1) {
            ref = "https://shopee.vn/search?keyword="+keyword
          
        } else {
            ref = "https://shopee.vn/search?keyword="+keyword+"page=" + i
        }

        ref = encodeURI(ref) 

        headersearch = {
            referer: ref,
            'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

        }

        try {
            datatest = await axios.get(search_api, {

                headers: headersearch
            })

        } catch (error) {
            console.log("Không lấy dc data")
            console.log(error)
            return false
        }

        try{
            data = datatest.data
            let checkProduct = 0
            if(data.items.length){
                console.log(data.items[0].item_basic.itemid)  
            }
            
            if(data.items.length){
                data.items.forEach(item => {   
                    
                    //console.log(item.item_basic.itemid)             
                    if(item.item_basic.itemid == productId){
                        checkProduct=1;                   
                    }
                });
            }
            if (checkProduct==1){
                
                productIndex = i
    
               break;
            }
        }catch(error){
            console.log(error)
        }
        
    }
    if(productIndex || productIndex == 0){
        return productIndex
    }else {
        return false
    }
    
}

const thaTimSanPham = async (product) => {

}


const layDanhSachSanPhamCuaShop = async (shop) => {

}


const timViTriSanPham = async (product) => {

}



module.exports = {

    timViTriTrangSanPhamTheoTuKhoa,
    thaTimSanPham,
    layDanhSachSanPhamCuaShop

}