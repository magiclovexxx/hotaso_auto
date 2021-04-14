const axios = require('axios').default;
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');


const timViTriTrangSanPhamTheoTuKhoa = async (product, maxPage) => {
    // lay cookie
    
    keyword = product.keyword.toLowerCase()
    productId = product.product_id
    console.log("Id sản phẩm: " + productId)
   let productIndex = 0
    for (let i = 1; i <= maxPage; i++) {
        console.log("Trang: " + i)
        maxproduct = 50 * (i-1)
        search_api = "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword="+keyword+"&limit=50&newest=" + maxproduct + "&order=desc&page_type=search&version=2"
        search_api = encodeURI(search_api)
        //console.log(shopeesearch)
        if (i == 1) {
            ref = "https://shopee.vn"
        }
        if (i == 2) {
            ref = "https://shopee.vn/search?keyword="+keyword
          
        } else {
            ref = "https://shopee.vn/search?keyword="+keyword+"page=" + i
        }

        ref = encodeURI(ref) 

        headersearch = {
            referer: ref,
            'if-none-match-': ' 55b03-362c8065febe2677f1d3f36f302b86c8'

        }
        let datatest
        console.log(search_api)
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
            checkProduct = 0
          
            if(data.items){
                let itemid3  = "" 
                itemid3 = data.items[0].item_basic.itemid
               
                console.log("----" + itemid3)  
                
                data.items.forEach(item => {                       
                   
                    let itemid2  = ""   
                    itemid2 = item.item_basic.itemid  
                   
                    console.log(itemid2) 

                    if( itemid2 == productId){
                        console.log("đã tìm thấy sản phẩm id: " + itemid2)  
                        checkProduct=1; 
                        //break;    
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
    if(productIndex){
        return productIndex
    }else {
        return 0
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