var GridRowItem = React.createClass({
	getInitialState: function() {
		return {
			//pct_diff: 1,
			editing: this.props.edit.active,
			resizing: this.props.resizing,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		};
	},
	componentWillReceiveProps: function(nextProps) {
		var copy = {},
			meta_id = this.props.meta.occupancy.id,
			edit = nextProps.edit,
			editing = edit.active,
			creating;

		if(editing && (edit.originalItem[meta_id] === nextProps.data[meta_id])) {
			this.setState({
				editing: true,
				resizing: true,
				currentResizeItem: nextProps.currentResizeItem,
				currentResizeItemRow: nextProps.currentResizeItemRow
			});
		} else if(!editing && nextProps.currentResizeItem && (nextProps.currentResizeItem[meta_id] === nextProps.data[meta_id])) {
			this.setState({
				editing: nextProps.edit.active,
				resizing: true,
				currentResizeItem: nextProps.currentResizeItem,
				currentResizeItemRow: nextProps.currentResizeItemRow
			});
		} else if((!this.props.edit.active && this.props.currentResizeItem && !nextProps.currentResizeItem) || (this.props.edit.active && !editing)) {
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
			px_per_int 				= display.px_per_int,
			x_origin   				= display.x_nL, //display.x_origin,
			data 					= props.data,
			row_data 				= props.row_data,
			res_meta                = props.meta.occupancy,
			start_time_ms 			= !state.resizing ? data[res_meta.start_date] : state.currentResizeItem.left,// * this.state.pct_diff,
			end_time_ms 			= !state.resizing ? data[res_meta.end_date] : state.currentResizeItem.right, // * this.state.pct_diff,
			time_span_ms 			= end_time_ms - start_time_ms,
			maintenance_time_span 	= data[res_meta.maintenance] * px_per_int, 
			reservation_time_span 	= ((!state.resizing) ? time_span_ms * px_per_ms : time_span_ms),
			is_temp_reservation 	= props.angular_evt.isAvailable(row_data, data),
			style 					= {},
			display_filter 			= props.angular_evt.displayFilter(props.filter, row_data, data),
			self = this;

		if(!display_filter) {
			style.display = 'none';
		}

		return GridRowItemDrag({
			key: 				data.key,
			className: 		    'occupancy-block' + (state.editing ? ' editing' : ''),
			row_data: 			row_data,
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
				left: 		   (!state.resizing ? (start_time_ms - /*display.*/ x_origin) * px_per_ms : start_time_ms) + 'px'
			}, style)	
		}, 
		React.DOM.span({
			className: ((!is_temp_reservation) ? 'occupied ' : '') + angular.lowercase(data[res_meta.status]) + (state.editing ? ' editing' : '') + (is_temp_reservation && data.selected ? ' reserved' : ''),
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
