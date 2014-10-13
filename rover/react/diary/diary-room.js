var Room = React.createClass({
	render: function() {
		return React.DOM.li({
			className: 'room-title' + (!_.isEmpty(this.props.data.status) ? ' ' + this.props.data.status: '')
		},
		React.DOM.span({
			className: 'number'
		}, this.props.data.number),
		React.DOM.span({
			className: 'type'
		}, this.props.data.type));
	}
});