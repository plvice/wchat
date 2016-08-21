const React = require('react');
const ChatEntries = require('./ChatEntries');


var Chat = React.createClass({

	componentDidMount: function () {
			console.log('component Chat mounted');
	},

	componentWillUnmount: function () {

	},

	getInitialState: function () {
		return {
			messages: [
				{author: 'John', content: 'John entry', key: '1'},
				{author: 'Samantha', content: 'Samantha entry', key: '2'}
			]
		};
	},

	render: function () {
		return (
			<div className="chat">
				<h1>Entries list</h1>
				<ChatEntries data={this.state.messages}/>
			</div>
		)
	}
});

module.exports = Chat;
