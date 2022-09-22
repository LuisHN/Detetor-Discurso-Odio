#!/bin/bash
cd /opt/work/Detetor-Discurso-Odio/
git pull

cd frontend 
npm i 
npm run build 
docker restart restart my-apache-app 

cd /opt/work/Detetor-Discurso-Odio/
cd backend
npm i
npm run build
pm2 restart all
