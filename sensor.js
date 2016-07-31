var Gpio = require('onoff').Gpio;
var sensorLib = require('node-dht-sensor');
var BaseObject = require('./baseObject.js');

function Sensor(name, type, pin, setting, direction) {
    var sensor = {}
    Object.setPrototypeOf(sensor, BaseObject(name));


    var isDHTSensor = false;
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
    sensor._registerAction('getStatus', function() {
        var status = { status: {} };
        status.status.sensor = sensor.sensor.readSync();
        if(typeof status.status.sensor.temperature != 'undefined'){
            status.status.sensor.temperature = status.status.sensor.temperature * 1.8 + 32;
        }
        return status;
    });
    return sensor;
}
module.exports = Sensor;
