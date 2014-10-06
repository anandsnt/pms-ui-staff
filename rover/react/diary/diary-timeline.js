var Timeline = React.createClass({
	statics: {

	},
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var props = this.props,
			state = this.state,
			timeline,
			hourly_spans = [],
			segment_hour_display = [],
			interval_spans,
			start_time = props.display.x_origin_start_time;		

		(function() {
			var time = start_time.hours;

			for(var i = 0; i < props.display.hours; i++) {
				segment_hour_display.push(time++ + ':00');

				time = (time > 23) ? 0 : time;
			}
		})(); 

		/*CREATE TIMELINE*/
		for(var i = 0; i < props.display.hours; i++) {
			interval_spans = [];

			interval_spans.push(React.DOM.span({
				className: 'hour-display'
			}, segment_hour_display[i]));

			for(var j = 0; j < props.display.intervals_per_hour; j++) {
				interval_spans.push(React.DOM.span({
					className: 'interval-' + (j + 1),
					style: {
						width: props.display.px_per_int
					}
				}));
			}

			hourly_spans.push(React.DOM.span({
				className: 'segment',
				style: {
					width: props.display.px_per_hr
				}
			}, interval_spans));
		}

		return React.DOM.div({
			className: 'wrapper',
			style: {
				width: props.display.width,
				height: props.viewport.timeline_header_height
			},
			data: this.state.data
		}, hourly_spans);
	}
});