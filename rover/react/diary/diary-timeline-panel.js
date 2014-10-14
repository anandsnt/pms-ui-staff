var TimelinePanel = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.timeline = new IScroll('#diary-timeline', { 
			probeType: 2, 
			scrollbars: false,
			interactiveScrollbars: true,
			scrollX: true, 
			scrollY: false, 
			tap: false, 
			click: false,
			momentum: false,
			bounce: false,
			mouseWheel: 'scroll',
			preventDefault: true
		});

		iscroll.timeline._scrollFn = this.props.__onGridScroll.bind(null, this);

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