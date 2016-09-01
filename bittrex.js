var bittrex = require('node.bittrex.api');

bittrex.options({
    'stream' : true,
    'verbose' : true,
    'cleartext' : false 
});

var trex = {
    read : function(callback) {
        bittrex.getmarketsummaries(function(data) {
            if (data.success) {
                var processedData = processData(data.result);
                if (callback) {
                    callback(null, processedData);
                }
            }
            else {
                callback(data.message, null);
            }
        });
    }
};

function processData(data) {
    var processedData = {};
    if (data) {
        data.forEach(function(market) {
            var convMarket = {};
            convMarket.id = market.MarketName;
            convMarket.last = market.Last;
            convMarket.lowestAsk = market.Ask;
            convMarket.highestBid = market.Bid;
            convMarket.baseVolume = market.BaseVolume;
            convMarket.quoteVolume = market.Volume;
            convMarket.high24hr = market.High;
            convMarket.low24hr = market.Low;
            convMarket.isFrozen = 0;
            convMarket.percentChange = getPriceChange(market.Last, market.PrevDay);

            processedData[market.MarketName] = convMarket;
        });
    }

    return processedData;
}

function getPriceChange(currentPrice, basePrice){
    var change = currentPrice - basePrice;
    var percentChange = change / basePrice;

    return percentChange;
}

module.exports = trex;