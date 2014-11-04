var TimelinePanel = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.timeline = new IScroll('#diary-timeline', { 
			probeType: 2, 
			scrollbars: false,
			interactiveScrollbars: false,
			scrollX: true, 
			scrollY: false, 
			momentum: false,
			bounce: true,
			mouseWheel: false,
			useTransition: true,
			preventDefaultException:{ className: /(^|\s)set-times(\s|$)/ }
		});

		iscroll.timeline._scrollFn = _.throttle(this.props.__onGridScroll.bind(null, iscroll.timeline), 10, { leading: false, trailing: true });

		iscroll.timeline.on('scroll', iscroll.timeline._scrollFn);

		setTimeout(function () {
	        iscroll.timeline.refresh();
	    }.bind(this), 0);
	},
	componentWillUnmount: function() {
		this.props.iscroll.timeline.destroy();
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		if(this.props.viewport !== nextProps.viewport ||
		   this.props.display !== nextProps.display ||
		   !this.props.currentResizeItem && nextProps.currentResizeItem ||
		   this.props.currentResizeItem) {
			return true;
		} else {
			return false;
		}
	},
	render: function() {
		var props = this.props,
			self = this;

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
			display: props.display,
			iscroll: props.iscroll,
			edit:    props.edit,
			__onResizeCommand:    props.__onResizeCommand,
			__onResizeStart:  props.__onResizeStart,
			__onResizeEnd:    props.__onResizeEnd,
			currentResizeItem:    props.currentResizeItem,
			currentResizeItemRow: props.currentResizeItemRow
		}),
		TimelineOccupancy({
			display:     props.display,
			data:        props.data,
			angular_evt: props.angular_evt		
		})));			
	}
});