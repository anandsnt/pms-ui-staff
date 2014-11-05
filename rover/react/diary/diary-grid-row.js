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
		var props = this.props,
			display = props.display,
			px_per_hr = display.px_per_hr + 'px',
			hourly_divs = [],
			room_meta = props.meta.room,
			room_meta_children = room_meta.row_children,
			self = this;

		/*Create hourly spans across each grid row*/
		for(var i = 0, len = display.hours; i < len; i++) {
			hourly_divs.push(React.DOM.span({ 
				className: 	'hour',
				style: {
					width: px_per_hr
				}
			}));
		}
		/*Create grid row and insert each occupany item as child into that row*/
		return React.DOM.li({
			key: 		props.key,
			className: 	'grid-row' + (_.isEmpty(props.data[room_meta.status]) ? '' : ' ' + props.data[room_meta.status])
		}, 
		_.map(props.data[room_meta_children], function(occupancy) {
			return GridRowItem({
				key: 			occupancy.key,
				display: 		display,
				viewport:    	props.viewport, 
				filter: 		props.filter,
				edit:           props.edit,
				iscroll:        props.iscroll,
				angular_evt: 	props.angular_evt,
				meta:           props.meta,
				data: 			occupancy,
				row_data:       props.data, 
				row_offset: 	props.row_number * (display.row_height + display.row_height_margin),
				__onDragStart:  props.__onDragStart,
				__onDragStop: 	props.__onDragStop,
				currentResizeItem: props.currentResizeItem,
				currentResizeItemRow: props.currentResizeItemRow
			});
		}), hourly_divs); //GridRowBackground({ display: this.props.display })); //hourly_divs);
	}	
});