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
			//e.preventDefault();
			e.stopPropagation();

			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__onMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();

			this.setState({
				mouse_down: true,
				origin_x: e.pageX,
				element_x: page_offset.left
			}, function() {
				this.props.iscroll.timeline.disable();
				this.props.iscroll.grid.disable();
			});
		}
	},
	__onMouseMove: function(e) {
		var delta_x = e.pageX - this.state.origin_x, 
			x_origin = this.props.display.x_origin,
			px_per_int = this.props.display.px_per_int,
			px_per_ms = this.props.display.px_per_ms,
			model = this._update(this.state.currentResizeItem),
			direction = this.props.itemProp;

		console.log('__onMouseMove', e);

		e.stopPropagation();
		e.preventDefault();

		if(!this.state.resizing &&
		   this.state.mouse_down && 
		   (Math.abs(delta_x) > 10)) {
			model[direction] = ((model[direction] + delta_x) / px_per_int).toFixed() * px_per_int;

			this.setState({
				left: model[direction],
				resizing: true,
				currentResizeItem: model,
				origin_x: e.pageX
			}, function() {
				this.props.__onResizeStart(undefined, model);			
			});

			this.props.__onResizeCommand(model);
		} else if(this.state.resizing && 
				  this.mouse_down) {		
			model[direction] = ((model[direction] + delta_x) / px_per_int).toFixed() * px_per_int;

			this.setState({
				left: model[direction],
				currentResizeItem: model,
				origin_x: e.pageX
				 //((this.state.left + delta_x) / px_per_int).toFixed() * px_per_int
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
			
		model[direction] = ((model[direction] + delta_x) / px_per_int).toFixed() * px_per_int;

		if(this.state.resizing) {
			this.setState({
				mouse_down: false,
				resizing: false,
				currentResizeItem: model
			}, function() {
				this.props.__onResizeEnd(this.state.row, model);
				
				this.props.__onResizeCommand(model);
				
				this.props.iscroll.timeline.enable();
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
			left: 0,
			data: this.props.data,
			resizing: false,
			mouse_down: false,
			currentResizeItem: this.props.currentResizeItem
		};
	},
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 100);
	},
	componentWillReceiveProps: function(nextProps) {
		var model, direction = this.props.itemProp;

		if(!this.props.currentResizeItem && nextProps.currentResizeItem) {
			model = this._update(nextProps.currentResizeItem);

			this.setState({
				left: model[direction],
				currentResizeItem: model
			});
		} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
			this.setState({
				currentResizeItem: undefined
			});
		}
	},
	render: function() {
		var self = this;

		console.log('rendering', this.state);

		return this.transferPropsTo(React.DOM.a({
			className: 'set-times',
			style: {
				left: (this.state.currentResizeItem ? this.state.currentResizeItem[direction] : 0) + 'px'		
			},
			onMouseDown: self.__onMouseDown
		}, (new Date(this.state.currentResizeItem[direction] / this.props.display.px_per_ms + this.props.display.x_origin)).toLocaleTimeString()));
	}
});