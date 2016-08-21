const Dispatcher = require('flux').Dispatcher;
const UserStore = require('../stores/User');
// const MicroEvent = require('../vendor/MicroEvent');


var AppDispatcher = new Dispatcher();

AppDispatcher.register(function (payload) {
	switch (payload.actionName) {
		case 'login':
			console.log(payload.entry);
			UserStore.trigger('change');
      	break;
	}
});

module.exports = AppDispatcher;
