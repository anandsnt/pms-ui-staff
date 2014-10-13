var GridRowItem = React.createClass({
	getInitialState: function() {
		return {
			resizing: false,
			currentResizeItem: undefined
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var copy = {};

		if(nextProps.currentResizeItem &&
		   nextProps.currentResizeItem.id === nextProps.data.id) {
			copy = _.extend(copy, nextProps.currentResizeItem);

			copy.start_date = new Date(nextProps.currentResizeItem.start_date.getTime());
			copy.end_date = new Date(nextProps.currentResizeItem.end_date.getTime());

			copy.left = (copy.start_date.getTime() - nextProps.display.x_origin) * nextProps.display.px_per_ms;
			copy.right = (copy.end_date.getTime() - nextProps.display.x_origin) * nextProps.display.px_per_ms;

			this.setState({
				resizing: true,
				currentResizeItem: copy
			});
		} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
			this.setState({
				resizing: false,
				currentResizeItem: undefined
			});
		}
	},
	render: function() {
		var props = this.props,
			start_time_ms 			= !this.state.resizing ? props.data.start_date.getTime() : this.state.currentResizeItem.start_date.getTime(),
			end_time_ms 			= !this.state.resizing ? props.data.end_date.getTime() : this.state.currentResizeItem.end_date.getTime(),
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
			style: 			_.extend({
				left: 		(start_time_ms - props.display.x_origin) * props.display.px_per_ms + 'px', 
				width: 		reservation_time_span + maintenance_time_span
			}, style),
			currentResizeItem: this.state.currentResizeItem
			//__dispatchResizeCommand: self.__dispatchResizeCommand
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