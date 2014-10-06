var Timeline = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
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
			className: 'wrapper',
			style: {
				width: props.display.width,
				height: props.viewport.timeline_header_height
			},
			data: this.state.data
		}, hourly_divs);

		/*OUTPUT VIEWPORT/GRID and eventually TIMELINE*/
		return timeline;
	}
});