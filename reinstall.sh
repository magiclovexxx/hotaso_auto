cd /home/hotaso_auto
mv .env /home
cd ../
rm -rf hotaso_auto
git clone https://github.com/magiclovexxx/hotaso_auto.git
mv .env hotaso_auto
cd hotaso_auto
npm install
pm2 restart all; pm2 log 
