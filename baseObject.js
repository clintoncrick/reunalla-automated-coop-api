// var events = require('events');
// var eventEmitter = new events.EventEmitter();

function BaseObject(name) {
    var bo = {};
    bo.name = name;

    //-----Items
    bo.items = {};
    bo.registerItem = function(item) {
        bo.items[item.name] = item;
    }
    bo.hasItems = function() {
        return Object.keys(bo.items).length;
    }


    //-----Actions
    bo.actions = {};
    bo.registerAction = function(actionName, callback) {
        if (typeof bo.actions[actionName] == 'undefined') {
            bo.actions[actionName] = [];
        }
        bo.actions[actionName].push(callback);
    }
    bo.executeAction = function(actionName) {
        return function() {
            if (bo.hasItems()) {
                Object.keys(bo.items).forEach(function(k) {
                    bo.items[k].executeAction(actionName);
                });
            }

            if (bo.actions[actionName] && bo.actions[actionName].length) {
                bo.actions[actionName].forEach(function(callback) {
                    callback();
                });
            }
        }
    }

    //Base methods;
    bo.init     = bo.executeAction('init');
    bo.wakeup   = bo.executeAction('wakeup');
    bo.cleanup  = bo.executeAction('cleanup');


    bo.getStatus = function() {
        var status = {};
        Object.keys(items).forEach(function(k, item) {
            console.log(item);
        });

        return status;
    }

    return bo;
}
module.exports = BaseObject;
