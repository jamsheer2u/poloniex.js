var config = require('./config');
var exchanges = require('./exchanges');
var colors = require('colors');
var fs = require('fs');
var cliff = require('cliff');

var last_read_file = 'last-data.json';
var trigger_point = 30.0;


// Public call
exchanges.prepare(function(err, data){
    if (err){
        console.log('ERROR', err);
        return;
    }

    start(data);
});

function start(data) {
    var lastData = readLastData(data);
    var rows = processData(data, config.cryptos, lastData);
    printData(rows);

    writeLastData(data);
}

function printData(rows) {
    var col = ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'];
    cliff.putRows('data', rows, col);
}

function processData(data, cryptos, lastData) {
    // console.log('Name', '\t', 'Low     ', '\t', 'Last     ', '\t', 'High     ', '\t', 'My Change', '\t', '24Hr     ', '\t', 'Last', '\n');
    var rows =[];
    var columns = ['Name', 'Low', 'Last', 'High', 'My Change', '24Hr', 'Last'];
    rows.push(columns);
    if (data && cryptos) {
        cryptos.forEach(function(coin){
            var coinData = data[coin.id];
            var lastCoinData = lastData[coin.id];
            var change24 = get24HrPriceChange(coinData.percentChange);
            var name = format(coinData.last, coin.price, coin.displayName);
            var last = format(coinData.last, coin.price, coinData.last);
            var myChange = format(coinData.last, coin.price);
            var lastChange = format(coinData.last, lastCoinData.last);
            //console.log(name, '\t', coinData.low24hr, '\t', last, '\t', coinData.high24hr, '\t', myChange, '  \t', change24, '\t', lastChange, '\n');
            var row = [name, coinData.low24hr, last, coinData.high24hr, myChange, change24, lastChange];
            rows.push(row);
        });
    }

    return rows;
}

function get24HrPriceChange(price) {
    var p = +price;
    var p1 = Math.abs(p);
    var returnObj;
    if (p < 0) {
        returnObj = colors.red((p1 * 100).toFixed(2) + ' ⇓');
        if (p1 * 100 > trigger_point) {
            returnObj = colors.inverse(returnObj);
        }
    }
    else {
        returnObj = colors.green((p1 * 100).toFixed(2) + ' ⇑');
        if (p1 * 100 > trigger_point) {
            returnObj = colors.inverse(returnObj);
        }
    }

    return returnObj;
}

function format(currentPrice, basePrice, data) {
    if (!basePrice) {
        basePrice = currentPrice;
    }

    currentPrice = +currentPrice;
    basePrice = +basePrice;

    var change = currentPrice - basePrice;
    var percentChange = change / basePrice;
    percentChange = Math.abs(percentChange);

    var returnObj;
    if (change < 0) {
        if (data) {
            returnObj = colors.red(data);
        }
        else {
            returnObj = colors.red((percentChange * 100).toFixed(2) + ' ⇓');
            if (percentChange * 100 > trigger_point) {
                returnObj = colors.inverse(returnObj);
            }
        }
    }
    else {
        if (data) {
            returnObj = colors.green(data);
        }
        else {
            returnObj = colors.green((percentChange * 100).toFixed(2) + ' ⇑');
            if (percentChange * 100 > trigger_point) {
                returnObj = colors.inverse(returnObj);
            }
        }
    }
    return returnObj;
}

function readLastData(defaultValue) {
    var json;
    try{
        json = JSON.parse(fs.readFileSync(last_read_file, 'utf8'));
    }
    catch(ex) {

    }

    if (!json) {
        json = defaultValue;
    }

    return json;
}

function writeLastData(data) {
    var json = JSON.stringify(data);
    fs.writeFileSync(last_read_file, json);
}

