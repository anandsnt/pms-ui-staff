var Grid = React.createClass({
	__onDragStart: function(room, reservation) {
		var self = this;

		this.setState({
			currentDragItem: reservation
		}, function() {
			self.props.angular_evt.onDragStart(room, reservation);
		});
	},
	__onDragStop: function(e, left) {
		var rowHeight 	= this.props.display.row_height + this.props.display.row_height_margin,
			viewport 	= this.props.viewport.element(),
			curPos 		= viewport[0].scrollTop + e.pageY - viewport.offset().top,
			rowNumber 	= Math.floor(curPos / rowHeight),
			room 		= this.props.data[rowNumber],
			reservation = this.state.currentDragItem,
			self 		= this;

		this.setState({
			currentDragItem: undefined
		}, function() {
			self.props.angular_evt.onDragEnd(room, reservation, (left / this.props.display.px_per_ms) + this.props.display.x_origin);
		});
	},
	_scrollFn: undefined,
	_scroll: undefined,
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.grid = new IScroll($('.diary-grid .wrapper')[0], { 
			probeType: 2, 
			scrollbars: true,
			interactiveScrollbars: true,
			scrollX: true, 
			scrollY: true, 
			tap: false, 
			click: false,
			preventDefaultException: { className: /(^|\s)occupancy-block(\s|$)/ },
			bounce: false,
			momentum: false,
			mouseWheel: 'scroll',
			preventDefault: true 
		});

		iscroll.grid._scrollFn = this.props.__onGridScroll.bind(null, this);

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
						iscroll:            self.props.iscroll, 
						angular_evt: 		self.props.angular_evt,
						currentDragItem: 	self.props.currentDragItem,
						currentResizeItem:  self.props.currentResizeItem,
						__onDragStart: 		self.__onDragStart,
						__onDragStop: 		self.__onDragStop//,
						//__dispatchResizeCommand: self.__dispatchResizeCommand				
					});
				})
		));
	}
});