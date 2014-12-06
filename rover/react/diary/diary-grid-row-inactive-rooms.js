var GridRowInactive = React.createClass({
	

	render: function() {
		var props = this.props,
			data  = props.data,			
			display 	= props.display,
			divClassName = 'occupancy-block',
			spanClassName = 'occupied',
			px_per_ms     = display.px_per_ms,
			px_per_int 	= display.px_per_int,
			x_origin   	= display.x_n, 
			start_time_ms =  data.startTime,
			end_time_ms  =  data.endTime,
			inactive_time_span = (end_time_ms - start_time_ms) * px_per_ms,
			innerText = (data.service_status == 'OUT_OF_ORDER'? 'OUT OF ORDER' : 'OUT OF SERVICE');
		
		var divClassName = 'occupancy-block';
		return this.transferPropsTo(React.DOM.div({
			className: divClassName,
			style: {
					background: '-webkit-linear-gradient(#C3C3C3, #8B8B8B)',
					display: 'block',
					left: (start_time_ms - x_origin) * px_per_ms + 'px'
			}
		}, 
		React.DOM.span({
			className: spanClassName,
			style: { 
				width: inactive_time_span + 'px' 
			}
		}, innerText)
		));
	}
});