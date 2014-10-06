var Toggle = React.createClass({
	render: function() {
		return React.DOM.div({
			className: 'switch-button on'
		},
			React.DOM.input({
				className: '',
				name: 'diary-rooms-showing',
				id: 'diary-rooms-showing',
				type: 'checkbox',
				checked: undefined
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