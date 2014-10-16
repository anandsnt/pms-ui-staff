var TogglePanel = React.createClass({
	__onClick: function(e) {
		var self = this;

		console.log(e);

		this.setState({
			mode: (this.state.mode === 'on') ? 'off' : 'on'
		}, function() {
			self.props.__toggleRows();
		});
	},
	getInitialState: function() {
		return {
			mode: 'on'
		};
	},
	shouldComponentRender: function(nextProps, nextState) {
		return this.state.mode !== nextState.mode;
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-toggle'
		},
		Toggle({
			mode: this.state.mode,
			__toggleRows: self.props.__toggleRows,
			__onClick: self.__onClick
		}));
	}
});