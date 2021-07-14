var cron = require('node-cron');
const exec = require('child_process').exec;
const actionsShopee = require('./src/actions.js')
require('dotenv').config();
slavenumber = process.env.SLAVE

restartAll = async () => {

 console.log("------- Restart all -------")

 let check = await actionsShopee.check_slave_die(slavenumber)
 console.log(check)
 
 if(check==1){
 //exec("shutdown -r", (error) => {
    exec("pm2 restart all", (error) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
    });
 }

 if(check==2){
    //exec("shutdown -r", (error) => {
       exec("shutrown -r", (error) => {
           if (error) {
               console.log(`error: ${error.message}`);
               return;
           }
       });
    }
   
}

async () => {
    await restartAll()
  }