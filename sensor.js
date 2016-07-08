var Gpio = require('onoff').Gpio;
module.exports = function(pin, setting, direction) {
    this.sensor = new Gpio(pin, setting, direction);
}
