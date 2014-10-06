var DiaryContent, SETTINGS = {
	viewport: {
		width: 1024,
		height: 768,
		row_header_width: 220,  //Relative starting point for left edge of grid
		timeline_header_height: 80,
		hours: 12
	},				
	display: {
		width: undefined,
		height: '100%',
		hours: 48,
		row_height: 80,
		intervals_per_hour: 4, 
		px_per_ms: undefined,
		px_per_int: undefined
	},
	filter: {
		types: ['room', 'rate_type', 'start_time', 'status']
	}
};

DiaryContent = React.createClass({
	__onGridScroll: function(e) {
		var el = e.currentTarget;

		if(el) {
			$('.timeline').css({ 'top': el.scrollTop + 'px'});
		}
	},
	getDefaultProps: function() {
		var viewport = SETTINGS.viewport,
			display = SETTINGS.display;

		display.width 		= display.hours / viewport.hours * viewport.width;
		display.px_per_hr 	= viewport.width / viewport.hours;
		display.px_per_int  = display.px_per_hr / display.intervals_per_hour;
		display.px_per_ms 	= display.px_per_int / 900000;

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
					x_origin: scope.start_date.getTime()
				},
				data: scope.data,
				currentDragItem: undefined,
				currentResizeItem: undefined
			};
		
		return initial_state;
	},
	render: function() {
		var display = _.extend(_.clone(this.props.display), this.state.display),
			self = this;

		_.extend(this.props.display, this.state.display);

		return this.transferPropsTo(React.DOM.div({
			className: 'diary-container'
		},
		RoomPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			__onGridScroll: this.__onGridScroll.bind(this)
		}),
		GridPanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			__onGridScroll: this.__onGridScroll.bind(this)
		})), this.props.children);
	}
});