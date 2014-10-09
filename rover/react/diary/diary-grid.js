var Grid = React.createClass({
	__onDragStart: function(room, reservation) {
		var self = this;

		this.setState({
			currentDragItem: reservation
		}, function() {
			self.props.angular_evt.onDragStart(room, reservation);
		});
	},
	__onDragStop: function(e) {
		var rowHeight 	= this.props.display.row_height + this.props.display.row_height_margin,
			viewport 	= this.props.viewport.element(),
			curPos 		= viewport[0].scrollTop + e.pageY - viewport.offset().top,
			rowNumber 	= Math.floor(curPos / rowHeight),
			room 		= this.state.data[rowNumber],
			reservation = this.state.currentDragItem,
			self 		= this;

		this.setState({
			currentDragItem: undefined
		}, function() {
			self.props.angular_evt.onDragEnd(room, reservation);
		});
	},
	getInitialState: function() {
		return {
			data: this.props.data,
			currentDragItem: undefined
		};
	},
	render: function() {
		var self = this;

		/*OUTPUT VIEWPORT/GRID and eventually TIMELINE*/
		return  React.DOM.div({
					className: 'wrapper'
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
						key: 				row.key,
						data: 				row,
						row_number: 		idx,
						className: 			'grid-row',
						display: 			self.props.display,
						viewport: 			self.props.viewport,
						filter: 			self.props.filter,
						angular_evt: 		self.props.angular_evt,
						currentDragItem: 	self.state.currentDragItem,
						__onDragStart: 		self.__onDragStart,
						__onDragStop: 		self.__onDragStop					
					});
				})
		));
	}
});