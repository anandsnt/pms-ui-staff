var Resizable = React.createClass({
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
	__onMouseDownLeft: function(e) {
		var page_offset, model;

		if(e.button === 0) {
			e.stopPropagation();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMoveLeft);

			page_offset = $(this.getDOMNode())[0].children[0].getBoundingClientRect();

			this.setState({
				mouse_down_left: true,
				mouse_down_right: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				element_x: page_offset.left,
				element_y: page_offset.top
			}, function() {
				this.props.iscroll.timeline.disable();
				this.props.iscroll.grid.disable();
			});
		}
	},
	__onMouseDownRight: function(e) {
		var page_offset;

		if(e.button === 0) {
			e.stopPropagation();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMoveRight);

			page_offset = $(this.getDOMNode())[0].children[1].getBoundingClientRect();

			this.setState({
				mouse_down_right: true,
				mouse_down_left: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				element_x: page_offset.left,
				element_y: page_offset.top
			}, function() {
				this.props.iscroll.timeline.disable();
				this.props.iscroll.grid.disable();
			});
		}
	},
	__onMouseMoveLeft: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			x_origin = this.props.display.x_origin,
			px_per_int = this.props.display.px_per_int,
			px_per_ms = this.props.display.px_per_ms,
			model = this.state.currentResizeItem;

		if(!this.state.resizing &&
		   this.state.mouse_down_left && (Math.abs(delta_x) + Math.abs(delta_y) > 5)) {
		   	model.left = (model.start_date.getTime() - x_origin) * px_per_ms;
			model.right = (model.end_date.getTime() - x_origin) * px_per_ms;

			this.setState({
				resizing: true,
				currentResizeItem: model,
				left: (this.state.element_x + delta_x / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int
			}, function() {
				//this.props.__onResizeLeftStart(undefined, model);
				this.props.__onResizeCommand(model);
			});
		} else if(this.state.resizing) {		
			model.left = ((model.left + delta_x) / px_per_int).toFixed() * px_per_int;
			//model.start_date = new Date(model.start_date.getTime() + delta_x / px_per_ms);
			//model.start_date = new Date(((model.start_date.getTime() * px_per_ms / px_per_int).toFixed() * px_per_int) / px_per_ms);
		
			this.setState({
				currentResizeItem: model,
				left: (this.state.element_x + delta_x / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int
			}, function() {
				this.props.__onResizeCommand(model);
			});
		}
	},
	__onMouseMoveRight: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			x_origin = this.props.display.x_origin,
			px_per_int = this.props.display.px_per_int,
			px_per_ms = this.props.display.px_per_ms,
			model = this.state.currentResizeItem;

		if(!this.state.resizing &&
		   this.state.mouse_down_right &&  (Math.abs(delta_x) + Math.abs(delta_y) > 5)) {
		   	model.left = (model.start_date.getTime() - x_origin) * px_per_ms;
			model.right = (model.end_date.getTime() - x_origin) * px_per_ms;

			this.setState({
				resizing: true,
				currentResizeItem: model,
				right: (this.state.element_x + delta_x / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int
			}, function() {
				this.props.__onResizeRightStart(undefined, model);
				this.props.__onResizeCommand(model);
			});
		} else if(this.state.resizing) {
			model.right = ((model.right + delta_x) / px_per_int).toFixed() * px_per_int;
			//model.end_date = new Date(model.end_date.getTime() + delta_x / px_per_ms);
			//model.end_date = new Date(((model.end_date.getTime() * px_per_ms / px_per_int).toFixed() * this.props.display.px_per_int) / this.props.display.px_per_ms);
			
			this.setState({
				resizing: true,
				currentResizeItem: model,
				right: (this.state.element_x + delta_x / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int
			}, function() {
				this.props.__onResizeCommand(model);
			});
		}
	},
	__onMouseUp: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			left = this.state.element_x + delta_x,
			model = this.state.currentResizeItem;

		if(this.state.resizing && this.state.mouse_down_left) {
			model.left = ((model.left + delta_x) / px_per_int).toFixed() * px_per_int;
		} else if(this.state.resizing && this.state.mouse_down_right) {
			model.right = ((model.left + delta_x) / px_per_int).toFixed() * px_per_int;
		}

		document.removeEventListener('mouseup', this.__onMouseUp);

		if(this.state.mouse_down_left) {
			document.removeEventListener('mousemove', this.__onMouseMoveLeft);
		} else{
			document.removeEventListener('mousemove', this.__onMouseMoveRight);
		}

		if(this.state.resizing) {
			this.setState({
				mouse_down_left: false,
				mouse_down_right: false,
				resizing: false,
				currentResizeItem: model
			}, function() {
				if(this.state.mouse_down_left) {
					this.props.__onResizeLeftEnd(this.state.row, model);
				} else {
					this.props.__onResizeRightEnd(this.state.row, model);
				}

				this.props.__onResizeCommand(model);
				
				this.props.iscroll.timeline.enable();
				this.props.iscroll.grid.enable();		
			});
		}
	},
	getDefaultProps: function() {
		return {
			handle_width: 50
		};
	},
	getInitialState: function() {
		return {
			data: this.props.data,
			resizing: false,
			mouse_down_left: false,
			mouse_down_right: false,
			currentResizeItem: this.props.currentResizeItem
		};
	},
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 100);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		if(!this.props.currentResizeItem && nextProps.currentResizeItem || 
			this.state.resizing && nextState.resizing) return true;

		return false;
	},
	componentWillReceiveProps: function(nextProps) {
		if(!this.props.currentResizeItem && nextProps.currentResizeItem) {
			this.setState({
				currentResizeItem: this._update(nextProps.currentResizeItem)
			});
		} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
			this.setState({
				currentResizeItem: undefined
			});
		}
	},
	render: function() {
		var handle_width_ms = this.props.handle_width * this.props.display.px_per_ms,
			self = this;

		return this.transferPropsTo(React.DOM.div({
				className: 'resize-wrapper',
				style: {
					display: (this.state.currentResizeItem) ? 'block' : 'none'
				} ,
				children: this.props.children
			},
			React.DOM.div({
				className: 'resize-control',
				style: {
					left: (this.state.currentResizeItem ? this.state.currentResizeItem.left : 0) + 'px'		
				},
				onMouseDown: self.__onMouseDownLeft//,
				//onMouseMove: self.__onMouseMove
			}),
			React.DOM.div({
				className: 'resize-control',
				style: {
					left: (this.state.currentResizeItem ? this.state.currentResizeItem.right : 0) + 'px'			
				},
				onMouseDown: self.__onMouseDownRight//,
				//onMouseMove: self.__onMouseMove
			})));
	}
});