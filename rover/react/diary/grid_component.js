/*
	GRID COMPONENTS
	---------------

	Root -> Collection of Rows that span into future without bounds = Grid
	          |  
		   Timeline Row for RoomType/RateType = GridRow(s) 
		      |
		   Reservation(s) = GridItem

												  Grid
											/   	|   	\
										Row1 	 Row2  	  Row3

*/

var Grid, GridRow, RowRenderer, GridRowItem, GridItemResize,
	MODES = ['room-change', 'resize', 'resize-capture'];

/*GridItemResize = React.createClass({
	mixins: [Resize],
	getDefaultProps: function() {

	},
	getInitialState: function() {

	},
	render: function() {

	}
});*/

GridRowItem = React.createClass({
	mixins: [Draggable],
	_resize: function(params) {
		if(this.isMounted) {

		}
	},
	/*Assume that physical dimensions change first, so we need to propagate them to the
	  backing data and convert to the altered time frame. */
	_syncData: function() {

	},
	getInitialState: function() {
		var props = this.props,
			px_per_ms = props.display.px_per_ms,
			x_axis_origin = props.display.x_origin + props.display.x_0,
			initial_state = Model({
				mode: MODES[0],
				start_time_ms: props.data.start_date.getTime(),
				pos: Object.create(null, { top: { value: 0 } }),
				dim: Object.create(null, { height: { value: '100%'} }),
				end_time_ms: props.data.end_date.getTime(),
				time_span_ms: undefined,
				time_span_intervals: undefined,
				dragging: false,
				y_offset: props.row_offset,
				rel: { x: 0, y: 0 }
			});

		initial_state.time_span_ms = initial_state.end_time_ms - initial_state.start_time_ms;
		initial_state.time_span_intervals = initial_state.time_span_ms / 9000000;

		initial_state.pos.left = (initial_state.start_time_ms - x_axis_origin) * px_per_ms;
		initial_state.dim.width = initial_state.time_span_ms * px_per_ms;

		initial_state.pos.x = initial_state.pos.left;
		initial_state.pos.y = 0;//initial_state.y_offset;  //TODO Change to prop that relflects actual y offset from top of grid

		return initial_state;
	},
	/*componentWillReceiveProps: function(nextProps) {

	},
	shouldComponentUpdate: function(nextProps, nextState) {

	},
	componentWillUpdate: function(nextProps, nextState) {

	},
	componentDidUpdate: function(prevProps, prevState) {

	},*/
	render: function() {
		var props = this.props,
			state = this.state,
			x_axis_origin =props.display.x_origin,
			px_per_ms = props.display.px_per_ms;

		return React.DOM.div({
			onMouseDown: this.__onMouseDown,
			key: props.data.key,
			className: props.className,
			ref: 'item',
			style: {
				left: state.pos.left + 'px',
				top: (!state.dragging ? state.pos.top : state.pos.y) + 'px',
				height: state.dim.height,
				width: (state.time_span_ms) * px_per_ms
			}
		});
	}
});

GridRow = React.createClass({
	_removeItemFromSet: function(item) {

	},
	_syncData: function(obj) {

	},
	getInitialState: function() {
		var props = this.props,
			initial_state = Model({
				x_rel_load_tigger_right: undefined,
				x_rel_load_trigger_left: undefined
			});

		return initial_state;
	},
	render: function() {
		var props = this.props,
			display = props.display,
			hourly_divs = [];

		/*Create hourly spans across each grid row*/
		for(var i = 0; i < display.hours; i++) {
			hourly_divs.push(React.DOM.span({ 
				key: 		'date-time-' + i,
				className: 	'hour',
				style: {
					width: 	display.px_per_hr + 'px',
					height: '100%'
				}
			}));
		}

		/*Create grid row and insert each occupany item as child into that row*/
		return React.DOM.li({
			key: 		props.key,
			className: 	props.className,
			style: {
				width: 	display.width + 'px',
				height: display.row_height + 'px'
			}
		}, 
		_.map(props.data.reservations, function(reservation) {
			return new GridRowItem({
				key: 		reservation.key,
				className: 	'reservation ' + reservation.status,
				display: 	display,
				data: 		reservation,
				row_offset: props.row_number * display.row_height,
				__onDragStart:  props.__onDragStart,
				__onDragStop: props.__onDragStop,
				__onMouseUp: props.__onDrop
			});
		}),
		hourly_divs);
	}
});

Grid = React.createClass({
	/*Valid Drop target processing, look through all data and find rows without conflicting 
	  time spans...*/
	_getValidDropsTargets: function() {

	},
	__onDragStart: function(item) {
		this.setState({
			currentDragItem: item
		});
	},
	__onDragStop: function() {
		this.setState({
			currentDragItem: undefined
		});
	},
	__onDrop: function(target_row) {

	},
	getDefaultProps: function() {
		var defaults = {
				viewport: {
					width: 1024,
					height: 768,
					row_header_width: 220,  //Relative starting point for left edge of grid
					timeline_header_height: 60,
					hours: 12
				},				
				display: {
					width: undefined,
					height: '100%',
					hours: 48,
					row_height: 80,
					intervals_per_hour: 4, 
					px_per_ms: undefined,
					px_per_int: undefined,
					onScroll: null
				},
				filter: {
					types: ['room', 'rate_type', 'start_time', 'status']
				}											
			},
			viewport = defaults.viewport,
			display = defaults.display;

		display.width 		= display.hours / viewport.hours * viewport.width;
		display.px_per_hr 	= viewport.width / viewport.hours;
		display.px_per_int  = display.px_per_hr / display.intervals_per_hour;
		display.px_per_ms 	= display.px_per_int / 900000;

		return defaults;
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
				data: {
					rows: scope.data
				},
				currentDragItem: undefined,
				currentResizeItem: undefined
			};
		
		return initial_state;
	},
	render: function() {
		var props = this.props,
			state = this.state,
			timeline,
			hourly_divs = [],
			interval_spans,
			self = this;

		/*CREATE TIMELINE*/
		for(var i = 0; i < props.display.hours; i++) {
			interval_spans = [];

			for(var j = 0; j < props.display.intervals_per_hour; j++) {
				interval_spans.push(React.DOM.span({
					className: 'interval-' + (j + 1),
					style: {
						width: props.display.px_per_int
					}
				}));
			}

			hourly_divs.push(React.DOM.div({
				className: 'segment',
				style: {
					width: props.display.px_per_hr
				}
			}, interval_spans));
		}

		timeline = React.DOM.div({
			className: 'timeline',
			style: {
				height: props.viewport.timeline_header_height
			}
		}, hourly_divs);

		/*OUTPUT VIEWPORT/GRID and eventually TIMELINE*/
		return  React.DOM.ul({ 
					className: 'grid' 
				}, 
				_.map(state.data.rows, function(row, idx) {
					return new GridRow({
						key: row.key,
						data: row,
						row_number: idx,
						className: 'grid-row',
						display: _.extend(_.clone(props.display), state.display),
						filter: props.filter,
						currentDragItem: state.currentDragItem,
						currentResizeItem: state.currentResizeItem,
						__onDragStart: self.__onDragStart,
						__onDragStop: self.__onDragStop,
						__onDrop: self.__onDrop					
					});
				})
		);
	}
});


