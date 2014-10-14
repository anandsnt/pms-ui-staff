var TimelinePanel = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.timeline = new IScroll('#diary-timeline', { 
			probeType: 2, 
			scrollbars: false,
			interactiveScrollbars: true,
			scrollX: true, 
			scrollY: false, 
			momentum: false,
			bounce: false,
			mouseWheel: 'scroll'
		});

		iscroll.timeline._scrollFn = this.props.__onGridScroll.bind(null, iscroll.timeline);

		iscroll.timeline.on('scroll', iscroll.timeline._scrollFn);

		setTimeout(function () {
	        iscroll.timeline.refresh();
	    }.bind(this), 0);
	},
	componentWillUnmount: function() {
		this.props.iscroll.timeline.destroy();
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
			display: this.props.display,
			data: this.props.data,
			__onResizeCommand: self.props.__onResizeCommand,
			__onResizeLeftStart:self.props.__onResizeLeftStart,
			__onResizeLeftEnd:  self.props.__onResizeLeftEnd,
			__onResizeRightStart:self.props.__onResizeRightStart,
			__onResizeRightEnd: self.props.__onResizeRightEnd, 
			currentResizeItem: this.props.currentResizeItem
		}),
		TimelineOccupancy({
			display: this.props.display,
			data: this.props.data		
		})));			
	}
});