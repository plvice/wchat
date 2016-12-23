const AppDispatcher = require('../dispatchers/Dispatcher');

let UserAction = {
    login: function (entry) {
        entry.loggedIn = true;
        AppDispatcher.dispatch({
            actionName: 'login',
            entry: entry
        });
    },

    restoreUserData: function (entry) {
        entry.loggedIn = false;
        AppDispatcher.dispatch({
            actionName: 'restoreUserData',
            entry: entry
        });
    }
}

module.exports = UserAction;
