var Grid = React.createClass({
		/*Valid Drop target processing, look through all data and find rows without conflicting 
	  time spans...*/
	_getValidDropsTargets: function() {

	},
	_checkStartTimeAgainstRow: function(start_time, row) {

	},
	_checkEndTimeAgainstRow: function(end_time, row) {

	},
	_filterRowsByStartTime: function(start_time) {

	},
	_filterRowsByEndTime: function(end_time) {

	},
	__onDragStart: function(item) {
		this.setState({
			currentDragItem: item
		});
	},
	__onDragStop: function() {
		this.setState({
			currentDragItem: undefined
		});
	},
	__onDrop: function(target_row) {

	},
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	render: function() {
		var self = this;

		/*OUTPUT VIEWPORT/GRID and eventually TIMELINE*/
		return  React.DOM.div({
					className: 'viewport reservations',
					onScroll: self.props.__onGridScroll 
				},
				React.DOM.ul({ 
					className: 'grid'
				}, 
				_.map(this.state.data, function(row, idx) {
					return GridRow({
						key: row.key,
						data: row,
						row_number: idx,
						className: 'grid-row',
						display: self.props.display,
						filter: self.props.filter,
						currentDragItem: self.state.currentDragItem,
						currentResizeItem: self.state.currentResizeItem,
						__onDragStart: self.__onDragStart,
						__onDragStop: self.__onDragStop,
						__onDrop: self.__onDrop					
					});
				})
		));
	}
});