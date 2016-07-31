var express = require('express');       // call express
var cors = require('cors');             // cors!
var app = express();                    // define our app using express
var port = process.env.PORT || 8080;    // set our port


//Get our chicken coop and wake it up;
var ChickenCoop = require('./chickenCoop.js');
var coop = ChickenCoop();
coop.wakeup();


var failure = {
    success: false,
    message: 'Invalid request, buddy'
};

var success = {
    success: true,
    message: 'Successfully executed the command;'
}

//Create the routes for the API;
var router = express.Router();
router.get('/', function(req, res) {
    res.json(failure);
});


router.get('/latestPhoto', function(req, res) {
    // coop.takePhoto();
    // var duration = 6200;
    // var newTime = Date.now() + duration;
    // while(Date.now() < newTime + duration){}
    res.sendFile('/tmp/stream/pic.jpg');
});

router.get('/coop', function(req, res) {
    res.json(coop.getStatus());
});

router.get('/coop/items/', function(req, res) {
    var status = coop.getStatus();
    res.json(status.items);
});

router.get('/coop/items/:item_name', function(req, res) {
    if (coop.items[req.params.item_name]) {
        res.json(coop.items[req.params.item_name].getStatus());
    } else {
        res.json(failure); //@TODO: update this to throw an actual error?
    }
});


// router.get('/coop/items/camera/takePhoto', function(req, res){
// 	coop.items['camera'].takePhoto();
// 	res.sendFile('/tmp/stream/pic.jpg');
// });

router.get('/coop/items/:item_name/:action/:arguments?', function(req, res) {
    var item = coop.items[req.params.item_name];
    if (item && item[req.params.action] && typeof item[req.params.action] == 'function') {
        var actionResponse = item[req.params.action].call(item, req.params.arguments);
        Promise.resolve(actionResponse).then(function(value) {
        	res.json(value || success);
        })
    } else {
        res.json(failure); //@TODO: update this to throw an actual error?
    }
});



//Register the routes;
app.use('/api', router);
app.use(cors());

//Fire it up!;
app.listen(port);
console.log('[CHICKEN COOP]: online. Now serving at: ' + port);
