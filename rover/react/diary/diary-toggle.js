var Toggle = React.createClass({
	componentWillReceiveProps: function(nextProps, nextState) {
		if(nextProps.mode !== this.props.mode) {
			this.props.__toggleRows(this.props.mode);
		}
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'switch-button' + (this.props.mode === 'on' ? ' on' : '')
		},
			React.DOM.input({
				className: '',
				name: 'diary-rooms-showing',
				id: 'diary-rooms-showing',
				type: 'checkbox',
				checked: undefined,
				onChange: self.props.__onClick
			}),
			React.DOM.label({
				className: 'data-off'
			},
				React.DOM.span({
					className: 'value'
				}, 'All'),
				React.DOM.span({
					className: 'switch-icon'
				}, 'All')),
			React.DOM.label({
				className: 'data-on'
			},
				React.DOM.span({
					className: 'switch-icon'
				}, 'H'),
				React.DOM.span({
					className: 'value'
				}, 'Open'))
		);
	}
});