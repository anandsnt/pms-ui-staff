var Grid = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.grid = new IScroll($('.diary-grid .wrapper')[0], { 
			probeType: 2, 
			scrollbars: true,
			interactiveScrollbars: true,
			scrollX: true, 
			scrollY: true, 
			bounce: false,
			momentum: false,
			preventDefaultException: { className: /(^|\s)occupancy-block(\s|$)/ },
			mouseWheel: 'scroll'
		});

		iscroll.grid._scrollFn = this.props.__onGridScroll.bind(null, iscroll.grid);

		iscroll.grid.on('scroll', iscroll.grid._scrollFn);

		setTimeout(function () {
	        iscroll.grid.refresh();
	    }.bind(this), 0);
	},
	componentWillUnmount: function() {
		this.props.iscroll.grid.destroy();
	},
	render: function() {
		var self = this;

		/*OUTPUT VIEWPORT/GRID and eventually TIMELINE*/
		return  React.DOM.div({
					id: 'grid-wrapper',
					className: 'wrapper scrollable'
				},
				React.DOM.ul({ 
					className: 'grid',
					style: {
						width: this.props.display.width + 'px'
					}
				}, 
				_.map(this.props.data, function(row, idx) {
					return GridRow({
						key: 				row.key,
						data: 				row,
						row_number: 		idx,
						className: 			'grid-row',
						display: 			self.props.display,
						viewport: 			self.props.viewport,
						filter: 			self.props.filter,
						edit:               self.props.edit,
						iscroll:            self.props.iscroll, 
						angular_evt: 		self.props.angular_evt,
						currentResizeItem:  self.props.currentResizeItem,
						currentResizeItemRow:   self.props.currentResizeItemRow,
						__onDragStart: 		self.props.__onDragStart,
						__onDragStop: 		self.props.__onDragStop			
					});
				})
		));
	}
});