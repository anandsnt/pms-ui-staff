var GridRowItem = React.createClass({
	//mixins: [Draggable],
	/*Assume that physical dimensions change first, so we need to propagate them to the
	  backing data and convert to the altered time frame. */
	_syncData: function() {

	},
	getInitialState: function() {
		var props 			= this.props,
			px_per_ms 		= props.display.px_per_ms,
			x_axis_origin 	= props.display.x_origin + props.display.x_0,
			initial_state 	= //Model({
			{
				data: 					props.data,
				start_time_ms: 			props.data.start_date.getTime(),
				//pos: 					Object.create(null, { top: { value: 0 } }),
				dim: 					Object.create(null, { height: { value: '100%'} }),
				end_time_ms: 			props.data.end_date.getTime(),
				time_span_ms: 			undefined,
				time_span_intervals: 	undefined,
				dragging: 				false,
				y_offset: 				props.row_offset //,
				//rel: 					Object.create(null, { x: { value: 0 }, y: { value: 0}})
			};

			//});

		initial_state.time_span_ms = initial_state.end_time_ms - initial_state.start_time_ms;
		initial_state.time_span_intervals = initial_state.time_span_ms / 9000000;

		//initial_state.pos.left = (initial_state.start_time_ms - x_axis_origin) * px_per_ms;
		//initial_state.dim.width = initial_state.time_span_ms * px_per_ms;

		//initial_state.pos.x = initial_state.pos.left;
		//initial_state.pos.y = 0;//initial_state.y_offset;  //TODO Change to prop that relflects actual y offset from top of grid

		return initial_state;
	},
	render: function() {
		var props = this.props,
			state = this.state,
			x_axis_origin =props.display.x_origin - props.display.x_0,
			px_per_int = props.display.px_per_int,
			px_per_ms = props.display.px_per_ms,
			maintenance_time_span = props.display.maintenance_int * px_per_int,
			reservation_time_span = (state.time_span_ms) * px_per_ms,
			is_temp_reservation = (props.data.status === 'reservation');

		return React.DOM.div({
			onMouseDown: this.__onMouseDown,
			key: props.data.key,
			className: props.className,
			ref: 'item',
			style: {
				left: (state.start_time_ms - x_axis_origin) * px_per_ms + 'px', //state.pos.left + 'px', //(!state.dragging ? state.pos.left : state.pos.x) + 'px',
				//top: state.pos.top + 'px', //(!state.dragging ? state.pos.top : state.pos.y) + 'px',
				//height: state.dim.height,
				width: reservation_time_span + maintenance_time_span
			}
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + props.data.status,
			style: {
				width: reservation_time_span
			}			
		}, is_temp_reservation ? props.data.rate + '|' + props.data.room_type : props.data.guest_name),
		React.DOM.span({
			className: 'maintenence',
			style: {
				width: maintenance_time_span
			}
		}, ' '));
	}
});