#!/bin/bash
git stash
git pull origin master
pm2 start shopee.js --watch