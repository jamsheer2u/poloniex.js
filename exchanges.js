var polo = require('./poloniex');
var trex = require('./bittrex');
var extend = require('extend');

var exchanges = {
    prepare : function(callback) {
        polo.read(function(err, data){
            if (!err) {
                trex.read(function(err1, data1) {
                    if (!err1) {
                        extend(true, data, data1);                    
                    }

                    if (callback) {
                        callback(err1, data);
                    }
                });
            }
            else if (callback) {
                callback(err, data);
            }
        });

        
    }
};

module.exports = exchanges;