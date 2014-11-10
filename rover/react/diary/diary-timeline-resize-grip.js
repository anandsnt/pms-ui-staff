var TimelineResizeGrip = React.createClass({
	__dbMouseMove: undefined,
	__onMouseDown: function(e) {
		var page_offset, model, props = this.props;

		props.iscroll.timeline.disable();
		props.iscroll.grid.disable();	

		e.preventDefault();
		e.stopPropagation();

		if(e.button === 0 || e.button === 2) {
			props.iscroll.grid.disable();

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
			x_origin = 		display.x_origin,
			px_per_int = 	display.px_per_int,
			px_per_ms = 	display.px_per_ms,
			model = 		state.currentResizeItem, 
			direction = 	props.itemProp;

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

			model[direction] = ((state.element_x + delta_x) / px_per_int).toFixed() * px_per_int;

			this.setState({
				currentResizeItem: model			
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
			x_origin =      display.x_origin,
			model = 		state.currentResizeItem,
			res_meta =      props.meta.occupancy,
			direction = 	props.itemProp;

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);
			
		model[direction] = ((state.element_x + delta_x) / px_per_int).toFixed() * px_per_int;

		if(this.state.resizing) {
			this.setState({
				left: model[direction],
				mouse_down: false,
				resizing: false,
				currentResizeItem: model
			}, function() {
				model[res_meta.start_date] = model.left / px_per_ms + x_origin;
				model[res_meta.end_date] = model.right / px_per_ms + x_origin;

				props.__onResizeEnd(state.row, model);
				
				props.__onResizeCommand(model);
				
				props.iscroll.timeline.enable();
				props.iscroll.grid.enable();		
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
			props = this.props, 
			display = props.display, 
			direction = this.props.itemProp,
			px_per_ms = display.px_per_ms,
			x_origin = display.x_origin,
			res_meta = props.meta.occupancy;

		if(!this.state.resizing) {
			if(!props.currentResizeItem && nextProps.currentResizeItem) {
				model = nextProps.currentResizeItem;

				if(!model.left && !model.right) {
					model.left = (model[res_meta.start_date] - x_origin) * px_per_ms;
					model.right = (model[res_meta.end_date] - x_origin) * px_per_ms;
				}

				if(nextProps.edit.passive) {
					this.setState({
						mode: model[props.meta.occupancy.id],
						currentResizeItem: model,
						currentResizeItemRow: model[props.meta.occupancy.id]
					});
				} else {
					this.setState({
						mode: undefined,
						currentResizeItem: model,
						currentResizeItemRow: nextProps.currentResizeItemRow
					});
				}
			} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
				this.setState({
					mode: undefined,
					currentResizeItem: undefined,
					currentResizeItemRow: undefined
				});
			}
		} 
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		//if(nextState.resizing && nextState.mouse_down) {
		/*if(!this.props.currentResizeItem && nextProps.currentResizeItem) {
			return true;
		}

		if(this.state.currentResizeItem[this.props.itemProp] !== nextState.currentResizeItem[this.props.itemProp]) {
			return true;
		} else {
			if(nextProps.currentResizeItem)
		}*/
		return true;
	},
	render: function() {
		var self = this,
			props = this.props,
			display = props.display,
			direction = props.itemProp,
			currentResizeItem = this.state.currentResizeItem;

		return this.transferPropsTo(React.DOM.a({
			className: 'set-times',
			style: {
				left: (currentResizeItem ? currentResizeItem[direction] : 0) + 'px'		
			},
			onMouseDown: self.__onMouseDown
		}, (currentResizeItem ? (new Date(currentResizeItem[direction] / display.px_per_ms + display.x_origin)).toLocaleTimeString() : '')));
	}
});