var cron = require('node-cron');
const exec = require('child_process').exec;

exec("curl -O https://beta.hotaso.vn/auto_shopee.sh; sh auto_shopee.sh", (error) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }else{
        process.exit()
    }
});
