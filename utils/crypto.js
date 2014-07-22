var crypto = require('crypto');
var CONSTANTS = require('./constants.js');
var CRYPTO_KEY = CONSTANTS.CRYPTO_KEY;
var SHA_KEY = CONSTANTS.SHA_KEY;

module.exports.decryptJSON = function (encryptJSON) {
    var decipher = crypto.createDecipher('aes-256-ecb', CRYPTO_KEY);
    var decryptTxt = decipher.update(encryptJSON, 'hex', 'utf8');
    decryptTxt += decipher.final('utf8');
    return JSON.parse(decryptTxt);
};

var encryptString = module.exports.encryptString = function(string) {
    var cipher = crypto.createCipher('aes-256-ecb', CRYPTO_KEY);
    var key = cipher.update(string, 'utf8','hex');
    key += cipher.final('hex');
    return key;
};

module.exports.encryptJSON = function (plainTextJSON) {
    plainTextJSON = JSON.stringify(plainTextJSON);
    return encryptString(plainTextJSON);
};


module.exports.sha = function(string_or_object) {
    if(_.isUndefined(string_or_object)) {
        return '';
    }

    if(!_.isString(string_or_object)) {
        try {
            string_or_object = JSON.stringify(string_or_object)
        } catch(e) {
            // oops
        }
    }
    
    var hmac = crypto.createHmac('sha256', SHA_KEY);
    hmac.update(string_or_object);
    return hmac.digest('base64');
}
