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
		var page_offset, el, props = this.props, state = this.state, display = props.display;
		
		e.stopPropagation();
		e.preventDefault();			
		if(e.button === 0) {
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__dbMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();
			
			el = props.viewport.element();
			var left = (((page_offset.left-props.display.x_0 - props.iscroll.grid.x)) / display.px_per_int).toFixed() * display.px_per_int;
			console.log('mouse down: ' + (page_offset.left  - el.offset().left - el.parent()[0].scrollLeft) + ", left: " + left);
			
			this.setState({
				//left: page_offset.left  - el.offset().left - el.parent()[0].scrollLeft,
				left: left,
				top: page_offset.top - el.offset().top - el[0].scrollTop,
				mouse_down: true,
				selected: true,
				element: el.parent(),
				origin_x: e.pageX,
				origin_y: e.pageY,
				offset_x: el.offset().left + props.iscroll.grid.x,
				offset_y: el.offset().top + props.iscroll.grid.y,
				element_x: page_offset.left-props.display.x_0 - props.iscroll.grid.x,
				element_y: page_offset.top
			},
			function() {
				props.iscroll.grid.disable();
				props.iscroll.timeline.disable();
				
			});
		}
	},
	__onMouseMove: function(e) {
		e.stopPropagation();
		e.preventDefault();

		var state 		= this.state,
			props 		= this.props,
			viewport 	= props.viewport.element(),
			display 	= props.display,
			px_per_ms 	= display.px_per_ms,
			delta_x 	= e.pageX - state.origin_x, //TODO - CHANGE TO left max distance
			delta_y 	= e.pageY - state.origin_y - state.offset_y,
			yCurPos 	= e.pageY - props.iscroll.grid.y - viewport.offset().top,
			xCurPos 	= e.pageX - props.iscroll.grid.x - viewport.offset().left, 
			adj_height 	= display.row_height + display.row_height_margin,
			x_origin 	= (display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
			fifteenMin	= 900000,
			colNumber	= Math.floor(xCurPos / display.px_per_int),
			rowNumber 	= Math.floor(yCurPos / adj_height),
			model;		

		if(!props.edit.active && !props.edit.passive){
			return;
		}

		if(props.edit.active && (props.data.key != props.currentDragItem.key)){
			return;
		}
		
		if(props.currentDragItem.reservation_status !== 'check-in'){
			return;
		}

		if(colNumber < 0 || colNumber/4 > display.hours || rowNumber < 0 || rowNumber > (display.total_rows-1)){
			return;
		}
		if(!state.dragging && (Math.abs(delta_x) + Math.abs(delta_y) > 10)) {
			model = this._update(props.currentDragItem); 

			this.setState({
				dragging: true,
				currentDragItem: model,
			}, function() {
				props.__onDragStart(props.row_data, model);
			});
		} else if(state.dragging) {	
			model = (props.currentDragItem),
					scroller = props.iscroll.grid;
	 		xScPos 	 = scroller.x;
	 		yScPos	 = scroller.y;

	 		/* sroll_beyond_edge : Possible values
	 		0 : None
	 		1 : Right
	 		2 : Left
	 		*/
	 		var scroll_beyond_edge = 0, width_of_res;
	 		width_of_res = (model.departure - model.arrival) * display.px_per_ms;
	 		
			//towards right
			if(e.pageX > state.origin_x) {
				if((e.pageX + width_of_res) > window.innerWidth && (display.x_p - model.departure) > 0) {
					if((xScPos - width_of_res) < scroller.maxScrollX) {
						xScPos = scroller.maxScrollX;
					}
					else{
						xScPos -=  width_of_res;
					}					
					scroll_beyond_edge = 1;
				}
			}

			//towards left
			else if(e.pageX < state.origin_x) {
				if((e.pageX - width_of_res) < viewport.offset().left && (model.arrival - display.x_n) > 0) {
					if((xScPos + width_of_res) < 0) {
						xScPos = 0;
					}
					else{
						xScPos +=  width_of_res;
					}
					scroll_beyond_edge = 2;
				}
			}
			
			//towards bottom
			if(e.pageY > state.origin_y) {
				if((e.pageY + display.row_height) > window.innerHeight) {
					if((yScPos - display.row_height) < scroller.maxScrollY) {
						yScPos = scroller.maxScrollY;
					}
					else{
						yScPos -=  display.row_height;
					}					
					scroll_beyond_edge = 3;
				}
			}
			//towards bottom
			else if(e.pageY < state.origin_y) {
				if((e.pageY - display.row_height) < viewport.offset().top) {
					if((yScPos + display.row_height) > 0) {
						yScPos = 0;
					}
					else{
						yScPos +=  display.row_height;
					}					
					scroll_beyond_edge = 4;
				}
			}
			if(scroller.maxScrollX <= xScPos &&  xScPos <= 0 &&  
				scroller.maxScrollY <= yScPos && yScPos <= 0) {
				
				scroller.scrollTo(xScPos, yScPos, 0);				
				//setTimeout(function(){
					scroller._scrollFn();
				//}, 50)
			}
	 		
			var cLeft = colNumber * display.px_per_int, top = rowNumber * (display.row_height) + display.row_height_margin;
			var cFactor = (state.element_x + delta_x);
			var left = cFactor = cLeft;
			//var left = ((cFactor) / display.px_per_int).toFixed() * display.px_per_int;
		
			if (scroll_beyond_edge === 1){
				left = cLeft - display.px_per_hr;
				cFactor = left;
			}
			else if (scroll_beyond_edge === 2){
				left = cLeft + display.px_per_hr - display.x_0;
				cFactor = left;
			}

			var commonFactor= ((((cFactor) / px_per_ms) + x_origin) / fifteenMin).toFixed(0),
				newArrival  = (commonFactor * fifteenMin);			
			
			var diff = newArrival - model.arrival;			
			model.arrival = newArrival;
			model.departure = model.departure + diff;

			this.setState({
				currentResizeItem: 	model,
				resizing: true			
			}, function() {
				props.__onResizeCommand(model);
			});			
			console.log('mouse move: ' + left);
			this.setState({
				//left: ((state.element_x + delta_x - state.offset_x) / display.px_per_int).toFixed() * display.px_per_int, 
				left: left, 
				//top: ((state.element_y + delta_y) / adj_height).toFixed() * adj_height
				top: top
			});
		}
	},
	__onMouseUp: function(e) {
		
		var state = this.state, 
			props = this.props,
			item = this.state.currentDragItem,
			display = 				props.display,
			delta_x = e.pageX - state.origin_x,
			x_origin = 				(display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
			px_per_int = 			display.px_per_int,
			px_per_ms = 			display.px_per_ms;
		document.removeEventListener('mouseup', this.__onMouseUp);
		document.removeEventListener('mousemove', this.__dbMouseMove);
		var page_offset = this.getDOMNode().getBoundingClientRect();
		
		e.stopPropagation();
		e.preventDefault();
		/*if(!props.edit.active && !props.edit.passive){
			return;
		}*/

		if(state.dragging && props.edit.active && (props.data.key != props.currentDragItem.key)){
			console.log('hey am here');
			return;
		}
		
		if(state.dragging) {
			console.log('mouse up: ' + state.left);
			this.setState({
				dragging: false,
				currentDragItem: undefined,
				left: state.left,
				top: state.top
			}, function() {
				
				props.iscroll.grid.enable();
				
				var prevArrival = item.arrival,
					fifteenMin	= 900000,
					commonFactor= ((((state.element_x + delta_x) / px_per_ms) + x_origin) / fifteenMin),
					newArrival  = commonFactor * fifteenMin,
					ceiled 		= Math.ceil(commonFactor) * fifteenMin,
					floored 	= Math.floor(commonFactor) * fifteenMin,
					diffC_NA	= Math.abs(ceiled - newArrival), //diff b/w ceiled & new Arrival,
					diffF_NA	= Math.abs(floored - newArrival); //diff b/w floored & new Arrival,

					
				if(newArrival - prevArrival <= 300000 && newArrival - prevArrival >= 0){	
					arrival = item.arrival;
				}
				else if(diffC_NA < diffF_NA){
					arrival = ceiled;
				}
				else if(diffC_NA > diffF_NA){
					arrival = floored;
				}				
				

				item.arrival = arrival;
				var diff = item.arrival - prevArrival;
				item.departure = item.departure + diff;				
				props.__onDragStop(e, state.left, state.top, item);				
				
			});
		} else if(this.state.mouse_down) {

			this.setState({
				mouse_down: false,
				selected: !state.selected
			}, function() {
				//var data = (props.edit.passive && props.data[props.meta.id] === props.data[props.meta.id]? props.currentDragItem : props.data);
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
		this.getDOMNode().addEventListener('mousedown', this.__onMouseDown);
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

		return this.transferPropsTo(React.DOM.div({
			style:       style,
			className:   props.className + className,
			children:    props.children,
			
		}));
	}
});