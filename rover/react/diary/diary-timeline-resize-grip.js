var TimelineResizeGrip = React.createClass({
	__dbMouseMove: undefined,
	__onMouseDown: function(e) {
		var page_offset, model, props = this.props;

		e.preventDefault();
		e.stopPropagation();

		if(e.button === 0 || e.button === 2) {
			props.iscroll.timeline.disable();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			this.setState({
				mouse_down: true,
				origin_x: e.pageX,
				element_x: page_offset.left -props.display.x_0 - props.iscroll.grid.x
			});
		}
	},
	__onMouseMove: function(e) {
		var props = 				this.props,
			state = 				this.state,
			display = 				props.display,
			delta_x = 				e.pageX - state.origin_x, 
			x_origin = 				(display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
			px_per_int = 			display.px_per_int,
			px_per_ms = 			display.px_per_ms,
			model = 				state.currentResizeItem, 
			direction = 			props.itemProp,
			newValue = ((((state.element_x + delta_x) / px_per_ms) + x_origin) / 900000).toFixed() * 900000,
			opposite =      		((direction === 'departure') ? 'arrival' : 'departure'),
			isResizable=			this.__whetherResizable( opposite, newValue),
			last_left;

		e.stopPropagation();
		e.preventDefault();
		
		if(!isResizable){
			newValue = model[direction];		
		}

		if(!state.resizing &&
		   state.mouse_down && 
		   (Math.abs(delta_x) > 10)) {

			this.setState({
				resizing: true,
				currentResizeItem: model
			}, function() {
				this.props.__onResizeStart(undefined, model);			
			});

			this.props.__onResizeCommand(model);
		} else if(state.resizing) {		
			last_left = model[direction];

			//if(Math.abs(model[direction]-model[opposite]) >= props.display.min_hours * 3600000) {
			model[direction] = newValue; 
			
			//if(Math.abs(model[direction]-model[opposite]) < props.display.min_hours * 3600000) {
			//	model[direction] = last_left;
			//}
			//} else{
				//model[direction] = last_left;
			//}
			this.setState({
				currentResizeItem: 	model			
			}, function() {
				props.__onResizeCommand(model);
			});		
		}
	},
	__onMouseUp: function(e) {
		var props = 		this.props,
			state = 		this.state,
			display = 		props.display,
			delta_x = 		e.pageX - state.origin_x, 
			px_per_int = 	display.px_per_int,
			px_per_ms =     display.px_per_ms,
			x_origin =      display.x_n, 
			model = 		state.currentResizeItem,
			m =      		props.meta.occupancy,
			direction = 	props.itemProp;

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);
			
		if(this.state.resizing) {
			props.iscroll.timeline.enable();

			setTimeout(function() {
				props.iscroll.timeline.refresh();				
			}, 250);

			this.setState({
				mouse_down: 		false,
				resizing: 			false,
				currentResizeItem: 	model
			}, function() {
				props.__onResizeEnd(state.row, model);

				props.__onResizeCommand(model);
			});
		}

		e.stopPropagation();
		e.preventDefault();
	},
	__whetherResizable: function(opposite, value){
		var props = 				this.props,
			state =					this.state,
			original_item = 		state.currentResizeItem,
			direction = 			props.itemProp.toUpperCase(),
			fifteenMin =			900000,
			reservation_status = 	original_item.reservation_status.toUpperCase(),
			difference	= (opposite == 'departure' ? (original_item[opposite] - value) :(value - original_item[opposite]) );
		
		if((difference) < (fifteenMin)) {			
			return false;
		}				 	
		else if ((reservation_status === "RESERVED" || reservation_status === "CHECK-IN" ||
			reservation_status === "AVAILABLE" )) {
			return true;
		}
		else if ( (reservation_status === "INHOUSE" || reservation_status === "DEPARTED") && direction == "DEPARTURE"){
			return true;
		}
		else if((reservation_status === "INHOUSE" || reservation_status === "DEPARTED") && direction == "ARRIVAL"){
			return false;
		}		
		return false;
	},	
	getDefaultProps: function() {
		return {
			handle_width: 50
		};
	},
	getInitialState: function() {
		return {
			stop_resize: false,
			resizing: false,
			mode: undefined,
			mouse_down: false,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		};
	},
	componentWillMount: function() {
		this.__dbMouseMove = _.throttle(this.__onMouseMove, 10);
	},
	componentDidMount: function(){
		this.getDOMNode().addEventListener('mousedown', this.__onMouseDown);	
	},
	componentWillReceiveProps: function(nextProps) {
		var model, 
			props 		= this.props, 
			state  		= this.state,
			display 	= props.display, 
			direction 	= this.props.itemProp,
			px_per_ms 	= display.px_per_ms,
			x_origin 	= display.x_n, // instanceof Date ? display.x_n.getTime() : display.x_n), 
			m 			= props.meta.occupancy;

		if(!this.state.resizing) {
			if(!props.currentResizeItem && nextProps.currentResizeItem) {
				model = nextProps.currentResizeItem;

				if(nextProps.edit.passive) {
					this.setState({
						mode: model[props.meta.occupancy.id],
						currentResizeItem: model,
						currentResizeItemRow: model[props.meta.occupancy.id]
					});
					var scrollToPos = (model[m.start_date] - x_origin - 7200000) * px_per_ms;
					if(scrollToPos < 0){
						scrollToPos = 0;
					}					
					props.iscroll.grid.scrollTo(-scrollToPos, 0, 0, 1000);
            		props.iscroll.timeline.scrollTo(-scrollToPos, 0, 0, 1000);
            		//state.onScrollEnd(Math.abs(props.iscroll.grid.x) / px_per_ms + x_origin);
				} else {
					this.setState({
						mode: 					undefined,
						currentResizeItem: 		model,
						currentResizeItemRow: 	nextProps.currentResizeItemRow
					});
				}
			} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
				this.setState({
					mode: 					undefined,
					currentResizeItem: 		undefined,
					currentResizeItemRow: 	undefined
				});
			}
			else if(this.props.currentResizeItem && nextProps.currentResizeItem){
				this.setState({
					mode: 					undefined,
					currentResizeItem: 		nextProps.currentResizeItem,
					currentResizeItemRow: 	nextProps.currentResizeItemRow
				});
			}
		} 
	},
	render: function() {
			var self = this,
				props 				= this.props,
				direction 			= props.itemProp,
				currentResizeItem 	= this.state.currentResizeItem,
				x_origin 			= (props.display.x_n instanceof Date ? props.display.x_n.getTime() : props.display.x_n),
				px_per_ms 			= props.display.px_per_ms,
				label       		= (direction === 'arrival' ? 'ARRIVE' : 'DEPART'),
				label_class         = (direction === 'arrival' ? 'arrival' : 'departure'),
				left 				= (currentResizeItem ? (currentResizeItem[direction] - x_origin) * px_per_ms : 0),
				count_txt           = props.meta.availability_count.total > 0 ? props.meta.availability_count.total : false,
				classes             = "set-times " + label_class,
				time_txt            = '';

			if(currentResizeItem) {
			 	time_txt = (new Date(currentResizeItem[direction])).toComponents().time.toString(true);
			}

			if(this.props.edit.active) {
				classes += " editing";
			}

			return React.DOM.div({
					className: classes,
					style: {
						left: left + 'px'
					}
				},
				React.DOM.span({
					className: 'title'
				},
					React.DOM.label({}, label),
					React.DOM.span({
						className: 'time'
					}, time_txt)
				),
				// React.DOM.span({
				// 	className: 'count',
				// 	style: {
				// 		display: direction === 'arrival' ? (this.props.edit.active || !count_txt ? 'none' : 'inline') : 'none'
				// 	}
				// }, count_txt),
				React.DOM.span({
					className: 'line',
					style: {
						display: this.props.edit.active ? 'inline' : 'none'
					}
				})
			);
		}
});
