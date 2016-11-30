/* FOR POTENTIAL FUTURE USE

  Designed to leave a shadow/footprint of where the drag item originated
*/
var Placeholder = React.createClass({
	render: function() {
		return React.DOM.div({
			className: 'occupancy-block placeholder',
			style: this.props.style
		});
	}
});