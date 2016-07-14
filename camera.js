var exec = require('child_process').exec;
var kill = require('tree-kill');
var fs = require('fs');
var BaseObject = require('./baseObject.js');

function Camera(name) {
    var camera = {};
    camera.streaming = false;
    camera.processes = {};
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

    camera.startStream = function() {
        //Streaming install and setup found here:
        //http://blog.cudmore.io/post/2015/03/15/Installing-mjpg-streamer-on-a-raspberry-pi/

        console.log('[CAMERA]: Starting stream @ :8090');
        camera.processes.camera = exec('raspistill -vf -hf --nopreview -w 640 -h 480 -q 5 -o /tmp/stream/pic.jpg -tl 100 -t 9999999 -th 0:0: > /dev/null 2>&1 &', function(error, stdout, stderr) {
            camera.processes.stream = exec('mjpg_streamer -i "input_file.so -f /tmp/stream -n pic.jpg" -o "output_http.so -w /usr/local/www -p 8090" > /dev/null 2>&1 &', function(error, stdout, stderr) {});
        });
    }

    camera.stopStream = function() {
        console.log('[CAMERA]: stopping camera...');
        if (camera.processes.camera) {
            kill(camera.processes.camera.pid + 1); //@TODO: fix this??
            console.log('[CAMERA]: camera stopped');
        }


        console.log('[CAMERA]: stopping stream...');
        if (camera.processes.stream) {
            kill(camera.processes.stream.pid + 1); //@TODO: fix this??
            console.log('[CAMERA]: stream stopped');
        }
    }

    return camera;
}
module.exports = Camera;
