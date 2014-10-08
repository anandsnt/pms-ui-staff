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
				element_y: page_offset.top
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
				element_y: page_offset.top
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			delta_y = e.pageY - this.state.origin_y, 
			distance = Math.abs(delta_x) + Math.abs(delta_y),
			left, top, margin_top = this.props.display.row_height + 6;

		if(!this.state.dragging &&
		   distance > 3) {
			this.setState({
				dragging: true
			}, function() {
				this.props.__onDragStart(this.props.room, this.props.__dragData.data);
			});
		} else if(this.state.dragging) {
			left = this.state.element_x + delta_x - $('.diary-grid .wrapper')[0].scrollLeft;
			top = this.state.element_y + delta_y - $('.diary-grid .wrapper')[0].scrollTop - this.state.offset_y;

			this.setState({
				left: (left / this.props.display.px_per_int).toFixed() * this.props.display.px_per_int , //document.body.scrollLeft,
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
			dragging: false,
			mouse_down_left: false,
			mouse_down_right: false
		};
	},
	render: function() {
		var i = 0, reservation, 
			handle_width_ms = this.props.handle_width * this.props.display.px_per_ms,
			self = this;

		while(!_.first(this.state.data[i++].reservations));

		reservation = _.first(this.state.data[--i].reservations);

		return React.DOM.div({
			style: {
				width: '100%'
			}
		},
		React.DOM.div({
			style: (this.state.dragging) ? {
				left: reservation.start_date.getTime() * this.props.display.px_per_ms + 'px',
				width: this.props.handle_width + 'px',
				height: '100%',
				zIndex: 1299,
				onClick: self.__onMouseDownLeft
			} : {}
		}),
		React.DOM.div({
			style: (this.state.dragging) ? {
				left: (reservation.end_date.getTime() - handle_width_ms) * this.props.display.px_per_ms + 'px',
				width: this.props.handle_width + 'px',
				height: '100%',
				zIndex: 1299,
				onClick: self.__onMouseDownRight
			} : {}
		}));
	}
});