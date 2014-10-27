var RoomPanel = React.createClass({
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.rooms = new IScroll('#diary-rooms', { 
			probeType: 2, 
			scrollbars: true,
			interactiveScrollbars: true,
			scrollX: false, 
			scrollY: true,
			momentum: false,
			bounce: true, 
			mouseWheel: false,
			useTransition: true
		});

		iscroll.rooms._scrollFn = _.throttle(this.props.__onGridScroll.bind(null, iscroll.rooms), 10, { leading: false, trailing: true });

		iscroll.rooms.on('scroll', iscroll.rooms._scrollFn);

		setTimeout(function () {
	        iscroll.rooms.refresh();
	    }, 0);
	},
	componentWillUnmount: function() {
		this.props.iscroll.rooms.destroy();
	},
	render: function() {
		return React.DOM.div({
			id: 'diary-rooms',
			className: 'diary-rooms scrollable'
		},
		Rooms({
			display: this.props.display,
			data: this.props.data
		}));
	}
});