const AppDispatcher = require('../dispatchers/Dispatcher');

let UserAction = {
    login: function (entry) {
        entry.loggedIn = true;
        AppDispatcher.dispatch({
            actionName: 'login',
            entry: entry
        });
    }
}

module.exports = UserAction;
