const Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

AppDispatcher.register(function (payload) {
	// switch (payload.actionName) {
	// 	case 'add-entry':
	// 		console.log('it works!');
	// 		console.log(payload.entry);
	// 		// ListStore.items.push( payload.newItem );
    //   	break;
	// }
});

module.exports = AppDispatcher;
