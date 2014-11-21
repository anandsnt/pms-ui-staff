var Timeline = React.createClass({
	render: function() {
		var props 					= this.props,
			state 					= this.state,
			display 				= props.display,
			timeline,
			hourly_spans 			= [],
			segment_hour_display 	= [],
			interval_spans,
			px_per_int 				= display.px_per_int + 'px',
			px_per_hr 				= display.px_per_hr + 'px',
			start_time 				= display.x_nL_time, 
			self 					= this;

		(function() {
			var time = start_time.hours;

			for(var i = 0, len = display.hours; i < len; i++) {
				segment_hour_display.push(time++ + ':00');

				time = (time > 23) ? 0 : time;
			}
		})(); 

		/*CREATE TIMELINE*/
		for(var i = 0, len = display.hours; i < len; i++) {
			interval_spans = [];

			interval_spans.push(React.DOM.span({
				className: 'hour-display'
			}, segment_hour_display[i]));

			for(var j = 0; j < display.intervals_per_hour; j++) {
				interval_spans.push(React.DOM.span({
					className: 'interval-' + (j + 1),
					style: {
						width: px_per_int
					}
				}));
			}

			hourly_spans.push(React.DOM.span({
				className: 'segment',
				style: {
					width: px_per_hr
				}
			}, interval_spans));
		}

		return React.DOM.div({
			className: 'wrapper',
			style: {
				width: display.width + 'px'
			},
		}, React.DOM.div({
			className: 'hours'
		}, hourly_spans), 
		Resizable({
			display:               display,
			edit:                  props.edit,
			filter:                props.filter,
			iscroll:               props.iscroll,
			meta:                  props.meta,
			__onResizeCommand:     props.__onResizeCommand,
			__onResizeStart:       props.__onResizeStart,
			__onResizeEnd:         props.__onResizeEnd,
			currentResizeItem:     props.currentResizeItem,
			currentResizeItemRow:  props.currentResizeItemRow
		}));
	}
});
