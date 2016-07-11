var Gpio = require('onoff').Gpio;
var BaseObject = require('./baseObject.js');

function Sensor(pin, setting, direction){
	var sensor = {}
	sensor.__proto__ = BaseObject('Sensor');

	sensor.sensor = new Gpio(pin, setting, direction);
	return sensor;
}
module.exports = Sensor;