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
		var props = 		this.props,
			state = 		this.state,
			display = 		props.display,
			delta_x = 		e.pageX - state.origin_x, 
			x_origin = 		(display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
			px_per_int = 	display.px_per_int,
			px_per_ms = 	display.px_per_ms,
			model = 		state.currentResizeItem, 
			direction = 	props.itemProp,
			opposite =      ((direction === 'departure') ? 'arrival' : 'departure'),
			last_left;

		e.stopPropagation();
		e.preventDefault();

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
			model[direction] = ((((state.element_x + delta_x) / px_per_ms) + x_origin) / 900000).toFixed() * 900000; 
			
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
				currentResizeItem: 	model//,
				//last_left: 			model[this.props.itemProp]
			}, function() {
				props.__onResizeEnd(state.row, model);

				props.__onResizeCommand(model);
			});
		}

		e.stopPropagation();
		e.preventDefault();
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
	componentWillReceiveProps: function(nextProps) {
		var model, 
			props 		= this.props, 
			display 	= props.display, 
			direction 	= this.props.itemProp,
			px_per_ms 	= display.px_per_ms,
			x_origin 	= (display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
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
		} 
	},
	render: function() {
		var self = this,
			props 				= this.props,
			direction 			= props.itemProp,
			currentResizeItem 	= this.state.currentResizeItem,
			x_origin 			= props.display.x_n,
			px_per_ms 			= props.display.px_per_ms,
			left 				= (currentResizeItem ? (currentResizeItem[direction] - x_origin) * px_per_ms : 0),
			grip_text = '';

		if(currentResizeItem) {
		 	grip_text = angular.uppercase(direction) + ' ' + (new Date(currentResizeItem[direction])).toComponents().time.toString(true);
		}

		return this.transferPropsTo(React.DOM.a({
			className: 'set-times',
			style: {
				left: left + 'px'		
			},
			onMouseDown: self.__onMouseDown
		}, grip_text));
	}
});
