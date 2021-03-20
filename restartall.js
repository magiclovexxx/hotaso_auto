var cron = require('node-cron');
const exec = require('child_process').exec;

restartAll = async () => {

 console.log("------- Restart all -------")
    exec("", (error) => {
    //exec("pm2 restart all", (error) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
    });
}

cron.schedule('*/30 * * * *', async () => {
    await restartAll()
  })