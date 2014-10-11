var TimelineOccupancy = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
var props = this.props,
			occupancy_data;	

		try{
			occupancy_data = this.props.angular_evt.calculateOccupancy(this.state.data);
		}catch(e) {
			console.log('Error: this.props.angular_evt.calculateOccupancy(state_data)');
		}

		return React.DOM.ul({
			className: 'occupancy'
		},
		_.map(occupancy_data, function(data_item) {
			return React.DOM.li({
				style: {
					width: props.display.px_per_hr
				}
			}, data_item);
		}));
	}
});