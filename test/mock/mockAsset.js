function MockStellarAsset(code, issuer){

  this.code = code;
  this.issuer = issuer;

}

MockStellarAsset.prototype.isNative = function isNative(){

  return typeof this.issuer !== 'string' && this.code === 'XLM';

};

MockStellarAsset.prototype.getCode = function getCode(){

  return this.code;

};

MockStellarAsset.prototype.getIssuer = function getIssuer(){

  return this.issuer;

};

MockStellarAsset.prototype.equals = function equals(assetCompare){

  return (assetCompare.isNative() && this.isNative() ) || (this.code === assetCompare.code && this.issuer === assetCompare.issuer);

};

MockStellarAsset.native = function native(){

  return new MockStellarAsset('XLM', null);

};

module.exports = MockStellarAsset;
