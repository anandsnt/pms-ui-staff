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
			//copy = _.extend(copy, nextProps.currentResizeItem);

			//copy.start_date = new Date(nextProps.currentResizeItem.start_date.getTime());
			//copy.end_date = new Date(nextProps.currentResizeItem.end_date.getTime());

			//copy.left = (copy.start_date.getTime() - nextProps.display.x_origin) * nextProps.display.px_per_ms;
			//copy.right = (copy.end_date.getTime() - nextProps.display.x_origin) * nextProps.display.px_per_ms;

			this.setState({
				resizing: true,
				currentResizeItem: nextProps.currentResizeItem
			});
		} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
			this.setState({
				resizing: false,
				currentResizeItem: undefined
			});
		}
	},
	/*shouldComponentUpdate: function(nextProps, nextState) {

	},*/
	render: function() {
		var props 					= this.props,
			state 					= this.state,
			display 				= props.display,
			start_time_ms 			= !state.resizing ? props.data.start_date.getTime() : state.currentResizeItem.left,
			end_time_ms 			= !state.resizing ? props.data.end_date.getTime() : state.currentResizeItem.right,
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= props.display.maintenance_span_int * display.px_per_int,
			reservation_time_span 	= ((!state.resizing) ? time_span_ms * display.px_per_ms : time_span_ms),
			is_temp_reservation 	= props.angular_evt.isAvailable(props.row_data, props.data),
			style 					= {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, props.row_data, props.data),
			self = this;

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			key: 				props.data.key,
			className: 		    'occupancy-block' + (state.resizing ? ' editing' : ''),
			row_data: 			props.row_data,
			data:  				props.data,
			display: 			props.display,
			viewport: 			props.viewport,
			iscroll:        	props.iscroll,
			angular_evt:    	props.angular_evt,
			__onDragStart:  	props.__onDragStart,
			__onDragStop: 		props.__onDragStop,
			currentResizeItem:  state.currentResizeItem,
			style: 			   _.extend({
				left: 		       (!state.resizing ? (start_time_ms - display.x_origin) * display.px_per_ms : start_time_ms) + 'px'
			}, style)	
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + props.data.status + (state.resizing ? ' editing' : '') + (is_temp_reservation && this.props.data.selected ? ' reserved' : ''),
			style: { 
				width: reservation_time_span + 'px' 
			}
		}, is_temp_reservation ? props.data.rate + '|' + props.data.room_type : props.data.guest_name),
		React.DOM.span({
			className: 'maintenance',
			style: { 
				width: maintenance_time_span + 'px' 
			}
		}, ' '));
	}
});