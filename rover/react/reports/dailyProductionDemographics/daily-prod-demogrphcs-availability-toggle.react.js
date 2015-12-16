var DailyProductionAvailabilityToggle = React.createClass({
	toggleTheAvailability : function() {
		var toggleAvailability = this.props.toggleAvailability;
		setTimeout(function(){
			toggleAvailability();
		}, 0);
	},
	componentDidMount: function() {
		this.getDOMNode().addEventListener('click', this.toggleTheAvailability);
		this.getDOMNode().checked = this.props.header.showAvailable;
	},
	componentDidUpdate: function() {
		this.getDOMNode().checked = this.props.header.showAvailable;
	},
	render: function(){
		return React.DOM.div({
					className	: 'switch-button ' + (this.props.header.showAvailable ?  'on' : 'disabled'),
					id 			: 'report-availability-toggle-parent',
				},
				React.DOM.input({
					name 	: 'report-toggle',
					id 		: 'report-availability-toggle',
					type 	: 'checkbox'
				}),
				React.DOM.label({
						className: 'data-off'
					},
					React.DOM.span({
						className: 'value'
					}, 'Availability'),
					React.DOM.span({
						className: 'switch-icon'
					}, 'Hidden')
				),
				React.DOM.label({
						className: 'data-on'
					},
					React.DOM.span({
						className: 'value'
					}, 'Availability'),
					React.DOM.span({
						className: 'switch-icon'
					}, 'Hidden')
				)
			);
	}
});
