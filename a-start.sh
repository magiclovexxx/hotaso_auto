#!/bin/bash
git stash
git pull origin master
pm2 start shopee.js restartall.js; pm2 startup; pm2 save; pm2 restart all;