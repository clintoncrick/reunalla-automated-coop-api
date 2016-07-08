var Door = require('./door.js');
var Camera = require('./camera.js');
module.exports = function() {
    var coopDoor = new Door();
    var camera = new Camera();

    this.wakeUp = function() {
        console.log('[CHICKEN COOP]: Waking up the chicken coop!');
        this.cleanup();
    }

    this.cleanup = function() {
    	coopDoor.cleanup();
    }
    
    this.takePhoto = function(_dest){
    	camera.takePhoto(_dest);
    }
};
