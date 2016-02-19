var GridRowItemDrag = React.createClass({
	_update: function(row_item_data) {
		return _.extend({}, row_item_data);
	},
	__dbMouseMove: undefined,
	componentWillMount: function() {
		this.__dbMouseMove = _.debounce(this.__onMouseMove, 10);
	},
	componentWillUnmount: function() {
  		this.getDOMNode().removeEventListener(this.mouseStartingEvent, this.__onMouseDown);
  	},
	__onMouseDown: function(e) {
		var page_offset, el, props = this.props, state = this.state, display = props.display;

		e.stopPropagation();
		e.preventDefault();
		e = this.isTouchEnabled ? e.changedTouches[0] : e;

		document.addEventListener (this.mouseLeavingEvent, this.__onMouseUp);
		document.addEventListener (this.mouseMovingEvent, this.__dbMouseMove);

		page_offset = this.getDOMNode().getBoundingClientRect();

		el = props.viewport.element();

		this.startingColNumber = Math.floor(Math.abs(props.iscroll.grid.x - (e.pageX - this.__roomListingAreaWidth))/display.px_per_int);
		this.reservationTimeStartColNumber = parseFloat(this.props.style.left) / display.px_per_int;

		this.startingRowNumber = Math.floor((e.pageY - props.iscroll.grid.y - props.viewport.element().offset().top)/ (display.row_height + display.row_height_margin));

		this.setState({
			mouse_down: true,
			selected: true,
			element: el.parent(),
			origin_x: e.pageX,
			origin_y: e.pageY,
			offset_x: el.offset().left + props.iscroll.grid.x,
			offset_y: el.offset().top + props.iscroll.grid.y,
			element_x: page_offset.left-props.display.x_0 - props.iscroll.grid.x,
			element_y: page_offset.top,
			currentClickedCol: this.startingColNumber
		},
		function() {
			props.iscroll.grid.disable();
			props.iscroll.timeline.disable();
		});
	},
	__onMouseMove: function(e) {
		e.stopPropagation();
		e.preventDefault();

		e = this.isTouchEnabled ? e.changedTouches[0] : e;
		var state 		= this.state,
			props 		= this.props,
			viewport 	= props.viewport.element(),
			display 	= props.display,
			px_per_ms 	= display.px_per_ms,
			delta_x 	= e.pageX - state.origin_x,
			delta_y 	= e.pageY - state.origin_y - state.offset_y,
			yCurPos 	= e.pageY - props.iscroll.grid.y - viewport.offset().top,
			adj_height 	= display.row_height + display.row_height_margin,
			x_origin 	= (display.x_n instanceof Date ? display.x_n.getTime() : display.x_n),
			fifteenMin	= 900000,
			model,
			scroller = props.iscroll.grid,
			mouseMovingRowNumber = Math.floor(yCurPos / adj_height),
			mouseMovingColNumber = Math.floor(Math.abs(scroller.x - (e.pageX - this.__roomListingAreaWidth)) / display.px_per_int);
		
		if(!props.edit.active && !props.edit.passive){
			return;
		}

		if(props.edit.active && (props.data.key !== props.currentDragItem.key)){
			return;
		}

		if(mouseMovingColNumber < 0 || mouseMovingColNumber/4 > display.hours || mouseMovingRowNumber < 0 || mouseMovingRowNumber > (display.total_rows-1)){
			return;
		}

		//we will allow to move checkingin/future reservation horizontally as well as vertically
		//in-house reservation: we will allow to move vertically only (Room change only)
		if(props.currentDragItem.reservation_status !== 'reserved'  &&
			props.currentDragItem.reservation_status !== 'inhouse'  &&
			props.currentDragItem.reservation_status !== 'check-in' ){
			return;
		}

		if(!state.dragging && (Math.abs(delta_x) + Math.abs(delta_y) > 10)) {
			model = this._update(props.currentDragItem);

			this.setState({
				dragging: true,
				currentDragItem: model
			}, function() {
				props.__onDragStart(props.row_data, model);
			});
		} else if(state.dragging) {
			model = (props.currentDragItem);

	 		var xScPos = scroller.x,
	 			yScPos = scroller.y,
	 			width_of_res = this.getDOMNode().offsetWidth;

            // dragging towards
            // RIGHT
            if ( mouseMovingColNumber -  this.startingColNumber > 0 ) {
            	var reachingRightEdge = (parseFloat(e.pageX) + parseFloat(width_of_res) + parseFloat(width_of_res)/4 ) > Math.abs( scroller.maxScrollX );
            		
            	if ( reachingRightEdge ) {
            		//based on where the reservation is going to plot, we have to calculate scroll position to scroll
            		var distanceMouseMoved = ( mouseMovingColNumber - state.currentClickedCol ) * display.px_per_int;
            		xScPos = (xScPos - distanceMouseMoved);	

            		if( xScPos < scroller.maxScrollX ) {
            			xScPos = scroller.maxScrollX;
            		}
            	}
            }

            // LEFT
            if ( mouseMovingColNumber -  this.startingColNumber < 0 ) {
            	var reachingLeftEdge = (parseFloat(e.pageX) - parseFloat(width_of_res) - parseFloat(width_of_res)/4 ) <= 0;
            		
            	if ( reachingLeftEdge ) {
            		//based on where the reservation is going to plot, we have to calculate scroll position to scroll
            		var distanceMouseMoved = ( mouseMovingColNumber - state.currentClickedCol ) * display.px_per_int;
            		xScPos = (xScPos - distanceMouseMoved);

            		if( xScPos > 0) {
            			xScPos = 0;
            		}
            	}
            }

            //TOP
            if ( mouseMovingRowNumber -  this.startingRowNumber < 0 ) {
            	var reachingTopEdge = (parseFloat(e.pageY) - 3 * adj_height ) <= props.viewport.element().offset().top;

            	if ( Math.abs( mouseMovingColNumber - this.startingColNumber ) < 3 ) {
            		mouseMovingColNumber = this.startingColNumber;
            	}
            	            	
            	if ( reachingTopEdge ) {
            		//based on where the reservation is going to plot, we have to calculate scroll position to scroll
            		var distanceMouseMoved = ( parseFloat(mouseMovingRowNumber) - parseFloat(this.startingRowNumber) ) * parseFloat(adj_height);
            		yScPos = (parseFloat(yScPos) - parseFloat(distanceMouseMoved));  

            		if(yScPos > 0) {
            			yScPos = 0;
            		}           		          		
            	}
            }

            //BOTTOM
            if ( mouseMovingRowNumber -  this.startingRowNumber > 0 ) {
            	var reachingBottomEdge = (parseFloat(e.pageY) + 3 * adj_height ) >= window.innerHeight;
            	
            	if ( Math.abs( mouseMovingColNumber - this.startingColNumber ) < 3 ) {
            		mouseMovingColNumber = this.startingColNumber;
            	}

            	if ( reachingBottomEdge ) {
            		//based on where the reservation is going to plot, we have to calculate scroll position to scroll
            		var distanceMouseMoved = ( parseFloat(mouseMovingRowNumber) - parseFloat(this.startingRowNumber) ) * parseFloat(adj_height);
            		yScPos = ( parseFloat(yScPos) - parseFloat(distanceMouseMoved) ); 

            		if( yScPos < scroller.maxScrollY ) {
            			yScPos = scroller.maxScrollY;
            		}            		
            	}
            }

            var newLeft = ((this.reservationTimeStartColNumber + mouseMovingColNumber - this.startingColNumber) * display.px_per_int),
            	newTop = mouseMovingRowNumber * adj_height;

            if(props.currentDragItem.reservation_status === 'inhouse' ) {
                newLeft = (state.element_x / display.px_per_int).toFixed() * display.px_per_int;
            }
            else {
				var newArrival = ((((newLeft / px_per_ms) + x_origin) / fifteenMin).toFixed(0) * fifteenMin),
					diff = newArrival - model.arrival;

	            model.arrival = newArrival;
	            model.departure = model.departure + diff;
            }

			this.setState({
				currentClickedCol: mouseMovingColNumber,
				currentResizeItem: model,
				resizing: true,
				left: parseFloat( newLeft ),
				top: newTop
			}, function() {
				
				props.__onResizeCommand(model);

	            if (scroller.maxScrollX <= xScPos && xScPos <= 0 &&
					scroller.maxScrollY <= yScPos ){
	    			
	    			scroller.scrollTo(xScPos, yScPos, 0);
					scroller._scrollFn();
	    		}					
			});		
		}
	},
	__onMouseUp: function(e) {

		e.stopPropagation();
		e.preventDefault();

		e = this.isTouchEnabled ? e.changedTouches[0] : e;
		var state = this.state,
			props = this.props,
			item = this.state.currentDragItem,
			display = 				props.display,
			delta_x = e.pageX - state.origin_x,
			x_origin = 				(display.x_n instanceof Date ? display.x_n.getTime() : display.x_n),
			px_per_int = 			display.px_per_int,
			px_per_ms = 			display.px_per_ms;

		document.removeEventListener (this.mouseLeavingEvent, this.__onMouseUp);
		document.removeEventListener (this.mouseMovingEvent, this.__dbMouseMove);
		var page_offset = this.getDOMNode().getBoundingClientRect();

		if(state.dragging && props.edit.active && (props.data.key !== props.currentDragItem.key)){
			return;
		}

		if(state.dragging) {
			this.setState({
				dragging: false,
				currentDragItem: undefined
			}, function() {
				props.iscroll.grid.enable();
				props.__onDragStop(e, state.left, state.top, item);

			});
		} else if(this.state.mouse_down) {

			this.setState({
				mouse_down: false,
				selected: !state.selected
			}, function() {
				var data = (_.has(state, 'selected') ? props.data : props.currentDragItem);
				props.iscroll.grid.enable();
				props.iscroll.timeline.enable();
				props.angular_evt.onSelect(props.row_data, data, !data.selected, 'edit');	//TODO Make proxy fn, and move this to diary-content
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
	componentDidMount: function() {
		this.isTouchEnabled 	= 'ontouchstart' in window;
		this.mouseStartingEvent = this.isTouchEnabled ? 'touchstart': 'mousedown';
		this.mouseMovingEvent 	= this.isTouchEnabled ? 'touchmove' : 'mousemove';
		this.mouseLeavingEvent 	= this.isTouchEnabled ? 'touchend'	: 'mouseup';
		this.getDOMNode().addEventListener(this.mouseStartingEvent, this.__onMouseDown);
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
			x_origin 			= (props.display.x_n instanceof Date ? props.display.x_n.getTime() : props.display.x_n),
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
		this.__roomListingAreaWidth =  120;
		return this.transferPropsTo(React.DOM.div({
			style:       style,
			className:   props.className + className,
			children:    props.children

		}
		));
	}
});