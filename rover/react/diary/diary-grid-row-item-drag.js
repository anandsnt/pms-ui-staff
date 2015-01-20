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
		var page_offset, el, props = this.props, state = this.state;
		
		e.stopPropagation();
		e.preventDefault();			
		if(e.button === 0) {
			document.addEventListener('mouseup', this.__onMouseUp);
			document.addEventListener('mousemove', this.__dbMouseMove);

			page_offset = this.getDOMNode().getBoundingClientRect();
			
			el = props.viewport.element();

			
			this.setState({
				left: page_offset.left  - el.offset().left - el.parent()[0].scrollLeft,
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
			xCurPos 	= e.pageX - props.iscroll.grid.x - viewport.offset().left, 
			adj_height 	= display.row_height + display.row_height_margin,
			x_origin 	= (display.x_n instanceof Date ? display.x_n.getTime() : display.x_n), 
			fifteenMin	= 900000,
			colNumber	= Math.floor(xCurPos / display.px_per_int),
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

		scroller = props.iscroll.grid;
 		xScPos 	 = scroller.x;
 		yScPos	 = scroller.y;

 		/* sroll_beyond_edge : Possible values
 		0 : None
 		1 : Right
 		2 : Left
 		*/
 		var scroll_beyond_edge = 0;
		//towards right
		if(e.pageX > state.origin_x) {
			if((e.pageX + display.px_per_hr) > window.innerWidth) {
				xScPos -=  display.px_per_hr;
				scroll_beyond_edge = 1;
			}
		}

		//towards left
		else if(e.pageX < state.origin_x) {
			if((e.pageX - display.px_per_hr) < viewport.offset().left) {
				xScPos +=  display.px_per_hr;
				scroll_beyond_edge = 2;
			}
		}
		scroller.scrollTo(xScPos, yScPos);
 		scroller._scrollFn();

		if(!state.dragging && (Math.abs(delta_x) + Math.abs(delta_y) > 10)) {
			model = this._update(props.currentDragItem); 

			this.setState({
				dragging: true,
				currentDragItem: model,
			}, function() {
				props.__onDragStart(props.row_data, model);
			});
		} else if(state.dragging) {	
			model = (props.currentDragItem);
			var cLeft = colNumber * display.px_per_int;
			var cFactor = (state.element_x + delta_x);
			var left = ((cFactor) / display.px_per_int).toFixed() * display.px_per_int;
			console.log("cLeft : " + cLeft +  " colNumber : " + colNumber +  " xCurPos" + xCurPos + " element_x: " + state.element_x + " left: "+ left + " diff: " +  (cLeft - left));

			console.log(display.px_per_hr);
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

			this.setState({
				//left: ((state.element_x + delta_x - state.offset_x) / display.px_per_int).toFixed() * display.px_per_int, 
				left: left, 
				top: ((state.element_y + delta_y) / adj_height).toFixed() * adj_height
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
			return;
		}
		
		if(state.dragging) {
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