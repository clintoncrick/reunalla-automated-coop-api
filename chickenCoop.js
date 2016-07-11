var BaseObject = require('./baseObject.js');
var Door = require('./door.js');
var Camera = require('./camera.js');

function ChickenCoop() {
    var coop = {};
    coop.__proto__ = BaseObject('Coop');

    var door = new Door('door');
    coop.registerItem(door);

    var camera = new Camera('camera');
    coop.registerItem(camera);

    coop.takePhoto = function(_dest) {
        camera.takePhoto(_dest);
    }

    coop.registerAction('wakeup', function(){
        console.log('[COOP]: Waking up the coop!');
        coop.takePhoto();
    });

    return coop;
}

module.exports = ChickenCoop;