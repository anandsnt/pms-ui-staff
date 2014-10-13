var TimelinePanel = React.createClass({
	_scrollFn: undefined,
	_scroll: undefined,
	componentDidMount: function() {
		var self = this;

		this.props.iscroll.timeline = this._scroll = new IScroll('#diary-timeline', { 
			probeType: 2, 
			scrollbars: false,
			interactiveScrollbars: true,
			scrollX: true, 
			scrollY: false, 
			tap: false, 
			click: true,
			bounce: false,
			mouseWheel: 'scroll',
			preventDefault: true
		});

		this._scrollFn = this.props.__onGridScroll.bind(null, this);

		this._scroll.on('scroll', this._scrollFn);

		setTimeout(function () {
	        self._scroll.refresh();
	    }, 100);
	},
	componentWillUnmount: function() {
		this._scroll.destroy();
	},
	render: function() {
		var self = this;

		return React.DOM.div({
			id: 'diary-timeline',
			className: 'diary-timeline scrollable'
		},
		React.DOM.div({
			id: 'timeline-outer-wrapper',
			className: 'outer-wrapper',
			style: {
				width: this.props.display.width + 'px'
			}
		},
		Timeline({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.props.data,
			filter: this.props.filter,
			angular_evt: this.props.angular_evt,
			__onResizeCommand: self.props.__onResizeCommand,
			currentResizeItem: this.props.currentResizeItem
		}),
		TimelineOccupancy({
			viewport: this.props.viewport,
			display: this.props.display,
			data: this.props.data,
			filter: this.props.filter,
			angular_evt: this.props.angular_evt			
		})));			
	}
});