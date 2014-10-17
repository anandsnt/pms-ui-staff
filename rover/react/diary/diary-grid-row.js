var GridRow = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		var render = true; //false;

		/*if(this.props.viewport !== nextProps.viewport ||
		   this.props.display !== nextProps.display) {
			render = true;
		} else {
			if(this.props.data.reservations.length !== nextProps.data.reservations.length) {
				render = true;
			} else if(nextProps.currentResizeItem) {
				if(nextProps.data.id === nextProps.currentResizeItemRow.id) {
					render = true;
				}
				//render = true;
			} else {
				for(var i = 0, len = this.props.data.reservations.length; i < len; i++) {
					if(this.props.data.reservations[i] !== nextProps.data.reservations[i]) {
						render = true;
						return render;
					}
				}
			}		
		}*/

		return render;
	},
	render: function() {
		var self = this;

		/*Create grid row and insert each occupany item as child into that row*/
		return React.DOM.li({
			key: 		this.props.key,
			className: 	this.props.className
		}, 
		_.map(this.props.data.reservations, function(reservation) {
			return GridRowItem({
				key: 			reservation.key,
				display: 		self.props.display,
				viewport:    	self.props.viewport, 
				filter: 		self.props.filter,
				edit:           self.props.edit,
				iscroll:        self.props.iscroll,
				angular_evt: 	self.props.angular_evt,
				data: 			reservation,
				row_data:       self.props.data, 
				row_offset: 	self.props.row_number * (self.props.display.row_height + self.props.display.row_height_margin),
				__onDragStart:  self.props.__onDragStart,
				__onDragStop: 	self.props.__onDragStop,
				currentResizeItem: self.props.currentResizeItem,
				currentResizeItemRow: self.props.currentResizeItemRow
			});
		}),
		GridRowBackground({ display: this.props.display })); //hourly_divs);
	}	
});