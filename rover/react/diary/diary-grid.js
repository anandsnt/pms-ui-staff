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
	__onDragStart: function(room, reservation) {
		var self = this;

		this.setState({
			currentDragItem: reservation
		}, function() {
			self.props.angular_evt.onDragStart(room, reservation);
		});
	},
	__onDragStop: function(e) {
		var rowHeight = this.props.display.row_height + 6,
			viewport = $('.diary-grid .wrapper'),
			curPos = viewport[0].scrollTop + e.pageY - viewport.offset().top,
			rowNumber = Math.floor(curPos / rowHeight),
			room = this.state.data[rowNumber],
			reservation = this.state.currentDragItem,
			self = this;

		this.setState({
			currentDragItem: undefined
		}, function() {
			self.props.angular_evt.onDragEnd(room, reservation);
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
					className: 'wrapper',
					onScroll: self.props.__onGridScroll 
				},
				React.DOM.ul({ 
					className: 'grid',
					style: {
						width: this.props.display.width + 'px',
						height: this.props.display.height + 'px'
					}
				}, 
				_.map(this.state.data, function(row, idx) {
					return GridRow({
						key: row.key,
						data: row,
						row_number: idx,
						ref: 'row',
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