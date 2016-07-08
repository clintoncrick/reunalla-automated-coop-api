var Motor = require('./motor.js');
var Sensor = require('./sensor.js');
module.exports = function(){
	var motor = new Motor(19, 26);
	var magnetSensor = new Sensor(6, 'high', 'both');
	// magnetSensor.sensor.watch(function(err, value) {
	//     console.log('Updating sensor to: ' + value);
	// });

	this.open = function(){
		console.log('[DOOR]: opening door');
		motor.up();
	};

	this.close = function(){
		console.log('[DOOR]: closing door');
		motor.down();
	};

	this.stop = function(){
		console.log('[DOOR]: stopping door');
		motor.stop();
	}

	this.cleanup = function(){
		motor.cleanup();
	}
}