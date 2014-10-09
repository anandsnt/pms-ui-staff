var Resizable = React.createClass({
	__onMouseDownLeft: function(e) {
		var page_offset;

		if(e.button === 0) {
			e.stopPropagation();
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			this.setState({
				mouse_down_left: true,
				mouse_down_right: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_y: $('.diary-timeline .wrapper').offset().top,
				element_x: page_offset.left,
				element_y: page_offset.top,
				left: page_offset.left
			});
		}
	},
	__onMouseDownRight: function(e) {
		var page_offset;

		if(e.button === 0) {
			e.stopPropagation();
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = $(this.getDOMNode()).filter(':first-child')[0].getBoundingClientRect();

			this.setState({
				mouse_down_right: true,
				mouse_down_left: false,
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_y: $('.diary-timeline .wrapper').offset().top,
				element_x: page_offset.left,
				element_y: page_offset.top,
				left: page_offset.left
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			left;

		left = this.state.element_x + delta_x;

		if(!this.state.dragging &&
		   this.state.mouse_down_left) {
			this.setState({
				dragging: true,
				left: (left / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int 
			}, function() {
				this.props.angular_evt.onResizeLeftStart(this.state.row, this.state.row_item, this.state.left);
			});
		} else if(this.state.dragging) {
			this.setState({
				left: (left / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int 
			});
		}
	},
	__onMouseUp: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			left;

		left = this.state.element_x + delta_x;

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);

		if(this.state.dragging) {
			this.setState({
				mouse_down_left: false,
				mouse_down_right: false,
				dragging: false,
				left: (left / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int 
			}, function() {
				this.props.angular_evt.onResizeLeftEnd(this.state.row, this.state.row_item, this.state.left);
			});
		}
	},
	getDefaultProps: function() {
		return {
			handle_width: 30
		};
	},
	getInitialState: function() {
		return {
			data: this.props.data,
			row: undefined,
			row_item: undefined,
			left: 0,
			dragging: false,
			mouse_down_left: false,
			mouse_down_right: false
		};
	},
	render: function() {
		var model,
			handle_width_ms = this.props.handle_width * this.props.display.px_per_ms,
			left, right,
			self = this;

		return React.DOM.div({
			style: {
				display: 'none'
			}
		});
		/*if(!this.state.row_item) {
			for(var i = 0; i < this.state.data.length; i++) {
				for(var j = 0; j < this.state.data[i].reservations.length; j++) {
					if(!model && this.state.data[i].reservations[j].temporary) {
						model = this.state.data[i].reservations[j];
						this.state.row = this.state.data[i];
						this.state.row_item = model;
					}
				}
			}

			if(model) {
				left = (model.start_date.getTime() - this.props.display.x_origin - this.props.display.x_0) * this.props.display.px_per_ms + 'px';
				right = (model.end_date.getTime() - handle_width_ms - this.props.display.x_origin - this.props.display.x_0) * this.props.display.px_per_ms + 'px';
			}
		}

		return React.DOM.div({
			style: {
				width: '100%'
			}
		},
		React.DOM.div({
			style: (model) ? {
				left: left || this.state.left,
				width: this.props.handle_width + 'px',
				height: '100%',
				zIndex: 1299,
				backgroundColor: '#fff',
				position: 'relative'				
			} : {},
			onMouseDown: self.__onMouseDownLeft
		}),
		React.DOM.div({
			style: (model) ? {
				left: right || this.state.left,
				width: this.props.handle_width + 'px',
				height: '100%',
				zIndex: 1299,
				backgroundColor: '#fff',
				position: 'relative'
			} : {},
			onMouseDown: self.__onMouseDownRight
		}));*/
	}
});