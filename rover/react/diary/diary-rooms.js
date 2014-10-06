var Rooms = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		}
	},
	render: function() {
		return React.DOM.ul({
			className: 'room-titles'
			style: {
				height: this.props.display.height
			}
		},
		_.map(this.state.data, function(room) {
			return Room({
				data: room
			});
		}));
	}
});