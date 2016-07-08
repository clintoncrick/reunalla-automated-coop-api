var exec = require('child_process').exec;
var fs = require('fs');
module.exports = function(_options) {
    var defaultOutput = './camera/latest.jpg';

    this.takePhoto = function(_dest) {
    	var output = _dest || defaultOutput;

        try {
            doesFileExist = fs.lstatSync(output);
        } catch (e) {
            //create it if it doesn't!;
            console.log('[CAMERA]: output does not exist. creating it.');
            fs.writeFile(output, '', function(){});
        }
        
        console.log('[CAMERA]: taking photo');
        var cmd = 'raspistill -vf -hf -o ' + output;
        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            console.log('[CAMERA]: photo finished');
        });
    }
};
