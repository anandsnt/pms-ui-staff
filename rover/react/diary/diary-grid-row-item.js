var GridRowItem = React.createClass({
	render: function() {
		var props = this.props,
			start_time_ms 			= props.data.start_date.getTime(),
			end_time_ms 			= props.data.end_date.getTime(),
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= props.display.maintenance_span_int * props.display.px_per_int,
			reservation_time_span 	= time_span_ms * props.display.px_per_ms,
			is_temp_reservation 	= (props.data.status === 'available'),
			style = {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, props.data, props.row_data); //TODO - pass in controller defined method from scope

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			__onDragStart:  props.__onDragStart,
			__onDragStop: 	props.__onDragStop,
			__onMouseUp: 	props.__onDrop,
			__dragData: {
				data: props.data
			},
			display: 		props.display,
			viewport: 		props.viewport,
			filter: 		props.filter,
			angular_evt:    props.angular_evt,
			key: 			props.data.key,
			className: 		'occupancy-block',
			row_data: 		props.row_data,
			data:  			props.data,
			style: 			_.extend(style, {
				left: (start_time_ms - props.display.x_origin) * props.display.px_per_ms + 'px', 
				width: reservation_time_span + maintenance_time_span
			})
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + props.data.status,
			style: { width: reservation_time_span }
		}, is_temp_reservation ? props.data.rate + '|' + props.data.room_type : props.data.guest_name),
		React.DOM.span({
			className: 'maintenance',
			style: { width: maintenance_time_span }
		}, ' '));
	}
});