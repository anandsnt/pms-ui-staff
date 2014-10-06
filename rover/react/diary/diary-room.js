var Room = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		return React.DOM.li({
			className: 'room-title'
		},
		React.DOM.span({
			className: 'number'
		}, this.state.data.number),
		React.DOM.span({
			className: 'type'
		}, this.state.data.type));
	}
});