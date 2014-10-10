var TimelineOccupancy = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var occupancy_data;

		try{
			occupancy_data = this.props.angular_evt.calculateOccupancy(this.state.data);
		}catch(e) {

		}

		return React.DOM.ul({
			className: 'occupancy'
		},
		_.map(occupancy_data, function(data_item) {
			return React.DOM.li({
				className: ''
			}, data_item);
		}));
	}
});