var Gpio = require('onoff').Gpio;
module.exports = function(pin1, pin2) {
    var Pin1 = new Gpio(pin1, 'out');
    var Pin2 = new Gpio(pin2, 'out');
    
    this.up = function() {
        Pin1.writeSync(1);
        Pin2.writeSync(0);
    }

    this.down = function() {
        Pin1.writeSync(0);
        Pin2.writeSync(1);
    }

    this.stop = function() {
        Pin1.writeSync(0);
        Pin2.writeSync(0);
    }

    this.cleanup = function() {
        console.log('[MOTOR]: cleanup started...');
        Pin1.writeSync(0);
        Pin2.writeSync(0);
        console.log('[MOTOR]: cleanup completed.');
    }
}
