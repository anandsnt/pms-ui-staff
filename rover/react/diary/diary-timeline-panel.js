var TimelinePanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-timeline scrollable',
			onScroll: self.props.__onGridScroll
		},
		Timeline({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data,
			filter: this.props.filter,
			angular_evt: this.props.angular_evt
		}));			
	}
});