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
			},function() {
                console.log(display);
            });  
            //, function() {
                //this.state.iscroll.grid.scrollTo((display.x_origin - display.x_n) * display.px_per_ms, this.state.iscroll.grid.y);
                //this.state.iscroll.timeline.scrollTo((display.x_origin - display.x_n) * display.px_per_ms, 0);
            //});
		}
	},
	__toggleRows: function(state) {
		this.state.angular_evt.toggleRows(state, Math.abs(this.state.iscroll.grid.x) / this.state.display.px_per_ms + this.state.display.x_n); //.x_origin);	
	},
	__onGridScrollStart: function(iscroll_object) {

	},
	__onGridScrollEnd: function(iscroll_object) {
		this.state.angular_evt.onScrollEnd(Math.abs(this.state.iscroll.grid.x) / this.state.display.px_per_ms + this.state.display.x_n); //x_origin);	
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

		row_item_data.start_date = row_item_data.left / state.display.px_per_ms + state.display.x_n; //.x_origin;
		row_item_data.end_date = row_item_data.right / state.display.px_per_ms + state.display.x_n; //.x_origin;

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
		//if(_.isObject(row_item_data)) {
			this.setProps({
				currentResizeItem: row_item_data
			});
		//} else if( _.isArray(row_item_data)) {

		//}
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
		var self = this,
            state = this.state;

    	$(window).on('resize', _.throttle(function(e) {
    		this._recalculateGridSize();
            this.componentWillMount();
    	}.bind(this), 10, { leading: false, trailing: true }));

        setTimeout(function() {
            self.state.iscroll.grid.scrollTo(-(self.state.display.x_origin - self.state.display.x_n) * self.state.display.px_per_ms, 0, 0, 1000);
            self.state.iscroll.timeline.scrollTo(-(self.state.display.x_origin - self.state.display.x_n) * self.state.display.px_per_ms, 0, 0, 1000);
        }, 1000);
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
			filter      = scope.gridProps.filter,
			s_0 		= {
							angular_evt: {
								onSelect: 					scope.onSelect,
								isSelected: 				scope.isSelected,
								isAvailable:                scope.isAvailable,
								isDraggable:                scope.isDraggable,
								isResizable:                scope.isResizable,
								toggleRows:                 scope.toggleRows,
								displayFilter: 				scope.displayFilter,
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
							currentResizeItems: props.currentResizeItems,
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
		//display.x_origin 			= filter.arrival_date.getTime();
        display.x_origin_start_time = filter.arrival_time;
        display.scrollTo            = (display.x_origin - display.x_n) * display.px_per_ms;

		return _.extend(s_0, scope.gridProps);
	},
	render: function() {
		var self = this,
			props = this.props,
			state = this.state;

		return this.transferPropsTo(React.DOM.div({
			className: 'diary-container ' + ((state.viewport.hours === 12) ? 'hours-12' : 'hours-24') + /*(props.currentResizeItem*/ (state.edit.active ? ' editing' : '')
		},
		TogglePanel({
			__toggleRows:  		self.__toggleRows
		}),
		RoomPanel({
			refs: 				'rooms',
			viewport: 			state.viewport,
			display: 			state.display,
			meta:           	state.meta,
			data: 				state.data,
			filter: 			state.filter,
			iscroll: 			state.iscroll,
			__onGridScroll: 	self.__onGridScroll,
			__onGridScrollEnd: 	self.__onGridScrollEnd
		}),
		TimelinePanel({
			refs: 				'timeline',
			viewport: 			state.viewport,
			display: 			state.display,
			data: 				state.data,
            stats:              state.stats,
			meta:               state.meta,
			filter: 			state.filter,
			edit: 				state.edit,
			iscroll: 			state.iscroll,
			currentResizeItem: 	props.currentResizeItem,
			angular_evt: 		state.angular_evt,
			__onResizeCommand: 	self.__onResizeCommand,
			__onResizeStart:    self.__onResizeStart,
			__onResizeEnd:  	self.__onResizeEnd,
			__onGridScroll: 	self.__onGridScroll,
			__onGridScrollEnd: 	self.__onGridScrollEnd
		}), 
		GridPanel({
			refs: 					'grid',
			viewport: 				state.viewport,
			display: 				state.display,
			filter: 				state.filter,
			edit:               	state.edit,
			iscroll: 				state.iscroll,
			meta:               	state.meta,
			data: 					state.data,
			currentResizeItem: 		props.currentResizeItem,
			currentResizeItemRow: 	props.currentResizeItemRow,
			angular_evt: 			state.angular_evt,
			__onGridScroll: 		self.__onGridScroll,
			__onGridScrollEnd: 		self.__onGridScrollEnd,
			__onDragStart: 			self.__onDragStart,
			__onDragStop: 			self.__onDragStop	
		})), this.props.children);
	}
});
