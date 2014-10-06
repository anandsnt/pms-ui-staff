var GridPanel = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			className: 'diary-grid',
			onScroll: this.__onGridScroll
		}, 
		TimelinePanel({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data
		}), 
		Grid({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.state.data
		}));
	}
});