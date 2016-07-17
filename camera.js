var child_process = require('child_process');
var exec = child_process.exec;
var execSync = child_process.execSync;
var kill = require('tree-kill');
var fs = require('fs');
var BaseObject = require('./baseObject.js');

function Camera(name) {
    var camera = {};
    camera.streaming = false;
    camera.streaming_directory = '/tmp/stream';
    camera.streaming_t = 9999999;
    camera.processes = {};
    camera.__proto__ = BaseObject(name);

    var defaultOutput = './camera/latest.jpg';
    camera.takePhoto = function(_dest) {
        if (!camera.streaming) {
            var output = _dest || defaultOutput;
            try {
                doesFileExist = fs.lstatSync(output);
            } catch (e) {
                //create it if it doesn't!;
                console.log('[CAMERA]: output does not exist. creating it.');
                fs.writeFile(output, '', function() {});
            }

            if (camera.streaming) {
                camera.stopCamera();
            }

            var cmd = 'raspistill -vf -hf -w 1600 -h 1200 -q 35  --nopreview -o ' + camera.streaming_directory + '/pic.jpg';
            camera.processes.camera = exec(cmd, function(error, stdout, stderr) {
                if (error) {
                    console.log('[CAMERA]: photo ERROR - ' + Date.now());
                    console.log(error);
                } else {
                    console.log('[CAMERA]: photo finished - ' + Date.now());
                }
                
                //@TODO: move/copy from tmp to _dest;
                if (camera.streaming) {
                    camera.restartCameraStream(true);
                }
            });
        }
    }

    camera.startStream = function(_restart) {
        //Streaming install and setup found here:
        //http://blog.cudmore.io/post/2015/03/15/Installing-mjpg-streamer-on-a-raspberry-pi/
        var restart = _restart || false;
        console.log('[CAMERA]: Starting stream @ :8090');

        try {
            fs.lstatSync(camera.streaming_directory);
        } catch (e) {
            //create it if it doesn't!;
            console.log('[CAMERA]: ' + camera.streaming_directory + ' does not exist. creating it.');
            execSync('mkdir ' + camera.streaming_directory);
            execSync('sudo chmod 777 ' + camera.streaming_directory);
        }

        camera.processes.camera = exec('raspistill -vf -hf --nopreview -w 770 -h 578 -q 10 -o ' + camera.streaming_directory + '/pic.jpg -tl 100 -t ' + camera.streaming_t + ' -th 0:0: > /dev/null 2>&1 &', function(error, stdout, stderr) {
            if (!restart) {
                camera.processes.stream = exec('mjpg_streamer -i "input_file.so -f ' + camera.streaming_directory + ' -n pic.jpg" -o "output_http.so -w /usr/local/www -p 8090" > /dev/null 2>&1 &', function(error, stdout, stderr) {});
            }
        });

        camera.streaming = true;

        camera.processes.cameraMonitor = setTimeout(function() {
            camera.restartCameraStream();
        }, camera.streaming_t - 200);
    }

    camera.stopCamera = function() {
        console.log('[CAMERA]: stopping camera...');
        if (camera.processes.camera) {
            kill(camera.processes.camera.pid + 1);
            console.log('[CAMERA]: camera stopped');
        }
    }

    camera.stopCameraMonitor = function() {
        console.log('[CAMERA]: stopping the camera monitor...');
        if (camera.processes.cameraMonitor) {
            clearTimeout(camera.processes.cameraMonitor);
            camera.processes.cameraMonitor = false;
            console.log('[CAMERA]: camera monitor');
        }
    }

    camera.stopStream = function(){
        console.log('[CAMERA]: stopping stream...');
        if (camera.processes.stream) {
            kill(camera.processes.stream.pid + 1);
            console.log('[CAMERA]: stream stopped');
        }
    }

    camera.turnOffStream = function() {
        camera.stopCamera();
        camera.stopStream();
        camera.stopCameraMonitor();
        camera.streaming = false;
    }

    camera.restartCameraStream = function() {
        camera.startStream(true);
    }

    return camera;
}
module.exports = Camera;
