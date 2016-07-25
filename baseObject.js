function BaseObject(name, options) {
    var bo = {};
    bo.name = name;

    //-----Items
    bo.items = {};
    bo._registerItem = function(item) {
        bo.items[item.name] = item;
    }
    bo._hasItems = function() {
        return Object.keys(bo.items).length;
    }

    //-----Actions
    bo.actions = {};
    bo._registerAction = function(actionName, callback) {
        if (typeof bo.actions[actionName] == 'undefined') {
            bo.actions[actionName] = [];
        }
        bo.actions[actionName].push(callback);
    }

    //Recursively execute this action name;
    bo._executeAction = function(actionName, defaultCallback) {
        return function() {
            var response = {
                name: bo.name
                    //items: []     // Conditionally adding this later;
            };

            //If we have items, call their actionName object and capture the results;
            if (bo._hasItems()) {
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

    bo.getActions = function() {
        var actions = [];
        for (var p in this) {
            if (typeof this[p] == 'function' && p[0] != '_') {
                actions.push(p);
            }
        }


        return actions;
    }

    //Base methods;
    bo.init = bo._executeAction('init');
    bo.wakeup = bo._executeAction('wakeup');
    bo.cleanup = bo._executeAction('cleanup');
    bo.getStatus = bo._executeAction('getStatus', function() {
        return {
            status: {}
        }
    });

    return bo;
}
module.exports = BaseObject;
