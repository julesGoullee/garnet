# Garnet
> Automatic market maker on Stellar Network

[![Build Status](https://travis-ci.org/julesGoullee/garnet.png)](https://travis-ci.org/julesGoullee/garnet)
[![dependencies Status](https://david-dm.org/julesGoullee/garnet.svg)](https://david-dm.org/julesGoullee/garnet#info=dependencies&view=table)

**Garnet** is a market-maker bot for the [Stellar network](https://www.stellar.org). It automatically creates *offers* on the market depending on its wallets and on market prices.

Its main goal is not to earn money but to help the *expansion* and introduction of *anchors* into Stellar network. It allows anchors to diffuse their assets, and users to send path payments with assets they don't hold. It is made to play the role of real market makers until there are enough players on the network.

This repository is here to show our original idea to help the network and  to show a proof-of-concept implementation. It is not intended to use on public network for now. 

The bot is launched with an account seed created specifically for it. It checks his trustlines and balances, and creates **passive offers** for everything it holds, with rates defined by an **oracle**.
The Oracle is an independent module that tells the bot prices and amount to sell for a pair of assets.

In this project there are tree differents oracles:
- One very basic, that sells everything it holds for a price of 1:1 (`oracles/simple.js`)
- One that fetch current market prices of common currences (USD, EUR, BTC, ...) from public APIs (currently [Coindesk](http://www.coindesk.com/api/)) (`oracles/realWorld.js`)
- One that reads prices and amount in a *Redis* database. (`oracles/redis.js`)


## Running demo

You can watch the current balances and offers for our demo bot on testnet on [Stellar Portal](https://stellar-portal.netlify.com/?accountId=GBJMKEFDNZE3X7PBM5QLEEOFZ75352FCEXCOSJJ3IAYQE2G6W25W4PYQ)

https://stellar-portal.netlify.com/?accountId=GBJMKEFDNZE3X7PBM5QLEEOFZ75352FCEXCOSJJ3IAYQE2G6W25W4PYQ

On this account, you can see that the bot holds EUR, USD, and BTC and hase offers with current market prices. If you send assets to it or create offers that take its, you will see that it update his offers. *(If you want to receive some assets, send us a message with your public key and we will fund you)*

## Use case

When an anchor wants to get into stellar network, no one holds its assets. There must be market makers that trust this new anchor to allow path payments and trading. At the very beggining, an anchor can become its own market maker, choose to trust some others anchor's assets, inject its own asset into the bot and get others assets in exchange. 
The bot will then loose anchor's assets, but gain other ones. The anchor has to invest money on it, but it will get others currencies that it will be able to claim on the real world afterwards. 
At the end, anchor's assets will be flowing on the network and exchanged by Stellar users. 
To stay fair and not to loose money, the bot must use an oracle that announce correct market prices.

You can run your own bot and test its behavior on the testnet. You can use tools like [Stellar Portal](https://stellar-portal.netlify.com/?accountId=GBJMKEFDNZE3X7PBM5QLEEOFZ75352FCEXCOSJJ3IAYQE2G6W25W4PYQ) or [Stellar Laboratory](https://www.stellar.org/laboratory).

- Create a bot account
- Create some issuer accounts, create trustlines to issuers assets *(corresponding to known currencies, EUR, USD...)* on the bot account
- Fund the bot account with one or two assets
- Watch offers that it has created.

## Running

### Requirements

- NodeJS v7+
- yarn *(optional)*
### Bash
 The easiest way to run the bot is from command line.
 
- Install node dependencies
- Run `npm start` with `SEED`environment variable filled with the bot's secret seed.

```
$ yarn (or npm install)
$ SEED=SDJEUIJRE npm start
```
### Docker
```
$ docker build
$ docker run \
    --name garnet-redis \
    -v ~/dockerVolumes/garnetData:/data \
    -p 127.0.0.1:6379:6379  \
    -d redis:3.2.6 redis-server \
    --appendonly yes
```

## Improvements

This bot is just a proof-of-concept for a market maker bot to allow expansion of stellar network and introduction of new anchors. It is not intended to use on real public network as the currently implemented oracle is not returning perfectly correct market prices and may loose some money value. It is currently configured to run on testnet. 

The plan is to increase robustness, precision of market prices and external oracles integrations. If anchors want to use it, the code can be adapted to connect to their own market estimations.

If you have something interesting to share with us, we're open to issue or PM.```
