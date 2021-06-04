#!/bin/bash
pm2 stop all
git stash
git pull origin master
npm install
pm2 start shopee.js
