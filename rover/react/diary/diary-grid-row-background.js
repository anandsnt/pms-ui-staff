/*FOR POTENTIAL FUTURE USE
	Switching to this form may reduce rendering time,
	but has the trade off of janky scrolling
*/
var GridRowBackground = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		if(this.props.display !== nextProps.display) {
			return true;
		}

		return false;
	},
	render: function() {
		var hourly_divs = [],
			self = this;

		/*Create hourly spans across each grid row*/
		for(var i = 0; i < this.props.display.hours; i++) {
			hourly_divs.push(React.DOM.span({
				key: 		'date-time-' + i,
				className: 	'hour',
				style: {
					width: 	this.props.display.px_per_hr + 'px'
				}
			}));
		}

		return React.DOM.div({
			style: {
				width: '100%',
				height: '100%',
				padding: '0px',
				margin: '0px',
				background: 'none',
				boxSizing: 'border-box'
			}
		}, hourly_divs);
	}
});