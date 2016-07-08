var Motor = require('./motor.js');
var Sensor = require('./sensor.js');
module.exports = function() {
    var d = this;
    var motor = new Motor(19, 26);
    var topSensor = new Sensor(6, 'in', 'both');
    var bottomSensor = new Sensor(5, 'in', 'both');

    this.open = function() {
        console.log('[DOOR]: opening door');
        motor.up();
    };

    this.close = function() {
        console.log('[DOOR]: closing door');
        motor.down();
    };

    this.stop = function() {
        console.log('[DOOR]: stopping door');
        motor.stop();
    }

    this.cleanup = function() {
        motor.cleanup();
    }


    function handleSensorChange(_name) {
        var name = (typeof _name != 'undefined' ? '[' + _name + ' SENSOR]:' : '');
        return function(err, value) {
            console.log(name, 'Updating sensor to: ' + value);
            
            if (!value) {
                d.stop();
            }
        }
    }
    topSensor.sensor.watch(handleSensorChange('TOP'));
    bottomSensor.sensor.watch(handleSensorChange('BOTTOM'));
}
