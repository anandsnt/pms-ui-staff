var GridRow = React.createClass({
	getInitialState: function() {
		return {
			x_rel_load_tigger_right: undefined,
			x_rel_load_trigger_left: undefined,
			data: this.props.data
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
				key: 		reservation.key,
				className: 	'occupancy-block',
				display: 	self.props.display,
				data: 		reservation,
				row_offset: self.props.row_number * self.props.display.row_height,
				__onDragStart:  self.props.__onDragStart,
				__onDragStop: self.props.__onDragStop,
				__onMouseUp: self.props.__onDrop
			});
		}),
		hourly_divs);
	}	
});