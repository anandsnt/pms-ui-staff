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
	shouldComponentUpdate: function(nextProps, nextState) {
		var row_item_data = this.props.data,
			next_row_item_data = nextProps.data;

		if(row_item_data.start_date.getTime() !== next_row_item_data.start_date.getTime() ||
		   row_item_data.end_date.getTime() !== next_row_item_data.end_date.getTime() ||
		   row_item_data.status !== next_row_item_data.status) {
			return true;
		}

		if(this.props.angular_evt.displayFilter(nextProps.filter, next_row_item_data, nextProps.row_data)) {
			return true;
		}

		return false;
	},
	render: function() {
		var props = this.props,
			state = this.state,
			start_time_ms 			= !state.resizing ? props.data.start_date.getTime() : state.currentResizeItem.start_date.getTime(),
			end_time_ms 			= !state.resizing ? props.data.end_date.getTime() : state.currentResizeItem.end_date.getTime(),
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= props.display.maintenance_span_int * props.display.px_per_int,
			reservation_time_span 	= time_span_ms * props.display.px_per_ms,
			is_temp_reservation 	= props.angular_evt.isAvailable(props.row_data, props.data),
			style 					= {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, props.row_data, props.data),
			self = this;

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			key: 			props.data.key,
			className: 		'occupancy-block',
			row_data: 		props.row_data,
			data:  			props.data,
			display: 		props.display,
			viewport: 		props.viewport,
			filter: 		props.filter,
			iscroll:        props.iscroll,
			angular_evt:    props.angular_evt,
			__onDragStart:  props.__onDragStart,
			__onDragStop: 	props.__onDragStop,
			currentResizeItem: state.currentResizeItem,
			style: 			_.extend({
				left: 		(start_time_ms - props.display.x_origin) * props.display.px_per_ms + 'px', 
				width: 		reservation_time_span + maintenance_time_span + 'px'
			}, style)	
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + props.data.status,
			style: { width: reservation_time_span + 'px' }
		}, is_temp_reservation ? props.data.rate + '|' + props.data.room_type : props.data.guest_name),
		React.DOM.span({
			className: 'maintenance',
			style: { width: maintenance_time_span + 'px' }
		}, ' '));
	}
});