var Gpio = require('onoff').Gpio;
var BaseObject = require('./baseObject.js');

function Motor(pin1, pin2) {
    var motor = {};
    motor.__proto__ = BaseObject('Motor');

    var Pin1 = new Gpio(pin1, 'out');
    var Pin2 = new Gpio(pin2, 'out');
    
    motor.up = function() {
        Pin1.writeSync(1);
        Pin2.writeSync(0);
    }

    motor.down = function() {
        Pin1.writeSync(0);
        Pin2.writeSync(1);
    }

    motor.stop = function() {
        Pin1.writeSync(0);
        Pin2.writeSync(0);
    }

    motor.cleanup = function(){
        console.log('[MOTOR]: cleanup started...');
        Pin1.writeSync(0);
        Pin2.writeSync(0);
        console.log('[MOTOR]: cleanup completed.');
    }

    motor.registerAction('wakeup', motor.cleanup);
    motor.registerAction('cleanup', motor.cleanup);
    
    return motor;
}

module.exports = Motor;