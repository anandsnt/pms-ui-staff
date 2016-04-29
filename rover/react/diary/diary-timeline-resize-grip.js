var TimelineResizeGrip = React.createClass({
	__dbMouseMove: undefined,
	__onMouseDown: function(e) {
		var page_offset, model, props = this.props;

		e.stopPropagation();
		e.preventDefault();
		e = this.isTouchEnabled ? e.changedTouches[0] : e;

		props.iscroll.timeline.disable();

		document.addEventListener(this.mouseLeavingEvent, this.__onMouseUp);
		document.addEventListener(this.mouseMovingEvent, this.__onMouseMove);

		page_offset = ReactDOM.findDOMNode(this).getBoundingClientRect();

		this.setState({
			mouse_down: true,
			origin_x: e.pageX,
			element_x: page_offset.left -props.display.x_0 - props.iscroll.grid.x
		});

	},
	__onMouseMove: function(e) {
		e.stopPropagation();
		e.preventDefault();
		e = this.isTouchEnabled ? e.changedTouches[0] : e;
		var props = 				this.props,
			state = 				this.state,
			display = 				props.display,
			delta_x = 				e.pageX - state.origin_x,
			x_origin = 				(display.x_n instanceof Date ? display.x_n.getTime() : display.x_n),
			px_per_int = 			display.px_per_int,
			px_per_ms = 			display.px_per_ms,
			model = 				state.currentResizeItem,
			direction = 			props.itemProp,
			newValue = ((((state.element_x + delta_x) / px_per_ms) + x_origin) / 900000).toFixed() * 900000,
			opposite =      		((direction === 'departure') ? 'arrival' : 'departure'),
			isResizable=			this.__whetherResizable( opposite, newValue),
			last_left;


		if(!isResizable){
			newValue = model[direction];
		}

		if(!state.resizing &&
		   state.mouse_down &&
		   (Math.abs(delta_x) > 10)) {

			this.setState({
				resizing: true,
				currentResizeItem: model
			}, function() {
				this.props.__onResizeStart(undefined, model);
			});

			this.props.__onResizeCommand(model);
		} else if(state.resizing) {
			last_left = model[direction];

			model[direction] = newValue;

			this.setState({
				currentResizeItem: 	model
			}, function() {
				props.__onResizeCommand(model);
			});
		}
	},
	__onMouseUp: function(e) {
		e.stopPropagation();
		e.preventDefault();
		e = this.isTouchEnabled ? e.changedTouches[0] : e;
		var props = 		this.props,
			state = 		this.state,
			display = 		props.display,
			delta_x = 		e.pageX - state.origin_x,
			px_per_int = 	display.px_per_int,
			px_per_ms =     display.px_per_ms,
			x_origin =      display.x_n,
			model = 		state.currentResizeItem,
			m =      		props.meta.occupancy,
			direction = 	props.itemProp;

		document.removeEventListener(this.mouseLeavingEvent, this.__onMouseUp);
		document.removeEventListener(this.mouseMovingEvent, this.__onMouseMove);

		if(this.state.resizing) {
			props.iscroll.timeline.enable();

			setTimeout(function() {
				props.iscroll.timeline.refresh();
			}, 250);

			this.setState({
				mouse_down: 		false,
				resizing: 			false,
				currentResizeItem: 	model
			}, function() {
				props.__onResizeEnd(state.row, model);

				props.__onResizeCommand(model);
			});
		}

	},
	__whetherResizable: function(opposite, value){
		var props = 				this.props,
			state =					this.state,
			original_item = 		state.currentResizeItem,
			direction = 			props.itemProp.toUpperCase(),
			fifteenMin =			900000,
			reservation_status = 	original_item.reservation_status.toUpperCase(),
			difference	= (opposite === 'departure' ? (original_item[opposite] - value) :(value - original_item[opposite]) );

		if((difference) < (fifteenMin)) {
			return false;
		}
		else if ((reservation_status === "RESERVED" || reservation_status === "CHECK-IN" ||
			reservation_status === "AVAILABLE" )) {
			return true;
		}
		else if ( (reservation_status === "INHOUSE" || reservation_status === "DEPARTED") && direction === "DEPARTURE"){
			return true;
		}
		else if((reservation_status === "INHOUSE" || reservation_status === "DEPARTED") && direction === "ARRIVAL"){
			return false;
		}
		return false;
	},
	getDefaultProps: function() {
		return {
			handle_width: 50
		};
	},
	getInitialState: function() {
		return {
			stop_resize: false,
			resizing: false,
			mode: undefined,
			mouse_down: false,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		};
	},
	componentWillMount: function() {
		this.__dbMouseMove = _.throttle(this.__onMouseMove, 10);
	},
	componentWillUnmount: function() {
  		ReactDOM.findDOMNode(this).removeEventListener(this.mouseStartingEvent, this.__onMouseDown);
  	},
	componentDidMount: function(){
		this.isTouchEnabled 	= 'ontouchstart' in window;
		this.mouseStartingEvent = this.isTouchEnabled ? 'touchstart': 'mousedown';
		this.mouseMovingEvent 	= this.isTouchEnabled ? 'touchmove' : 'mousemove';
		this.mouseLeavingEvent 	= this.isTouchEnabled ? 'touchend'	: 'mouseup';

		ReactDOM.findDOMNode(this).addEventListener(this.mouseStartingEvent, this.__onMouseDown);
	},
	componentWillReceiveProps: function(nextProps) {
		var model,
			props 		= this.props,
			state  		= this.state,
			display 	= props.display,
			direction 	= this.props.itemProp,
			px_per_ms 	= display.px_per_ms,
			x_origin 	= display.x_n, // instanceof Date ? display.x_n.getTime() : display.x_n),
			m 			= props.meta.occupancy;
		if(!this.state.resizing) {
			if(!props.currentResizeItem && nextProps.currentResizeItem) {
				model = nextProps.currentResizeItem;
				if(nextProps.edit.passive) {
					this.setState({
						mode: model[props.meta.occupancy.id],
						currentResizeItem: model,
						currentResizeItemRow: model[props.meta.occupancy.id]
					});
					var scrollToPos = (model[m.start_date] - x_origin - 7200000) * px_per_ms;
					if(scrollToPos < 0){
						scrollToPos = 0;
					}
					props.iscroll.grid.scrollTo(-scrollToPos, 0, 0, 1000);
            		props.iscroll.timeline.scrollTo(-scrollToPos, 0, 0, 1000);
            		props.iscroll.rooms.scrollTo(0, props.iscroll.rooms.y, 0, 1000);
            		props.iscroll.rooms._scrollFn();
            		props.iscroll.rooms.refresh();

				} else {
					this.setState({
						mode: 					undefined,
						currentResizeItem: 		model,
						currentResizeItemRow: 	nextProps.currentResizeItemRow
					});
				}
			} else if(this.props.currentResizeItem && !nextProps.currentResizeItem) {
				this.setState({
					mode: 					undefined,
					currentResizeItem: 		undefined,
					currentResizeItemRow: 	undefined
				});
			}
			else if(this.props.currentResizeItem && nextProps.currentResizeItem){
				this.setState({
					mode: 					undefined,
					currentResizeItem: 		nextProps.currentResizeItem,
					currentResizeItemRow: 	nextProps.currentResizeItemRow
				});
			}
		}
	},
	render: function() {
			var self = this,
				props 				= this.props,
				direction 			= props.itemProp,
				currentResizeItem 	= this.state.currentResizeItem,
				x_origin 			= (props.display.x_n instanceof Date ? props.display.x_n.getTime() : props.display.x_n),
				px_per_ms 			= props.display.px_per_ms,
				label       		= (direction === 'arrival' ? 'ARRIVE' : 'DEPART'),
				label_class         = (direction === 'arrival' ? 'arrival' : 'departure'),
				left 				= (currentResizeItem ? (currentResizeItem[direction] - x_origin) * px_per_ms : 0),
				count_txt           = props.meta.availability_count.total > 0 ? props.meta.availability_count.total : false,
				classes             = "set-times " + label_class,
				time_txt            = '';


			if(currentResizeItem) {
				var dateDirection = new Date(currentResizeItem[direction]);
				time_txt = dateDirection.toComponents().time.toString(true);
				var display_start_time = (props.display.x_n instanceof Date ? props.display.x_n : new Date (props.display.x_n) );

				if(display_start_time.isOnDST()===false && dateDirection.isOnDST() ===true ) {
					var dateForCalculatingLeft = new Date(currentResizeItem[direction]);
					dateForCalculatingLeft.setMinutes(dateForCalculatingLeft.getMinutes() + dateForCalculatingLeft.getDSTDifference());
					left = (dateForCalculatingLeft.getTime() - x_origin) * px_per_ms;

				}

				else if(display_start_time.isOnDST()===true && dateDirection.isOnDST() ===false ) {
					var dateForCalculatingLeft = new Date(currentResizeItem[direction]);
					dateForCalculatingLeft.setMinutes(dateForCalculatingLeft.getMinutes() + dateForCalculatingLeft.getDSTDifference());
					left = (dateForCalculatingLeft.getTime() - x_origin) * px_per_ms;
					//The special case adjustment
					if(dateForCalculatingLeft.isOnDST()){
						left = (dateForCalculatingLeft.getTime() + 3600000 - x_origin) * px_per_ms;
					}
				}


			}

			if(this.props.edit.active) {
				classes += " editing";
			}

			return React.DOM.div({
					className: classes,
					style: {
						left: left + 'px'
					}
				},
				React.DOM.span({
					className: 'title'
				},
					React.DOM.label({}, label),
					React.DOM.span({
						className: 'time'
					}, time_txt)
				),
				React.DOM.span({
					className: 'line',
					style: {
						display: this.props.edit.active ? 'inline' : 'none'
					}
				})
			);
		}
});

