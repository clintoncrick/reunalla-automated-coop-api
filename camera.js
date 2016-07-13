var exec = require('child_process').exec;
var fs = require('fs');
var BaseObject = require('./baseObject.js');

function Camera(name) {
    var camera = {};
    camera.__proto__ = BaseObject(name);

    var defaultOutput = './camera/latest.jpg';
    camera.takePhoto = function(_dest) {
        var output = _dest || defaultOutput;
        try {
            doesFileExist = fs.lstatSync(output);
        } catch (e) {
            //create it if it doesn't!;
            console.log('[CAMERA]: output does not exist. creating it.');
            fs.writeFile(output, '', function() {});
        }

        console.log('[CAMERA]: taking photo - ' + Date.now());
        var cmd = 'raspistill -vf -hf -o ' + output;
        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            console.log('[CAMERA]: photo finished - ' + Date.now());
        });
    }

    return camera;
}
module.exports = Camera;