var TimelinePanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		return React.DOM.div({
			className: 'diary-timeline scrollable',
			onScroll: this.props.__onGridScroll
		},
		Timeline({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data
		}));			
	}
});