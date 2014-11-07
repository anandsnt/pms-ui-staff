var Placeholder = React.createClass({
	render: function() {
		return React.DOM.div({
			className: 'occupancy-block placeholder',
			style: this.props.style
		});
	}
});