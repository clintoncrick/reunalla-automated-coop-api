function BaseObject(name, options) {
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

    bo.executeAction = function(actionName, defaultCallback) {
        return function() {
            var response = {
                name: bo.name
                //items: []     // Conditionally adding this later;
            };

            //If we have items, call their actionName object and capture the results;
            if (bo.hasItems()) {
                response.items = [];
                Object.keys(bo.items).forEach(function(k) {
                    if (typeof bo.items[k][actionName] == 'function') {
                        response.items.push(bo.items[k][actionName]());
                    }
                });
            }

            //Call the action upon ourselves if we have it;
            if (bo.actions[actionName] && bo.actions[actionName].length) {
                bo.actions[actionName].forEach(function(callback) {
                    Object.assign(response, callback());
                });
            }
            //Or use the default action if we don't have one;
            else if (defaultCallback && typeof defaultCallback == 'function') {
                Object.assign(response, defaultCallback());
            }

            return response;
        }
    }

    //Base methods;
    bo.init     = bo.executeAction('init');
    bo.wakeup   = bo.executeAction('wakeup');
    bo.cleanup  = bo.executeAction('cleanup');
    bo.getStatus = bo.executeAction('getStatus', function(){
        return {
            status: {}
        }
    });

    return bo;
}
module.exports = BaseObject;
