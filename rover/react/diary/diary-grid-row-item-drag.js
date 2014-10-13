var GridRowItemDrag = React.createClass({
	__dbMouseMove: undefined,
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 10);

		/*if(_.isObject(this.props.iscroll)) {
			for(var k in this.props.iscroll) {
				if(Object.prototype.hasOwnProperty.call(this.props.iscroll, k)) {
					if(this.props.iscroll[k] instanceof IScroll) {
						this.props.iscroll[k].disable();
					}
				}
			}
		}*/
	},
	__onMouseDown: function(e) {
		var page_offset, el;

		if(e.button === 0) {
			e.stopPropagation();
			e.preventDefault();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__dbMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();
			el = this.props.viewport.element();

			this.setState({
				left: page_offset.left  - el.offset().left - el.parent()[0].scrollLeft,
				top: page_offset.top - el.offset().top - el[0].scrollTop,
				mouse_down: true,
				element: el.parent(),
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_x: el.offset().left,
				offset_y: el.offset().top,
				element_x: page_offset.left,
				element_y: page_offset.top
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y - this.state.offset_y, 
			distance = Math.abs(delta_x) + Math.abs(delta_y),
			left, 
			top, 
			margin_top = this.props.display.row_height + this.props.display.row_height_margin;

		if(!this.state.dragging && distance > 10) {
			this.setState({
				dragging: true
			}, function() {
				this.props.__onDragStart(this.props.row_data, this.props.__dragData.data);
			});
		} else if(this.state.dragging) {	
			left = 	this.state.element_x + delta_x - this.state.offset_x;
			top = 	this.state.element_y + delta_y; // - this.state.element[0].scrollTop; this.state.offset_y;	

			this.setState({
				left: Math.floor(left / this.props.display.px_per_int) * this.props.display.px_per_int , 
				top: Math.floor(top / margin_top) * margin_top
			});
		}
	},
	__onMouseUp: function(e) {
		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__dbMouseMove);

		if(this.state.dragging) {
			this.setState({
				dragging: false,
				left: this.state.left,
				top: this.state.top
			}, function() {
				this.props.__onDragStop(e, this.state.left);
			});
		} else if(this.state.mouse_down) {
			this.setState({
				selected: !this.state.selected
			}, function() {
				this.props.angular_evt.onSelect(this.props.row_data, this.props.data, false, 'resize');
				//this.props.__dispatchResizeCommand(this.props.row_data, this.props.data);
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
				top: this.state.top //,
				//height: this.props.display.row_height
			}; 
			className = 'occupancy-block dragstate';
		} else if(this.state.selected) {
			className = 'occupancy-block selected';
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