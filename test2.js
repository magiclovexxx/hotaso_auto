const axios = require('axios').default;

proxy = []

proxy2 = []

proxy3 = [
]



function getCookiesMap(cookiesString, url) {
    let cookies = []
    const ck_obj = cookiesString.split(";")
        .map(function (cookieString) {
            return cookieString.trim().split(/=(.+)/);
        })
        .reduce(function (acc, curr) {
            acc[curr[0]] = curr[1];
            return acc;
        }, {})
    const keys = Object.keys(ck_obj)
    for (let i = 0; i < keys.length; i++) {
        cookies.push({
            name: keys[i],
            value: ck_obj[keys[i]],
            domain: url,
            path: '/'
        })
    }
    return cookies
}

proxy_test = async () => {
    proxy.forEach(async (item, index) => {
        proxy1 = item.split(":")
        const proxy_1 = {
            host: proxy1[0],
            port: proxy1[1],
            proxyAuth: proxy1[2] + ":" + proxy1[3]
        };
        // or
        // const proxy = 'y0adXjeO:pAzAHCr4@54.82.74.24:5557';

        await proxy_check(proxy_1).then(async (r) => {
            url_proxy = "http://api.hotaso.vn/api_user/check_proxy?proxy=" + proxy_1.host + ":OK"
            check = await axios.get(url_proxy)
            // console.log(check.data)
        }).catch(async (e) => {
            //  console.log(index + " -- " + proxy_1.host) 
            //console.log(proxy_1.host) 

            url_proxy = "http://api.hotaso.vn/api_user/check_proxy?proxy=" + proxy_1.host
            check = await axios.get(url_proxy)
            console.log(check.data)
        });
    })

}

gen_cookie = () => {
    cookies = [{ "name": "SPC_R_T_IV", "value": "VOal05Pxz1OFIuzotqQdVw==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0497, "size": 34, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_ID", "value": "dsGqR6K9q7365h2Hgi0ILEEVawIC98xKbWH4YHPko5aA9mVk3pgH+lh2rvoyAqXm1atOIT7Fbln9etXCik\/\/ypcNF3WZd9nPnQVUszuh3mU=", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0497, "size": 118, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "\"ELhRSoJB\/OniTXF4dchi\/A==\"", "domain": "shopee.vn", "path": "\/", "expires": 2274973592.4417, "size": 34, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga", "value": "GA1.2.1466147805.1631723493", "domain": ".shopee.vn", "path": "\/", "expires": 1707325591, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "VOal05Pxz1OFIuzotqQdVw==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0498, "size": 32, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSessionUser_868286", "value": "eyJpZCI6IjE4ZjZmM2IxLWQyYzYtNWFkNC05OGY2LTc2NzIxZjlmYThkNyIsImNyZWF0ZWQiOjE2MzcxODA3MDYxNjcsImV4aXN0aW5nIjp0cnVlfQ==", "domain": ".shopee.vn", "path": "\/", "expires": 1675789436, "size": 137, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "dsGqR6K9q7365h2Hgi0ILEEVawIC98xKbWH4YHPko5aA9mVk3pgH+lh2rvoyAqXm1atOIT7Fbln9etXCik\/\/ypcNF3WZd9nPnQVUszuh3mU=", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0498, "size": 116, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1644253371.341.1.1644253607.34", "domain": ".shopee.vn", "path": "\/", "expires": 1707325607, "size": 50, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "csrftoken", "value": "9wb7t87fhEo3QK3nAJ21uZNofSFxzAfD", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_ST", "value": ".bFFCcm9LbFZaTVhzNTFDQXbU6xLCYK8iF9pbk8Pca5gT2Ipvkl4QSqAxRjquOfoqH6h0A2nD7ylqsnJLDaRInNGtvtQAQZF9fCSCVWEaqLc+tiNrrpFiEud3M0M1urSzkkowsCDfdqKf4VZfxk4YQm1L2As5U9r1YfJ7+MLTm3humMYarZylOvdR3H0VbRBAEKU7tPBtE\/0NX+V3Abkm6Q==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0499, "size": 223, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_SI", "value": "mall.HimJkmOeN200wqYaeeS4YkT4ccE1qURg", "domain": ".shopee.vn", "path": "\/", "expires": 1644340051.0496, "size": 43, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_F", "value": "McWM6YUD29aJaMFXF0B5eDMQAS9WC5qv", "domain": ".shopee.vn", "path": "\/", "expires": 2262443484.7791, "size": 37, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gid", "value": "GA1.2.458424575.1644253374", "domain": ".shopee.vn", "path": "\/", "expires": 1644339991, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_U", "value": "492512234", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0499, "size": 14, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_CLIENTID", "value": "TWNXTTZZVUQyOWFKxbmjnaiscwytynfp", "domain": ".shopee.vn", "path": "\/", "expires": 2262443547.2287, "size": 44, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "\/", "expires": 1644256974, "size": 21, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gcl_au", "value": "1.1.1086006197.1639502025", "domain": ".shopee.vn", "path": "\/", "expires": 1647278025, "size": 32, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "\/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_EC", "value": "\"bmJVZHlRamtscGNIN0FnTkMKL\/8YggmBwqiljg0Fdpbjueenvc7ioZAHeY4LoXkn3MVCRXGIT8++IL09626+oC8lh\/0bU97HZuMTbU8UFxHBK8Q0P8oMNOn+m8NknaJHhC\/gDKVJJ0bC+5xWMg8TlskXUz1phtQ99ATMgyhDDfo=\"", "domain": ".shopee.vn", "path": "\/", "expires": 2274973418.0317, "size": 180, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "shopee_webUnique_ccd", "value": "%2FxCFLPwnx7RIjNIypVgT8w%3D%3D%7CL2MmZlCYC7AMQVwP3jIH7bJAveBJr1nZs097sfYWWQgtfjYUW2dVOEZ1JdSSMccim6A0TIVXtMh0RX3qPPE%3D%7CS%2FDNTTYtvzdzotpC%7C03%7C3", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 169, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_IA", "value": "1", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 7, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSession_868286", "value": "eyJpZCI6IjUyZjMxZTczLTA5NDEtNGU2MS1hY2NkLWE5ZTBhMzhhMTk2YyIsImNyZWF0ZWQiOjE2NDQyNTMzNzMyODEsImluU2FtcGxlIjpmYWxzZX0=", "domain": ".shopee.vn", "path": "\/", "expires": 1644255273, "size": 133, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_fbp", "value": "fb.1.1631723477271.2033864996", "domain": ".shopee.vn", "path": "\/", "expires": 1652029590, "size": 33, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_QPWSDCXHZQA", "value": "9c435ff4-40a0-43ea-c6b5-24b4341b7bfb", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 48, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "\/", "expires": 1644255273, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "5e33e0f8-1642-11ec-8b39-f41d6bf8658f", "domain": ".shopee.vn", "path": "\/", "expires": 2262443484.7787, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "\"KDjaXK63EaeHudUrm7JcXJIBdeW2IaxxttCZZrzr4cED2BIpIT7PDMYr1xsROUivhVsEhMOKD89pLCumgyZOS542xsQ+PThBg2wbi3jrTrM=\"", "domain": "shopee.vn", "path": "\/", "expires": 2274973592.4417, "size": 118, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjid", "value": "6613ec11-254a-4fbc-ba73-29b68673649b", "domain": ".shopee.vn", "path": "\/", "expires": 1663259493, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }]
    cookie1 = ""
    cookies.forEach(row => {
        cookie1 = cookie1 + row.name + "=" + row.value + ";"

    })
    console.log(cookie1)
}

gen_cookie_mobile = async () => {
    cookies = [{ "name": "SPC_R_T_IV", "value": "VOal05Pxz1OFIuzotqQdVw==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0497, "size": 34, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_R_T_ID", "value": "dsGqR6K9q7365h2Hgi0ILEEVawIC98xKbWH4YHPko5aA9mVk3pgH+lh2rvoyAqXm1atOIT7Fbln9etXCik\/\/ypcNF3WZd9nPnQVUszuh3mU=", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0497, "size": 118, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "\"ELhRSoJB\/OniTXF4dchi\/A==\"", "domain": "shopee.vn", "path": "\/", "expires": 2274973592.4417, "size": 34, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga", "value": "GA1.2.1466147805.1631723493", "domain": ".shopee.vn", "path": "\/", "expires": 1707325591, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_IV", "value": "VOal05Pxz1OFIuzotqQdVw==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0498, "size": 32, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSessionUser_868286", "value": "eyJpZCI6IjE4ZjZmM2IxLWQyYzYtNWFkNC05OGY2LTc2NzIxZjlmYThkNyIsImNyZWF0ZWQiOjE2MzcxODA3MDYxNjcsImV4aXN0aW5nIjp0cnVlfQ==", "domain": ".shopee.vn", "path": "\/", "expires": 1675789436, "size": 137, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "dsGqR6K9q7365h2Hgi0ILEEVawIC98xKbWH4YHPko5aA9mVk3pgH+lh2rvoyAqXm1atOIT7Fbln9etXCik\/\/ypcNF3WZd9nPnQVUszuh3mU=", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0498, "size": 116, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_ga_M32T05RVZT", "value": "GS1.1.1644253371.341.1.1644253607.34", "domain": ".shopee.vn", "path": "\/", "expires": 1707325607, "size": 50, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "csrftoken", "value": "9wb7t87fhEo3QK3nAJ21uZNofSFxzAfD", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 41, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_ST", "value": ".bFFCcm9LbFZaTVhzNTFDQXbU6xLCYK8iF9pbk8Pca5gT2Ipvkl4QSqAxRjquOfoqH6h0A2nD7ylqsnJLDaRInNGtvtQAQZF9fCSCVWEaqLc+tiNrrpFiEud3M0M1urSzkkowsCDfdqKf4VZfxk4YQm1L2As5U9r1YfJ7+MLTm3humMYarZylOvdR3H0VbRBAEKU7tPBtE\/0NX+V3Abkm6Q==", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0499, "size": 223, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_SI", "value": "mall.HimJkmOeN200wqYaeeS4YkT4ccE1qURg", "domain": ".shopee.vn", "path": "\/", "expires": 1644340051.0496, "size": 43, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_F", "value": "McWM6YUD29aJaMFXF0B5eDMQAS9WC5qv", "domain": ".shopee.vn", "path": "\/", "expires": 2262443484.7791, "size": 37, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gid", "value": "GA1.2.458424575.1644253374", "domain": ".shopee.vn", "path": "\/", "expires": 1644339991, "size": 30, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_U", "value": "492512234", "domain": ".shopee.vn", "path": "\/", "expires": 2274973651.0499, "size": 14, "httpOnly": false, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_CLIENTID", "value": "TWNXTTZZVUQyOWFKxbmjnaiscwytynfp", "domain": ".shopee.vn", "path": "\/", "expires": 2262443547.2287, "size": 44, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "AMP_TOKEN", "value": "%24NOT_FOUND", "domain": ".shopee.vn", "path": "\/", "expires": 1644256974, "size": 21, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_gcl_au", "value": "1.1.1086006197.1639502025", "domain": ".shopee.vn", "path": "\/", "expires": 1647278025, "size": 32, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "G_ENABLED_IDPS", "value": "google", "domain": ".shopee.vn", "path": "\/", "expires": 253402257600, "size": 20, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_EC", "value": "\"bmJVZHlRamtscGNIN0FnTkMKL\/8YggmBwqiljg0Fdpbjueenvc7ioZAHeY4LoXkn3MVCRXGIT8++IL09626+oC8lh\/0bU97HZuMTbU8UFxHBK8Q0P8oMNOn+m8NknaJHhC\/gDKVJJ0bC+5xWMg8TlskXUz1phtQ99ATMgyhDDfo=\"", "domain": ".shopee.vn", "path": "\/", "expires": 2274973418.0317, "size": 180, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "welcomePkgShown", "value": "true", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "shopee_webUnique_ccd", "value": "%2FxCFLPwnx7RIjNIypVgT8w%3D%3D%7CL2MmZlCYC7AMQVwP3jIH7bJAveBJr1nZs097sfYWWQgtfjYUW2dVOEZ1JdSSMccim6A0TIVXtMh0RX3qPPE%3D%7CS%2FDNTTYtvzdzotpC%7C03%7C3", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 169, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_IA", "value": "1", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 7, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjSession_868286", "value": "eyJpZCI6IjUyZjMxZTczLTA5NDEtNGU2MS1hY2NkLWE5ZTBhMzhhMTk2YyIsImNyZWF0ZWQiOjE2NDQyNTMzNzMyODEsImluU2FtcGxlIjpmYWxzZX0=", "domain": ".shopee.vn", "path": "\/", "expires": 1644255273, "size": 133, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_fbp", "value": "fb.1.1631723477271.2033864996", "domain": ".shopee.vn", "path": "\/", "expires": 1652029590, "size": 33, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_QPWSDCXHZQA", "value": "9c435ff4-40a0-43ea-c6b5-24b4341b7bfb", "domain": "shopee.vn", "path": "\/", "expires": -1, "size": 48, "httpOnly": false, "secure": false, "session": true, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjAbsoluteSessionInProgress", "value": "0", "domain": ".shopee.vn", "path": "\/", "expires": 1644255273, "size": 29, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "REC_T_ID", "value": "5e33e0f8-1642-11ec-8b39-f41d6bf8658f", "domain": ".shopee.vn", "path": "\/", "expires": 2262443484.7787, "size": 44, "httpOnly": true, "secure": true, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "SPC_T_ID", "value": "\"KDjaXK63EaeHudUrm7JcXJIBdeW2IaxxttCZZrzr4cED2BIpIT7PDMYr1xsROUivhVsEhMOKD89pLCumgyZOS542xsQ+PThBg2wbi3jrTrM=\"", "domain": "shopee.vn", "path": "\/", "expires": 2274973592.4417, "size": 118, "httpOnly": false, "secure": false, "session": false, "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }, { "name": "_hjid", "value": "6613ec11-254a-4fbc-ba73-29b68673649b", "domain": ".shopee.vn", "path": "\/", "expires": 1663259493, "size": 41, "httpOnly": false, "secure": false, "session": false, "sameSite": "Lax", "sameParty": false, "sourceScheme": "Secure", "sourcePort": 443 }]
    var axios = require('axios');

    var config = {
        method: 'get',
        url: 'https://shopee.vn/api/v4/shop/get_shop_detail?sort_sold_out=0&username=bangoaim4670',
        headers: {
            'authority': 'shopee.vn',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
            'x-api-source': 'pc',
            'x-shopee-language': 'vi',
            'x-requested-with': 'XMLHttpRequest',
            'if-none-match-': '55b03-ab195f0ddfd7a7eafa2df7c9ad9f3b9f',
            'sec-ch-ua-platform': '"Windows"',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://shopee.vn/awifi?categoryId=100013&itemId=13908620813',
            'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': 'REC_T_ID=79b2b3ee-5935-11ec-8bb3-48df37dec418; SPC_EC=-; SPC_F=4TtIt1UWcTtcnFSNtxw6dUVuX0KhlD58; SPC_IA=-1; SPC_R_T_ID=ltWXMpN4dPcbQXdTuFlH8UnHBV5yQY2r9llFhZ7nY1SuFZ5SxbMXk9JAYEGJfwj/lZPKzS0YPPBLjPwlrq/wH8uB/mInL6wJTc2x19C3jVI=; SPC_R_T_IV=QWPYphACZOdjsSWr+dYrfw==; SPC_SI=mall.HimJkmOeN200wqYaeeS4YkT4ccE1qURg; SPC_T_ID=ltWXMpN4dPcbQXdTuFlH8UnHBV5yQY2r9llFhZ7nY1SuFZ5SxbMXk9JAYEGJfwj/lZPKzS0YPPBLjPwlrq/wH8uB/mInL6wJTc2x19C3jVI=; SPC_T_IV=QWPYphACZOdjsSWr+dYrfw==; SPC_U=-'
        }
    };

     let user_info = {}

    await axios(config)
        .then(function (response) {
            let data = response.data
            user_info.shopid=data.data.shopid
            user_info.userid=data.data.userid
            user_info.username = data.data.account.username
        })
        .catch(function (error) {
            console.log(error);
        });

    cookies = [{"name":"SPC_T_IV","value":"BC2gn3wJIwFuy0oVNpgjkQ==","domain":".shopee.vn","path":"\/","expires":2274761187.8869,"size":32,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_R_T_IV","value":"BC2gn3wJIwFuy0oVNpgjkQ==","domain":".shopee.vn","path":"\/","expires":2274761187.8869,"size":34,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_R_T_ID","value":"HnTbLKKY\/PV9PLlMealEH+lkfQdn8oPOdOEb36JGT84UDIfxufXJVlUrFB8lVm9fDch7XXGISC8ei2p\/TN3yV4X26bLeDsuWoFUIAwghpUc=","domain":".shopee.vn","path":"\/","expires":2274761187.8869,"size":118,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"csrftoken","value":"XZqn24mi5EgdRC6wBqEPNonJE6KMJs7p","domain":"shopee.vn","path":"\/","expires":-1,"size":41,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_ST","value":".SjVUVENoME9WdDV0dXVHSUSIFhBmK\/MxNpWrQRS02ft+zB5yqCDYPHtufoJJFBlt6jBsM\/tw3sF1Sor49u2jOLjlvy8ThflzdxXwjwGWjU7TO6FPmEoa3bAX8aK+fe+usnP2Vl8Q0ypSy7xTSywBchONpPZf\/gw4ayBPDsz1789SbHHmUzULMfUgxEwsjZggBrMBPsWsL1GTvB8DcJQNUA==","domain":".shopee.vn","path":"\/","expires":2274761187.887,"size":223,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_ga_M32T05RVZT","value":"GS1.1.1644040834.127.1.1644041069.18","domain":".shopee.vn","path":"\/","expires":1707113069,"size":50,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_T_ID","value":"\"HnTbLKKY\/PV9PLlMealEH+lkfQdn8oPOdOEb36JGT84UDIfxufXJVlUrFB8lVm9fDch7XXGISC8ei2p\/TN3yV4X26bLeDsuWoFUIAwghpUc=\"","domain":"shopee.vn","path":"\/","expires":2274761069.0813,"size":118,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_T_IV","value":"\"BC2gn3wJIwFuy0oVNpgjkQ==\"","domain":"shopee.vn","path":"\/","expires":2274761069.0812,"size":34,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_ga","value":"GA1.2.250169406.1638582660","domain":".shopee.vn","path":"\/","expires":1707113036,"size":29,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_EC","value":"\"VFVxQ0loWTNWMWgzNjhNZguRGGzmdDjClM4klRH14qXpXa0m\/6JLAqX7wDbGnbSElsgFcuVavNVfIzkLk0QOycf6KtXcU7rmUnvWIV7Rn+w68VC2QHHRUeNq+KrqIdxpnbrdY2nFoUEkhskD5FoBmWSJf6m426JHxdUOt\/h5pj4=\"","domain":".shopee.vn","path":"\/","expires":2274760974.6441,"size":180,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_F","value":"d24LZcrlXkiCW4UkNS6LhzZ8WwN0LtHc","domain":".shopee.vn","path":"\/","expires":2269302658.9728,"size":37,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_gid","value":"GA1.2.1454611960.1644040838","domain":".shopee.vn","path":"\/","expires":1644127436,"size":31,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_SI","value":"bfftocvn.rTHDlDcpFYgeJv6qGzauSIDtrLigjmpR","domain":".shopee.vn","path":"\/","expires":1644127587.8868,"size":47,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_gcl_au","value":"1.1.663130586.1638582656","domain":".shopee.vn","path":"\/","expires":1646358655,"size":31,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"AMP_TOKEN","value":"%24NOT_FOUND","domain":".shopee.vn","path":"\/","expires":1644044437,"size":21,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_hjAbsoluteSessionInProgress","value":"1","domain":".shopee.vn","path":"\/","expires":1644042963,"size":29,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"REC_T_ID","value":"9f636467-54a4-11ec-9c5b-10c172968114","domain":".shopee.vn","path":"\/","expires":2269302658.9725,"size":44,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_T_ID","value":"HnTbLKKY\/PV9PLlMealEH+lkfQdn8oPOdOEb36JGT84UDIfxufXJVlUrFB8lVm9fDch7XXGISC8ei2p\/TN3yV4X26bLeDsuWoFUIAwghpUc=","domain":".shopee.vn","path":"\/","expires":2274761187.8869,"size":116,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_hjSessionUser_868286","value":"eyJpZCI6ImFhY2IxZDZhLWViOWItNTQxMy1iODNlLTJhY2QwMGNkMjMwZSIsImNyZWF0ZWQiOjE2Mzg1ODI2NjAwOTAsImV4aXN0aW5nIjp0cnVlfQ==","domain":".shopee.vn","path":"\/","expires":1675577066,"size":137,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_QPWSDCXHZQA","value":"ca49e89c-f639-4fdb-d5e9-433fa430c9b0","domain":"shopee.vn","path":"\/","expires":-1,"size":48,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"G_ENABLED_IDPS","value":"google","domain":".shopee.vn","path":"\/","expires":253402257600,"size":20,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_IA","value":"-1","domain":"shopee.vn","path":"\/","expires":2274760974.644,"size":8,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_U","value":"512328345","domain":".shopee.vn","path":"\/","expires":2274761187.887,"size":14,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"SPC_CLIENTID","value":"ZDI0TFpjcmxYa2lDukotsebwpwusfzvf","domain":".shopee.vn","path":"\/","expires":2269302704.9919,"size":44,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_hjSession_868286","value":"eyJpZCI6ImVlNDMzYjI2LWNhYmItNDhiZC1hMzU0LWNkM2QyMGNhYzVlNSIsImNyZWF0ZWQiOjE2NDQwNDA4MzcyODUsImluU2FtcGxlIjpmYWxzZX0=","domain":".shopee.vn","path":"\/","expires":1644042963,"size":133,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"_fbp","value":"fb.1.1638582664832.934552309","domain":".shopee.vn","path":"\/","expires":1651817069,"size":32,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},{"name":"REC_T_ID","value":"9e638d8e-54a4-11ec-8cda-3c15fb7ea14f","domain":"shopee.vn","path":"\/","expires":2269302656.7461,"size":44,"httpOnly":true,"secure":true,"session":false,"sameSite":"None","sameParty":false,"sourceScheme":"Secure","sourcePort":443}]
    cookie1 = ""
    cookies.forEach(row => {
        cookie1 = cookie1 + row.name + "=" + row.value + ";"

    })
    cookie1 = cookie1 + "shopid=" + user_info.shopid + ";"
    cookie1 = cookie1 + "userid=" + user_info.userid + ";"
    cookie1 = cookie1 + "username=" + user_info.username + ";"
    console.log(cookie1)
}


updateErrorLogs = async (error, slave) => {
    update_error_logs = "https://beta.hotaso.vn/api_user/error_logs"
    console.log(" - CậP nhật lỗi: " + error.message);
    let message = error.message
    console.log(error)
    let log={
        logs:error,
        slave:slave,
        message: message
    }
    await axios.post(update_error_logs, {
        data: log,
        timeout: 50000
    },
        {
            // httpsAgent: httpsAgent
        })
        .then(function (response) {
            console.log(response.data);
            return true
        })
        .catch(async function (error) {
            console.log(error);
            console.log(" - Update action lỗi");           
        });
}


test_cookie = async () => {

const puppeteer = require('puppeteer');
let is_block_image = false;

  const browser = await puppeteer.launch({ headless: false });
  const page = (await browser.pages())[0];
  cookies = [{"name":"cto_bundle","value":"2ZEk4l9DM1glMkJXZ1VZc2NvakVTM0Q4dFZTYWNHWUNOOXptOHVDQ1lmcXVWb3VobVJnUnVpYkZOWDliVTZCUjdIRWo5YlhzUXhpT2N1b3YxbWhQTWtRVFgwWlhOWVBqZjdGeUJGdFpERXVBYlphZWdhMUw4NUVOU1B2QWdJekN5Tm1xQ1JOc05yU2Zac2ZDSFg4cnlabCUyRkFxVmh3JTNEJTNE","domain":".shopee.vn","path":"\/","expires":1665324798,"size":230,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_T_ID","value":"\"NMnqrOhGbiuMUpzaTOYFj8aX89bXLPnVvJEtGGbSxstGyqU0IoNooxFUdt7aDDs2Z+jKNu8bqAC1O34Y7WGfmK1797IF8HY1YzjThOnLKbA=\"","domain":"shopee.vn","path":"\/","expires":2261880786.5531,"size":118,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_R_T_ID","value":"\"NMnqrOhGbiuMUpzaTOYFj8aX89bXLPnVvJEtGGbSxstGyqU0IoNooxFUdt7aDDs2Z+jKNu8bqAC1O34Y7WGfmK1797IF8HY1YzjThOnLKbA=\"","domain":".shopee.vn","path":"\/","expires":2261880786.5463,"size":120,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_R_T_IV","value":"\"1bIb62mxhkS6S3g6tuLu\/Q==\"","domain":".shopee.vn","path":"\/","expires":2261880786.5464,"size":36,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_SI","value":"bfftocsg6.ZG3sB1GGWwWkVcetIfqPv2OefsF2z1ln","domain":".shopee.vn","path":"\/","expires":1631247191.9105,"size":48,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"REC_T_ID","value":"592ecf86-e8de-11eb-8569-9440c931dacc","domain":".shopee.vn","path":"\/","expires":2257452724.2235,"size":44,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"_gcl_au","value":"1.1.1375020834.1626732723","domain":".shopee.vn","path":"\/","expires":1634508723,"size":32,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_CLIENTID","value":"aVZ1eHEyU05yUUlCmuowabgrwefdqosi","domain":".shopee.vn","path":"\/","expires":2257452746.0512,"size":44,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_U","value":"320401707","domain":".shopee.vn","path":"\/","expires":2261880793.2458,"size":14,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"csrftoken","value":"udKclexNUvvvFH1NL66DpB4HDTKGYqPV","domain":"shopee.vn","path":"\/","expires":-1,"size":41,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_IA","value":"-1","domain":"shopee.vn","path":"\/","expires":2261691459.3986,"size":8,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"REC_T_ID","value":"592ee1aa-e8de-11eb-ab91-48df37dd92e4","domain":"shopee.vn","path":"\/","expires":2257452724.2203,"size":44,"httpOnly":true,"secure":true,"session":false,"sameSite":"None","sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"_hjid","value":"3b58ae55-6c1a-49ae-ba06-817880eb2bfd","domain":".shopee.vn","path":"\/","expires":1658268728,"size":41,"httpOnly":false,"secure":false,"session":false,"sameSite":"Lax","sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"G_ENABLED_IDPS","value":"google","domain":".shopee.vn","path":"\/","expires":253402257600,"size":20,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_EC","value":"UzhVVWg0Q0Jsbm5nNlVQbWmpWZBz5waz9si51nfA8fnm1uFQ13WHy1DvwX6U09JyMTbuauRXkajRsxdS6c7z2AF3Ipw8sBUvAj+ee0BL6BjIPng3b448dnLUg\/y4a0d4i9+4mt+fuesJyKV+6XQovyIZQZgW01g+KUJbNWyGZw0=","domain":".shopee.vn","path":"\/","expires":2261880793.2457,"size":178,"httpOnly":true,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"welcomePkgShown","value":"true","domain":"shopee.vn","path":"\/","expires":-1,"size":19,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_ST","value":"\".QUNhZk5MVmc1blIxM2FxbYiNS5aKGEMwr0apl1qSkTVmGpgsQyXbq0sViRngmFQPkbBb4Uejj3wPLLjWu7iaLR+\/TG8SH0+cJEZ68Lj9JvyHRiJFQjJxavOX6tFT08eQaqR96aq99rxt97ieIxI2WlDs86ICQnSAFyfn22v9cVnCpC23JVQoeKPsVfDAkssUUgAV6Le2VnefVDZ+crCP+w==\"","domain":".shopee.vn","path":"\/","expires":2261691459.3989,"size":225,"httpOnly":true,"secure":true,"session":false,"sameSite":"None","sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_T_IV","value":"\"1bIb62mxhkS6S3g6tuLu\/Q==\"","domain":"shopee.vn","path":"\/","expires":2261880786.5464,"size":34,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_PC_HYBRID_ID","value":"22","domain":"shopee.vn","path":"\/","expires":-1,"size":18,"httpOnly":false,"secure":false,"session":true,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"_fbp","value":"fb.1.1626732723713.1184355551","domain":".shopee.vn","path":"\/","expires":1638936817,"size":33,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"SPC_F","value":"iVuxq2SNrQIBHIY9eyhxiM7f0k5V1ODm","domain":".shopee.vn","path":"\/","expires":2257452724.2237,"size":37,"httpOnly":false,"secure":true,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"_ga_M32T05RVZT","value":"GS1.1.1630971398.11.1.1630971471.48","domain":".shopee.vn","path":"\/","expires":1694043471,"size":49,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443},
  {"name":"_ga","value":"GA1.2.756601462.1626732728","domain":".shopee.vn","path":"\/","expires":1694043471,"size":29,"httpOnly":false,"secure":false,"session":false,"sameParty":false,"sourceScheme":"Secure","sourcePort":443}]
  //cookies = JSON.parse(cookies)
  cookies.forEach(async (item) => {
    await page.setCookie(item);
    console.log(item)
  });
  await page.goto('https://shopee.vn');
  //await page.setRequestInterception(true);
  //page.on('request', request_event);
  //is_block_image = true;
  //is_block_image = false;

}


(async () => {
   let check = await axios('https://shopee68.com/ajaxs/client/get-mail-box-tm.php?uid=nqvixuyenle507@mail68.tk')
    
    console.log(check.data)

})();