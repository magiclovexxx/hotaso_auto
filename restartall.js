var cron = require('node-cron');
const exec = require('child_process').exec;
const actionsShopee = require('./src/actions.js')
require('dotenv').config();
slavenumber = process.env.SLAVE

restartAll = async () => {

 console.log("------- Restart all -------")
    try {
        let check = await actionsShopee.check_slave_die(slavenumber)
        console.log(check)
        if(check){
        //exec("shutdown -r", (error) => {
           exec("pm2 restart all", (error) => {
               if (error) {
                   console.log(`error: ${error.message}`);
                   return;
               }
           });
        }
    } catch (error) {
        console.log(error)
    }
}

cron.schedule('*/5 * * * *', async () => {
    await restartAll()
  })