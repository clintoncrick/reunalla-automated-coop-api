var BaseObject = require('./baseObject.js');


//--Mongo
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function Monitor(name, type, itemToMonitor) {
    var monitor = {};
    Object.setPrototypeOf(monitor, BaseObject(name));
    
    monitor.type = '';
    monitor.saveFunction = function() {};
    monitor.getItems = function() {
        return [];
    };
    monitor.frequency = 1800000; // in MS;
    

    // //TOCLEAR THE MONITOR LOGs;
    // monitor.url = 'mongodb://localhost:27017/chickenCoop';
    // MongoClient.connect(monitor.url, function(err, db){
    //     db.collection('monitor').deleteMany({})
    // });


    switch (type) {
        case 'mongo':
        default:
            monitor.url = 'mongodb://localhost:27017/chickenCoop';
            monitor.type = 'mongo';
            monitor.saveFunction = function() {
                console.log('[MONITOR]: Saving status.....');
                var log = itemToMonitor.getStatus();
                MongoClient.connect(monitor.url, function(err, db) {
                    db.collection('monitor').insertOne(log, function(err, result) {
                        console.log('[MONITOR]: Status saved!');
                        db.close();
                    });
                });
            };
            monitor.getItems = function(_count) {
                var count = (_count ? _count * 1 : false);
                return new Promise(function(resolve, reject) {
                    var returnItems = [];
                    MongoClient.connect(monitor.url, function(err, db) {
                        var items = db.collection('monitor').find();
                        if(count) {
                            items = items.limit(count);
                        }
                        items.sort({timestamp: -1}).toArray().then(function(items) {
                            db.close();
                            resolve(items);
                        });
                    });
                });
            }
            break;
    }

    monitor._registerAction('wakeup', function() {
        monitor.saveFunction();
        monitor.monitorProcess = setInterval(monitor.saveFunction, monitor.frequency);
    });

    
    // monitor._registerAction('getStatus', function() {
    //     var status = {
    //         status: {}
    //     };
    //     return status;
    // });

    return monitor;
}
module.exports = Monitor;
