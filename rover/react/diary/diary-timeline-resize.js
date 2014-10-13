var Resizable = React.createClass({
	__dbMouseMove: undefined,
	_update: function(row_item_data) {
		var copy = {};

		if(_.isObject(row_item_data)) {
			copy = _.extend(copy, row_item_data);

			copy.start_date = new Date(row_item_data.start_date.getTime());
			copy.end_date = new Date(row_item_data.end_date.getTime());

			return copy;
		}
	},
	__onMouseDownLeft: function(e) {
		var page_offset, model;

		if(e.button === 0) {
			//e.stopPropagation();
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			model = this._update(this.state.currentResizeItem);

			console.log('MouseDown:', model.start_date, model.end_date);

			this.setState({
				mouse_down_left: true,
				mouse_down_right: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				element_x: page_offset.left,
				element_y: page_offset.top
			});
		}
	},
	__onMouseDownRight: function(e) {
		var page_offset, model;

		if(e.button === 0) {
			e.stopPropagation();
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = $(this.getDOMNode()).filter(':first-child')[0].getBoundingClientRect();

			model = this._update(this.state.currentResizeItem);

			console.log('MouseDown:', model.start_date, model.end_date);

			this.setState({
				mouse_down_right: true,
				mouse_down_left: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				element_x: page_offset.left,
				element_y: page_offset.top
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			distance = Math.abs(delta_x) + Math.abs(delta_y),
			x_origin = this.props.display.x_origin,
			px_per_int = this.props.display.px_per_int,
			model = this._update(this.state.currentResizeItem);

		if(!this.state.resizing &&
		   this.state.mouse_down_left && distance > 5) {
			this.setState({
				resizing: true,
				currentResizeItem: model
			}, function() {
				this.props.angular_evt.onResizeLeftStart(this.state.currentResizeItem);
				this.props.__onResizeCommand(this.state.currentResizeItem);
			});
		} else if(this.state.resizing) {
			if(this.state.mouse_down_left) {
				model.start_date = new Date(model.start_date.getTime() + delta_x / this.props.display.px_per_ms);
				model.start_date = new Date(((model.start_date.getTime() * this.props.display.px_per_ms / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int) / this.props.display.px_per_ms);
			}

			if(this.state.mouse_down_right) {
				model.end_date = new Date(model.end_date.getTime() + delta_x / this.props.display.px_per_ms);
				model.end_date = new Date(((model.end_date.getTime() * this.props.display.px_per_ms / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int) / this.props.display.px_per_ms);
			}

			console.log('MouseMove:', model.start_date, model.end_date);

			this.setState({
				currentResizeItem: model
			}, function() {
				this.props.__onResizeCommand(this.state.currentResizeItem);
			});
		}
	},
	__onMouseUp: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			left = this.state.element_x + delta_x,
			model = this._update(this.state.currentResizeItem);

		if(this.state.resizing && this.state.mouse_down_left) {
			model.start_date = new Date(model.start_date.setTime(model.start_date.getTime() + delta_x / this.props.display.px_per_ms));
			model.start_date = new Date(((model.start_date.getTime() / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int) / this.props.display.px_per_ms);
		}

		if(this.state.resizing && this.state.mouse_down_right) {
			model.end_date = new Date(model.end_date.setTime(model.end_date.getTime() + delta_x / this.props.display.px_per_ms));
			model.end_date = new Date(((model.end_date.getTime() / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int) / this.props.display.px_per_ms);
		}

		console.log('MouseMove:', model.start_date, model.end_date);

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);

		if(this.state.resizing) {
			this.setState({
				mouse_down_left: false,
				mouse_down_right: false,
				resizing: false,
				currentResizeItem: model
			}, function() {
				this.props.angular_evt.onResizeLeftEnd(this.state.row, this.state.currentResizeItem);
				this.props.__onResizeCommand(this.state.currentResizeItem);
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
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 10);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		if(!this.props.currentResizeItem && nextProps.currentResizeItem || 
			this.state.resizing && nextState.resizing) return true;

		return false;
	},
	componentWillReceiveProps: function(nextProps) {
		var copy = {};

		if(!this.props.currentResizeItem && nextProps.currentResizeItem) {
			copy = _.extend(copy, nextProps.currentResizeItem);

			copy.start_date = new Date(nextProps.currentResizeItem.start_date.getTime());
			copy.end_date = new Date(nextProps.currentResizeItem.end_date.getTime());

			this.setState({
			//resizing: true,
				currentResizeItem: copy
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
				style: {
					display: (this.state.currentResizeItem) ? 'block' : 'none',
					width: '100%',
					height: '100%',
					padding: '0px',
					margin: '0px',
					border: 'none',
					position: 'relative',
					top: '0px',
					left: '0px'
				} ,
				children: this.props.children
			},
			React.DOM.div({
				style: {
					position: 'absolute',
					left: (this.state.currentResizeItem ? (this.state.currentResizeItem.start_date.getTime() - this.props.display.x_origin) * this.props.display.px_per_ms : 0) + 'px',
					height: '100%',
					width: this.props.handle_width + 'px',
					backgroundColor: 'rgba(255,255,255, 1)',
					zIndex: '499'			
				},
				onMouseDown: self.__onMouseDownLeft
			}),
			React.DOM.div({
				style: {
					position: 'absolute',
					left: (this.state.currentResizeItem ? (this.state.currentResizeItem.end_date.getTime() - this.props.display.x_origin) * this.props.display.px_per_ms - this.props.handle_width : 0) + 'px',
					height: '100%',
					width: this.props.handle_width + 'px',
					backgroundColor: 'rgba(255,255,255, 1)',
					zIndex: '499'					
				},
				onMouseDown: self.__onMouseDownRight
			})));
	}
});