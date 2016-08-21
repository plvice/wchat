const AppDispatcher = require('../dispatchers/Dispatcher');

let UserAction = {
    login: function (entry) {
        AppDispatcher.dispatch({
            actionName: 'login',
            entry: entry
        });
    }
}

module.exports = UserAction;
