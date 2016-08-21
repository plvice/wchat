const React = require('react')

var AnotherComponent = React.createClass({
	componentDidMount: function () {
		console.log('zamontowano nowy komponentttt!');
	},

	render: function () {
		return (
			<div className="added-component">
				This component has been added by the button visible above.
			</div>
		)
	}
});

module.exports = AnotherComponent;
