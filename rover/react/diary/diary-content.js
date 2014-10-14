React.initializeTouchEvents(true);

var DiaryContent = React.createClass({
	_recalculateGridSize: function() {
		var display = this.state.display,
			viewport = this.state.viewport;

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
	__onGridScroll: function(component) {
		try{
			var el = $(component.getDOMNode().children[0]);

			if(el) {
				this.state.iscroll.timeline.scrollTo(this.state.iscroll.grid.x, 0);
				this.state.iscroll.rooms.scrollTo(0, -this.state.iscroll.grid.y);
			}
		} catch(e) {
			console.log(e);
		}
	},
	__onResizeCommand: function(row_item_data) {
		var copy = {};

		copy = _.extend(copy, row_item_data);

		copy.start_date = new Date(copy.start_date.getTime());
		copy.end_date = new Date(copy.end_date.getTime());		

		this.setProps({
			//resizing: true,
			currentResizeItem: copy
		});
	},
	__onResizeStart: function(row_data, row_item_data) {
		console.log('Resize start:', row_data, row_item_data);
	},
	__onResizeEnd: function(row_item_data) {
		this.setState({
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
  	shouldComponentUpdate: function(nextProps, nextState) {
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

    	return true;
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
			viewport: this.state.viewport,
			display: this.state.display,
			data: this.state.data,
			filter: this.state.filter,
		}),
		RoomPanel({
			refs: 'rooms',
			viewport: this.state.viewport,
			display: this.state.display,
			data: this.state.data,
			filter: this.state.filter,
			iscroll: this.state.iscroll,
			__onGridScroll: self.__onGridScroll
		}),
		TimelinePanel({
			refs: 'timeline',
			viewport: this.state.viewport,
			display: this.state.display,
			data: this.state.data,
			filter: this.state.filter,
			iscroll: this.state.iscroll,
			currentResizeItem: this.props.currentResizeItem,
			angular_evt: this.state.angular_evt,
			__onResizeCommand: self.__onResizeCommand,
			__onGridScroll: self.__onGridScroll
		}), 
		GridPanel({
			refs: 'grid',
			viewport: this.state.viewport,
			display: this.state.display,
			filter: this.state.filter,
			iscroll: this.state.iscroll,
			data: this.state.data,
			currentResizeItem: this.props.currentResizeItem,
			angular_evt: this.state.angular_evt,
			//__dispatchResizeCommand: this.dispatchResizeCommand,
			__onGridScroll: self.__onGridScroll
		})), this.props.children);
	}
});