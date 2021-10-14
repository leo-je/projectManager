#! /bin/sh
npm run build
docker stop pm
docker rm pm
docker build . -t pm-service
docker run -itd --name pm -p 9095:80 pm-service