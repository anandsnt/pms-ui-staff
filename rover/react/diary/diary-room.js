var Room = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		var room_meta_status = this.props.meta.room.status;

		return this.props.data[room_meta_status] !== nextProps.data[room_meta_status];
	},
	showRoomStatusUpdatePopup: function () {
		this.props.showRoomStatusAndServiceUpdatePopup(this.props.data);
	},
	render: function() {
		var props = this.props,
			room_meta = props.meta.room,
			self = this;

		return React.DOM.li({
			className: 'room-title' + (!(props.data[room_meta.hk_status] === "") ? ' ' + this.props.data[room_meta.hk_status] : '')
		},
		React.DOM.span({
			className: 'number',
			onClick: self.showRoomStatusUpdatePopup
		}, props.data[room_meta.number]),
		React.DOM.span({
			className: 'type'
		}, props.data[room_meta.type]));
	}
});
