var GridPanel = React.createClass({
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
			data: this.props.data,
			angular_evt: this.props.angular_evt,
			currentResizeItem: this.props.currentResizeItem,
			__onGridScroll: self.props.__onGridScroll//,
			//__dispatchResizeCommand: self.__dispatchResizeCommand
		}));
	}
});