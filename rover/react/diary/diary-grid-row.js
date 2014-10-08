var GridRow = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data,
			currentDragItem: this.props.currentDragItem
		};
	},
	render: function() {
		var hourly_divs = [],
			self = this;

		/*Create hourly spans across each grid row*/
		for(var i = 0; i < this.props.display.hours; i++) {
			hourly_divs.push(React.DOM.span({ 
				key: 		'date-time-' + i,
				className: 	'hour',
				style: {
					width: 	this.props.display.px_per_hr + 'px'
				}
			}));
		}

		/*Create grid row and insert each occupany item as child into that row*/
		return React.DOM.li({
			key: 		this.props.key,
			className: 	this.props.className
		}, 
		_.map(this.state.data.reservations, function(reservation) {
			return GridRowItem({
				key: 			reservation.key,
				className: 		'occupancy-block',
				display: 		self.props.display,
				viewport:    	self.props.viewport, 
				filter: 		self.props.filter,
				angular_evt: 	self.props.angular_evt,
				data: 			reservation,
				room:       	self.props.data, 
				row_offset: 	self.props.row_number * self.props.display.row_height,
				__onDragStart:  self.props.__onDragStart,
				__onDragStop: 	self.props.__onDragStop,
				__onMouseUp: 	self.props.__onDrop
			});
		}),
		hourly_divs);
	}	
});