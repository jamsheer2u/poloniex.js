var Poloniex = require('./lib/poloniex');
Poloniex.STRICT_SSL = false;

var poloniex = new Poloniex(
    // 'API_KEY',
    // 'API_SECRET'
);

var polo = {
    read : function(callback) {
        // Public call
        poloniex.getTicker(function(err, data){
            if (callback) {
                callback(err, data);
            }
        });
    }
};

module.exports = polo;