var Rooms = React.createClass({
	render: function() {
		return React.DOM.ul({
			className: 'wrapper',
			style: {
				height: this.props.display.height
			}
		},
		_.map(this.props.data, function(room) {
			return Room({
				data: room
			});
		}));
	}
});