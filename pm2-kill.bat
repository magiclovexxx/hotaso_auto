cd /home/hotaso_auto
Taskkill /F /IM Chrome.exe; pm2 kill; pm2 start shopee.js restartall.js; pm2 startup; pm2 save
