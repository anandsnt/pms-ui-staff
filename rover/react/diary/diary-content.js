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
	__onGridScroll: function(e) {
		var el = e.currentTarget;

		if(el) {
			$('.diary-timeline').css({ 'left': -el.scrollLeft + 120 + 'px'});
			$('.diary-rooms').css({ 'top': -el.scrollTop + 90 + 'px'});
		}
	},
	componentDidMount: function() {
    	$(window).on('resize', _.debounce(function(e) {
    		this._recalculateGridSize();
    	}.bind(this), 50));
  	},
  	componentWillUnmount: function() {
  		$(window).off('resize');
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
								onDragStart: 				scope.onDragStart,
								onDragEnd: 					scope.onDragEnd,
								onResizeLeftStart: 			scope.onResizeLeftStart,
								onResizeLeftEnd: 			scope.onResizeLeftEnd,
								onResizeRightStart: 		scope.onResizeRightStart,
								onResizeRightEnd: 			scope.onResizeRightEnd,
								onScrollLoadTriggerRight: 	scope.onScrollLoadTriggerRight,
								onScrollLoadTriggerLeft: 	scope.onScrollLoadTriggerLeft
							},
							currentDragItem: undefined,
							currentResizeItem: undefined
						};
		
		display.width 				= display.hours / viewport.hours * viewport.width;
		display.height 				= '100%';
		display.px_per_hr 			= viewport.width / viewport.hours;
		display.px_per_int  		= display.px_per_hr / display.intervals_per_hour;
		display.px_per_ms 			= display.px_per_int / 900000;
		display.x_0 				= viewport.row_header_right;
		display.x_origin 			= scope.start_date.getTime(),
		display.x_origin_start_time = scope.start_time

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
			viewport: this.state.viewport,
			display: this.state.display,
			data: this.state.data,
			filter: this.state.filter,
			__onGridScroll: this.__onGridScroll
		}),
		TimelinePanel({
			viewport: this.state.viewport,
			display: this.state.display,
			data: this.state.data,
			filter: this.state.filter,
			angular_evt: this.state.angular_evt,
			__onGridScroll: this.__onGridScroll
		}), 
		GridPanel({
			viewport: this.state.viewport,
			display: this.state.display,
			filter: this.state.filter,
			data: this.state.data,
			angular_evt: this.state.angular_evt,
			__onGridScroll: this.__onGridScroll
		})), this.props.children);
	}
});