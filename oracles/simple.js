/* eslint-disable class-methods-use-this */
/* eslint-disable no-async-without-await/no-async-without-await */
/* eslint-disable no-unused-vars */


 class Oracle {
   async getPrice(assetSelling, assetBuying){

     return { n: 1, d: 1};
  
   }
   async getAmount(wallet){

     if(wallet.asset.isNative() ){

       return 0;
    
     }
    
     return wallet.balance;
  
   }
}

 module.exports = Oracle;
