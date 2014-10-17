var GridRowItemDrag = React.createClass({
	_update: function(row_item_data) {
		var copy = {};

		if(_.isObject(row_item_data)) {
			copy = _.extend(copy, row_item_data);

			copy.start_date = new Date(row_item_data.start_date.getTime());
			copy.end_date = new Date(row_item_data.end_date.getTime());

			return copy;
		}
	},
	__dbMouseMove: undefined,
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 10);
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
				offset_x: el.offset().left + this.props.iscroll.grid.x,
				offset_y: el.offset().top + this.props.iscroll.grid.y,
				element_x: page_offset.left,
				element_y: page_offset.top
			},
			function() {
				this.props.iscroll.grid.disable();
			});
		}
	},
	__onMouseMove: function(e) {
		var state 		= this.state,
			props 		= this.props,
			display 	= props.display,
			delta_x 	= e.pageX - state.origin_x, 
			delta_y 	= e.pageY - state.origin_y - state.offset_y, 
			adj_height 	= display.row_height + display.row_height_margin,
			model;

		if(!state.dragging && (Math.abs(delta_x) + Math.abs(delta_y) > 10)) {
			model = this._update(props.data);

			this.setState({
				dragging: true,
				currentDragItem: model
			}, function() {
				props.__onDragStart(props.row_data, model);
			});
		} else if(state.dragging) {	
			this.setState({
				left: ((state.element_x + delta_x - state.offset_x) / display.px_per_int).toFixed() * display.px_per_int, 
				top: ((state.element_y + delta_y) / adj_height).toFixed() * adj_height
			});
		}
	},
	__onMouseUp: function(e) {
		var state = this.state, 
			props = this.props,
			item = this.state.currentDragItem;

		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__dbMouseMove);

		if(state.dragging) {
			this.setState({
				dragging: false,
				currentDragItem: undefined,
				left: state.left,
				top: state.top
			}, function() {
				props.iscroll.grid.enable();
				props.__onDragStop(e, state.left, item);
			});
		} else if(this.state.mouse_down) {
			this.setState({
				mouse_down: false,
				selected: !state.selected
			}, function() {
				props.iscroll.grid.enable();
				props.angular_evt.onSelect(props.row_data, props.data, !state.selected, 'resize');		
			});
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if(!this.props.currentDragItem && 
		   !this.state.currentDragItem && 
		    nextProps.currentDragItem) {

			this.setState({
				currentDragItem: this._update(nextProps.currentDragItem)
			});
		} else if(this.props.currentDragItem && 
				  !nextProps.currentDragItem) {
			
			this.setState({
				currentDragItem: undefined
			});
		}
	},
	getInitialState: function() {
		return {
			dragging: false,
			mouse_down: false,
			selected: false
		};
	},
	render: function() {
		var state = this.state,
			style = {},
			className = '';

		if(this.state.dragging) {
			style = { 
				position: 'fixed',
				left: state.left,
				top: state.top
			}; 
			className = 'occupancy-block dragstate';
		//} else if(state.selected) {
			//className = 'occupancy-block reserved';
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