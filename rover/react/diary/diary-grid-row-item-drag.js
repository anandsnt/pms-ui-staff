var GridRowItemDrag = React.createClass({
	__onMouseDown: function(e) {
		var page_offset;

		if(e.button === 0) {
			e.stopPropagation();
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			this.setState({
				mouse_down: true,
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_y: $('.diary-grid .wrapper').offset().top,
				element_x: page_offset.left,
				element_y: page_offset.top
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			distance = Math.abs(delta_x) + Math.abs(delta_y),
			left, top, margin_top = this.props.display.row_height + 6;

		if(!this.state.dragging) {
			this.setState({
				dragging: true
			}, function() {
				this.props.__onDragStart(this.props.room, this.props.__dragData.data);
			});
		} else if(this.state.dragging) {
			left = 	this.state.element_x + delta_x; 
			top = 	this.state.element_y + delta_y - this.state.offset_y; 

			this.setState({
				left: (left / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int , 
				top: (top / margin_top).toFixed() * margin_top
			});
		}
	},
	__onMouseUp: function(e) {
		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__onMouseMove);

		if(this.state.dragging) {
			this.setState({
				dragging: false
			}, function() {
				this.props.__onDragStop(e);
			});
		} else if(this.state.mouse_down) {
			this.setState({
				selected: !this.state.selected
			}, function() {
				this.props.angular_evt.onSelect(this.state.data);
			});
		}
	},
	getInitialState: function() {
		return {
			data: this.props.data,
			room: this.props.room,
			dragging: false,
			mouse_down: false,
			selected: false
		};
	},
	render: function() {
		var style = {},
			className = '';

		if(this.state.dragging) {
			style = { 
				position: 'fixed',
				left: this.state.left,
				top: this.state.top,
				height: this.props.display.row_height
			}; 
			className = 'draggable';
		} else if(this.state.selected) {
			className = 'selected';
		} else {
			className = '';
		}

		return this.transferPropsTo(React.DOM.div({
			style: style,
			className: className,
			children: this.props.children,
			onMouseDown: this.__onMouseDown
		}));
	}
});