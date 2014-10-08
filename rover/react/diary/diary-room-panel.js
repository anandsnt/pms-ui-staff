var RoomPanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-rooms scrollable',
			/*style: {
				height: this.props.viewport.height
			},*/
			onScroll: self.props.__onGridScroll
		},
		Rooms({
			display: this.props.display,
			data: this.state.data
		}));
	}
});