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

cd /opt/work/Detetor-Discurso-Odio/classificador/worker
pip install -r requirements.txt

pm2 stop all
pm2 start classificador.py --name classificador --interpreter python3
pm2 start classificador-extensao.py classificador-extensao --interpreter python3


cd  /opt/work/Detetor-Discurso-Odio/backend/dist
pm2 start dist/main.js --name backend

pm2 restart all