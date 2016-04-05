var TogglePanel = React.createClass({
	__onClick: function(e) {
		var self = this,
			mode = (this.state.mode === 'on') ? 'off' : 'on';

		this.setState({
			mode: mode
		}, function() {
			self.props.__toggleRows(mode);
		});

		e.preventDefault();
		e.stopPropagation();
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
		React.createElement( Toggle, {
			mode: this.state.mode,
			__onClick: self.__onClick
		}));
	}
});
