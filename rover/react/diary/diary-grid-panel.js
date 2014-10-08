var GridPanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-grid scrollable',
			onScroll: self.props.__onGridScroll 
		}, 
		Grid({
			viewport: this.props.viewport,
			display: this.props.display,
			filter: this.props.filter,
			data: this.state.data,
			angular_evt: this.props.angular_evt,
			__onGridScroll: self.props.__onGridScroll
		}));
	}
});