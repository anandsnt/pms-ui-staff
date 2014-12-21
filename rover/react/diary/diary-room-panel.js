var RoomPanel = React.createClass({
	componentDidUpdate: function(){	
		console.log(this.props.edit);
		var state 	= this.state,
			props 	= this.props,
			data 	= props.data,
			display = props.display,
			rowHeight = display.row_height + display.row_height_margin,
			rowNumber = props.edit.active ? _.indexOf(_.pluck(data, 'id'), props.edit.originalRowItem.id) : 0;

		var scrollYPos = rowNumber * rowHeight;
		console.log('data');
		console.log(data);
		
		this.props.iscroll.rooms.scrollTo(0, -scrollYPos, 0, 1000);	
		this.props.iscroll.rooms.refresh();	
	},
	componentDidMount: function() {
		var iscroll = this.props.iscroll;

		iscroll.rooms = new IScroll('#diary-rooms', { 
			probeType: 2, 
			scrollbars: 'custom',
			interactiveScrollbars: true,
			scrollX: false, 
			scrollY: true,
			momentum: false,
			bounce: false, 
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
		this.props.iscroll.rooms = null;
	},
	render: function() {
		var props = this.props;

		return React.DOM.div({
			id: 'diary-rooms',
			className: 'diary-rooms scrollable'
		},
		Rooms({
			display: props.display,
			meta:    props.meta,
			data:    props.data
		}));
	}
});