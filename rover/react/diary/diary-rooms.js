var Rooms = React.createClass({
	render: function() {
		return React.DOM.ul({
			id: 'room-wrapper',
			className: 'wrapper',
			style: {
				height: this.props.display.height + 'px'
			}
		},
		_.map(this.props.data, function(room) {
			return Room({
				data: room
			});
		}));
	}
});