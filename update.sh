#!/bin/bash
pm2 stop all
git stash
git pull origin master
npm install
npm install pm2-windows-startup -g
pm2-startup install
pm2 start shopee.js
pm2 save
pm2 log
