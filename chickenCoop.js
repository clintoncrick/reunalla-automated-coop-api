var BaseObject = require('./baseObject.js');
var Door = require('./door.js');
var Camera = require('./camera.js');
var Sensor = require('./sensor.js');
var Monitor = require('./monitor.js');

function ChickenCoop() {
    var coop = {};
    Object.setPrototypeOf(coop, BaseObject('Coop'));

    var door = new Door('door');
    coop._registerItem(door);
    
    var temperatureSensor = new Sensor('temperature-sensor', 'dht', 16);
    coop._registerItem(temperatureSensor);

    var camera = new Camera('camera');
    coop._registerItem(camera);

    coop.takePhoto = function(_dest) {
        return camera.takePhoto(_dest);
    }

    var monitor = new Monitor('monitor', 'mongo', coop);
    coop._registerItem(monitor);

    coop._registerAction('wakeup', function() {
        console.log('[COOP]: Waking up the coop!');
        //coop.takePhoto();
        camera.startStream();
    });

    coop._registerAction('getStatus', function(){
        return {
            timestamp: Date.now(),
            status: {
                //isDoorOpen: door.getStatus().status.isOpen
            }
        }
    });

    return coop;
}

module.exports = ChickenCoop;
