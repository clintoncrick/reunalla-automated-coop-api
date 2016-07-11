var Gpio = require('onoff').Gpio;
var sensorLib = require('node-dht-sensor');
var BaseObject = require('./baseObject.js');

function Sensor(name, type, pin, setting, direction) {
    var sensor = {}
    var isDHTSensor = false;
    sensor.__proto__ = BaseObject(name);

    switch (type) {
        case 'dht':
            isDHTSensor = true;
            sensorLib.initialize(22, pin);
            sensor.sensor = {
                readSync: function() {
                    return sensorLib.readSpec(22, pin);
                }
            };
            break;
        case 'gpio':
        default:
            sensor.sensor = new Gpio(pin, setting, direction);
            break;
    }
    sensor.registerAction('getStatus', function() {
        var status = { status: {} };
        status.status.sensor = sensor.sensor.readSync();
        return status;
    });
    return sensor;
}
module.exports = Sensor;
