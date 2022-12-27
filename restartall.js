var cron = require('node-cron');
const exec = require('child_process').exec;
const actionsShopee = require('./src/actions.js')
require('dotenv').config();
slavenumber = process.env.SLAVE
mode = process.env.MODE
const moment = require('moment')

restartAll = async () => {
    console.log("------- Restart all -------")
   
    try {
        // exec("node restart.js", (error) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return;
        //     }
        // });

        let check = await actionsShopee.check_slave_die(slavenumber)
       
        console.log(moment().format("hh:mm:ss") + "Trạng thái slave: " + slavenumber + " : " + check)
        if (check) {
            //exec("shutdown -r", (error) => {
                console.log(moment().format("hh:mm:ss") + " - ------- Restart all -------")
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
if (mode == "DEV") {
    (async () => {     
        await restartAll()

    })();
} else {
    console.log(moment().format("hh:mm:ss") + "slave: " + slavenumber )
    cron.schedule('*/20 * * * *', async () => {
        await restartAll()
    })
}
