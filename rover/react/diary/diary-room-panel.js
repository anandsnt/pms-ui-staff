var RoomPanel = React.createClass({
	_scrollFn: undefined,
	_scroll: undefined,
	componentDidMount: function() {
		var self = this;

		this.props.iscroll.rooms = this._scroll = new IScroll('#diary-rooms', { 
			probeType: 2, 
			scrollbars: true,
			interactiveScrollbars: true,
			scrollX: false, 
			scrollY: true, 
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
			id: 'diary-rooms',
			className: 'diary-rooms scrollable'
		},
		Rooms({
			display: this.props.display,
			data: this.props.data
		}));
	}
});