React.initializeTouchEvents(true);

var DiaryContent = React.createClass({
	_recalculateGridSize: function() {
		var display = _.extend({}, this.state.display),
			viewport = _.extend({}, this.state.viewport);

		viewport.width = $(window).width() - 120;
		viewport.height = $(window).height() - 230;

		display.width 		= display.hours / viewport.hours * viewport.width;
		display.px_per_hr 	= viewport.width / viewport.hours;
		display.px_per_int 	= display.px_per_hr / display.intervals_per_hour;
		display.px_per_ms 	= display.px_per_int / 900000;

		this.setState({
			viewport: viewport,
			display: display
		});
	},
	__toggleRows: function(state) {
		var scroll_pos = this.state.iscroll.grid.x / this.state.display.px_per_ms + this.state.display.x_origin;

		this.state.angular_evt.toggleRows(state, scroll_pos);	
	},
	__onGridScroll: function(iscroll_object) {
		try{
			var el = iscroll_object, iscroll = this.state.iscroll;

			if(el) {
				switch(el) {
					case iscroll.grid:
						iscroll.timeline.scrollTo(el.x, 0);
						iscroll.rooms.scrollTo(0, el.y);
					break;
					case iscroll.timeline:
						iscroll.grid.scrollTo(el.x, iscroll.grid.y);
					break;
					case iscroll.rooms:
						iscroll.grid.scrollTo(iscroll.grid.x, el.y);
					break;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},
	__onDragStart: function(row_data, row_item_data) {
		this.state.angular_evt.onDragStart.apply(this, Array.prototype.slice.call(arguments));
	},
	__onDragStop: function(e, left, row_item_data) {
		var state 			= this.state,
			rowHeight 		= state.display.row_height + state.display.row_height_margin,
			viewport 		= state.viewport.element(),
			curPos 			= viewport[0].scrollTop + e.pageY - viewport.offset().top - state.iscroll.grid.y,
			rowNumber 		= (curPos / rowHeight).toFixed(),
			row_data 		= state.data[rowNumber],
			//row_item_data 	= this._update(this.state.currentDragItem),
			start_time_ms 	= (left / state.display.px_per_ms) + state.display.x_origin,
			delta 			= start_time_ms - row_item_data.start_date.getTime();

		row_item_data.start_date = new Date(start_time_ms);
		row_item_data.end_date 	= new Date(row_item_data.end_date.getTime() + delta);

		this.state.angular_evt.onDragEnd(row_data, row_item_data);
		
	},
	/*Message transport between timeline and grid:
	  As resize controls are arranged on timeline, the positional data
	  is passed via this command, then a property update is initiated with a
	  deep copy clone of the position state from the timeline.  This update
	  propagates down the component tree and is available for rendering update
	  by the grid row item.
	*/
	__onResizeCommand: function(row_item_data) {
		this.setProps({
			currentResizeItem: row_item_data
		});
	},
	__onResizeLeftStart: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeLeftStart.apply(this, Array.prototype.slice.call(arguments));
	},
	__onResizeLeftEnd: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeLeftEnd.apply(this, Array.prototype.slice.call(arguments));

		this.setProps({
			currentResizeItem: undefined
		});
	},
	__onResizeRightStart: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeRightStart.apply(this, Array.prototype.slice.call(arguments));
	},
	__onResizeRightEnd: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeRightEnd.apply(this, Array.prototype.slice.call(arguments));

		this.setProps({
			currentResizeItem: undefined
		});
	},	
	componentDidMount: function() {
		var self = this;

    	$(window).on('resize', _.debounce(function(e) {
    		this._recalculateGridSize();
    	}.bind(this), 50));
  	},
  	componentWillUnmount: function() {
  		$(window).off('resize');
  	},
  	componentWillMount: function() {
  		var self = this;

    	for(var k in this.state.iscroll) {
    		if(Object.prototype.hasOwnProperty.call(this.state.iscroll, k)) {
    			if(this.state.iscroll[k] instanceof IScroll) {
    				setTimeout(function () {
    					self.state.iscroll[k].refresh(); 
    				}, 0);
    			}
    		}
    	}
  	},
  	componentWillReceiveProps: function(nextProps) {
  		if(this.props.viewport !== nextProps.viewport ||
  		   this.props.display !== nextProps.display ||
  		   this.props.filter !== nextProps.filter) {

  			this.setState({
  				display: nextProps.display,
  				viewport: nextProps.viewport,
  				filter: nextProps.filter
  			});
  		}
  	},
	getInitialState: function() {
		var props 		= this.props,
			scope 		= props.scope,
			viewport 	= scope.gridProps.viewport,
			display 	= scope.gridProps.display,
			s_0 		= {
							angular_evt: {
								onSelect: 					scope.onSelect,
								onRowItemSelect: 			scope.onRowItemSelect,
								onRowSelect: 				scope.onRowSelect,
								onTimelineSelect:  			scope.onTimelineSelect,
								isSelected: 				scope.isSelected,
								isAvailable:                scope.isAvailable,
								toggleRows:                 scope.toggleRows,
								displayFilter: 				scope.displayFilter,
								calculateOccupancy:    		scope.calculateOccupancy, 
								onDragStart: 				scope.onDragStart,
								onDragEnd: 					scope.onDragEnd,
								onResizeLeftStart: 			scope.onResizeLeftStart,
								onResizeLeftEnd: 			scope.onResizeLeftEnd,
								onResizeRightStart: 		scope.onResizeRightStart,
								onResizeRightEnd: 			scope.onResizeRightEnd,
								onScrollLoadTriggerRight: 	scope.onScrollLoadTriggerRight,
								onScrollLoadTriggerLeft: 	scope.onScrollLoadTriggerLeft
							},
							currentDragItem: props.currentDragItem,
							currentResizeItem: props.currentResizeItem,
							iscroll: {
				  				timeline: undefined,
				  				rooms: undefined,
				  				grid: undefined
				  			}
						};
		
		display.width 				= display.hours / viewport.hours * viewport.width;
		display.height 				= '100%';
		display.px_per_hr 			= viewport.width / viewport.hours;
		display.px_per_int  		= display.px_per_hr / display.intervals_per_hour;
		display.px_per_ms 			= display.px_per_int / 900000;
		display.x_0 				= viewport.row_header_right;
		display.x_origin 			= scope.start_date.getTime();
		display.x_origin_start_time = scope.start_time;

		return _.extend(s_0, scope.gridProps);
	},
	render: function() {
		var self = this;

		return this.transferPropsTo(React.DOM.div({
			className: 'diary-container ' + ((this.state.viewport.hours === 12) ? 'hours-12' : 'hours-24')
		},
		TogglePanel({
			__toggleRows:  self.__toggleRows
		}),
		RoomPanel({
			refs: 			'rooms',
			viewport: 		this.state.viewport,
			display: 		this.state.display,
			data: 			this.state.data,
			filter: 		this.state.filter,
			iscroll: 		this.state.iscroll,
			__onGridScroll: self.__onGridScroll
		}),
		TimelinePanel({
			refs: 				'timeline',
			viewport: 			this.state.viewport,
			display: 			this.state.display,
			data: 				this.state.data,
			filter: 			this.state.filter,
			iscroll: 			this.state.iscroll,
			currentResizeItem: 	this.props.currentResizeItem,
			angular_evt: 		this.state.angular_evt,
			__onResizeCommand: 	self.__onResizeCommand,
			__onResizeLeftStart:self.__onResizeLeftStart,
			__onResizeLeftEnd:  self.__onResizeLeftEnd,
			__onResizeRightStart:self.__onResizeRightStart,
			__onResizeRightEnd: self.__onResizeRightEnd, 
			__onGridScroll: 	self.__onGridScroll
		}), 
		GridPanel({
			refs: 				'grid',
			viewport: 			this.state.viewport,
			display: 			this.state.display,
			filter: 			this.state.filter,
			iscroll: 			this.state.iscroll,
			data: 				this.state.data,
			currentResizeItem: 	this.props.currentResizeItem,
			//currentDragItem:    this.state.currentDragItem, 
			angular_evt: 		this.state.angular_evt,
			__onGridScroll: 	self.__onGridScroll,
			__onDragStart: 		self.__onDragStart,
			__onDragStop: 		self.__onDragStop	
		})), this.props.children);
	}
});