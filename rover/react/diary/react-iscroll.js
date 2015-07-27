/*FOR POTENTIAL FUTURE USE*/
var ReactIscroll = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.grid = new IScroll($('.diary-grid .wrapper')[0], {
			probeType: 2,
			scrollbars: true,
			interactiveScrollbars: true,
			scrollX: true,
			scrollY: true,
			bounce: true,
			momentum: false,
			preventDefaultException: { className: /(^|\s)(occupied|available|reserved)(\s|$)/ },
			mouseWheel: true,
			useTransition: true
		});

		iscroll.grid._scrollFn = _.throttle(this.props.__onGridScroll.bind(null, iscroll.grid), 10, { leading: false, trailing: true });

		iscroll.grid.on('scroll', iscroll.grid._scrollFn);
		iscroll.grid.on('scrollEnd', this.props.__onGridScrollEnd);

		setTimeout(function () {
	        iscroll.grid.refresh();
	    }.bind(this), 0);
	},
	componentWillUnmount: function() {
		this.props.iscroll.grid.destroy();
		this.props.iscroll.grid = null;
	}
});