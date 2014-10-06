var TogglePanel = React.createClass({
	render: function() {
		return React.DOM.div({
			className: 'diary-toggle'
		},
		Toggle({
			data: this.props.data
		}))
	}
});