const AppDispatcher = require('../dispatchers/Dispatcher');

let UserAction = {
    login: function (entry) {
        entry.state = 'loggedin';
        AppDispatcher.dispatch({
            actionName: 'login',
            entry: entry
        });
    }
}

module.exports = UserAction;
