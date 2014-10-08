var GridRowItem = React.createClass({
	//mixins: [Draggable],
	/*Assume that physical dimensions change first, so we need to propagate them to the
	  backing data and convert to the altered time frame. */
	getInitialState: function() {
		var props 			= this.props,
			display 		= props.display,
			px_per_ms 		= display.px_per_ms,
			x_axis_origin 	= display.x_origin + display.x_0,
			initial_state 	= 
			{
				data: 					props.data,
				room: 					props.room,
				start_time_ms: 			props.data.start_date.getTime(),
				end_time_ms: 			props.data.end_date.getTime(),
				time_span_ms: 			undefined,
				time_span_intervals: 	undefined,
				y_offset: 				props.row_offset 
			};

		initial_state.time_span_ms = initial_state.end_time_ms - initial_state.start_time_ms;
		initial_state.time_span_intervals = initial_state.time_span_ms / 9000000;

		return initial_state;
	},
	render: function() {
		var props = this.props,
			state = this.state,
			display 				= props.display,
			data 					= props.data,
			x_axis_origin 			= display.x_origin - display.x_0,
			px_per_int 				= display.px_per_int,
			px_per_ms 				= display.px_per_ms,
			start_time_ms 			= data.start_date.getTime(),
			end_time_ms 			= data.end_date.getTime(),
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= display.maintenance_int * px_per_int,
			reservation_time_span = time_span_ms * px_per_ms,
			is_temp_reservation 	= (data.status === 'reservation'),
			style = {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, state.data, state.room, props.data); //TODO - pass in controller defined method from scope

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			__onDragStart:  props.__onDragStart,
			__onDragStop: props.__onDragStop,
			__onMouseUp: props.__onDrop,
			__dragData: {
				data: this.state.data
			},
			display: props.display,
			viewport: 		props.viewport,
			filter: 		props.filter,
			angular_evt:    props.angular_evt,
			key: props.data.key,
			className: props.className,
			room: props.room,
			data:  			props.data,
			style: _.extend(style, {
				left: (start_time_ms - x_axis_origin) * px_per_ms + 'px', 
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