#Garnet

[![Build Status](https://travis-ci.org/julesGoullee/garnet.png)](https://travis-ci.org/julesGoullee/garnet)
[![dependencies Status](https://david-dm.org/julesGoullee/garnet.svg)](https://david-dm.org/julesGoullee/garnet#info=dependencies&view=table)

#DB:
```
docker run \
    --name garnet-redis \
    -v ~/dockerVolumes/garnetData:/data \
    -p 127.0.0.1:6379:6379  \
    -d redis:3.2.6 redis-server \
    --appendonly yes
```
