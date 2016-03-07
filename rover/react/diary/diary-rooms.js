var Rooms = React.createClass({
	render: function() {
		var props = this.props;

		return React.DOM.ul({
			id: 'room-wrapper',
			className: 'wrapper'
		},
		_.map(props.data, function(room) {
			return React.createElement( Room, {
				meta: props.meta,
				data: room
			});
		}));
	}
});