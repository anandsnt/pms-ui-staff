var RoomPanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-rooms',
			onScroll: self.props.__onGridScroll
		},
		React.DOM.div({
			className: 'switch-button'
		}),
		Rooms({
			data: this.state.data
		}));
	}
});