var GridRowItemDrag = React.createClass({
	_update: function(row_item_data) {
		//var copy = {};

		/*if(_.isObject(row_item_data)) {
			copy = _.extend(copy, row_item_data);

			copy.start_date = new Date(row_item_data.start_date.getTime());
			copy.end_date = new Date(row_item_data.end_date.getTime());

			return copy;
		}*/

		return _.extend({}, row_item_data);
	},
	__dbMouseMove: undefined,
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 10);
	},
	__onMouseDown: function(e) {
		var page_offset, el, props = this.props;

		e.stopPropagation();
		e.preventDefault();

		if(e.button === 0 || e.button === 2) {
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__dbMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();
			
			el = props.viewport.element();

			this.setState({
				left: page_offset.left  - el.offset().left - el.parent()[0].scrollLeft,
				top: page_offset.top - el.offset().top - el[0].scrollTop,
				mouse_down: true,
				element: el.parent(),
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_x: el.offset().left + props.iscroll.grid.x,
				offset_y: el.offset().top + props.iscroll.grid.y,
				element_x: page_offset.left,
				element_y: page_offset.top
			},
			function() {
				props.iscroll.grid.disable();
				props.iscroll.timeline.disable();
			});
		}
	},
	__onMouseMove: function(e) {
		var state 		= this.state,
			props 		= this.props,
			display 	= props.display,
			delta_x 	= e.pageX - state.origin_x, //TODO - CHANGE TO left max distance
			delta_y 	= e.pageY - state.origin_y - state.offset_y, 
			adj_height 	= display.row_height + display.row_height_margin,
			model;

		if(!state.dragging && (Math.abs(delta_x) + Math.abs(delta_y) > 10)) {
			model = this._update(props.currentDragItem); 

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

		
		e.stopPropagation();
		e.preventDefault();

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
				var data = (props.edit.passive && props.data[props.meta.id] === props.data[props.meta.id]? props.currentDragItem : props.data);

				props.iscroll.grid.enable();			
				props.iscroll.timeline.enable();
				
				props.angular_evt.onSelect(props.row_data, data, !state.selected, 'edit');	//TODO Make proxy fn, and move this to diary-content	
			});
		}


	},
	componentWillReceiveProps: function(nextProps) {
		var id_meta = this.props.meta.occupancy.id;

		if(!this.props.currentDragItem && 
		   !this.state.currentDragItem && 
		    nextProps.currentDragItem && 
		    nextProps.currentDragItem[id_meta] === this.props.data[id_meta]) {

			this.setState({
				currentDragItem: nextProps.currentDragItem
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
		var props = this.props,
			state = this.state,
			style = {},
			className = '';

		if(state.dragging) {
			style = { 
				position: 'fixed',
				left: state.left,
				top: state.top
			}; 
			className = ' dragstate'; 
		} else {
			className = '';
		}

		return this.transferPropsTo(React.DOM.div({
			style:       style,
			className:   props.className + className,
			children:    props.children,
			onMouseDown: this.__onMouseDown
		}));
	}
});
