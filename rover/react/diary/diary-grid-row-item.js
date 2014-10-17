var GridRowItem = React.createClass({
	getInitialState: function() {
		return {
			editing: this.props.edit.active,
			resizing: this.props.resizing,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var copy = {};

		if(nextProps.currentResizeItem &&
		   nextProps.currentResizeItem.id === nextProps.data.id ||
		   nextProps.edit.active &&
		   nextProps.edit.originalItem.id === nextProps.data.id) {

			this.setState({
				editing: nextProps.edit.active,
				resizing: true,
				currentResizeItem: nextProps.currentResizeItem,
				currentResizeItemRow: nextProps.currentResizeItemRow
			});
		} else if(!this.props.edit.active && this.props.currentResizeItem && !nextProps.currentResizeItem ||
				  this.props.edit.active && !nextProps.edit.active) {
			this.setState({
				editing: false,
				resizing: false,
				currentResizeItem: undefined,
				currentResizeItemRow: undefined
			});
		}
	},
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
			className: 		    'occupancy-block' + (state.editing ? ' editing' : ''),
			row_data: 			props.row_data,
			data:  				props.data,
			display: 			props.display,
			viewport: 			props.viewport,
			edit:               props.edit,
			iscroll:        	props.iscroll,
			angular_evt:    	props.angular_evt,
			__onDragStart:  	props.__onDragStart,
			__onDragStop: 		props.__onDragStop,
			currentResizeItem:  state.currentResizeItem,
			currentResizeItemRow: state.currentResizeItemRow,
			style: 			   _.extend({
				left: 		       (!state.resizing ? (start_time_ms - display.x_origin) * display.px_per_ms : start_time_ms) + 'px'
			}, style)	
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + props.data.status + (state.editing ? ' editing' : '') + (is_temp_reservation && this.props.data.selected ? ' reserved' : ''),
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