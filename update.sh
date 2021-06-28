#!/bin/bash
git stash
git pull origin master
npm install
pm2 start shopee.js
pm2 start restartall.js
pm2 startup
pm2 save
pm2 restart all
