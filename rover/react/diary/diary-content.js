var DiaryContent, SETTINGS = {
	viewport: {
		width: 1024,
		height: 768,
		row_header_width: 120,  //Relative starting point for left edge of grid
		timeline_header_height: 80,
		timeline_height: 60,
		timeline_occupancy_height: 20,
		hours: 12
	},				
	display: {
		width: undefined,
		height: '100%',
		hours: 48,
		row_height: 60,
		intervals_per_hour: 4, 
		px_per_ms: undefined,
		px_per_int: undefined,
		maintenance_int: 2
	},
	filter: {
		types: ['room', 'rate_type', 'start_time', 'status']
	}
};

DiaryContent = React.createClass({
	roomsPanelEl: undefined,
	timelinePanelEl: undefined,
	_recalculateGridSize: function() {
		var display_width,
			px_per_hr,
			px_per_int,
			px_per_ms,
			vw_width,
			vw_height;

		vw_width = $(window).width() - 120;
		vw_height = $(window).height() - 230;

		display_width = this.props.display.hours / this.props.viewport.hours * vw_width;
		px_per_hr = vw_width / this.props.viewport.hours;
		px_per_int = px_per_hr / this.props.display.intervals_per_hour;
		px_per_ms = px_per_int / 900000;

		this.setState({
			viewport: {
				width: vw_width,
				height: vw_height
			},
			display: {
				width: display_width,
				px_per_hr: px_per_hr,
				px_per_int: px_per_int,
				px_per_ms: px_per_ms
			}
		});
	},
	__onGridScroll: function(e) {
		var el = e.currentTarget;

		if(el) {
			$('.diary-timeline .wrapper').css({ 'left': -el.scrollLeft + 'px'});
			$('.diary-rooms .wrapper').css({ 'top': -el.scrollTop + 'px'});
		}
	},
	componentDidMount: function() {
		this.roomsPanelEl = $('.diary-rooms .wrapper');
		this.timelinePanelEl = $('.diary-timeline .wrapper');
    	//this.__onGridScroll = _.debounce(this.__onGridScroll.bind(this), 100);

    	$(window).on('resize', _.debounce(function(e) {
    		this._recalculateGridSize();
    	}.bind(this), 50));
  	},
  	componentWillUnmount: function() {
  		$(window).off('resize');
  	},
	getDefaultProps: function() {
		var viewport = SETTINGS.viewport,
			display = SETTINGS.display;

		return { 
			viewport: viewport, 
			display: display, 
			data: [],
			filter: undefined 
		};
	},
	getInitialState: function() {
		var props = this.props,
			scope = props.scope,
			initial_state = {
				display: {
					x_0: props.viewport.row_header_width,
					x_origin: scope.start_date.getTime(),
					x_origin_start_time: scope.start_time
				},
				viewport: {
					width: scope.grid_dimensions.width,
					height: scope.grid_dimensions.height,
					element: scope.grid_element
				},
				data: scope.data,
				new_reservation_time_span: scope.new_reservation_time_span,
				angular_evt: {
					onSelect: scope.onSelect,
					isSelected: scope.isSelected,
					displayFilter: scope.displayFilter,
					onDragStart: scope.onDragStart,
					onDragEnd: scope.onDragEnd,
					onResizeStart: scope.onResizeStart,
					onResizeEnd: scope.onResizeEnd,
					onScrollLoadTriggerRight: scope.onScrollLoadTriggerRight,
					onScrollLoadTriggerLeft: scope.onScrollLoadTriggerLeft
				},
				filter: scope.filter,
				currentDragItem: undefined,
				currentResizeItem: undefined
			};
		
		initial_state.display.width 		= props.display.hours / props.viewport.hours * initial_state.viewport.width;
		initial_state.display.px_per_hr 	= initial_state.viewport.width / props.viewport.hours;
		initial_state.display.px_per_int  	= initial_state.display.px_per_hr / props.display.intervals_per_hour;
		initial_state.display.px_per_ms 	= initial_state.display.px_per_int / 900000;

		return initial_state;
	},
	render: function() {
		var self = this;

		_.extend(this.props.viewport, this.state.viewport);
		_.extend(this.props.display, this.state.display);

		return this.transferPropsTo(React.DOM.div({
			className: 'diary-container hours-12'
		},
		TogglePanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			filter: this.state.filter,
		}),
		RoomPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			filter: this.state.filter,
			__onGridScroll: self.__onGridScroll
		}),
		TimelinePanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			filter: this.state.filter,
			angular_evt: this.state.angular_evt,
			__onGridScroll: self.__onGridScroll
		}), 
		GridPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			filter: this.state.filter,
			data: this.state.data,
			angular_evt: this.state.angular_evt,
			__onGridScroll: self.__onGridScroll
		})), this.props.children);
	}
});