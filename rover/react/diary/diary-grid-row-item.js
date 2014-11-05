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
			px_per_ms               = display.px_per_ms,
			data 					= props.data,
			res_meta                = props.meta.occupancy,
			start_time_ms 			= !state.resizing ? data[res_meta.start_date] : state.currentResizeItem.left,
			end_time_ms 			= !state.resizing ? data[res_meta.end_date] : state.currentResizeItem.right,
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= display.maintenance_span_int * display.px_per_int,
			reservation_time_span 	= ((!state.resizing) ? time_span_ms * px_per_ms : time_span_ms),
			is_temp_reservation 	= props.angular_evt.isAvailable(props.row_data, data),
			style 					= {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, props.row_data, data),
			self = this;

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			key: 				data.key,
			className: 		    'occupancy-block' + (state.editing ? ' editing' : ''),
			row_data: 			props.row_data,
			meta:               props.meta,
			data:  				data,
			display: 			display,
			viewport: 			props.viewport,
			edit:               props.edit,
			iscroll:        	props.iscroll,
			angular_evt:    	props.angular_evt, 
			__onDragStart:  	props.__onDragStart,
			__onDragStop: 		props.__onDragStop,
			currentDragItem:    props.currentResizeItem,
			style: 			   _.extend({
				left: 		   (!state.resizing ? (start_time_ms - display.x_origin) * px_per_ms : start_time_ms) + 'px'
			}, style)	
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + data[res_meta.status] + (state.editing ? ' editing' : '') + (is_temp_reservation && data.selected ? ' reserved' : ''),
			style: { 
				width: reservation_time_span + 'px' 
			}
		}, is_temp_reservation ? data[res_meta.rate] + '|' + data[res_meta.room_type] : data[res_meta.guest_name]),
		React.DOM.span({
			className: 'maintenance',
			style: { 
				width: maintenance_time_span + 'px' 
			}
		}, ' '));
	}
});