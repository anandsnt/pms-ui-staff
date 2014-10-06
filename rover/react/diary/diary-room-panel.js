var RoomPanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		return React.DOM.div({
			className: 'diary-rooms'
		},
		Rooms({
			data: this.state.data
		}));
	}
});