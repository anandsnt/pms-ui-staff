React.initializeTouchEvents(true);

var DiaryContent = React.createClass({
	_recalculateGridSize: function() {
		var display = _.extend({}, this.state.display),
			viewport = _.extend({}, this.state.viewport);

		viewport.width = $(window).width() - 120;
		viewport.height = $(window).height() - 230;

		if(viewport.width !== this.state.viewport.width ||
		   viewport.height !== this.state.viewport.height) {
			display.width 		= display.hours / viewport.hours * viewport.width;
			display.px_per_hr 	= viewport.width / viewport.hours;
			display.px_per_int 	= display.px_per_hr / display.intervals_per_hour;
			display.px_per_ms 	= display.px_per_int / 900000;

			this.setState({
				viewport: viewport,
				display: display
			});
		}
	},
	__toggleRows: function(state) {
		this.state.angular_evt.toggleRows(state, Math.abs(this.state.iscroll.grid.x) / this.state.display.px_per_ms + this.state.display.x_origin);	
	},
	__onGridScrollStart: function(iscroll_object) {

	},
	__onGridScrollEnd: function(iscroll_object) {
		this.state.angular_evt.onScrollEnd(Math.abs(this.state.iscroll.grid.x) / this.state.display.px_per_ms + this.state.display.x_origin);	
	},
	__onGridScroll: function(iscroll_object) {		
		var el = iscroll_object, iscroll = this.state.iscroll;

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
 
	},
	__onDragStart: function(row_data, row_item_data) {
		this.state.angular_evt.onDragStart.apply(this, Array.prototype.slice.call(arguments));
	},
	__onDragStop: function(e, left, row_item_data) {
		var state 			= this.state,
			rowHeight 		= state.display.row_height + state.display.row_height_margin,
			viewport 		= state.viewport.element(),
			curPos 			= e.pageY - viewport.offset().top - state.iscroll.grid.y, //viewport[0].scrollTop + e.pageY - viewport.offset().top - state.iscroll.grid.y,
			rowNumber 		= (curPos / rowHeight).toFixed(),
			row_data 		= state.data[rowNumber],
			delta 			= Number((left - row_item_data.left).toFixed(3));

		if(rowNumber * (state.display.row_height + state.display.row_height_margin) < e.pageY) {
			rowNumber++;
		}
		
		row_item_data.left = left;
		row_item_data.right = row_item_data.right + delta;

		row_item_data.start_date = row_item_data.left / state.display.px_per_ms + state.display.x_origin;
		row_item_data.end_date = row_item_data.right / state.display.px_per_ms + state.display.x_origin;

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
	__onResizeStart: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeStart.apply(this, Array.prototype.slice.call(arguments));
	},
	__onResizeEnd: function(row_data, row_item_data) {
		this.state.angular_evt.onResizeEnd.apply(this, Array.prototype.slice.call(arguments));

		this.setProps({
			currentResizeItem: row_item_data,
			currentResizeItemRow: row_data
		});
	},
	componentDidMount: function() {
		var self = this;

    	$(window).on('resize', _.throttle(function(e) {
    		this._recalculateGridSize();
    	}.bind(this), 10, { leading: false, trailing: true }));
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
  		var hops = Object.prototype.hasOwnProperty;
  		/*if(this.props.viewport !== nextProps.viewport ||
  		   this.props.display !== nextProps.display ||
  		   this.props.filter !== nextProps.filter ||
  		   this.props.edit !== nextProps.edit) {

  			this.setState({
  				display: nextProps.display,
  				viewport: nextProps.viewport,
  				filter: nextProps.filter,
  				edit: nextProps.edit
  			});
  		}*/

  		if(hops.call(this.props, 'viewport') && this.props.viewport !== nextProps.viewport) {
  			this.setState({
  				viewport: nextProps.viewport
  			});
  		}

  		if(hops.call(this.props, 'display') && this.props.display !== nextProps.display) {
  			this.setState({
  				display: nextProps.display
  			});
  		}

  		if(hops.call(this.props, 'filter') && this.props.filter !== nextProps.filter ) {
  			this.setState({
  				filter: nextProps.filter
  			});
  		}

  		if(hops.call(this.props, 'edit') && this.props.edit !== nextProps.edit) {
  			this.setState({
  				edit: nextProps.edit
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
								isSelected: 				scope.isSelected,
								isAvailable:                scope.isAvailable,
								isDraggable:                scope.isDraggable,
								isResizable:                scope.isResizable,
								toggleRows:                 scope.toggleRows,
								displayFilter: 				scope.displayFilter,
								calculateOccupancy:    		scope.calculateOccupancy, 
								onDragStart: 				scope.onDragStart,
								onDragEnd: 					scope.onDragEnd,
								onResizeStart: 				scope.onResizeStart,
								onResizeEnd: 				scope.onResizeEnd,
								onScrollEnd:                scope.onScrollEnd, 
								onScrollLoadTriggerRight: 	scope.onScrollLoadTriggerRight,
								onScrollLoadTriggerLeft: 	scope.onScrollLoadTriggerLeft
							},
							currentDragItem: props.currentDragItem,
							currentResizeItem: props.currentResizeItem,
							edit: {
								active: false,
								originalItem: undefined,
								originalRowItem: undefined
							},
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
			className: 'diary-container ' + ((this.state.viewport.hours === 12) ? 'hours-12' : 'hours-24') + (this.props.currentResizeItem ? ' editing' : '')
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
			__onGridScroll: self.__onGridScroll,
			__onGridScrollEnd: 	self.__onGridScrollEnd
		}),
		TimelinePanel({
			refs: 				'timeline',
			viewport: 			this.state.viewport,
			display: 			this.state.display,
			data: 				this.state.data,
			filter: 			this.state.filter,
			edit: 				this.state.edit,
			iscroll: 			this.state.iscroll,
			currentResizeItem: 	this.props.currentResizeItem,
			angular_evt: 		this.state.angular_evt,
			__onResizeCommand: 	self.__onResizeCommand,
			__onResizeStart:    self.__onResizeStart,
			__onResizeEnd:  	self.__onResizeEnd,
			__onGridScroll: 	self.__onGridScroll,
			__onGridScrollEnd: 	self.__onGridScrollEnd
		}), 
		GridPanel({
			refs: 				'grid',
			viewport: 			this.state.viewport,
			display: 			this.state.display,
			filter: 			this.state.filter,
			edit:               this.state.edit,
			iscroll: 			this.state.iscroll,
			data: 				this.state.data,
			currentResizeItem: 	this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow,
			angular_evt: 		this.state.angular_evt,
			__onGridScroll: 	self.__onGridScroll,
			__onGridScrollEnd: 	self.__onGridScrollEnd,
			__onDragStart: 		self.__onDragStart,
			__onDragStop: 		self.__onDragStop	
		})), this.props.children);
	}
});