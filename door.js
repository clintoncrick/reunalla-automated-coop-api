var BaseObject = require('./baseObject.js');
var Motor = require('./motor.js');
var Sensor = require('./sensor.js');

function Door(name) {
    var door = {};
    door.__proto__ = BaseObject(name);

    var motor = new Motor('motor', 19, 26);
    door.registerItem(motor);

    var topSensor = new Sensor('top-sensor', 'gpio', 6, 'in', 'both');
    topSensor.sensor.setActiveLow(true);
    door.registerItem(topSensor);
    
    var bottomSensor = new Sensor('bottom-sensor', 'gpio', 5, 'in', 'both');
    bottomSensor.sensor.setActiveLow(true);
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
                if (value) {
                    console.log(name, 'triggered. Stopping door.');
                    door.stop();
                }
            }
        }

        topSensor.sensor.watch(handleSensorChange('TOP'));
        bottomSensor.sensor.watch(handleSensorChange('BOTTOM'));
    });

    door.registerAction('getStatus', function() {
        var motorStatus = motor.getStatus();
        var opening = motorStatus.status.Pin1;
        var closing = motorStatus.status.Pin2;
        return {
            status: {
                isOpen: topSensor.sensor.readSync(),
                isClosed: bottomSensor.sensor.readSync(),
                isStuck: (!opening && !closing && !topSensor.sensor.readSync() && !bottomSensor.sensor.readSync()) * 1,
                isOpening: opening,
                isClosing: closing
            }
        };
    });

    return door;
}


module.exports = Door;
