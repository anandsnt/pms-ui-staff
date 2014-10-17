var TimelinePanel = React.createClass({
	componentDidMount: function() {
		/*var iscroll = this.props.iscroll;

		iscroll.timeline = new IScroll('#diary-timeline', { 
			//probeType: 1, 
			scrollbars: false,
			interactiveScrollbars: false,
			scrollX: false, 
			scrollY: false, 
			momentum: false,
			bounce: false
		});*/

		//iscroll.timeline._scrollFn = this.props.__onGridScroll.bind(null, iscroll.timeline);

		//iscroll.timeline.on('scroll', iscroll.timeline._scrollFn);

		/*setTimeout(function () {
	        iscroll.timeline.refresh();
	    }.bind(this), 0);*/
	},
	componentWillUnmount: function() {
		//this.props.iscroll.timeline.destroy();
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
			iscroll: this.props.iscroll,
			__onResizeCommand: self.props.__onResizeCommand,
			__onResizeLeftStart:self.props.__onResizeLeftStart,
			__onResizeLeftEnd:  self.props.__onResizeLeftEnd,
			__onResizeRightStart:self.props.__onResizeRightStart,
			__onResizeRightEnd: self.props.__onResizeRightEnd, 
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		}),
		TimelineOccupancy({
			display: this.props.display,
			data: this.props.data,
			angular_evt: this.props.angular_evt		
		})));			
	}
});