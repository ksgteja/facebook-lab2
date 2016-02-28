var crypto = require('crypto'),
    algo = 'aes-256-ctr',
    key = 'd6F3Efeqabyfhsc';

exports.encrypt = function(password){
  var cipher = crypto.createCipher(algo,key)
  var crypted = cipher.update(password,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
exports.decrypt = function(password){

	console.log("Password is "+password);
  var decipher = crypto.createDecipher(algo,key)
  var dec = decipher.update(password,'hex','utf8')
  dec += decipher.final('utf8');
  
  console.log("Decrypted text "+dec);
  return dec;
}

