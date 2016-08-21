const React = require('react');
const ReactDOM = require('react-dom');
const AppDispatcher = require('../dispatchers/Dispatcher');
const AnotherComponent = require('./AnotherComponent');

var ChatEntries = React.createClass({

	componentDidMount: function () {
		console.log('component ChatEntries mounted');
		console.log('ChatEntries props: ');
		console.log(this.props.data);
	},

	componentWillUnmount: function () {

	},

	addNewEntry: function (e) {
		// console.log(e);
		// console.log(AppDispatcher);
		AppDispatcher.dispatch({
			actionName: 'add-entry',
			entry: {message: 'newly added entry', author: 'Olga', key: '3'}
		});

		ReactDOM.render(<AnotherComponent />, document.getElementById('app'))
	},

	render: function () {
		var data = this.props.data;

		var messages = this.props.data.map(function (entry) {
				return (
					<li className="entry" key={entry.key}>
						<div className="entry-author">
							<strong>{entry.author}</strong>
						</div>
						<div className="entry-content">
							<p>{entry.content}</p>
						</div>
					</li>
				)
		});

		return (
			<div className="entries">
				<ul>
					{messages}
				</ul>
				<button onClick={this.addNewEntry}>Add another entry</button>
			</div>
		)
	}
});

module.exports = ChatEntries;
