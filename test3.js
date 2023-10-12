const { firefox, chromium } = require("playwright");

(async () => {
//     const browser = await firefox.launchPersistentContext('E:\\profile',{
//         headless:false
//     })
//     const page = await browser.pages()[0];

//     await page.goto('https://shopee.vn/%C3%81o-thun-tay-l%E1%BB%A1-HADES-ALTERNATIVE-TEE-%C3%A1o-thun-ch%E1%BB%AF-H-tay-ng%E1%BA%AFn-nam-n%E1%BB%AF-hades-ch%E1%BA%A5t-cotton-cao-c%E1%BA%A5p-GTM-i.168758605.17881621493?sp_atk=24853a71-2e59-4b58-b697-e9df3287f51a&xptdk=24853a71-2e59-4b58-b697-e9df3287f51a')
   
//     await page.waitForTimeout(5000)

    
//    let check_2= await page.$(`text=thêm vào giỏ aaaaaaaa`)
//    if(check_2){
//     console.log("Check 22222222222")
//     await check_2.click()
//    }
   
//     //await page.goto('https://browserleaks.com/canvas');
//     await page.waitForTimeout(999999)

const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=th%E1%BB%8Bt%20l%E1%BB%A3n%20g%C3%A1c%20b%E1%BA%BFp&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2',
  headers: { 
    '1dbb7e7d': '_8>\'\'?4=&#CCRL1"k\'/gN:)O.,\\7oq:lC5L1FKI]@c5\\3C=VJX`Y$K!n<Y%bki<ME#@U-+oo530!^F=\'9R\\fHUB.]dW@YMCi5@_*.bMHmo\'ZhXGaS;*o3,G:\\2EihEUai7la9sE,C71"mct8/EVA*=cD;S\'Nob:mT;d!o9kThpk-OrlqH\\tJEa@#g=^0sMFrU$(8au;).EQ\\6hhdA(f\'-:<`jLOFNs#\\p>/Q$U2FDg=>8M1/*On53Y,uh_6mHP,TMu"iJ43tATp"ffWTb[(*pZn5:fM:A),E17#<XGHH\'MaoFDX2N7uR=kb)u(7#94!12;XW$4bt(/jN!"pE\'Za^OUR>E+d\\c\'j-f^SP]O??GTL?"0X8F$QUI,kXCd[G+mU"*4s^oF.kG_k$n_F?', 
    '2805aa14': 'f)<W3<e<]Y5]YB[(qjX456!K7', 
    'authority': 'shopee.vn', 
    'accept': 'application/json', 
    'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7', 
    'af-ac-enc-dat': 'AAcyLjkuMi0yAAABiVbBtqEAAA+uAwAAAAAAAAAAAj+vsCNyOwOxf5KccDwU30qsCmxrp8DLRwc1Rx0w3URU8gb8E/mZyUQ/QIwbJ1fSlP8VFy2XjXljmnj6XvF1Y+F3AW+NJX//fYuVYCTu2dziu9qvfieoZvvRh0omnce+hk6WI428I1f+MUiwSQdjmue/jfwcyfERzyWqPiqrAYCW1jajhLHdnvDgoow6xY1pa91/sexlaZRkNE/JMRxENhq1SFarnX48Ez19JSjFKqaAMOj5yjqtj8MO7OvaJO0qUcttROOntMKOOI+PC18wA9bavxmx7U5zaqz2Gfp+ZuldSCOwcQTbcn7zz5TjSZlbdeEaljuUMlQaYYN3sy2FTiqGwRGAUpjtMRSl8TY0yN7ixtME45f/NhMnw8f21UXD2mkb2JsAQ8Y9lVW9cL3Wx1rWu2p1hKkY4MYuRRRPu/pxQrto04zaSwO/1GXe2Xe6/gfPKa9644itgTtxa7PwS9vnAEGPkzNagY60jMbDqdPrdnANmQsNXts5GyAjI8vnGItu2NN4vuczF+RFXHOAGxWJncl4uqVX0YU67JSJsycszVP2rAsNXts5GyAjI8vnGItu2NN154PomD8a8K3kTkSGTUjyUhkXYwsUy7YzYetASLKIUuhNJhShmaZxNblMWOFi45Mu8hFnJnWUuS7GAzNwMfJfdBKiYv6tJSF3IDTEvDUSmplOIcZfgcApWArq1cbA8B5wmh6Jc5qBmjYFrLdizaxkrlBKRN2sUjcXzmpG/I/G0JpLBWCjreCQPoeLs2qGai1PXjEGGWy3DMVVukZKDs+2QD6VGjw2AWwF/TWNvbabMy2ZqzqE9S1a9CJPGJ49f6+X/zYTJ8PH9tVFw9ppG9ibKVfibIqudCanr1dNXpn4nYFvDlMKA7tTIkQqUAfAoXFeCejdVFkD7QAu0qKLGDity2fLR4w8Kg/lXWUm9S+6TghSOArqiZwhNCs2ugdtuUs+99oVub8t2FvZsdHITf4Y+qbllAwjUJ1rNYEEhZMktCg56l5f6H4omAPEE9A36DU=', 
    'af-ac-enc-sz-token': '1DslxoQ2CC2A48GsqCdRmg==|TCx6PwKMC7tX9zHVKrQ+/H3BCOqjdZwTeFORkY8x1xpyMPEYN+R+NwsN4Nl7sNeHhSbe3iT9SMRSK8+x86IQE89qlwnDYpsvW39v6gpSiA==|sXQEfHEwldDmjDWf|06|3', 
    'content-type': 'application/json', 
    'cookie': 'REC_T_ID=eeb036bb-d14a-11ec-aafb-9440c944a328; SC_DFP=QIf0Ft7RqH4XVuCEYxNmpvNzEybWpxpj; _fbp=fb.1.1652369644781.118543600; G_ENABLED_IDPS=google; _hjSessionUser_868286=eyJpZCI6IjhkMjRlNWI1LWFkNTMtNTU3ZC1hZDE1LWEwNDMxMjkwYzNmYSIsImNyZWF0ZWQiOjE2NTIzNjk2NDY0NzMsImV4aXN0aW5nIjp0cnVlfQ==; __utma=20759802.61446569.1652369646.1655403138.1655403138.1; SPC_CLIENTID=ejVIMGlJMVd4c1Vwqldywrupjczxokbj; kk_leadtag=true; _ga_KK6LLGGZNQ=GS1.1.1660876128.10.0.1660876128.0.0.0; SPC_F=xXCG7GPD2sPX7ue5xCwQRoWvadtES3Am; language=vi; cto_bundle=kzDvEV94T1ElMkZBSXc5YlhyWHd1eENBajU3eGxpV2l0MlN5NXUxcGlVTDNPY3N3T1dnOTkyRXBpQ0I3Nlc2TGFiSlJqTGIyM080aVd0MmpPY0pLMUFLZVZWV2clMkZzNkN1QyUyRm1kanV0WDZudmU3WjVBcG5jZjF5YzloMk1iVlo0TUx2TDM5V3lpenNwemUzUWY5MiUyRlZENFF0ck9yQSUzRCUzRA; SPC_T_IV="NFZKYlhvblVpODQ0RzhsMw=="; SPC_T_ID="cGmdefAP7s0WWeGDL+Dggc+yW3uxI6HUIJz8E9ShG/IZOl3JE5hGQoFgDss7wcrDXzGknSgeffr45mNFDLgTxPzCvCU7NXHPpiUz96nZkBH6+slGYyzy0IPPgM92QcpmLQHHpfmdEa98jfBZCeph9BmUMKZgd0eVJagWAM+k1uo="; _ga_CGXK257VSB=GS1.1.1671978751.2.0.1671978848.60.0.0; _gcl_aw=GCL.1681615221.Cj0KCQjwlumhBhClARIsABO6p-zC1lTkLZQuk79Dd7_LKySQU2n5yJXOhzmWpXYtRyrWua4DYUh8-RgaAqXFEALw_wcB; _gac_UA-61914164-6=1.1681615223.Cj0KCQjwlumhBhClARIsABO6p-zC1lTkLZQuk79Dd7_LKySQU2n5yJXOhzmWpXYtRyrWua4DYUh8-RgaAqXFEALw_wcB; _gcl_au=1.1.360815445.1686106540; _hjid=c0bd8288-4e81-4d69-b3a7-33198455bfe4; __LOCALE__null=VN; csrftoken=uFZK5zmUuEsFAJwI0in2a6xwpPgzjcOr; SL_G_WPT_TO=vi; SPC_SI=DwidZAAAAAB5NHFVcWl5b6JkPQIAAAAAcnBFRFlYMzA=; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _QPWSDCXHZQA=596b7d29-c0d1-4630-90f6-30eb92de3cd2; _hjIncludedInSessionSample_868286=0; _hjSession_868286=eyJpZCI6ImIwZDJjOTJkLTE0OTktNGRhZi1hMGFjLTg4NmMyYjAyNDdiZCIsImNyZWF0ZWQiOjE2ODkzNzc2NzA4MzYsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.844453219.1689377671; SPC_U=32600334; SPC_IA=1; SPC_R_T_ID=6PK9o4iM6I3Q51CtMOa3Cqy2m7eW2+42ELlRZ9/maeerFtn1tQR2dWBHP1pHLa8PrlRtyFvHSFKi/HNFby0r60HgLuCezlMdO/QMAxYj2jtLGeQxvqCtZ9f9BIFfeXT1AAAruDT93Aw1C5CuOL24oElKDXmVqYc3cEiRnodk5po=; SPC_R_T_IV=aVRqMVVPWUhZdEgxOXUxcg==; SPC_T_ID=6PK9o4iM6I3Q51CtMOa3Cqy2m7eW2+42ELlRZ9/maeerFtn1tQR2dWBHP1pHLa8PrlRtyFvHSFKi/HNFby0r60HgLuCezlMdO/QMAxYj2jtLGeQxvqCtZ9f9BIFfeXT1AAAruDT93Aw1C5CuOL24oElKDXmVqYc3cEiRnodk5po=; SPC_T_IV=aVRqMVVPWUhZdEgxOXUxcg==; shopee_webUnique_ccd=1DslxoQ2CC2A48GsqCdRmg%3D%3D%7CTCx6PwKMC7tX9zHVKrQ%2B%2FH3BCOqjdZwTeFORkY8x1xpyMPEYN%2BR%2BNwsN4Nl7sNeHhSbe3iT9SMRSK8%2Bx86IQE89qlwnDYpsvW39v6gpSiA%3D%3D%7CsXQEfHEwldDmjDWf%7C06%7C3; ds=5315aef997bb097110fa81a96ddcc849; _ga=GA1.1.61446569.1652369646; _ga_M32T05RVZT=GS1.1.1689377670.208.1.1689377692.38.0.0; SPC_SC_TK=7e78a418463d592d3e59f26cbe2355b2; SPC_SC_UD=32600334; SPC_STK=ZAK+7LpVlzMb8ifgAt/YnBwrcbZkwEDSSTgMdWHL/ruzlYpVIbA7IJzek09TXJrzaiznvBXHv7KghLnlrJMU3tK7WLwp1mkwHymD0jRUgKf4L7AyojILysy3La4YaAFD8gGUBppYpOIPbZZbghmG5fqNNlRaYiWc1AE6OnQurBs=; SPC_ST=.UzB2WnNHWGw3WXpFb0ZzZI7k97ZQFp3RxJTBECIpttGCjarmtVs8oGQnz4SCDhAYEOjL2RuveDaVup0ESz1vecudLuEk4rqHIEEoQS/47e1dx9GdqenC+BatDh/uoUDlajb6Crl5cca5wiNqITtElYh+nUkpRsqNapwviFNc2kuP+FGhZ+Edwy1moZ8jN+qnwEmrbtL+WAPPHHjUa5+Log==; SPC_EC=M2lPZHAxc1RLeVJYdXE4RJ8UswfWzJZ7sOKTkz0DIbVEqA1Kh2gubyIBlR56juihK3SAguaQ5DHJj6vnRtPkhFvrcs40NSSWWqzUOgWBdiVcg4RrVfTUYanx57pLK8Ki0e2qSj/E78gGWbIqFezcCIoZZ84gkrjb9nIt+vytgc4=; SPC_EC=cXJlTnZQNW1YQVJ2bWN5Yv6ePjCt1jYivDpWUl1nw6p89riKOUon9/ZYosncQU6JL/4FTBpcjZckqJALDtFDiuM+sCGw3KMA5aIreKqmNEIob+JKrKe2fXrR9LPhBvDONNlllcUY1ZRysbm0fOpUXvDIq4QVfAYcoIKvnjeumbw=; SPC_R_T_ID=6PK9o4iM6I3Q51CtMOa3Cqy2m7eW2+42ELlRZ9/maeerFtn1tQR2dWBHP1pHLa8PrlRtyFvHSFKi/HNFby0r60HgLuCezlMdO/QMAxYj2jtLGeQxvqCtZ9f9BIFfeXT1AAAruDT93Aw1C5CuOL24oElKDXmVqYc3cEiRnodk5po=; SPC_R_T_IV=aVRqMVVPWUhZdEgxOXUxcg==; SPC_SI=DwidZAAAAAB5NHFVcWl5b6JkPQIAAAAAcnBFRFlYMzA=; SPC_ST=.UzB2WnNHWGw3WXpFb0ZzZI7k97ZQFp3RxJTBECIpttGCjarmtVs8oGQnz4SCDhAYEOjL2RuveDaVup0ESz1vecudLuEk4rqHIEEoQS/47e1dx9GdqenC+BatDh/uoUDlajb6Crl5cca5wiNqITtElYh+nUkpRsqNapwviFNc2kuP+FGhZ+Edwy1moZ8jN+qnwEmrbtL+WAPPHHjUa5+Log==; SPC_T_ID=6PK9o4iM6I3Q51CtMOa3Cqy2m7eW2+42ELlRZ9/maeerFtn1tQR2dWBHP1pHLa8PrlRtyFvHSFKi/HNFby0r60HgLuCezlMdO/QMAxYj2jtLGeQxvqCtZ9f9BIFfeXT1AAAruDT93Aw1C5CuOL24oElKDXmVqYc3cEiRnodk5po=; SPC_T_IV=aVRqMVVPWUhZdEgxOXUxcg==; SPC_U=32600334', 
    'f65bf6a5': '7"E#uP`=Vh4MMJE.r*H@!O,Zg', 
    'referer': 'https://shopee.vn/search?keyword=th%E1%BB%8Bt%20l%E1%BB%A3n%20g%C3%A1c%20b%E1%BA%BFp', 
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'sz-token': '1DslxoQ2CC2A48GsqCdRmg==|TCx6PwKMC7tX9zHVKrQ+/H3BCOqjdZwTeFORkY8x1xpyMPEYN+R+NwsN4Nl7sNeHhSbe3iT9SMRSK8+x86IQE89qlwnDYpsvW39v6gpSiA==|sXQEfHEwldDmjDWf|06|3', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 
    'x-api-source': 'pc', 
    'x-csrftoken': 'uFZK5zmUuEsFAJwI0in2a6xwpPgzjcOr', 
    'x-requested-with': 'XMLHttpRequest', 
    'x-sap-access-f': '3.2.114.2.0|13|2.9.2-2_5.1.0_0_327|93679b4b751c4318821f58d157f7533c6aa33f6733d444|10900|1100', 
    'x-sap-access-s': 'foPbTdEhP__qpJh0MmmrRwvD4MAKtBUnjfYUnqYuYhs=', 
    'x-sap-access-t': '1689377856', 
    'x-sap-ri': '41dcb16456f1f82769f67237919fbe94b49c88c28e6733dd', 
    'x-shopee-language': 'vi', 
    'x-sz-sdk-version': '2.9.2-2&1.4.1'
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data.items[0].shopid);
})
.catch((error) => {
  console.log(error);
});


})();