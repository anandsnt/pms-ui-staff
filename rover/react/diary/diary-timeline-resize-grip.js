var TimelineResizeGrip = React.createClass({
	__dbMouseMove: undefined,
	_update: function(row_item_data) {
		var copy = {};

		if(_.isObject(row_item_data)) {
			copy = _.extend(copy, row_item_data);

			copy.start_date = new Date(copy.start_date.getTime());
			copy.end_date = new Date(copy.end_date.getTime());

			return copy;
		}
	},
	__onMouseDown: function(e) {
		var page_offset, model;

		if(e.button === 0) {
			this.props.iscroll.grid.disable();
			
			e.preventDefault();
			e.stopPropagation();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			this.setState({
				mouse_down: true,
				origin_x: e.pageX,
				element_x: page_offset.left - 120
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			x_origin = this.props.display.x_origin,
			px_per_int = this.props.display.px_per_int,
			px_per_ms = this.props.display.px_per_ms,
			model = this.state.currentResizeItem, 
			direction = this.props.itemProp;

		e.stopPropagation();
		e.preventDefault();

		if(!this.state.resizing &&
		   this.state.mouse_down && 
		   (Math.abs(delta_x) > 10)) {

			this.setState({
				resizing: true,
				currentResizeItem: model
			}, function() {
				this.props.__onResizeStart(undefined, model);			
			});

			this.props.__onResizeCommand(model);
		} else if(this.state.resizing) {		

			model[direction] = ((this.state.element_x + delta_x) / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int;

			this.setState({
				currentResizeItem: model			
			}, function() {
				this.props.__onResizeCommand(model);
			});		
		}
	},
	__onMouseUp: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			px_per_int = this.props.display.px_per_int,
			model = this.state.currentResizeItem,
			direction = this.props.itemProp;

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);
			
		model[direction] = ((this.state.element_x + delta_x) / px_per_int).toFixed() * px_per_int;

		if(this.state.resizing) {
			this.setState({
				left: model[direction],
				mouse_down: false,
				resizing: false,
				currentResizeItem: model
			}, function() {
				this.props.__onResizeEnd(this.state.row, model);
				
				this.props.__onResizeCommand(model);
				
				//this.props.iscroll.timeline.enable();
				this.props.iscroll.grid.enable();		
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
			mouse_down: false,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		};
	},
	componentWillMount: function() {
		this.__dbMouseMove = _.throttle(this.__onMouseMove, 10);
	},
	componentWillReceiveProps: function(nextProps) {
		var model, direction = this.props.itemProp;

		if(!this.state.resizing) {
			if(!this.props.currentResizeItem && nextProps.currentResizeItem) {
				model = nextProps.currentResizeItem;

				if(!model.left && !model.right) {
					model.left = (model.start_date.getTime() - this.props.display.x_origin) * this.props.display.px_per_ms;
					model.right = (model.end_date.getTime() - this.props.display.x_origin) * this.props.display.px_per_ms;
				}

				this.setState({
					currentResizeItem: model,
					currentResizeItemRow: nextProps.currentResizeItemRow
				});
			} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
				this.setState({
					currentResizeItem: undefined,
					currentResizeItemRow: undefined
				});
			}
		} /*else {
			if(this.state.resizing) {
				if(nextProps.currentResizeItem[this.props.itemProp] !== this.state.currentResizeItem[this.props.itemProp]) {
					this.setState({
						left: nextProps.currentResizeItem[this.props.itemProp]
					});
				}
			}
		}*/
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
			direction = this.props.itemProp,
			px_per_ms = this.props.display.px_per_ms,
			x_origin = this.props.display.x_origin,
			currentResizeItem = this.state.currentResizeItem;

		return this.transferPropsTo(React.DOM.a({
			className: 'set-times',
			style: {
				left: (currentResizeItem ? currentResizeItem[direction] : 0) + 'px'		
			},
			onMouseDown: self.__onMouseDown
		}, (currentResizeItem ? (new Date(currentResizeItem[direction] / px_per_ms + x_origin)).toLocaleTimeString() : '')));
	}
});