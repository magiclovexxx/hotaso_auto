#!/bin/bash
git stash
git pull origin master
npm install
pm2 start shopee.js
pm2 restart all
