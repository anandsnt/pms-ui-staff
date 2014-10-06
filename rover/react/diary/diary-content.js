var DiaryContent, SETTINGS = {
	viewport: {
		width: 1024,
		height: 768,
		row_header_width: 120,  //Relative starting point for left edge of grid
		timeline_header_height: 80,
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
    	this.__onGridScroll = _.debounce(this.__onGridScroll, 100);
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
					x_scroll_delta: 0,
					y_scroll_delta: 0,
					x_scroll_offset: 0,
					y_scroll_offset: 0, //AKA Y OFFSET FROM ROOT TOP OF GRID
					y_rel_load_trigger_right: undefined,
					y_rel_load_trigger_left: undefined,
					x_0: props.viewport.row_header_width,
					x_origin: scope.start_date.getTime(),
					x_origin_start_time: scope.start_time
				},
				viewport: {
					width: scope.grid_dimensions.width,
					height: scope.grid_dimensions.height
				},
				data: scope.data,
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
			data: this.state.data
		}),
		RoomPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			__onGridScroll: self.__onGridScroll
		}),
		TimelinePanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			__onGridScroll: self.__onGridScroll
		}), 
		GridPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			__onGridScroll: self.__onGridScroll
		})), this.props.children);
	}
});