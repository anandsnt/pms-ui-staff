var RoomPanel = React.createClass({
	render: function() {
		//var self = this;

		return React.DOM.div({
			className: 'diary-rooms scrollable',
			onScroll: this.props.__onGridScroll
		},
		Rooms({
			display: this.props.display,
			data: this.props.data
		}));
	}
});