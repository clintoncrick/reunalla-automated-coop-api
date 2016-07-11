var BaseObject = require('./baseObject.js');
var Motor = require('./motor.js');
var Sensor = require('./sensor.js');

function Door(name) {
    var door = {};
    door.__proto__ = BaseObject(name);

    var motor = new Motor(19, 26);
    door.registerItem(motor);

    var topSensor = new Sensor(6, 'in', 'both');
    door.registerItem(topSensor);

    var bottomSensor = new Sensor(5, 'in', 'both');
    door.registerItem(bottomSensor);

    
    door.open = function() {
        console.log('[DOOR]: opening door');
        motor.up();
    };

    door.close = function() {
        console.log('[DOOR]: closing door');
        motor.down();
    };

    door.stop = function() {
        console.log('[DOOR]: stopping door');
        motor.stop();
    }

    door.registerAction('wakeup', function() {
        console.log('[DOOR]: Watching sensors');
        
        function handleSensorChange(_name) {
            var name = (typeof _name != 'undefined' ? '[' + _name + ' SENSOR]:' : '');
            return function(err, value) {
                console.log(name, 'Updating sensor to: ' + value);

                if (!value) {
                    door.stop();
                }
            }
        }

        topSensor.sensor.watch(handleSensorChange('TOP'));
        bottomSensor.sensor.watch(handleSensorChange('BOTTOM'));
    });

    return door;
}


module.exports = Door;
