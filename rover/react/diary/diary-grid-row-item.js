var GridRowItem = React.createClass({
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
			px_per_ms = this.props.display.px_per_ms,
			x_axis_origin = this.props.display.x_origin + this.props.display.x_0,
			initial_state = Model({
				data: this.props.data,
				//mode: MODES[0],
				start_time_ms: this.props.data.start_date.getTime(),
				pos: Object.create(null, { top: { value: 0 } }),
				dim: Object.create(null, { height: { value: '100%'} }),
				end_time_ms: this.props.data.end_date.getTime(),
				time_span_ms: undefined,
				time_span_intervals: undefined,
				dragging: false,
				y_offset: this.props.row_offset,
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
				left: (!state.dragging ? state.pos.left : state.pos.x) + 'px',
				top: (!state.dragging ? state.pos.top : state.pos.y) + 'px',
				height: state.dim.height,
				width: (state.time_span_ms) * px_per_ms
			}
		}, 
		React.DOM.span({
			className: 'occupied ' + props.data.status,
			value: props.data.guest_name
		}),
		React.DOM.span({
			className: 'maintenance'
		}));
	}
});